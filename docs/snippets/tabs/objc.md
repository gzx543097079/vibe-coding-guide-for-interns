```objc
@interface OrdersViewController ()
@property (nonatomic, copy) NSArray<NSString *> *titles;
@property (nonatomic, strong) UISegmentedControl *segmented;
@property (nonatomic, strong) UILabel *contentView; // 实际项目里换成子控制器或列表
@end

@implementation OrdersViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.titles = @[@"全部", @"待付款", @"待发货", @"已完成"];
    // UISegmentedControl 自带滑块动画和读屏语义
    self.segmented = [[UISegmentedControl alloc] initWithItems:self.titles];
    self.segmented.selectedSegmentIndex = 0;
    [self.segmented addTarget:self action:@selector(changed) forControlEvents:UIControlEventValueChanged];
    self.navigationItem.titleView = self.segmented;

    self.contentView = [[UILabel alloc] init];
    [self.view addSubview:self.contentView]; // 约束省略
    [self showIndex:0];
}

- (void)changed {
    [self showIndex:self.segmented.selectedSegmentIndex];
}

// 内容区淡入
- (void)showIndex:(NSInteger)index {
    self.contentView.text = [self.titles[index] stringByAppendingString:@"订单"];
    if (UIAccessibilityIsReduceMotionEnabled()) return;
    self.contentView.alpha = 0;
    [UIView animateWithDuration:0.2 animations:^{
        self.contentView.alpha = 1;
    }];
}

@end
```
