```swift
struct DocumentView: View {
    @State private var showShare = false
    @State private var confirmDelete = false

    var body: some View {
        VStack {
            Button("分享") { showShare = true }
            Button("删除", role: .destructive) { confirmDelete = true }
        }
        .sheet(isPresented: $showShare) {
            ShareSheet()
                .presentationDetents([.medium, .large]) // iOS 16+
        }
        .alert("删除这篇文档？", isPresented: $confirmDelete) {
            Button("删除", role: .destructive) { /* 删除 */ }
            Button("取消", role: .cancel) {}
        }
    }
}
```
