```swift
final class OrdersViewController: UIViewController {
    private let titles = ["全部", "待付款", "待发货", "已完成"]
    private lazy var segmented = UISegmentedControl(items: titles)
    private let contentView = UILabel() // 实际项目里换成子控制器或列表

    override func viewDidLoad() {
        super.viewDidLoad()
        // UISegmentedControl 自带滑块动画和读屏语义
        segmented.selectedSegmentIndex = 0
        segmented.addTarget(self, action: #selector(changed), for: .valueChanged)
        navigationItem.titleView = segmented
        view.addSubview(contentView) // 约束省略
        show(0)
    }

    @objc private func changed() {
        show(segmented.selectedSegmentIndex)
    }

    // 内容区淡入
    private func show(_ index: Int) {
        contentView.text = "\(titles[index])订单"
        guard !UIAccessibility.isReduceMotionEnabled else { return }
        contentView.alpha = 0
        UIView.animate(withDuration: 0.2) { self.contentView.alpha = 1 }
    }
}
```
