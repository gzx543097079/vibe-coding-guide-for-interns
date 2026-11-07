```swift
final class SortableViewController: UITableViewController {
    private var tabs = ["首页", "消息", "发现", "我的"]

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        // 编辑模式下每行右侧出现系统拖动手柄，按住即浮起，其他行自动让位
        setEditing(true, animated: false) // 同步 VC 与 tableView 的编辑状态
        navigationItem.rightBarButtonItem = editButtonItem
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        tabs.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        cell.textLabel?.text = tabs[indexPath.row]
        return cell
    }

    // 允许移动；只排序不删除时隐藏左侧删除按钮
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool { true }
    override func tableView(_ tableView: UITableView, editingStyleForRowAt indexPath: IndexPath) -> UITableViewCell.EditingStyle { .none }
    override func tableView(_ tableView: UITableView, shouldIndentWhileEditingRowAt indexPath: IndexPath) -> Bool { false }

    // 松手落位后同步数据源
    override func tableView(_ tableView: UITableView, moveRowAt from: IndexPath, to: IndexPath) {
        let item = tabs.remove(at: from.row)
        tabs.insert(item, at: to.row)
        // VoiceOver 用户通过手柄的自定义操作移动，这里补一句位置播报
        UIAccessibility.post(notification: .announcement, argument: "已移到第 \(to.row + 1) 项，共 \(tabs.count) 项")
    }
}
```
