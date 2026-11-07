```swift
final class AccordionViewController: UITableViewController {
    private let sections = [("配送说明", "下单后 48 小时内发货。"), ("退换政策", "7 天无理由退换。")]
    private let allowsMultiple = false // 一次只展开一个
    private var expanded: Set<Int> = [0]
    private var headers: [Int: (button: UIButton, arrow: UIImageView)] = [:] // 缓存 header，才能看到箭头旋转

    override func numberOfSections(in tableView: UITableView) -> Int { sections.count }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        expanded.contains(section) ? 1 : 0
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell()
        cell.textLabel?.text = sections[indexPath.section].1
        cell.textLabel?.numberOfLines = 0
        return cell
    }

    override func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        if let h = headers[section] { return h.button }
        let button = UIButton(type: .system)
        button.setTitle(sections[section].0, for: .normal)
        button.contentHorizontalAlignment = .leading
        let arrow = UIImageView(image: UIImage(systemName: "chevron.down"))
        arrow.translatesAutoresizingMaskIntoConstraints = false
        button.addSubview(arrow)
        arrow.trailingAnchor.constraint(equalTo: button.trailingAnchor, constant: -16).isActive = true
        arrow.centerYAnchor.constraint(equalTo: button.centerYAnchor).isActive = true
        button.tag = section
        button.addTarget(self, action: #selector(toggle(_:)), for: .touchUpInside)
        headers[section] = (button, arrow)
        updateHeader(section, animated: false)
        return button
    }

    @objc private func toggle(_ sender: UIButton) {
        let s = sender.tag
        let closing = expanded.contains(s) ? [s] : (allowsMultiple ? [] : Array(expanded))
        let opening = expanded.contains(s) ? [] : [s]
        expanded.subtract(closing)
        expanded.formUnion(opening)

        let reduce = UIAccessibility.isReduceMotionEnabled
        tableView.performBatchUpdates {
            self.tableView.deleteRows(at: closing.map { IndexPath(row: 0, section: $0) }, with: reduce ? .none : .fade)
            self.tableView.insertRows(at: opening.map { IndexPath(row: 0, section: $0) }, with: reduce ? .none : .fade)
        }
        (closing + opening).forEach { updateHeader($0, animated: !reduce) }
    }

    private func updateHeader(_ section: Int, animated: Bool) {
        guard let h = headers[section] else { return }
        let open = expanded.contains(section)
        h.button.accessibilityValue = open ? "已展开" : "已收起"
        UIView.animate(withDuration: animated ? 0.2 : 0) {
            h.arrow.transform = open ? CGAffineTransform(rotationAngle: .pi) : .identity
        }
    }
}
```
