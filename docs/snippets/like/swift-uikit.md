```swift
final class LikeButton: UIButton {
    private(set) var liked = false
    private var count = 128
    private let countLabel = UILabel() // 放在心形右侧，布局代码省略

    func toggle() {
        liked.toggle()
        count += liked ? 1 : -1
        setImage(UIImage(systemName: liked ? "heart.fill" : "heart"), for: .normal)
        tintColor = liked ? .systemRed : .secondaryLabel
        accessibilityTraits = liked ? [.button, .selected] : .button
        accessibilityLabel = "赞"
        accessibilityValue = "\(count)"

        // 减少动态效果：只切换颜色和数字
        guard !UIAccessibility.isReduceMotionEnabled else { countLabel.text = "\(count)"; return }
        // 数字向上滚动切换
        let roll = CATransition()
        roll.type = .push
        roll.subtype = .fromTop
        roll.duration = 0.25
        countLabel.layer.add(roll, forKey: "roll")
        countLabel.text = "\(count)"

        // 心形先缩小，再弹簧回弹；取消点赞只做这一步
        guard let heart = imageView else { return }
        UIView.animate(withDuration: 0.1, animations: {
            heart.transform = CGAffineTransform(scaleX: 0.7, y: 0.7)
        }, completion: { _ in
            UIView.animate(withDuration: 0.4, delay: 0, usingSpringWithDamping: 0.4,
                           initialSpringVelocity: 6, options: [], animations: {
                heart.transform = .identity
            })
        })
        if liked { burst(around: heart.center) }
    }

    // 8 个小圆点向外飞散并淡出
    private func burst(around center: CGPoint) {
        for i in 0..<8 {
            let dot = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 5))
            dot.backgroundColor = .systemRed
            dot.layer.cornerRadius = 2.5
            dot.center = center
            dot.isUserInteractionEnabled = false
            addSubview(dot)
            let angle = CGFloat(i) * .pi / 4
            UIView.animate(withDuration: 0.5, delay: 0, options: .curveEaseOut, animations: {
                dot.transform = CGAffineTransform(translationX: 22 * sin(angle), y: -22 * cos(angle)).scaledBy(x: 0.3, y: 0.3)
                dot.alpha = 0
            }, completion: { _ in dot.removeFromSuperview() })
        }
    }
}
```
