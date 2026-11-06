```swift
final class NotifyViewController: UIViewController {
    private let allButton = NotifyViewController.makeBox("全选")
    private let items = ["邮件", "短信", "推送"].map { NotifyViewController.makeBox($0) }
    private let radios = ["浅色", "深色"].map { NotifyViewController.makeBox($0, off: "circle", on: "largecircle.fill.circle") }

    // 用 UIButton 的 selected 状态切换图标；selected 时读屏会读出「已选定」
    private static func makeBox(_ title: String, off: String = "square", on: String = "checkmark.square.fill") -> UIButton {
        let b = UIButton(type: .custom)
        b.setTitle(" " + title, for: .normal)
        b.setTitleColor(.label, for: .normal)
        b.setImage(UIImage(systemName: off), for: .normal)
        b.setImage(UIImage(systemName: on), for: .selected)
        return b
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        ([allButton] + items).forEach { $0.addTarget(self, action: #selector(tap(_:)), for: .touchUpInside) }
        radios.forEach { $0.addTarget(self, action: #selector(pick(_:)), for: .touchUpInside) }
        radios.first?.isSelected = true
        // 布局省略：放进一个竖向 UIStackView
    }

    @objc private func tap(_ sender: UIButton) {
        if sender === allButton {
            let target = !allButton.isSelected
            items.forEach { $0.isSelected = target; pop($0) }
        } else {
            sender.isSelected.toggle()
            pop(sender)
        }
        syncParent()
    }

    // 单选：只保留一个选中，圆点用同样的缩放动画
    @objc private func pick(_ sender: UIButton) {
        radios.forEach { $0.isSelected = $0 === sender }
        pop(sender)
    }

    private func syncParent() {
        let n = items.filter(\.isSelected).count
        let mixed = n > 0 && n < items.count
        allButton.isSelected = n == items.count
        allButton.setImage(UIImage(systemName: mixed ? "minus.square.fill" : "square"), for: .normal)
        allButton.accessibilityValue = mixed ? "部分选中" : nil
    }

    // 对勾缩放淡入
    private func pop(_ b: UIButton) {
        guard !UIAccessibility.isReduceMotionEnabled, let iv = b.imageView else { return }
        iv.transform = CGAffineTransform(scaleX: 0.5, y: 0.5)
        iv.alpha = 0
        UIView.animate(withDuration: 0.2) {
            iv.transform = .identity
            iv.alpha = 1
        }
    }
}
```
