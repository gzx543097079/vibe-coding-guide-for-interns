import SwiftUI
import UIKit

// 滑动回复演示：把消息向左拖，露出回复箭头；拖过阈值松手，消息被引用到输入框上方。

// MARK: - 颜色与动效令牌

private extension Color {
    init(swipeReplyHex hex: UInt32) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: 1
        )
    }
}

private struct SwipeReplyPalette {
    let bg: Color
    let ink: Color
    let ink2: Color
    let line: Color
    let soft: Color
    let accent: Color
    let onAccent: Color

    init(_ scheme: ColorScheme) {
        let dark = scheme == .dark
        bg = Color(swipeReplyHex: dark ? 0x000000 : 0xFFFFFF)
        ink = Color(swipeReplyHex: dark ? 0xFFFFFF : 0x000000)
        ink2 = Color(swipeReplyHex: dark ? 0x98989F : 0x6E6E73)
        line = Color(swipeReplyHex: dark ? 0x38383A : 0xC6C6C8)
        soft = Color(swipeReplyHex: dark ? 0x1C1C1E : 0xF2F2F7)
        accent = Color(swipeReplyHex: dark ? 0x0A84FF : 0x0071E3)
        onAccent = Color(swipeReplyHex: 0xFFFFFF)
    }
}

private enum SwipeReplyMetrics {
    static let canvasWidth: CGFloat = 248
    static let canvasHeight: CGFloat = 442
    static let listPaddingH: CGFloat = 12
    static let inputBarHeight: CGFloat = 52
    static let quoteBarHeight: CGFloat = 44
    /// 气泡最大宽度 = 行宽的 78%
    static let bubbleMaxWidth: CGFloat = (canvasWidth - listPaddingH * 2) * 0.78
    static let dragFactor: CGFloat = 0.6
    static let maxDrag: CGFloat = 64
    static let threshold: CGFloat = 48

    /// cubic-bezier(0.2, 0.8, 0.2, 1)
    static func ease(_ duration: Double) -> Animation {
        .timingCurve(0.2, 0.8, 0.2, 1, duration: duration)
    }
}

// MARK: - 数据

private struct SwipeReplyMessage: Identifiable, Equatable {
    let id: UUID
    let text: String
    let mine: Bool
    /// 这条消息引用的原消息全文
    let quote: String?

    init(text: String, mine: Bool, quote: String? = nil) {
        self.id = UUID()
        self.text = text
        self.mine = mine
        self.quote = quote
    }

    var author: String { mine ? "自己" : "林夕" }

    static let initial: [SwipeReplyMessage] = [
        SwipeReplyMessage(text: "周五的评审改到下午三点了", mine: false),
        SwipeReplyMessage(text: "好的，我把演示准备好", mine: true),
        SwipeReplyMessage(text: "登录页那个问题修了吗？", mine: false),
        SwipeReplyMessage(text: "修了，下午合并", mine: true),
    ]
}

// MARK: - 行高

/// 按 CSS 的 line-height 倍数还原行高：行间补差值，上下各补一半。
private struct SwipeReplyLineHeight: ViewModifier {
    let size: CGFloat
    let multiple: CGFloat
    let weight: Font.Weight

    func body(content: Content) -> some View {
        let uiWeight: UIFont.Weight = weight == .bold ? .bold : .regular
        let natural = UIFont.systemFont(ofSize: size, weight: uiWeight).lineHeight
        let extra = max(0, size * multiple - natural)
        return content
            .font(.system(size: size, weight: weight))
            .lineSpacing(extra)
            .padding(.vertical, extra / 2)
    }
}

private extension View {
    func swipeReplyText(size: CGFloat, lineHeight: CGFloat, weight: Font.Weight = .regular) -> some View {
        modifier(SwipeReplyLineHeight(size: size, multiple: lineHeight, weight: weight))
    }
}

// MARK: - 图标

/// 回复箭头，viewBox 0 0 16 16
private struct SwipeReplyArrowShape: Shape {
    func path(in rect: CGRect) -> Path {
        let s = min(rect.width, rect.height) / 16
        var p = Path()
        p.move(to: CGPoint(x: 6.5, y: 3.5))
        p.addLine(to: CGPoint(x: 2.5, y: 7.5))
        p.addLine(to: CGPoint(x: 6.5, y: 11.5))
        p.move(to: CGPoint(x: 3, y: 7.5))
        p.addLine(to: CGPoint(x: 9, y: 7.5))
        p.addArc(
            center: CGPoint(x: 9, y: 11.5),
            radius: 4,
            startAngle: .degrees(-90),
            endAngle: .degrees(0),
            clockwise: false
        )
        p.addLine(to: CGPoint(x: 13, y: 12.5))
        return p.applying(CGAffineTransform(scaleX: s, y: s))
    }
}

/// 发送箭头，viewBox 0 0 16 16
private struct SwipeReplySendShape: Shape {
    func path(in rect: CGRect) -> Path {
        let s = min(rect.width, rect.height) / 16
        var p = Path()
        p.move(to: CGPoint(x: 8, y: 13))
        p.addLine(to: CGPoint(x: 8, y: 3))
        p.move(to: CGPoint(x: 3.5, y: 7.5))
        p.addLine(to: CGPoint(x: 8, y: 3))
        p.addLine(to: CGPoint(x: 12.5, y: 7.5))
        return p.applying(CGAffineTransform(scaleX: s, y: s))
    }
}

/// 关闭叉号，viewBox 0 0 14 14
private struct SwipeReplyCloseShape: Shape {
    func path(in rect: CGRect) -> Path {
        let s = min(rect.width, rect.height) / 14
        var p = Path()
        p.move(to: CGPoint(x: 3, y: 3))
        p.addLine(to: CGPoint(x: 11, y: 11))
        p.move(to: CGPoint(x: 11, y: 3))
        p.addLine(to: CGPoint(x: 3, y: 11))
        return p.applying(CGAffineTransform(scaleX: s, y: s))
    }
}

private func swipeReplyStroke(_ width: CGFloat) -> StrokeStyle {
    StrokeStyle(lineWidth: width, lineCap: .round, lineJoin: .round)
}

// MARK: - 消息行

private struct SwipeReplyRow: View {
    let message: SwipeReplyMessage
    let palette: SwipeReplyPalette
    let reduceMotion: Bool
    let onReply: () -> Void

    private enum Axis { case horizontal, vertical }

    @State private var offset: CGFloat = 0
    @State private var axis: Axis?
    @State private var holdAccent = false
    @State private var bounce = 0
    @GestureState private var dragging = false
    @FocusState private var keyboardFocused: Bool

    private var armed: Bool { offset <= -SwipeReplyMetrics.threshold }
    private var progress: CGFloat { min(abs(offset) / SwipeReplyMetrics.threshold, 1) }

    private var bubbleShape: UnevenRoundedRectangle {
        UnevenRoundedRectangle(
            topLeadingRadius: 18,
            bottomLeadingRadius: message.mine ? 18 : 6,
            bottomTrailingRadius: message.mine ? 6 : 18,
            topTrailingRadius: 18
        )
    }

    /// 焦点环：2pt 实线，向外偏移 2pt
    private var focusRing: some View {
        UnevenRoundedRectangle(
            topLeadingRadius: 22,
            bottomLeadingRadius: message.mine ? 22 : 10,
            bottomTrailingRadius: message.mine ? 10 : 22,
            topTrailingRadius: 22
        )
        .strokeBorder(palette.accent, lineWidth: 2)
        .padding(-4)
        .opacity(keyboardFocused ? 1 : 0)
        .allowsHitTesting(false)
    }

    var body: some View {
        let textColor = message.mine ? palette.onAccent : palette.ink
        let highlighted = armed || holdAccent

        ZStack(alignment: .trailing) {
            // 回复箭头：在气泡下层，重叠时被气泡盖住
            SwipeReplyArrowShape()
                .stroke(highlighted ? palette.onAccent : palette.ink2, style: swipeReplyStroke(1.8))
                .frame(width: 16, height: 16)
                .keyframeAnimator(initialValue: CGFloat(1), trigger: bounce) { content, value in
                    content.scaleEffect(value)
                } keyframes: { _ in
                    KeyframeTrack {
                        CubicKeyframe(1.25, duration: 0.1)
                        CubicKeyframe(1.0, duration: 0.1)
                    }
                }
                .frame(width: 28, height: 28)
                .background(Circle().fill(highlighted ? palette.accent : palette.soft))
                .scaleEffect(0.5 + 0.5 * progress)
                .opacity(progress)
                .allowsHitTesting(false)
                .accessibilityHidden(true)

            bubble(textColor: textColor)
                .frame(maxWidth: SwipeReplyMetrics.bubbleMaxWidth, alignment: message.mine ? .trailing : .leading)
                .frame(maxWidth: .infinity, alignment: message.mine ? .trailing : .leading)
        }
        .onChange(of: armed) { _, nowArmed in
            if nowArmed && !reduceMotion { bounce += 1 }
        }
        .onChange(of: dragging) { _, active in
            // 手势被系统取消（例如滚动接管）时 onEnded 不一定会来，这里兜底回弹
            if !active {
                DispatchQueue.main.async { finishDrag(allowCommit: false) }
            }
        }
    }

    private func bubble(textColor: Color) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            if let quote = message.quote {
                Text(quote)
                    .swipeReplyText(size: 12, lineHeight: 1.45)
                    .lineLimit(1)
                    .truncationMode(.tail)
                    .padding(.leading, 8)
                    .overlay(alignment: .leading) {
                        Rectangle().fill(textColor).frame(width: 2)
                    }
                    .opacity(0.75)
            }
            Text(message.text)
                .swipeReplyText(size: 14, lineHeight: 1.45)
                .multilineTextAlignment(.leading)
                .fixedSize(horizontal: false, vertical: true)
        }
        .foregroundStyle(textColor)
        .padding(.vertical, 8)
        .padding(.horizontal, 12)
        .background(bubbleShape.fill(message.mine ? palette.accent : palette.soft))
        .overlay(focusRing)
        .contentShape(bubbleShape)
        .offset(x: offset)
        .simultaneousGesture(dragGesture)
        .focusable()
        .focused($keyboardFocused)
        .focusEffectDisabled()
        .onKeyPress(keys: [.return, .space]) { _ in
            onReply()
            return .handled
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(message.author)：\(message.text)。按回车回复")
        .accessibilityAddTraits(.isButton)
        .accessibilityAction { onReply() }
    }

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 8, coordinateSpace: .global)
            .updating($dragging) { _, state, _ in state = true }
            .onChanged { value in
                if axis == nil {
                    axis = abs(value.translation.width) > abs(value.translation.height) ? .horizontal : .vertical
                }
                guard axis == .horizontal else { return }
                // 拖动中没有过渡，直接跟手；只能向左
                var transaction = Transaction()
                transaction.disablesAnimations = true
                withTransaction(transaction) {
                    offset = min(0, max(-SwipeReplyMetrics.maxDrag, value.translation.width * SwipeReplyMetrics.dragFactor))
                }
            }
            .onEnded { _ in finishDrag(allowCommit: true) }
    }

    private func finishDrag(allowCommit: Bool) {
        guard axis != nil || offset != 0 else { return }
        let commit = allowCommit && axis == .horizontal && armed
        axis = nil

        if commit {
            // 箭头保持强调色，直到 300ms 回弹结束
            holdAccent = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { holdAccent = false }
            onReply()
        }

        if reduceMotion {
            offset = 0
        } else {
            withAnimation(SwipeReplyMetrics.ease(0.3)) { offset = 0 }
        }
    }
}

// MARK: - 关闭按钮样式

private struct SwipeReplyCloseButtonStyle: ButtonStyle {
    let palette: SwipeReplyPalette

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .frame(width: 28, height: 28)
            .background(Circle().fill(configuration.isPressed ? palette.soft : Color.clear))
            .contentShape(Circle())
    }
}

// MARK: - 画布

struct SwipeReplyDemo: View {
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    @State private var messages = SwipeReplyMessage.initial
    @State private var replyTarget: SwipeReplyMessage?
    @State private var draft = ""
    @FocusState private var inputFocused: Bool

    private static let contentID = "swipe-reply-content"

    init() {}

    private var canSend: Bool {
        !draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    var body: some View {
        let palette = SwipeReplyPalette(colorScheme)

        VStack(spacing: 0) {
            titleBar(palette)
            messageList(palette)
            inputBar(palette)
        }
        .frame(width: SwipeReplyMetrics.canvasWidth, height: SwipeReplyMetrics.canvasHeight)
        .overlay(alignment: .bottom) {
            ZStack(alignment: .bottom) {
                if let target = replyTarget {
                    quoteBar(target, palette)
                        .transition(reduceMotion ? .opacity : .opacity.combined(with: .offset(y: 8)))
                }
            }
            .padding(.bottom, SwipeReplyMetrics.inputBarHeight)
            .animation(SwipeReplyMetrics.ease(0.2), value: replyTarget != nil)
        }
        .background(palette.bg)
        .clipped()
    }

    // MARK: 标题栏

    private func titleBar(_ palette: SwipeReplyPalette) -> some View {
        Text("林夕")
            .swipeReplyText(size: 17, lineHeight: 1.5, weight: .bold)
            .foregroundStyle(palette.ink)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.top, 12)
            .padding(.horizontal, 18)
            .padding(.bottom, 10)
            .accessibilityAddTraits(.isHeader)
    }

    // MARK: 消息列表

    private func messageList(_ palette: SwipeReplyPalette) -> some View {
        ScrollViewReader { proxy in
            ScrollView(.vertical) {
                VStack(spacing: 8) {
                    ForEach(messages) { message in
                        SwipeReplyRow(
                            message: message,
                            palette: palette,
                            reduceMotion: reduceMotion,
                            onReply: { startReply(to: message) }
                        )
                        .transition(
                            reduceMotion
                                ? .opacity
                                : .opacity
                                    .combined(with: .offset(y: 10))
                                    .combined(with: .scale(scale: 0.96))
                        )
                    }
                }
                .padding(.top, 4)
                .padding(.horizontal, SwipeReplyMetrics.listPaddingH)
                // 引用条出现时下内边距改为 52，最后一条消息不被盖住
                .padding(.bottom, replyTarget != nil ? 52 : 8)
                .animation(SwipeReplyMetrics.ease(0.26), value: messages.count)
                .id(Self.contentID)
            }
            .scrollIndicators(.hidden)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .clipped()
            .onChange(of: messages.count) { _, _ in
                DispatchQueue.main.async {
                    proxy.scrollTo(Self.contentID, anchor: .bottom)
                }
            }
        }
    }

    // MARK: 引用条

    private func quoteBar(_ target: SwipeReplyMessage, _ palette: SwipeReplyPalette) -> some View {
        HStack(spacing: 8) {
            VStack(alignment: .leading, spacing: 0) {
                Text("回复 \(target.author)")
                    .swipeReplyText(size: 12, lineHeight: 1.35, weight: .bold)
                    .foregroundStyle(palette.accent)
                    .lineLimit(1)
                Text(target.text)
                    .swipeReplyText(size: 12, lineHeight: 1.35)
                    .foregroundStyle(palette.ink2)
                    .lineLimit(1)
                    .truncationMode(.tail)
            }
            .padding(.leading, 8)
            .frame(maxWidth: .infinity, alignment: .leading)
            .overlay(alignment: .leading) {
                Rectangle().fill(palette.accent).frame(width: 2)
            }
            .accessibilityElement(children: .combine)

            Button {
                replyTarget = nil
            } label: {
                SwipeReplyCloseShape()
                    .stroke(palette.ink2, style: swipeReplyStroke(1.8))
                    .frame(width: 14, height: 14)
            }
            .buttonStyle(SwipeReplyCloseButtonStyle(palette: palette))
            .accessibilityLabel("取消回复")
        }
        .padding(.leading, 12)
        .padding(.trailing, 8)
        .frame(height: SwipeReplyMetrics.quoteBarHeight)
        .frame(maxWidth: .infinity)
        .background(palette.bg)
        .overlay(alignment: .top) {
            Rectangle().fill(palette.line).frame(height: 1)
        }
    }

    // MARK: 输入栏

    private func inputBar(_ palette: SwipeReplyPalette) -> some View {
        HStack(spacing: 8) {
            TextField(
                "",
                text: $draft,
                prompt: Text("发消息").foregroundStyle(palette.ink2)
            )
            .font(.system(size: 14))
            .foregroundStyle(palette.ink)
            .tint(palette.accent)
            .submitLabel(.send)
            .focused($inputFocused)
            .onSubmit {
                send()
                // 回车发送后焦点留在输入框
                inputFocused = true
            }
            .padding(.horizontal, 14)
            .frame(height: 36)
            .frame(maxWidth: .infinity)
            .background(RoundedRectangle(cornerRadius: 18).fill(palette.soft))
            .overlay {
                RoundedRectangle(cornerRadius: 18)
                    .strokeBorder(palette.accent, lineWidth: 2)
                    .opacity(inputFocused ? 1 : 0)
                    .allowsHitTesting(false)
            }
            .accessibilityLabel("消息内容")

            Button {
                send()
            } label: {
                SwipeReplySendShape()
                    .stroke(palette.onAccent, style: swipeReplyStroke(2))
                    .frame(width: 16, height: 16)
                    .frame(width: 36, height: 36)
                    .background(Circle().fill(palette.accent))
                    .contentShape(Circle())
            }
            .buttonStyle(.plain)
            .disabled(!canSend)
            .opacity(canSend ? 1 : 0.4)
            .accessibilityLabel("发送")
        }
        .padding(.horizontal, 10)
        .frame(height: SwipeReplyMetrics.inputBarHeight)
        .frame(maxWidth: .infinity)
        .background(palette.bg)
        .overlay(alignment: .top) {
            Rectangle().fill(palette.line).frame(height: 1)
        }
    }

    // MARK: 行为

    private func startReply(to message: SwipeReplyMessage) {
        // 已有引用条时直接替换内容
        replyTarget = message
        inputFocused = true
        AccessibilityNotification.Announcement("正在回复：\(message.text)").post()
    }

    private func send() {
        let text = draft.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        messages.append(SwipeReplyMessage(text: text, mine: true, quote: replyTarget?.text))
        replyTarget = nil
        draft = ""
    }
}
