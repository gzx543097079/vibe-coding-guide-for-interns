```objc
- (UIView *)blockWithFrame:(CGRect)frame radius:(CGFloat)radius {
    UIView *v = [[UIView alloc] initWithFrame:frame];
    v.backgroundColor = UIColor.systemGray5Color;
    v.layer.cornerRadius = radius;
    return v;
}

- (UIView *)makeSkeleton {
    UIView *skeleton = [[UIView alloc] initWithFrame:CGRectMake(16, 16, 240, 40)];
    skeleton.layer.masksToBounds = YES;
    // 头像圆 + 两行文字条
    [skeleton addSubview:[self blockWithFrame:CGRectMake(0, 0, 40, 40) radius:20]];
    [skeleton addSubview:[self blockWithFrame:CGRectMake(52, 6, 180, 12) radius:6]];
    [skeleton addSubview:[self blockWithFrame:CGRectMake(52, 24, 110, 12) radius:6]];
    skeleton.isAccessibilityElement = YES;
    skeleton.accessibilityLabel = @"加载中";

    if (!UIAccessibilityIsReduceMotionEnabled()) {
        CAGradientLayer *gradient = [CAGradientLayer layer];
        gradient.frame = skeleton.bounds;
        gradient.colors = @[(id)UIColor.clearColor.CGColor,
                            (id)[UIColor colorWithWhite:1 alpha:0.6].CGColor,
                            (id)UIColor.clearColor.CGColor];
        gradient.startPoint = CGPointMake(0, 0.5);
        gradient.endPoint = CGPointMake(1, 0.5);
        [skeleton.layer addSublayer:gradient];

        CABasicAnimation *anim = [CABasicAnimation animationWithKeyPath:@"transform.translation.x"];
        anim.fromValue = @(-240);
        anim.toValue = @(240);
        anim.duration = 1.4;
        anim.repeatCount = HUGE_VALF;
        [gradient addAnimation:anim forKey:@"shimmer"];
    }
    return skeleton;
}

// 加载完成：内容淡入，骨架淡出后移除
- (void)showContent:(UIView *)content replacing:(UIView *)skeleton {
    content.alpha = 0;
    [UIView animateWithDuration:0.3 animations:^{
        content.alpha = 1;
        skeleton.alpha = 0;
    } completion:^(BOOL finished) {
        [skeleton removeFromSuperview];
    }];
}
```
