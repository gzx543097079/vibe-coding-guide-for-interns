```objc
@interface SortableViewController ()
@property (nonatomic, strong) NSMutableArray<NSString *> *tabs;
@end

@implementation SortableViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.tabs = [@[@"首页", @"消息", @"发现", @"我的"] mutableCopy];
    [self.tableView registerClass:[UITableViewCell class] forCellReuseIdentifier:@"cell"];
    // 编辑模式下每行右侧出现系统拖动手柄，按住即浮起，其他行自动让位
    [self setEditing:YES animated:NO]; // 同步 VC 与 tableView 的编辑状态
    self.navigationItem.rightBarButtonItem = self.editButtonItem;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.tabs.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell" forIndexPath:indexPath];
    cell.textLabel.text = self.tabs[indexPath.row];
    return cell;
}

// 允许移动；只排序不删除时隐藏左侧删除按钮
- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath { return YES; }
- (UITableViewCellEditingStyle)tableView:(UITableView *)tableView editingStyleForRowAtIndexPath:(NSIndexPath *)indexPath {
    return UITableViewCellEditingStyleNone;
}
- (BOOL)tableView:(UITableView *)tableView shouldIndentWhileEditingRowAtIndexPath:(NSIndexPath *)indexPath { return NO; }

// 松手落位后同步数据源，并播报新位置
- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)from toIndexPath:(NSIndexPath *)to {
    NSString *item = self.tabs[from.row];
    [self.tabs removeObjectAtIndex:from.row];
    [self.tabs insertObject:item atIndex:to.row];
    NSString *msg = [NSString stringWithFormat:@"已移到第 %ld 项，共 %lu 项", (long)to.row + 1, (unsigned long)self.tabs.count];
    UIAccessibilityPostNotification(UIAccessibilityAnnouncementNotification, msg);
}
@end
```
