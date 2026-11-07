```objc
// iOS 没有系统 Toast，自己做一个浮在视图上的 UILabel
static __weak UILabel *gCurrentToast;

void ShowToast(NSString *text, UIView *view) {
    [gCurrentToast removeFromSuperview]; // 新消息替换旧消息

    UILabel *label = [[UILabel alloc] init];
    label.text = [NSString stringWithFormat:@"  %@  ", text];
    label.textColor = UIColor.whiteColor;
    label.backgroundColor = [UIColor colorWithWhite:0 alpha:0.8];
    label.layer.cornerRadius = 8;
    label.clipsToBounds = YES;
    label.translatesAutoresizingMaskIntoConstraints = NO;
    [view addSubview:label];
    [NSLayoutConstraint activateConstraints:@[
        [label.centerXAnchor constraintEqualToAnchor:view.centerXAnchor],
        [label.bottomAnchor constraintEqualToAnchor:view.safeAreaLayoutGuide.bottomAnchor constant:-64],
        [label.heightAnchor constraintEqualToConstant:36],
    ]];
    gCurrentToast = label;

    BOOL reduce = UIAccessibilityIsReduceMotionEnabled();
    label.alpha = 0;
    label.transform = reduce ? CGAffineTransformIdentity : CGAffineTransformMakeTranslation(0, 8);
    [UIView animateWithDuration:0.2 animations:^{
        label.alpha = 1;
        label.transform = CGAffineTransformIdentity;
    }];
    UIAccessibilityPostNotification(UIAccessibilityAnnouncementNotification, text); // 读屏播报

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 2 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
        [UIView animateWithDuration:0.2 animations:^{
            label.alpha = 0;
        } completion:^(BOOL finished) {
            [label removeFromSuperview];
        }];
    });
}

// 用法：ShowToast(@"已复制", self.view);
// 带「撤销」的 Snackbar：底部容器 + UIButton，用 transform 从下方滑入，4 秒后移除
```
