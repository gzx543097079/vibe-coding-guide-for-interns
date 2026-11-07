待校对：.contentTransition(.numericText()) 需要 iOS 16；用 asyncAfter 串联两段动画的节奏待真机调整。

```swift
struct LikeButton: View {
    @State private var liked = false
    @State private var count = 128
    @State private var scale: CGFloat = 1
    @State private var burst = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        Button(action: toggle) {
            HStack(spacing: 6) {
                ZStack {
                    // 8 个小圆点向外飞散并淡出
                    ForEach(0..<8, id: \.self) { i in
                        Circle().fill(.red).frame(width: 5, height: 5)
                            .offset(y: burst ? -22 : 0)
                            .rotationEffect(.degrees(Double(i) * 45))
                            .opacity(liked && !reduceMotion && !burst ? 1 : 0)
                    }
                    Image(systemName: liked ? "heart.fill" : "heart")
                        .foregroundStyle(liked ? .red : .secondary)
                        .scaleEffect(scale)
                }
                Text("\(count)").monospacedDigit().contentTransition(.numericText())
            }
        }
        .accessibilityLabel("赞")
        .accessibilityValue("\(count)")
        .accessibilityAddTraits(liked ? .isSelected : [])
    }

    private func toggle() {
        liked.toggle()
        guard !reduceMotion else { count += liked ? 1 : -1; return } // 减少动态效果：只切换颜色
        withAnimation(.easeOut(duration: 0.3)) { count += liked ? 1 : -1 }
        // 先缩小，再弹簧回弹；取消点赞只做这一步
        withAnimation(.easeIn(duration: 0.1)) { scale = 0.7 }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            withAnimation(.spring(response: 0.35, dampingFraction: 0.45)) { scale = 1 }
        }
        guard liked else { return }
        burst = false // 先无动画复位，下一帧再播放爆发
        DispatchQueue.main.async {
            withAnimation(.easeOut(duration: 0.5)) { burst = true }
        }
    }
}
```
