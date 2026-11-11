import SwiftUI

// 宿主：把四个独立实现的画布放在屏幕固定位置，底部切换效果和深浅色。
// 画布左上角固定在 (77, 220)，尺寸 248×442，方便按坐标注入触摸。
// 启动参数：-demo <swipe-reply|reaction|stories|zoom>，-dark YES
@main
struct PromptVerifyApp: App {
    var body: some Scene {
        WindowGroup { HostView() }
    }
}

private enum Demo: String, CaseIterable, Identifiable {
    case swipeReply = "swipe-reply", reaction, stories, zoom
    var id: String { rawValue }
    var title: String {
        switch self {
        case .swipeReply: return "滑动回复"
        case .reaction: return "表情回应"
        case .stories: return "快拍"
        case .zoom: return "图片放大"
        }
    }
}

private struct HostView: View {
    @State private var demo = Demo(rawValue: UserDefaults.standard.string(forKey: "demo") ?? "") ?? .swipeReply
    @State private var dark = UserDefaults.standard.bool(forKey: "dark")
    // 换效果或换深浅色时重建画布，让它回到初始状态
    @State private var generation = 0

    var body: some View {
        ZStack(alignment: .top) {
            Color(white: dark ? 0.16 : 0.9).ignoresSafeArea()
            Group {
                switch demo {
                case .swipeReply: SwipeReplyDemo()
                case .reaction: ReactionDemo()
                case .stories: StoriesDemo()
                case .zoom: ZoomDemo()
                }
            }
            .id("\(demo.rawValue)-\(generation)")
            .frame(width: 248, height: 442)
            .clipped()
            .padding(.top, 220)

            VStack(spacing: 10) {
                Picker("效果", selection: $demo) {
                    ForEach(Demo.allCases) { Text($0.title).tag($0) }
                }
                .pickerStyle(.segmented)
                HStack {
                    Toggle("深色", isOn: $dark).fixedSize()
                    Spacer()
                    Button("重置") { generation += 1 }
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 700)
        }
        .ignoresSafeArea()
        .preferredColorScheme(dark ? .dark : .light)
        .onChange(of: dark) { generation += 1 }
    }
}
