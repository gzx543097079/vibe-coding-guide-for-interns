```swift
struct Carousel: View {
    let banners: [String]
    @State private var index = 0
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    private let timer = Timer.publish(every: 4, on: .main, in: .common).autoconnect()

    var body: some View {
        // .page 样式自带整页滑动和圆点指示器
        TabView(selection: $index) {
            ForEach(banners.indices, id: \.self) { i in
                Text(banners[i])
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(.blue.opacity(0.15))
                    .tag(i)
            }
        }
        .tabViewStyle(.page(indexDisplayMode: .always))
        .frame(height: 180)
        .onReceive(timer) { _ in
            // 减少动态效果时不自动播放
            guard !reduceMotion, !banners.isEmpty else { return }
            withAnimation { index = (index + 1) % banners.count }
        }
    }
}
```
