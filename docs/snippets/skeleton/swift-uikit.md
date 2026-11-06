```swift
final class ProfileSkeletonView: UIView {
    private let gradient = CAGradientLayer()

    override init(frame: CGRect) {
        super.init(frame: frame)
        // 占位块：头像圆 + 两行文字条，尺寸和真实布局保持一致
        let avatar = block(CGRect(x: 0, y: 0, width: 40, height: 40), radius: 20)
        let line1 = block(CGRect(x: 52, y: 6, width: 180, height: 12), radius: 6)
        let line2 = block(CGRect(x: 52, y: 24, width: 110, height: 12), radius: 6)
        [avatar, line1, line2].forEach(addSubview)

        isAccessibilityElement = true
        accessibilityLabel = "加载中"

        guard !UIAccessibility.isReduceMotionEnabled else { return }
        gradient.colors = [UIColor.clear, UIColor.white.withAlphaComponent(0.6), UIColor.clear].map(\.cgColor)
        gradient.startPoint = CGPoint(x: 0, y: 0.5)
        gradient.endPoint = CGPoint(x: 1, y: 0.5)
        layer.addSublayer(gradient)
        layer.masksToBounds = true

        // 只动 transform.translation.x，不改尺寸
        let anim = CABasicAnimation(keyPath: "transform.translation.x")
        anim.fromValue = -240
        anim.toValue = 240
        anim.duration = 1.4
        anim.repeatCount = .infinity
        gradient.add(anim, forKey: "shimmer")
    }

    required init?(coder: NSCoder) { fatalError() }

    override func layoutSubviews() {
        super.layoutSubviews()
        gradient.frame = bounds
    }

    private func block(_ frame: CGRect, radius: CGFloat) -> UIView {
        let v = UIView(frame: frame)
        v.backgroundColor = .systemGray5
        v.layer.cornerRadius = radius
        return v
    }
}

// 加载完成：内容淡入替换骨架
func showContent(_ content: UIView, replacing skeleton: UIView) {
    content.alpha = 0
    UIView.animate(withDuration: 0.3) { content.alpha = 1; skeleton.alpha = 0 } completion: { _ in
        skeleton.removeFromSuperview()
    }
}
```
