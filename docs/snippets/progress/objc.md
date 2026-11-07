```objc
// 确定进度：UIProgressView，自带无障碍值
UIProgressView *bar = [[UIProgressView alloc] initWithProgressViewStyle:UIProgressViewStyleDefault];
bar.accessibilityLabel = @"上传进度";
[bar setProgress:0.4 animated:!UIAccessibilityIsReduceMotionEnabled()];

// 旋转加载指示器
UIActivityIndicatorView *spinner =
    [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleMedium];
spinner.accessibilityLabel = @"加载中";
[spinner startAnimating];

// 环形进度：系统没有，用 CAShapeLayer 的 strokeEnd
CGRect frame = CGRectMake(0, 0, 48, 48);
UIBezierPath *path = [UIBezierPath bezierPathWithArcCenter:CGPointMake(24, 24)
                                                    radius:22
                                                startAngle:-M_PI_2
                                                  endAngle:M_PI * 1.5
                                                 clockwise:YES];
UIView *ring = [[UIView alloc] initWithFrame:frame];
CAShapeLayer *track = [CAShapeLayer layer];
CAShapeLayer *value = [CAShapeLayer layer];
for (CAShapeLayer *l in @[track, value]) {
    l.path = path.CGPath;
    l.fillColor = nil;
    l.lineWidth = 4;
    [ring.layer addSublayer:l];
}
track.strokeColor = UIColor.systemGray5Color.CGColor;
value.strokeColor = UIColor.systemBlueColor.CGColor;
value.lineCap = kCALineCapRound;
value.strokeEnd = 0.4;
ring.isAccessibilityElement = YES;
ring.accessibilityLabel = @"同步进度";
ring.accessibilityValue = @"40%";
// UIKit 没有不确定进度的线性条，常见做法是改用 UIActivityIndicatorView
```
