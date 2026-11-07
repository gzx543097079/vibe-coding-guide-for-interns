```swift
struct MessageList: View {
    @State private var items: [Message] = []

    var body: some View {
        List {
            ForEach(items) { item in
                Text(item.title)
            }
            .onDelete { offsets in
                items.remove(atOffsets: offsets) // 左滑删除
            }
        }
        .refreshable {
            await load() // 下拉刷新，iOS 15+
        }
    }

    func load() async {
        // 拉取数据
    }
}
```
