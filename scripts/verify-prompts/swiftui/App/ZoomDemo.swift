import SwiftUI

// MARK: - 布局常量

private enum ZoomMetrics {
    static let canvas = CGSize(width: 248, height: 442)
    /// 标题栏高度：上 12 + 行高 17×1.5 + 下 10
    static let headerLineHeight: CGFloat = 25.5
    static let headerHeight: CGFloat = 12 + 25.5 + 10
    static let gridPadH: CGFloat = 18
    static let gridPadV: CGFloat = 4
    static let gap: CGFloat = 6
    static let columns = 3
    static let count = 6
    static let thumbRadius: CGFloat = 10
    static let hues: [Double] = [30, 150, 250, 85, 330, 200]

    /// 缩略图边长：3 列等分
    static var cell: CGFloat {
        (canvas.width - gridPadH * 2 - gap * CGFloat(columns - 1)) / CGFloat(columns)
    }

    /// 大图边长 = 画布宽度
    static var heroSide: CGFloat { canvas.width }

    /// 第 index 个缩略图在画布坐标系里的位置
    static func thumbFrame(_ index: Int) -> CGRect {
        let col = CGFloat(index % columns)
        let row = CGFloat(index / columns)
        return CGRect(
            x: gridPadH + col * (cell + gap),
            y: headerHeight + gridPadV + row * (cell + gap),
            width: cell,
            height: cell
        )
    }

    /// 让大图「正好盖住缩略图」的变换
    static func coverTransform(_ index: Int) -> (offset: CGSize, scale: CGFloat, radius: CGFloat) {
        let frame = thumbFrame(index)
        let scale = cell / heroSide
        let offset = CGSize(
            width: frame.midX - canvas.width / 2,
            height: frame.midY - canvas.height / 2
        )
        return (offset, scale, thumbRadius / scale)
    }
}

// MARK: - 颜色

/// oklch → sRGB（超出色域的分量直接截断）
private func zoomOKLCH(_ l: Double, _ c: Double, _ h: Double, alpha: Double = 1) -> Color {
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

    func encode(_ v: Double) -> Double {
        let x = min(max(v, 0), 1)
        return x <= 0.0031308 ? 12.92 * x : 1.055 * pow(x, 1 / 2.4) - 0.055
    }
    return Color(.sRGB, red: encode(lr), green: encode(lg), blue: encode(lb), opacity: alpha)
}

private func zoomHex(_ hex: UInt32) -> Color {
    Color(
        .sRGB,
        red: Double((hex >> 16) & 0xFF) / 255,
        green: Double((hex >> 8) & 0xFF) / 255,
        blue: Double(hex & 0xFF) / 255,
        opacity: 1
    )
}

private struct ZoomPalette {
    let dark: Bool

    var bg: Color { dark ? zoomHex(0x000000) : zoomHex(0xFFFFFF) }
    var ink: Color { dark ? zoomHex(0xFFFFFF) : zoomHex(0x000000) }
    var accent: Color { dark ? zoomHex(0x0A84FF) : zoomHex(0x0071E3) }

    func tileFill(_ index: Int) -> Color {
        let h = ZoomMetrics.hues[index]
        return dark ? zoomOKLCH(0.38, 0.06, h) : zoomOKLCH(0.88, 0.05, h)
    }

    func tileInk(_ index: Int) -> Color {
        let h = ZoomMetrics.hues[index]
        return dark ? zoomOKLCH(0.9, 0.08, h, alpha: 0.55) : zoomOKLCH(0.38, 0.12, h, alpha: 0.55)
    }
}

// MARK: - 状态

private enum ZoomPhase {
    case grid       // 网格
    case opening    // 放大过程中
    case viewing    // 全屏查看
    case dragging   // 向下拖动中
    case closing    // 关闭过程中
}

private enum ZoomFocusTarget: Hashable {
    case thumb(Int)
    case close
}

private enum ZoomDragSession {
    case idle
    case active
    case ignored    // 这次按下发生在不能拖的时机，整次手势都忽略
}

/// 不带按压反馈的按钮样式
private struct ZoomBareButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
    }
}

/// 关闭图标：viewBox 0 0 14 14，路径 m3 3 8 8M11 3l-8 8
private struct ZoomCloseIcon: Shape {
    func path(in rect: CGRect) -> Path {
        let k = min(rect.width, rect.height) / 14
        var p = Path()
        p.move(to: CGPoint(x: 3 * k, y: 3 * k))
        p.addLine(to: CGPoint(x: 11 * k, y: 11 * k))
        p.move(to: CGPoint(x: 11 * k, y: 3 * k))
        p.addLine(to: CGPoint(x: 3 * k, y: 11 * k))
        return p
    }
}

// MARK: - 画布

struct ZoomDemo: View {
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    @State private var openIndex: Int?
    @State private var phase: ZoomPhase = .grid

    // 大图当前的变换
    @State private var heroOffset: CGSize = .zero
    @State private var heroScale: CGFloat = 1
    @State private var heroRadius: CGFloat = 0
    @State private var heroOpacity: Double = 1
    // 遮罩和顶部信息条的透明度
    @State private var chromeOpacity: Double = 0

    @State private var dragSession: ZoomDragSession = .idle
    /// 每开始一段动画加一，用来作废过期的完成回调
    @State private var generation = 0

    @GestureState private var pressing = false
    @FocusState private var focus: ZoomFocusTarget?
    @AccessibilityFocusState private var a11yFocus: ZoomFocusTarget?

    private static let canvasSpace = "ZoomCanvas"

    init() {}

    private var palette: ZoomPalette { ZoomPalette(dark: colorScheme == .dark) }

    private static func ease(_ duration: Double) -> Animation {
        .timingCurve(0.2, 0.8, 0.2, 1, duration: duration)
    }

    var body: some View {
        ZStack(alignment: .topLeading) {
            palette.bg

            VStack(spacing: 0) {
                header
                grid
                Spacer(minLength: 0)
            }
            // 查看层打开期间网格不可点，也不暴露给读屏
            .allowsHitTesting(openIndex == nil)
            .accessibilityHidden(openIndex != nil)

            if let index = openIndex {
                viewer(index)
                    .zIndex(1)
            }
        }
        .frame(width: ZoomMetrics.canvas.width, height: ZoomMetrics.canvas.height)
        .coordinateSpace(name: Self.canvasSpace)
        .clipped()
        .onChange(of: pressing) { _, isPressing in
            // 手势被系统取消时 onEnded 不会来，这里兜底回弹
            guard !isPressing else { return }
            DispatchQueue.main.async {
                guard dragSession != .idle else { return }
                let session = dragSession
                dragSession = .idle
                if session == .active, phase == .dragging {
                    snapBack()
                }
            }
        }
    }

    // MARK: 网格

    private var header: some View {
        Text("相册")
            .font(.system(size: 17, weight: .bold))
            .foregroundStyle(palette.ink)
            .lineLimit(1)
            .frame(maxWidth: .infinity, alignment: .leading)
            .frame(height: ZoomMetrics.headerLineHeight)
            .padding(EdgeInsets(top: 12, leading: 18, bottom: 10, trailing: 18))
            .accessibilityAddTraits(.isHeader)
    }

    private var grid: some View {
        VStack(spacing: ZoomMetrics.gap) {
            ForEach(0..<(ZoomMetrics.count / ZoomMetrics.columns), id: \.self) { row in
                HStack(spacing: ZoomMetrics.gap) {
                    ForEach(0..<ZoomMetrics.columns, id: \.self) { col in
                        thumb(row * ZoomMetrics.columns + col)
                    }
                }
            }
        }
        .padding(.horizontal, ZoomMetrics.gridPadH)
        .padding(.vertical, ZoomMetrics.gridPadV)
    }

    private func thumb(_ index: Int) -> some View {
        let isFocused = focus == .thumb(index)
        return Button {
            open(index)
        } label: {
            ZStack {
                palette.tileFill(index)
                Text("\(index + 1)")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(palette.tileInk(index))
            }
            .frame(width: ZoomMetrics.cell, height: ZoomMetrics.cell)
            .clipShape(RoundedRectangle(cornerRadius: ZoomMetrics.thumbRadius, style: .circular))
            .contentShape(Rectangle())
        }
        .buttonStyle(ZoomBareButtonStyle())
        // 被点开的那张隐藏但保留位置
        .opacity(openIndex == index ? 0 : 1)
        .overlay {
            // 焦点环：2pt 实线，向外偏移 2pt
            if isFocused {
                RoundedRectangle(cornerRadius: ZoomMetrics.thumbRadius + 3, style: .circular)
                    .stroke(palette.accent, lineWidth: 2)
                    .padding(-3)
                    .allowsHitTesting(false)
            }
        }
        .focused($focus, equals: .thumb(index))
        .focusEffectDisabled()
        .accessibilityLabel("查看第 \(index + 1) 张照片")
        .accessibilityFocused($a11yFocus, equals: .thumb(index))
    }

    // MARK: 查看层

    private func viewer(_ index: Int) -> some View {
        ZStack {
            // 遮罩
            Color.black
                .opacity(chromeOpacity)
                .accessibilityHidden(true)

            hero(index)

            infoBar(index)
                .opacity(chromeOpacity)
        }
        .frame(width: ZoomMetrics.canvas.width, height: ZoomMetrics.canvas.height)
        .accessibilityElement(children: .contain)
        .accessibilityLabel("第 \(index + 1) 张照片，共 \(ZoomMetrics.count) 张")
        .accessibilityAddTraits(.isModal)
        .accessibilityAction(.escape) { close() }
    }

    private func hero(_ index: Int) -> some View {
        ZStack {
            palette.tileFill(index)
            Text("\(index + 1)")
                .font(.system(size: 74, weight: .bold))
                .foregroundStyle(palette.tileInk(index))
        }
        .frame(width: ZoomMetrics.heroSide, height: ZoomMetrics.heroSide)
        .clipShape(RoundedRectangle(cornerRadius: heroRadius, style: .circular))
        .contentShape(Rectangle())
        .scaleEffect(heroScale, anchor: .center)
        .offset(heroOffset)
        .opacity(heroOpacity)
        .gesture(dragGesture)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("第 \(index + 1) 张照片")
        .accessibilityAddTraits(.isImage)
        .accessibilityHint("向下拖动可关闭")
    }

    private func infoBar(_ index: Int) -> some View {
        let closeFocused = focus == .close
        return ZStack {
            Text("\(index + 1) / \(ZoomMetrics.count)")
                .font(.system(size: 13, weight: .semibold))
                .monospacedDigit()
                .foregroundStyle(Color.white)
                .allowsHitTesting(false)
                .accessibilityLabel("第 \(index + 1) 张，共 \(ZoomMetrics.count) 张")

            Button {
                close()
            } label: {
                ZStack {
                    Circle().fill(Color.white.opacity(0.16))
                    ZoomCloseIcon()
                        .stroke(Color.white, style: StrokeStyle(lineWidth: 1.8, lineCap: .round))
                        .frame(width: 14, height: 14)
                }
                .frame(width: 32, height: 32)
                .contentShape(Circle())
            }
            .buttonStyle(ZoomBareButtonStyle())
            .overlay {
                // 键盘焦点环：白色 2pt，向外偏移 2pt
                if closeFocused {
                    Circle()
                        .stroke(Color.white, lineWidth: 2)
                        .padding(-3)
                        .allowsHitTesting(false)
                }
            }
            .focused($focus, equals: .close)
            .focusEffectDisabled()
            // 硬件键盘 Esc
            .keyboardShortcut(.cancelAction)
            .accessibilityLabel("关闭")
            .accessibilityFocused($a11yFocus, equals: .close)
            .padding(.top, 8)
            .padding(.trailing, 10)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
        }
        .frame(width: ZoomMetrics.canvas.width, height: 48)
        .frame(maxHeight: .infinity, alignment: .top)
    }

    // MARK: 手势

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 0, coordinateSpace: .named(Self.canvasSpace))
            .updating($pressing) { _, state, _ in
                state = true
            }
            .onChanged { value in
                if dragSession == .idle {
                    // 只有全屏查看状态下按下才算一次有效拖动
                    if phase == .viewing {
                        dragSession = .active
                        phase = .dragging
                    } else {
                        dragSession = .ignored
                    }
                }
                guard dragSession == .active, phase == .dragging else { return }

                let dx = value.translation.width
                let dy = value.translation.height
                let down = max(dy, 0)

                // 拖动中没有过渡
                var transaction = Transaction()
                transaction.disablesAnimations = true
                withTransaction(transaction) {
                    heroOffset = CGSize(width: dx, height: dy)
                    heroScale = 1 - min(down / 500, 0.3)
                    chromeOpacity = 1 - Double(min(down / 200, 1)) * 0.7
                }
            }
            .onEnded { value in
                let session = dragSession
                dragSession = .idle
                guard session == .active, phase == .dragging else { return }
                if value.translation.height > 80 {
                    close()
                } else {
                    snapBack()
                }
            }
    }

    // MARK: 动作

    private func open(_ index: Int) {
        // 同一时间只能打开一张
        guard phase == .grid, openIndex == nil else { return }

        generation += 1
        let token = generation
        let cover = ZoomMetrics.coverTransform(index)

        // 第一帧：大图正好盖住缩略图（减少动态效果时直接放在终点，只做淡入）
        var transaction = Transaction()
        transaction.disablesAnimations = true
        withTransaction(transaction) {
            if reduceMotion {
                heroOffset = .zero
                heroScale = 1
                heroRadius = 0
                heroOpacity = 0
            } else {
                heroOffset = cover.offset
                heroScale = cover.scale
                heroRadius = cover.radius
                heroOpacity = 1
            }
            chromeOpacity = 0
            dragSession = .idle
            phase = .opening
            openIndex = index
        }

        // 下一帧：过渡到全屏
        DispatchQueue.main.async {
            guard generation == token else { return }
            focus = .close
            a11yFocus = .close
            withAnimation(Self.ease(0.32), completionCriteria: .logicallyComplete) {
                heroOffset = .zero
                heroScale = 1
                heroRadius = 0
                heroOpacity = 1
                chromeOpacity = 1
            } completion: {
                guard generation == token, phase == .opening else { return }
                phase = .viewing
            }
        }
    }

    private func close() {
        guard let index = openIndex else { return }
        guard phase == .opening || phase == .viewing || phase == .dragging else { return }

        generation += 1
        let token = generation
        let cover = ZoomMetrics.coverTransform(index)

        phase = .closing
        // 还按着的那次拖动不再生效
        if dragSession == .active { dragSession = .ignored }

        // 从大图当前的变换直接飞回缩略图
        withAnimation(Self.ease(0.28), completionCriteria: .logicallyComplete) {
            if reduceMotion {
                heroOpacity = 0
            } else {
                heroOffset = cover.offset
                heroScale = cover.scale
                heroRadius = cover.radius
            }
            chromeOpacity = 0
        } completion: {
            guard generation == token else { return }
            var transaction = Transaction()
            transaction.disablesAnimations = true
            withTransaction(transaction) {
                openIndex = nil
                phase = .grid
                heroOffset = .zero
                heroScale = 1
                heroRadius = 0
                heroOpacity = 1
                chromeOpacity = 0
            }
            // 焦点回到原来的缩略图
            DispatchQueue.main.async {
                guard generation == token else { return }
                focus = .thumb(index)
                a11yFocus = .thumb(index)
            }
        }
    }

    /// 拖动距离不够，回到全屏位置
    private func snapBack() {
        phase = .viewing
        if reduceMotion {
            var transaction = Transaction()
            transaction.disablesAnimations = true
            withTransaction(transaction) {
                heroOffset = .zero
                heroScale = 1
            }
            withAnimation(Self.ease(0.32)) {
                chromeOpacity = 1
            }
        } else {
            withAnimation(Self.ease(0.32)) {
                heroOffset = .zero
                heroScale = 1
                chromeOpacity = 1
            }
        }
    }
}
