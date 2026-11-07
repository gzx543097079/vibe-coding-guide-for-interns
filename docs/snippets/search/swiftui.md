待校对：.searchable 需要 iOS 15，.searchSuggestions 和 .searchCompletion 需要 iOS 16；用 .task(id:) 做防抖的节奏待真机验证。

```swift
struct SearchView: View {
    let words = ["苹果", "苹果手机", "苹果电脑", "香蕉", "橙子"]
    let recent = ["耳机", "充电器"]
    @State private var query = ""
    @State private var results: [String] = []

    var body: some View {
        NavigationStack {
            List(results, id: \.self) { Text($0) }
                .overlay {
                    if !query.isEmpty && results.isEmpty {
                        Text("没有找到「\(query)」相关结果").foregroundStyle(.secondary)
                    }
                }
                .navigationTitle("搜索")
        }
        // 系统搜索栏自带清除按钮
        .searchable(text: $query, prompt: "搜索")
        .searchSuggestions {
            if query.isEmpty {
                Section("最近搜索") {
                    ForEach(recent, id: \.self) { Text($0).searchCompletion($0) }
                }
            } else {
                ForEach(results, id: \.self) { w in
                    highlighted(w).searchCompletion(w)
                }
            }
        }
        .task(id: query) {
            // 防抖 150ms：query 变化时上一个任务被取消
            guard (try? await Task.sleep(nanoseconds: 150_000_000)) != nil else { return }
            results = words.filter { $0.contains(query) }
        }
    }

    // 匹配部分加粗
    private func highlighted(_ w: String) -> Text {
        guard let r = w.range(of: query) else { return Text(w) }
        return Text(w[..<r.lowerBound]) + Text(w[r]).bold() + Text(w[r.upperBound...])
    }
}
```
