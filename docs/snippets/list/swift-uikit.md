```swift
// 下拉刷新
override func viewDidLoad() {
    super.viewDidLoad()
    let refresh = UIRefreshControl()
    refresh.addAction(UIAction { [weak self] _ in
        self?.reload()
    }, for: .valueChanged)
    tableView.refreshControl = refresh
}

func reload() {
    // 拉取数据完成后：
    tableView.reloadData()
    tableView.refreshControl?.endRefreshing()
}

// 左滑删除
override func tableView(_ tableView: UITableView,
                        trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
    let delete = UIContextualAction(style: .destructive, title: "删除") { [weak self] _, _, completion in
        self?.items.remove(at: indexPath.row)
        tableView.deleteRows(at: [indexPath], with: .automatic)
        completion(true)
    }
    return UISwipeActionsConfiguration(actions: [delete])
}
```
