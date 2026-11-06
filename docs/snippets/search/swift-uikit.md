```swift
final class SearchViewController: UITableViewController, UISearchResultsUpdating {
    private let words = ["苹果", "苹果手机", "苹果电脑", "香蕉", "橙子"]
    private let recent = ["耳机", "充电器"]
    private var query = ""
    private var items: [String] = []
    private var debounce: DispatchWorkItem?

    override func viewDidLoad() {
        super.viewDidLoad()
        let search = UISearchController(searchResultsController: nil)
        search.searchResultsUpdater = self
        search.obscuresBackgroundDuringPresentation = false
        navigationItem.searchController = search // 搜索栏自带清除按钮
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        items = recent
    }

    func updateSearchResults(for searchController: UISearchController) {
        let text = searchController.searchBar.text ?? ""
        debounce?.cancel()
        let work = DispatchWorkItem { [weak self] in self?.reload(text) }
        debounce = work
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.15, execute: work) // 防抖 150ms
    }

    private func reload(_ text: String) {
        query = text
        items = text.isEmpty ? recent : words.filter { $0.contains(text) }
        // 没有结果时用 backgroundView 显示空状态
        let empty = UILabel()
        empty.text = "没有找到「\(text)」相关结果"
        empty.textAlignment = .center
        tableView.backgroundView = (!text.isEmpty && items.isEmpty) ? empty : nil
        tableView.reloadData()
    }

    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        query.isEmpty && !items.isEmpty ? "最近搜索" : nil
    }
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int { items.count }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        let word = items[indexPath.row]
        let text = NSMutableAttributedString(string: word)
        // 匹配部分加粗
        if !query.isEmpty, let r = word.range(of: query) {
            text.addAttribute(.font, value: UIFont.boldSystemFont(ofSize: 17), range: NSRange(r, in: word))
        }
        cell.textLabel?.attributedText = text
        return cell
    }
}
```
