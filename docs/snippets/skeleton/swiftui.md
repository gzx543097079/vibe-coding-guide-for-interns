```swift
import SwiftUI

// 光泽：一层渐变在内容上方做 offset 平移，并用内容本身做 mask
struct Shimmer: ViewModifier {
    @State private var phase: CGFloat = -1
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    func body(content: Content) -> some View {
        if reduceMotion {
            content
        } else {
            content
                .overlay {
                    GeometryReader { geo in
                        LinearGradient(colors: [.clear, .white.opacity(0.6), .clear],
                                       startPoint: .leading, endPoint: .trailing)
                            .offset(x: phase * geo.size.width)
                    }
                }
                .mask { content }
                .onAppear {
                    withAnimation(.linear(duration: 1.4).repeatForever(autoreverses: false)) { phase = 1 }
                }
        }
    }
}

struct ProfileRow: View {
    let user: User?

    var body: some View {
        Group {
            if let user {
                HStack(spacing: 12) {
                    AsyncImage(url: user.avatarURL).frame(width: 40, height: 40).clipShape(Circle())
                    VStack(alignment: .leading) { Text(user.name).bold(); Text(user.bio) }
                }
                .transition(.opacity)
            } else {
                HStack(spacing: 12) {
                    Circle().frame(width: 40, height: 40)
                    VStack(alignment: .leading, spacing: 8) {
                        Capsule().frame(width: 180, height: 12)
                        Capsule().frame(width: 110, height: 12)
                    }
                }
                .foregroundStyle(Color(.systemGray5))
                .modifier(Shimmer())
                .accessibilityElement(children: .ignore)
                .accessibilityLabel("加载中")
            }
        }
        .animation(.easeOut(duration: 0.3), value: user == nil)
    }
}
```
