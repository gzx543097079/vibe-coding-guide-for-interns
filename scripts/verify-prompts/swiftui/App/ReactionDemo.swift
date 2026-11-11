import SwiftUI
import UIKit

// MARK: - 颜色

private struct ReactionRGB {
    let r: Double
    let g: Double
    let b: Double

    init(_ hex: UInt32) {
        r = Double((hex >> 16) & 0xff) / 255
        g = Double((hex >> 8) & 0xff) / 255
        b = Double(hex & 0xff) / 255
    }

    init(r: Double, g: Double, b: Double) {
        self.r = r
        self.g = g
        self.b = b
    }

    var color: Color { Color(.sRGB, red: r, green: g, blue: b, opacity: 1) }

    // sRGB -> OKLab
    private var oklab: (l: Double, a: Double, b: Double) {
        func lin(_ c: Double) -> Double {
            c <= 0.04045 ? c / 12.92 : pow((c + 0.055) / 1.055, 2.4)
        }
        let lr = lin(r), lg = lin(g), lb = lin(b)
        let l = cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
        let m = cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
        let s = cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
        return (
            0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
        )
    }

    /// 等价于 CSS color-mix(in oklab, self x%, other)
    func mixed(_ fraction: Double, with other: ReactionRGB) -> ReactionRGB {
        let p = oklab, q = other.oklab
        let L = p.l * fraction + q.l * (1 - fraction)
        let A = p.a * fraction + q.a * (1 - fraction)
        let B = p.b * fraction + q.b * (1 - fraction)
        let l = pow(L + 0.3963377774 * A + 0.2158037573 * B, 3)
        let m = pow(L - 0.1055613458 * A - 0.0638541728 * B, 3)
        let s = pow(L - 0.0894841775 * A - 1.2914855480 * B, 3)
        func gam(_ c: Double) -> Double {
            let v = min(max(c, 0), 1)
            return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1 / 2.4) - 0.055
        }
        return ReactionRGB(
            r: gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
            g: gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
            b: gam(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
        )
    }
}

private struct ReactionPalette {
    let bg: Color
    let ink: Color
    let line: Color
    let soft: Color
    let accent: Color
    let onAccent: Color
    let badgeFill: Color

    init(_ scheme: ColorScheme) {
        let dark = scheme == .dark
        let bgRGB = ReactionRGB(dark ? 0x000000 : 0xffffff)
        let accentRGB = ReactionRGB(dark ? 0x0a84ff : 0x0071e3)
        bg = bgRGB.color
        ink = ReactionRGB(dark ? 0xffffff : 0x000000).color
        line = ReactionRGB(dark ? 0x38383a : 0xc6c6c8).color
        soft = ReactionRGB(dark ? 0x1c1c1e : 0xf2f2f7).color
        accent = accentRGB.color
        onAccent = ReactionRGB(0xffffff).color
        badgeFill = accentRGB.mixed(0.14, with: bgRGB).color
    }
}

// MARK: - 动效

private func reactionEase(_ duration: Double) -> Animation {
    .timingCurve(0.2, 0.8, 0.2, 1, duration: duration)
}

private func reactionEaseIn(_ duration: Double) -> Animation {
    .timingCurve(0.4, 0, 1, 1, duration: duration)
}

private struct ReactionPop: ViewModifier {
    let scale: CGFloat
    let opacity: Double
    let anchor: UnitPoint

    func body(content: Content) -> some View {
        content.scaleEffect(scale, anchor: anchor).opacity(opacity)
    }
}

// MARK: - 数据

private struct ReactionMessage: Identifiable {
    let id: Int
    let mine: Bool
    let text: String
}

private enum ReactionFocusTarget: Hashable {
    case bubble(Int)
    case emoji(Int)
}

private let reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"]
private let reactionCanvasWidth: CGFloat = 248
private let reactionCanvasHeight: CGFloat = 442
private let reactionRowWidth: CGFloat = 248 - 24
// 6 × 32 + 5 × 2 + 左右 padding 12
private let reactionBarWidth: CGFloat = 6 * 32 + 5 * 2 + 12

// MARK: - 表情按钮样式

private struct ReactionEmojiStyle: ButtonStyle {
    let lifted: Bool
    let selected: Bool
    let soft: Color
    let reduceMotion: Bool

    func makeBody(configuration: Configuration) -> some View {
        let active = (lifted || configuration.isPressed) && !reduceMotion
        return configuration.label
            .frame(width: 32, height: 32)
            .background(Circle().fill(selected ? soft : Color.clear))
            .contentShape(Circle())
            .scaleEffect(active ? 1.25 : 1)
            .offset(y: active ? -2 : 0)
            .animation(reactionEase(0.15), value: active)
    }
}

// MARK: - 回应徽章

private struct ReactionBadgeSlot: View {
    let emoji: String?
    let palette: ReactionPalette
    let reduceMotion: Bool
    let onCancel: () -> Void

    @State private var shown: String?
    @State private var scale: CGFloat = 0
    @State private var opacity: Double = 0
    @State private var task: Task<Void, Never>?

    var body: some View {
        // 用 ZStack 包一层，保证没有徽章时 onChange 仍然生效
        ZStack {
            if let shown {
                Button(action: onCancel) {
                    HStack(spacing: 4) {
                        Text(shown).font(.system(size: 14))
                        Text("1")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(palette.accent)
                    }
                    .padding(.leading, 6)
                    .padding(.trailing, 8)
                    .frame(height: 24)
                    .background(RoundedRectangle(cornerRadius: 12).fill(palette.badgeFill))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .strokeBorder(palette.accent, lineWidth: 1)
                    )
                    .contentShape(RoundedRectangle(cornerRadius: 12))
                }
                .buttonStyle(.plain)
                .scaleEffect(scale)
                .opacity(opacity)
                .padding(.horizontal, 10)
                .padding(.top, -6)
                .accessibilityLabel("取消回应 \(shown)")
            }
        }
        .onAppear {
            if let emoji, shown == nil { run(emoji) }
        }
        .onChange(of: emoji) { _, new in run(new) }
    }

    private func run(_ target: String?) {
        task?.cancel()
        task = Task { @MainActor in
            // 旧徽章先消失
            if shown != nil {
                withAnimation(reactionEaseIn(0.16)) {
                    if !reduceMotion { scale = 0 }
                    opacity = 0
                }
                try? await Task.sleep(nanoseconds: 160_000_000)
                if Task.isCancelled { return }
                shown = nil
            }
            guard let target else { return }
            // 新徽章再出现
            scale = reduceMotion ? 1 : 0
            opacity = reduceMotion ? 0 : 1
            shown = target
            try? await Task.sleep(nanoseconds: 16_000_000)
            if Task.isCancelled { return }
            if reduceMotion {
                withAnimation(reactionEase(0.35)) { opacity = 1 }
                return
            }
            // 关键帧 0% → 60%：scale 0 → 1.2
            withAnimation(reactionEase(0.21)) { scale = 1.2 }
            try? await Task.sleep(nanoseconds: 210_000_000)
            if Task.isCancelled { return }
            // 60% → 100%：scale 1.2 → 1
            withAnimation(reactionEase(0.14)) { scale = 1 }
        }
    }
}

// MARK: - 画布

struct ReactionDemo: View {
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    @State private var reactions: [Int: String] = [:]
    @State private var openID: Int?
    /// 层级抬到遮罩之上的那一行；关闭动画结束后才放下
    @State private var raisedID: Int?
    @State private var pressingID: Int?
    @State private var emojiShown = false
    @State private var hoveredEmoji: Int?
    @State private var openedViaKeyboard = false

    @FocusState private var keyFocus: ReactionFocusTarget?
    @AccessibilityFocusState private var a11yFocus: ReactionFocusTarget?

    private let messages: [ReactionMessage] = [
        ReactionMessage(id: 0, mine: false, text: "新版本今晚发布"),
        ReactionMessage(id: 1, mine: true, text: "收到，我来盯发布"),
        ReactionMessage(id: 2, mine: false, text: "辛苦了，发完早点休息"),
    ]

    private var palette: ReactionPalette { ReactionPalette(colorScheme) }

    var body: some View {
        VStack(spacing: 0) {
            // 遮罩：零高度占位，向下溢出铺满画布；zIndex 介于普通行与被长按行之间
            ZStack {
                if openID != nil {
                    Color.black.opacity(0.28)
                        .frame(width: reactionCanvasWidth, height: reactionCanvasHeight)
                        .contentShape(Rectangle())
                        .onTapGesture { close() }
                        .accessibilityElement()
                        .accessibilityLabel("关闭表情条")
                        .accessibilityAddTraits(.isButton)
                        .accessibilityAction { close() }
                        .transition(.opacity.animation(reactionEase(0.18)))
                }
            }
            .frame(width: reactionCanvasWidth, height: 0, alignment: .top)
            .zIndex(1)

            titleBar

            ForEach(messages) { msg in
                row(msg)
                    .padding(.top, msg.id == messages.first?.id ? 16 : 10)
                    .padding(.horizontal, 12)
                    .zIndex(raisedID == msg.id ? 2 : 0)
                    .accessibilityHidden(openID != nil && openID != msg.id)
            }

            Spacer(minLength: 0)
        }
        .frame(width: reactionCanvasWidth, height: reactionCanvasHeight, alignment: .top)
        .background(palette.bg)
        .clipped()
    }

    // MARK: 标题栏

    private var titleBar: some View {
        Text("林夕")
            .font(.system(size: 17, weight: .bold))
            .foregroundStyle(palette.ink)
            .frame(height: 17 * 1.5)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.top, 12)
            .padding(.horizontal, 18)
            .padding(.bottom, 10)
            .accessibilityAddTraits(.isHeader)
            .accessibilityHidden(openID != nil)
    }

    // MARK: 消息行

    private func row(_ msg: ReactionMessage) -> some View {
        VStack(alignment: msg.mine ? .trailing : .leading, spacing: 0) {
            bubble(msg)
            ReactionBadgeSlot(
                emoji: reactions[msg.id],
                palette: palette,
                reduceMotion: reduceMotion,
                onCancel: { reactions[msg.id] = nil }
            )
            .zIndex(1)
        }
        .frame(maxWidth: .infinity, alignment: msg.mine ? .trailing : .leading)
        .overlay(alignment: msg.mine ? .topTrailing : .topLeading) {
            if openID == msg.id {
                bar(msg)
                    // 条的底边距气泡顶部 8pt
                    .alignmentGuide(.top) { $0[.bottom] + 8 }
                    .transition(barTransition(mine: msg.mine))
            }
        }
    }

    private func bubble(_ msg: ReactionMessage) -> some View {
        let shape = UnevenRoundedRectangle(
            topLeadingRadius: 18,
            bottomLeadingRadius: msg.mine ? 18 : 6,
            bottomTrailingRadius: msg.mine ? 6 : 18,
            topTrailingRadius: 18
        )
        // 行高 1.45：用行距 + 上下补白凑出来
        let extra = max(0, 14 * 1.45 - UIFont.systemFont(ofSize: 14).lineHeight)
        let pressing = pressingID == msg.id
        let sender = msg.mine ? "自己" : "林夕"

        return Text(msg.text)
            .font(.system(size: 14))
            .lineSpacing(extra)
            .multilineTextAlignment(.leading)
            .foregroundStyle(msg.mine ? palette.onAccent : palette.ink)
            .padding(.vertical, 8 + extra / 2)
            .padding(.horizontal, 12)
            .background(shape.fill(msg.mine ? palette.accent : palette.soft))
            .contentShape(shape)
            .scaleEffect(pressing && !reduceMotion ? 0.96 : 1)
            .animation(pressing ? reactionEase(0.45) : reactionEase(0.15), value: pressing)
            .onLongPressGesture(minimumDuration: 0.45, maximumDistance: 8) {
                open(msg.id, viaKeyboard: false)
            } onPressingChanged: { isPressing in
                if isPressing {
                    if openID == nil { pressingID = msg.id }
                } else if pressingID == msg.id {
                    pressingID = nil
                }
            }
            .focusable()
            .focused($keyFocus, equals: .bubble(msg.id))
            .onKeyPress(keys: [.return, .space]) { _ in
                open(msg.id, viaKeyboard: true)
                return .handled
            }
            .accessibilityElement(children: .ignore)
            .accessibilityLabel("\(sender)：\(msg.text)")
            .accessibilityHint("添加回应")
            .accessibilityValue(openID == msg.id ? "表情条已展开" : "")
            .accessibilityAddTraits(.isButton)
            .accessibilityAction { open(msg.id, viaKeyboard: false) }
            .accessibilityFocused($a11yFocus, equals: .bubble(msg.id))
            .frame(maxWidth: reactionRowWidth * 0.78, alignment: msg.mine ? .trailing : .leading)
    }

    // MARK: 表情条

    private func barTransition(mine: Bool) -> AnyTransition {
        if reduceMotion {
            return .asymmetric(
                insertion: .opacity.animation(reactionEase(0.22)),
                removal: .opacity.animation(reactionEaseIn(0.14))
            )
        }
        let anchor = UnitPoint(
            x: mine ? (reactionBarWidth - 24) / reactionBarWidth : 24 / reactionBarWidth,
            y: 1
        )
        let pop = AnyTransition.modifier(
            active: ReactionPop(scale: 0.6, opacity: 0, anchor: anchor),
            identity: ReactionPop(scale: 1, opacity: 1, anchor: anchor)
        )
        return .asymmetric(
            insertion: pop.animation(reactionEase(0.22)),
            removal: pop.animation(reactionEaseIn(0.14))
        )
    }

    private func bar(_ msg: ReactionMessage) -> some View {
        HStack(spacing: 2) {
            ForEach(Array(reactionEmojis.enumerated()), id: \.offset) { index, emoji in
                let selected = reactions[msg.id] == emoji
                Button {
                    pick(emoji, for: msg.id)
                } label: {
                    Text(emoji).font(.system(size: 20))
                }
                .buttonStyle(
                    ReactionEmojiStyle(
                        lifted: hoveredEmoji == index || keyFocus == .emoji(index),
                        selected: selected,
                        soft: palette.soft,
                        reduceMotion: reduceMotion
                    )
                )
                .onHover { inside in
                    if inside {
                        hoveredEmoji = index
                    } else if hoveredEmoji == index {
                        hoveredEmoji = nil
                    }
                }
                .focused($keyFocus, equals: .emoji(index))
                // 依次弹入：第 n 个延迟 n × 30ms
                .scaleEffect(emojiShown || reduceMotion ? 1 : 0.3)
                .opacity(emojiShown ? 1 : 0)
                .animation(reactionEase(0.26).delay(Double(index) * 0.03), value: emojiShown)
                .accessibilityLabel("回应 \(emoji)")
                .accessibilityAddTraits(selected ? .isSelected : [])
                .accessibilityFocused($a11yFocus, equals: .emoji(index))
            }
        }
        .padding(.vertical, 5)
        .padding(.horizontal, 6)
        .background(
            Capsule()
                .fill(palette.bg)
                .shadow(color: Color.black.opacity(0.18), radius: 12, x: 0, y: 6)
        )
        // 0 0 0 1px line：贴着外沿的一圈描边
        .overlay(Capsule().stroke(palette.line, lineWidth: 1).padding(-0.5))
        .fixedSize()
        .onKeyPress(.escape) {
            close()
            return .handled
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel("选择回应")
        .accessibilityAction(.escape) { close() }
        .onAppear {
            DispatchQueue.main.async { emojiShown = true }
        }
    }

    // MARK: 行为

    private func open(_ id: Int, viaKeyboard: Bool) {
        // 同一时间只能打开一个表情条
        guard openID == nil else { return }
        pressingID = nil
        emojiShown = false
        hoveredEmoji = nil
        openedViaKeyboard = viaKeyboard
        raisedID = id
        withAnimation(reactionEase(0.22)) { openID = id }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            guard openID == id else { return }
            a11yFocus = .emoji(0)
            if viaKeyboard { keyFocus = .emoji(0) }
        }
    }

    private func close() {
        guard let id = openID else { return }
        withAnimation(reactionEase(0.18)) { openID = nil }
        hoveredEmoji = nil
        a11yFocus = .bubble(id)
        if openedViaKeyboard { keyFocus = .bubble(id) }
        // 等退出动画结束再把这一行放回原层级
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            if openID == nil, raisedID == id { raisedID = nil }
        }
    }

    private func pick(_ emoji: String, for id: Int) {
        if reactions[id] == emoji {
            reactions[id] = nil
        } else {
            reactions[id] = emoji
        }
        close()
    }
}
