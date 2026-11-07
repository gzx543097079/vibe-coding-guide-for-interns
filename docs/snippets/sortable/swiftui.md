```swift
struct SortableView: View {
    @State private var tabs = ["首页", "消息", "发现", "我的"]

    var body: some View {
        NavigationStack {
            List {
                ForEach(tabs, id: \.self) { tab in
                    Text(tab)
                }
                // .onMove 让 List 在编辑模式下显示拖动手柄，系统负责浮起和让位动画
                .onMove { from, to in
                    tabs.move(fromOffsets: from, toOffset: to)
                }
            }
            .navigationTitle("调整顺序")
            .toolbar {
                // 点「编辑」进入编辑模式后出现手柄；VoiceOver 下手柄自带移动操作
                EditButton()
            }
        }
    }
}
```
