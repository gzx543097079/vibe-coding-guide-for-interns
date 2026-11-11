import SwiftUI
import UIKit

// MARK: - 数据与常量

private struct StoriesItem {
    let hue: Double
    let title: String
    let subtitle: String
}

private enum StoriesSpec {
    static let canvas = CGSize(width: 248, height: 442)
    static let duration: CFTimeInterval = 4.0
    static let tapThreshold: CFTimeInterval = 0.25
    static let zoneTop: CGFloat = 64
    static let leftRatio: CGFloat = 0.32
    /// 单帧最大累计时间，避免从后台回来时一次跳过多条
    static let maxFrameDelta: CFTimeInterval = 0.1

    static let items: [StoriesItem] = [
        StoriesItem(hue: 250, title: "今天的构建通过了", subtitle: "主分支 12 个检查全部通过"),
        StoriesItem(hue: 150, title: "新成员加入", subtitle: "欢迎两位实习生加入前端组"),
        StoriesItem(hue: 30, title: "周五下午评审", subtitle: "三点，线上会议室"),
        StoriesItem(hue: 330, title: "本周合并 18 个 PR", subtitle: "比上周多 5 个"),
    ]

    /// cubic-bezier(0.2, 0.8, 0.2, 1)
    static func ease(_ duration: Double) -> Animation {
        .timingCurve(0.2, 0.8, 0.2, 1, duration: duration)
    }
}

// MARK: - 颜色

private extension Color {
    /// oklch → sRGB（超出色域的分量直接裁剪）
    static func storiesOKLCH(l: Double, c: Double, h: Double) -> Color {
        let rad = h * .pi / 180
        let a = c * cos(rad)
        let b = c * sin(rad)

        let l_ = l + 0.3963377774 * a + 0.2158037573 * b
        let m_ = l - 0.1055613458 * a - 0.0638541728 * b
        let s_ = l - 0.0894841775 * a - 1.2914855480 * b

        let lc = l_ * l_ * l_
        let mc = m_ * m_ * m_
        let sc = s_ * s_ * s_

        let lr = 4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc
        let lg = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc
        let lb = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc

        func gamma(_ v: Double) -> Double {
            let x = min(max(v, 0), 1)
            return x <= 0.0031308 ? 12.92 * x : 1.055 * pow(x, 1 / 2.4) - 0.055
        }
        return Color(.sRGB, red: gamma(lr), green: gamma(lg), blue: gamma(lb), opacity: 1)
    }
}

// MARK: - 逐帧计时

private final class StoriesTicker: NSObject {
    var onTick: ((CFTimeInterval) -> Void)?
    private var link: CADisplayLink?
    private var last: CFTimeInterval?

    func start() {
        guard link == nil else { return }
        let l = CADisplayLink(target: self, selector: #selector(step(_:)))
        l.add(to: .main, forMode: .common)
        link = l
    }

    func stop() {
        link?.invalidate()
        link = nil
        last = nil
    }

    @objc private func step(_ l: CADisplayLink) {
        let now = l.timestamp
        let dt = last.map { now - $0 } ?? 0
        last = now
        onTick?(dt)
    }
}

private final class StoriesModel: ObservableObject {
    @Published var index = 0
    /// 当前条目已播放时间（秒）
    @Published var elapsed: CFTimeInterval = 0
    @Published var pausedByButton = false
    @Published var holding = false
    /// 每次切换（含从头重播）自增，用来重新触发正文进入动画
    @Published var enterToken = 0

    private let ticker = StoriesTicker()

    init() {
        ticker.onTick = { [weak self] dt in self?.tick(dt) }
    }

    deinit { ticker.stop() }

    var progress: Double { min(max(elapsed / StoriesSpec.duration, 0), 1) }

    func start() { ticker.start() }
    func stop() { ticker.stop() }

    private func tick(_ dt: CFTimeInterval) {
        guard !pausedByButton, !holding else { return }
        // 限制单帧增量：后台回来时不会一次跳过多条
        let next = elapsed + min(max(dt, 0), StoriesSpec.maxFrameDelta)
        if next >= StoriesSpec.duration {
            goNext()
        } else {
            elapsed = next
        }
    }

    func goNext() {
        index = (index + 1) % StoriesSpec.items.count
        elapsed = 0
        enterToken += 1
    }

    func goPrev() {
        // 已经是第一条时从头重播第一条
        index = max(index - 1, 0)
        elapsed = 0
        enterToken += 1
    }
}

// MARK: - 子视图

private struct StoriesProgressBar: View {
    let index: Int
    let progress: Double

    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<StoriesSpec.items.count, id: \.self) { i in
                Rectangle()
                    .fill(Color.white.opacity(0.35))
                    .overlay(
                        Rectangle()
                            .fill(Color.white)
                            .scaleEffect(x: value(for: i), y: 1, anchor: .leading)
                    )
                    .frame(height: 3)
                    .frame(maxWidth: .infinity)
                    .clipShape(RoundedRectangle(cornerRadius: 2, style: .circular))
            }
        }
        .accessibilityHidden(true)
    }

    private func value(for i: Int) -> CGFloat {
        if i < index { return 1 }
        if i > index { return 0 }
        return CGFloat(progress)
    }
}

private struct StoriesPauseIcon: Shape {
    let paused: Bool

    func path(in rect: CGRect) -> Path {
        var p = Path()
        if paused {
            // M4 2.5v9l7.5-4.5z
            p.move(to: CGPoint(x: 4, y: 2.5))
            p.addLine(to: CGPoint(x: 4, y: 11.5))
            p.addLine(to: CGPoint(x: 11.5, y: 7))
            p.closeSubpath()
        } else {
            // M3.5 2.5h2.5v9H3.5z M8 2.5h2.5v9H8z
            p.addRect(CGRect(x: 3.5, y: 2.5, width: 2.5, height: 9))
            p.addRect(CGRect(x: 8, y: 2.5, width: 2.5, height: 9))
        }
        let s = min(rect.width, rect.height) / 14
        return p.applying(CGAffineTransform(scaleX: s, y: s))
    }
}

private struct StoriesPauseButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
    }
}

private struct StoriesPauseButton: View {
    let paused: Bool
    let action: () -> Void
    @State private var hovering = false
    @FocusState private var focused: Bool

    var body: some View {
        Button(action: action) {
            StoriesPauseIcon(paused: paused)
                .fill(Color.white)
                .frame(width: 14, height: 14)
                .frame(width: 28, height: 28)
                .background(Circle().fill(Color.white.opacity(hovering ? 0.18 : 0)))
                .overlay(
                    Circle()
                        .strokeBorder(Color.white, lineWidth: 2)
                        .padding(4)
                        .opacity(focused ? 1 : 0)
                )
                .contentShape(Circle())
        }
        .buttonStyle(StoriesPauseButtonStyle())
        .onHover { hovering = $0 }
        .focused($focused)
        .focusEffectDisabled()
        .accessibilityLabel(paused ? "继续播放" : "暂停")
        .accessibilityAddTraits(paused ? [.isSelected] : [])
    }
}

private struct StoriesHeader: View {
    let paused: Bool
    let toggle: () -> Void

    var body: some View {
        HStack(alignment: .center, spacing: 8) {
            Text("林")
                .font(.system(size: 13, weight: .bold))
                .frame(width: 28, height: 28)
                .background(Circle().fill(Color.white.opacity(0.22)))
            Text("林夕")
                .font(.system(size: 13, weight: .semibold))
            Text("2 小时前")
                .font(.system(size: 12))
                .opacity(0.7)
            Spacer(minLength: 0)
            StoriesPauseButton(paused: paused, action: toggle)
        }
        .lineLimit(1)
        .foregroundStyle(Color.white)
        .padding(.horizontal, 2)
    }
}

/// 正文：每次切换以新的 id 重建，出现时播放进入动画
private struct StoriesBody: View {
    let item: StoriesItem
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var shown = false

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(item.title)
                .font(.system(size: 22, weight: .heavy))
                .lineSpacing(2.4) // 行高 1.3 ≈ 28.6pt
                .padding(.vertical, 1.2)
            Text(item.subtitle)
                .font(.system(size: 13))
                .lineSpacing(4) // 行高 1.5 ≈ 19.5pt
                .padding(.vertical, 2)
                .opacity(0.8)
        }
        .foregroundStyle(Color.white)
        .multilineTextAlignment(.leading)
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 20)
        .frame(maxHeight: .infinity, alignment: .center)
        .opacity(shown ? 1 : 0)
        .scaleEffect(reduceMotion || shown ? 1 : 1.04)
        .accessibilityElement(children: .combine)
        .onAppear {
            withAnimation(StoriesSpec.ease(0.28)) { shown = true }
        }
    }
}

/// 透明点击区：按下立即回调，松开时告知是否算一次点击
private struct StoriesTapZone: View {
    let size: CGSize
    let label: String
    let onPress: () -> Void
    /// 参数为 true 表示短按（需要切换）
    let onRelease: (Bool) -> Void
    let onActivate: () -> Void

    @State private var pressStart: CFTimeInterval?
    @State private var cancelled = false
    @GestureState private var touching = false
    @FocusState private var focused: Bool

    var body: some View {
        Color.clear
            .frame(width: size.width, height: size.height)
            .contentShape(Rectangle())
            .overlay(
                Rectangle()
                    .strokeBorder(Color.white, lineWidth: 2)
                    .padding(4)
                    .opacity(focused ? 1 : 0)
                    .allowsHitTesting(false)
            )
            .gesture(
                DragGesture(minimumDistance: 0, coordinateSpace: .local)
                    .updating($touching) { _, state, _ in state = true }
                    .onChanged { value in
                        let inside = CGRect(origin: .zero, size: size).contains(value.location)
                        if pressStart == nil {
                            guard !cancelled, inside else { return }
                            pressStart = CACurrentMediaTime()
                            onPress()
                        } else if !inside {
                            // 移出点击区：视为松开但不切换
                            pressStart = nil
                            cancelled = true
                            onRelease(false)
                        }
                    }
                    .onEnded { _ in
                        if let start = pressStart {
                            pressStart = nil
                            onRelease(CACurrentMediaTime() - start < StoriesSpec.tapThreshold)
                        }
                        cancelled = false
                    }
            )
            .onChange(of: touching) { _, now in
                // 手势被系统取消时不会走 onEnded，这里兜底恢复
                guard !now else { return }
                if pressStart != nil {
                    pressStart = nil
                    onRelease(false)
                }
                cancelled = false
            }
            .focusable()
            .focused($focused)
            .focusEffectDisabled()
            .onKeyPress(keys: [.return, .space]) { _ in
                onActivate()
                return .handled
            }
            .accessibilityElement()
            .accessibilityLabel(label)
            .accessibilityAddTraits(.isButton)
            .accessibilityAction { onActivate() }
    }
}

// MARK: - 对外视图

struct StoriesDemo: View {
    @StateObject private var model = StoriesModel()
    @Environment(\.colorScheme) private var colorScheme

    private var item: StoriesItem { StoriesSpec.items[model.index] }

    private var canvasBackground: Color {
        colorScheme == .dark ? .black : .white
    }

    var body: some View {
        let canvas = StoriesSpec.canvas
        let zoneHeight = canvas.height - StoriesSpec.zoneTop
        let leftWidth = canvas.width * StoriesSpec.leftRatio

        ZStack(alignment: .top) {
            // 背景色直接切换，不做过渡
            Color.storiesOKLCH(l: 0.55, c: 0.13, h: item.hue)

            StoriesBody(item: item)
                .id(model.enterToken)

            HStack(spacing: 0) {
                StoriesTapZone(
                    size: CGSize(width: leftWidth, height: zoneHeight),
                    label: "上一条",
                    onPress: { model.holding = true },
                    onRelease: { tapped in
                        model.holding = false
                        if tapped { model.goPrev() }
                    },
                    onActivate: { model.goPrev() }
                )
                StoriesTapZone(
                    size: CGSize(width: canvas.width - leftWidth, height: zoneHeight),
                    label: "下一条",
                    onPress: { model.holding = true },
                    onRelease: { tapped in
                        model.holding = false
                        if tapped { model.goNext() }
                    },
                    onActivate: { model.goNext() }
                )
            }
            .padding(.top, StoriesSpec.zoneTop)

            VStack(spacing: 10) {
                StoriesProgressBar(index: model.index, progress: model.progress)
                StoriesHeader(paused: model.pausedByButton) {
                    model.pausedByButton.toggle()
                }
            }
            .padding(EdgeInsets(top: 10, leading: 10, bottom: 0, trailing: 10))
            .opacity(model.holding ? 0 : 1)
            .animation(StoriesSpec.ease(0.2), value: model.holding)
        }
        .frame(width: canvas.width, height: canvas.height)
        .background(canvasBackground)
        .clipped()
        .onKeyPress(.rightArrow) {
            model.goNext()
            return .handled
        }
        .onKeyPress(.leftArrow) {
            model.goPrev()
            return .handled
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel("快拍")
        .onChange(of: model.enterToken) { _, _ in
            // 对应 aria-live="polite"：切换后读出新内容
            var text = AttributedString("\(item.title)，\(item.subtitle)")
            text.accessibilitySpeechAnnouncementPriority = .low
            AccessibilityNotification.Announcement(text).post()
        }
        .onAppear { model.start() }
        .onDisappear { model.stop() }
    }
}
