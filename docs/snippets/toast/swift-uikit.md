```swift
import UIKit

// iOS 没有系统 Toast，自己做一个浮在窗口上的 UILabel
enum Toast {
    private static weak var current: UILabel?

    static func show(_ text: String, in view: UIView, duration: TimeInterval = 2) {
        current?.removeFromSuperview() // 新消息替换旧消息

        let label = PaddingLabel()
        label.text = text
        label.textColor = .white
        label.backgroundColor = UIColor.black.withAlphaComponent(0.8)
        label.layer.cornerRadius = 8
        label.clipsToBounds = true
        label.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(label)
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -64),
        ])
        current = label

        let reduce = UIAccessibility.isReduceMotionEnabled
        label.alpha = 0
        label.transform = reduce ? .identity : CGAffineTransform(translationX: 0, y: 8)
        UIView.animate(withDuration: 0.2) {
            label.alpha = 1
            label.transform = .identity
        }
        UIAccessibility.post(notification: .announcement, argument: text) // 读屏播报

        DispatchQueue.main.asyncAfter(deadline: .now() + duration) { [weak label] in
            UIView.animate(withDuration: 0.2) {
                label?.alpha = 0
            } completion: { _ in
                label?.removeFromSuperview()
            }
        }
    }
}

final class PaddingLabel: UILabel {
    override func drawText(in rect: CGRect) {
        super.drawText(in: rect.inset(by: UIEdgeInsets(top: 8, left: 16, bottom: 8, right: 16)))
    }
    override var intrinsicContentSize: CGSize {
        let s = super.intrinsicContentSize
        return CGSize(width: s.width + 32, height: s.height + 16)
    }
}

// 用法：Toast.show("已复制", in: view)
// 带「撤销」的 Snackbar 同理：一个底部容器 + UIButton，从 translationX/Y 滑入，4 秒后移除
```
