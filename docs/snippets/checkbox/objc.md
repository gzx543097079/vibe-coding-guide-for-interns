```objc
@interface NotifyViewController ()
@property (nonatomic, strong) UIButton *allButton;
@property (nonatomic, copy) NSArray<UIButton *> *items;
@end

@implementation NotifyViewController

- (UIButton *)makeBox:(NSString *)title {
    UIButton *b = [UIButton buttonWithType:UIButtonTypeCustom];
    [b setTitle:[@" " stringByAppendingString:title] forState:UIControlStateNormal];
    [b setTitleColor:UIColor.labelColor forState:UIControlStateNormal];
    [b setImage:[UIImage systemImageNamed:@"square"] forState:UIControlStateNormal];
    [b setImage:[UIImage systemImageNamed:@"checkmark.square.fill"] forState:UIControlStateSelected];
    [b addTarget:self action:@selector(tap:) forControlEvents:UIControlEventTouchUpInside];
    return b;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.allButton = [self makeBox:@"全选"];
    self.items = @[[self makeBox:@"邮件"], [self makeBox:@"短信"], [self makeBox:@"推送"]];
    // 布局省略；单选组同理，图标换成 circle / largecircle.fill.circle
}

- (void)tap:(UIButton *)sender {
    if (sender == self.allButton) {
        BOOL target = !self.allButton.selected;
        for (UIButton *b in self.items) { b.selected = target; [self pop:b]; }
    } else {
        sender.selected = !sender.selected;
        [self pop:sender];
    }
    [self syncParent];
}

- (void)syncParent {
    NSUInteger n = 0;
    for (UIButton *b in self.items) { if (b.selected) n++; }
    BOOL mixed = n > 0 && n < self.items.count;
    self.allButton.selected = (n == self.items.count);
    [self.allButton setImage:[UIImage systemImageNamed:(mixed ? @"minus.square.fill" : @"square")]
                    forState:UIControlStateNormal];
    self.allButton.accessibilityValue = mixed ? @"部分选中" : nil;
}

// 对勾缩放淡入
- (void)pop:(UIButton *)b {
    if (UIAccessibilityIsReduceMotionEnabled()) return;
    b.imageView.transform = CGAffineTransformMakeScale(0.5, 0.5);
    b.imageView.alpha = 0;
    [UIView animateWithDuration:0.2 animations:^{
        b.imageView.transform = CGAffineTransformIdentity;
        b.imageView.alpha = 1;
    }];
}

@end
```
