```swift
// 确定进度：UIProgressView，自带无障碍值
let bar = UIProgressView(progressViewStyle: .default)
bar.accessibilityLabel = "上传进度"
bar.setProgress(0.4, animated: !UIAccessibility.isReduceMotionEnabled)

// 旋转加载指示器
let spinner = UIActivityIndicatorView(style: .medium)
spinner.accessibilityLabel = "加载中"
spinner.startAnimating()

// 环形进度：系统没有，用 CAShapeLayer 的 strokeEnd
final class RingProgressView: UIView {
    private let track = CAShapeLayer()
    private let value = CAShapeLayer()

    var progress: CGFloat = 0 {
        didSet {
            // strokeEnd 有隐式动画；减少动态效果时关掉
            CATransaction.begin()
            CATransaction.setDisableActions(UIAccessibility.isReduceMotionEnabled)
            value.strokeEnd = progress
            CATransaction.commit()
            accessibilityValue = "\(Int(progress * 100))%"
        }
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        for l in [track, value] {
            l.fillColor = nil
            l.lineWidth = 4
            layer.addSublayer(l)
        }
        track.strokeColor = UIColor.systemGray5.cgColor
        value.strokeColor = tintColor.cgColor
        value.lineCap = .round
        value.strokeEnd = 0
        isAccessibilityElement = true
        accessibilityLabel = "同步进度"
    }

    required init?(coder: NSCoder) { fatalError() }

    override func layoutSubviews() {
        super.layoutSubviews()
        // 从 12 点方向顺时针画
        let path = UIBezierPath(arcCenter: CGPoint(x: bounds.midX, y: bounds.midY),
                                radius: min(bounds.width, bounds.height) / 2 - 2,
                                startAngle: -.pi / 2, endAngle: .pi * 1.5, clockwise: true)
        track.path = path.cgPath
        value.path = path.cgPath
    }
}
// UIKit 没有不确定进度的线性条，常见做法是改用 UIActivityIndicatorView
```
