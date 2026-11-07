```objc
// LikeButton : UIButton，countLabel 为放在按钮旁的 UILabel
- (void)toggle {
    self.liked = !self.liked;
    self.count += self.liked ? 1 : -1;
    [self setImage:[UIImage systemImageNamed:self.liked ? @"heart.fill" : @"heart"] forState:UIControlStateNormal];
    self.tintColor = self.liked ? UIColor.systemRedColor : UIColor.secondaryLabelColor;
    self.accessibilityTraits = self.liked ? (UIAccessibilityTraitButton | UIAccessibilityTraitSelected) : UIAccessibilityTraitButton;
    self.accessibilityLabel = @"赞";
    self.accessibilityValue = @(self.count).stringValue;

    // 减少动态效果：只切换颜色和数字
    if (UIAccessibilityIsReduceMotionEnabled()) { self.countLabel.text = @(self.count).stringValue; return; }

    CATransition *roll = [CATransition animation]; // 数字向上滚动切换
    roll.type = kCATransitionPush;
    roll.subtype = kCATransitionFromTop;
    roll.duration = 0.25;
    [self.countLabel.layer addAnimation:roll forKey:@"roll"];
    self.countLabel.text = @(self.count).stringValue;

    // 心形先缩小，再弹簧回弹；取消点赞只做这一步
    UIView *heart = self.imageView;
    [UIView animateWithDuration:0.1 animations:^{
        heart.transform = CGAffineTransformMakeScale(0.7, 0.7);
    } completion:^(BOOL finished) {
        [UIView animateWithDuration:0.4 delay:0 usingSpringWithDamping:0.4 initialSpringVelocity:6
                            options:0 animations:^{ heart.transform = CGAffineTransformIdentity; } completion:nil];
    }];
    if (self.liked) [self burstAround:heart.center];
}

// 8 个小圆点向外飞散并淡出
- (void)burstAround:(CGPoint)center {
    for (NSInteger i = 0; i < 8; i++) {
        UIView *dot = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 5, 5)];
        dot.backgroundColor = UIColor.systemRedColor;
        dot.layer.cornerRadius = 2.5;
        dot.center = center;
        dot.userInteractionEnabled = NO;
        [self addSubview:dot];
        CGFloat angle = i * M_PI / 4;
        [UIView animateWithDuration:0.5 delay:0 options:UIViewAnimationOptionCurveEaseOut animations:^{
            dot.transform = CGAffineTransformScale(CGAffineTransformMakeTranslation(22 * sin(angle), -22 * cos(angle)), 0.3, 0.3);
            dot.alpha = 0;
        } completion:^(BOOL finished) { [dot removeFromSuperview]; }];
    }
}
```
