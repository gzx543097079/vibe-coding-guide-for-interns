```objc
@interface EmailFieldView () <UITextFieldDelegate>
@property (nonatomic, strong) UITextField *field;
@property (nonatomic, strong) UILabel *floatLabel;
@property (nonatomic, strong) UILabel *errorLabel;
@end

@implementation EmailFieldView

- (void)setupField {
    self.field.accessibilityLabel = @"邮箱";
    self.field.keyboardType = UIKeyboardTypeEmailAddress;
    self.field.autocapitalizationType = UITextAutocapitalizationTypeNone;
    self.field.clearButtonMode = UITextFieldViewModeAlways; // 有值就显示清除按钮
    self.field.delegate = self;
    self.field.layer.borderWidth = 1;
    self.field.layer.borderColor = UIColor.separatorColor.CGColor;
    [self.field addTarget:self action:@selector(updateLabel)
         forControlEvents:UIControlEventEditingDidBegin | UIControlEventEditingChanged | UIControlEventEditingDidEnd];
    [self.field addTarget:self action:@selector(validate) forControlEvents:UIControlEventEditingDidEnd];
}

// 浮动标签：获得焦点或有值时上移缩小
- (void)updateLabel {
    BOOL up = self.field.isEditing || self.field.text.length > 0;
    CGAffineTransform t = up ? CGAffineTransformScale(CGAffineTransformMakeTranslation(0, -14), 0.75, 0.75)
                             : CGAffineTransformIdentity;
    [UIView animateWithDuration:(UIAccessibilityIsReduceMotionEnabled() ? 0 : 0.2) animations:^{
        self.floatLabel.transform = t;
    }];
}

- (void)validate {
    NSString *text = self.field.text ?: @"";
    NSPredicate *p = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", @"[^\\s@]+@[^\\s@]+\\.[^\\s@]+"];
    BOOL ok = text.length == 0 || [p evaluateWithObject:text];
    [self setError:(ok ? nil : @"邮箱格式不对")];
    if (ok || UIAccessibilityIsReduceMotionEnabled()) return;
    CAKeyframeAnimation *shake = [CAKeyframeAnimation animationWithKeyPath:@"transform.translation.x"];
    shake.values = @[@0, @-6, @6, @-3, @0];
    shake.duration = 0.3;
    [self.field.layer addAnimation:shake forKey:@"shake"];
}

- (void)setError:(NSString *)message {
    self.errorLabel.text = message;
    self.field.layer.borderColor = (message ? UIColor.systemRedColor : UIColor.separatorColor).CGColor;
    if (message) UIAccessibilityPostNotification(UIAccessibilityAnnouncementNotification, message);
}

- (BOOL)textFieldShouldClear:(UITextField *)textField {
    [self setError:nil];
    dispatch_async(dispatch_get_main_queue(), ^{ [self updateLabel]; });
    return YES;
}

@end
```
