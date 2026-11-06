```objc
@interface CitySelectViewController ()
@property (nonatomic, copy) NSString *selected;
@property (nonatomic, strong) UIButton *button;
@end

@implementation CitySelectViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.selected = @"北京";
    UIButtonConfiguration *config = [UIButtonConfiguration borderedButtonConfiguration];
    config.image = [UIImage systemImageNamed:@"chevron.up.chevron.down"];
    config.imagePlacement = NSDirectionalRectEdgeTrailing;
    config.imagePadding = 6;
    self.button = [UIButton buttonWithConfiguration:config primaryAction:nil];
    self.button.showsMenuAsPrimaryAction = YES;        // 点一下直接弹出菜单
    self.button.changesSelectionAsPrimaryAction = YES; // iOS 15+：当前项带对勾，标题跟随选中项
    self.button.menu = [self makeMenu];
    self.button.accessibilityLabel = @"城市";
    [self.view addSubview:self.button]; // 约束省略
}

- (UIMenu *)makeMenu {
    NSArray<NSString *> *cities = @[@"北京", @"上海", @"广州", @"深圳"];
    NSMutableArray<UIAction *> *actions = [NSMutableArray array];
    __weak typeof(self) weakSelf = self;
    for (NSString *city in cities) {
        UIAction *action = [UIAction actionWithTitle:city image:nil identifier:nil handler:^(UIAction *a) {
            weakSelf.selected = a.title;
        }];
        action.state = [city isEqualToString:self.selected] ? UIMenuElementStateOn : UIMenuElementStateOff;
        if ([city isEqualToString:@"广州"]) action.attributes = UIMenuElementAttributesDisabled; // 禁用项
        [actions addObject:action];
    }
    return [UIMenu menuWithTitle:@"城市" children:actions];
}

@end
```
