```swift
struct RootView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("首页", systemImage: "house") }
            DiscoverView()
                .tabItem { Label("发现", systemImage: "safari") }
            MineView()
                .tabItem { Label("我的", systemImage: "person") }
        }
    }
}
```
