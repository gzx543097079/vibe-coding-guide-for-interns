```swift
struct ProgressDemo: View {
    @State private var progress = 0.4
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        VStack(spacing: 24) {
            // 确定进度的线性进度条（系统自带无障碍值）
            ProgressView(value: progress) { Text("上传进度") }

            // 旋转加载指示器
            ProgressView("加载中")

            // 环形进度：系统 circular 样式在 iOS 上不显示确定进度，自己画
            ZStack {
                Circle().stroke(Color(.systemGray5), lineWidth: 4)
                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(Color.accentColor, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                    .rotationEffect(.degrees(-90))
            }
            .frame(width: 48, height: 48)
            .animation(reduceMotion ? nil : .easeOut(duration: 0.3), value: progress)
            .accessibilityElement()
            .accessibilityLabel("同步进度")
            .accessibilityValue("\(Int(progress * 100))%")

            IndeterminateBar()
        }
        .padding()
    }
}

// 不确定进度的线性条：系统没有，用 offset 平移一段色块
struct IndeterminateBar: View {
    @State private var moving = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        GeometryReader { geo in
            Capsule().fill(Color.accentColor)
                // 减少动态效果时不平移，改成整条明暗闪烁
                .frame(width: reduceMotion ? geo.size.width : geo.size.width * 0.4)
                .offset(x: reduceMotion ? 0 : (moving ? geo.size.width : -geo.size.width * 0.4))
                .opacity(reduceMotion && moving ? 0.4 : 1)
        }
        .frame(height: 4)
        .background(Color(.systemGray5))
        .clipShape(Capsule())
        .onAppear {
            withAnimation(.easeInOut(duration: 1.2).repeatForever(autoreverses: reduceMotion)) { moving = true }
        }
        .accessibilityLabel("正在加载")
    }
}
```
