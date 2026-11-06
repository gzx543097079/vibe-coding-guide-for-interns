```objc
@interface AccordionViewController : UITableViewController
@property (nonatomic, copy) NSArray<NSArray<NSString *> *> *sections; // @[@[标题, 内容], ...]
@property (nonatomic, strong) NSMutableIndexSet *expanded;
@property (nonatomic) BOOL allowsMultiple; // NO：一次只展开一个
@end

@implementation AccordionViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.expanded = [NSMutableIndexSet indexSetWithIndex:0]; // 默认展开第一个
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView { return self.sections.count; }

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [self.expanded containsIndex:section] ? 1 : 0;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [[UITableViewCell alloc] init];
    cell.textLabel.text = self.sections[indexPath.section][1];
    cell.textLabel.numberOfLines = 0;
    return cell;
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section {
    BOOL open = [self.expanded containsIndex:section];
    UIButton *button = [UIButton buttonWithType:UIButtonTypeSystem];
    [button setTitle:self.sections[section][0] forState:UIControlStateNormal];
    [button setImage:[UIImage systemImageNamed:@"chevron.down"] forState:UIControlStateNormal];
    button.semanticContentAttribute = UISemanticContentAttributeForceRightToLeft; // 箭头放右边
    button.imageView.transform = open ? CGAffineTransformMakeRotation(M_PI) : CGAffineTransformIdentity;
    button.accessibilityValue = open ? @"已展开" : @"已收起";
    button.tag = section;
    [button addTarget:self action:@selector(toggle:) forControlEvents:UIControlEventTouchUpInside];
    return button;
}

- (void)toggle:(UIButton *)sender {
    NSInteger s = sender.tag;
    NSMutableIndexSet *changed = [NSMutableIndexSet indexSetWithIndex:s];
    if ([self.expanded containsIndex:s]) {
        [self.expanded removeIndex:s];
    } else {
        if (!self.allowsMultiple) { [changed addIndexes:self.expanded]; [self.expanded removeAllIndexes]; }
        [self.expanded addIndex:s];
    }
    UITableViewRowAnimation anim = UIAccessibilityIsReduceMotionEnabled() ? UITableViewRowAnimationNone
                                                                          : UITableViewRowAnimationFade;
    // reloadSections 会重建 header，箭头直接按新状态显示；要看到旋转过程需缓存 header 并改用增删行
    [self.tableView reloadSections:changed withRowAnimation:anim];
}

@end
```
