```objc
@interface SearchViewController () <UISearchResultsUpdating>
@property (nonatomic, copy) NSArray<NSString *> *words, *recent, *items;
@property (nonatomic, copy) NSString *query;
@end

@implementation SearchViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.words = @[@"苹果", @"苹果手机", @"苹果电脑", @"香蕉", @"橙子"];
    self.recent = @[@"耳机", @"充电器"];
    self.items = self.recent;
    self.query = @"";
    UISearchController *search = [[UISearchController alloc] initWithSearchResultsController:nil];
    search.searchResultsUpdater = self;
    search.obscuresBackgroundDuringPresentation = NO;
    self.navigationItem.searchController = search; // 搜索栏自带清除按钮
    [self.tableView registerClass:[UITableViewCell class] forCellReuseIdentifier:@"cell"];
}

- (void)updateSearchResultsForSearchController:(UISearchController *)searchController {
    // 防抖 150ms：取消上一次排队的刷新
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(reload:) object:self.query];
    self.query = searchController.searchBar.text ?: @"";
    [self performSelector:@selector(reload:) withObject:self.query afterDelay:0.15];
}

- (void)reload:(NSString *)text {
    self.items = text.length == 0 ? self.recent
        : [self.words filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"SELF CONTAINS %@", text]];
    UILabel *empty = [[UILabel alloc] init];
    empty.text = [NSString stringWithFormat:@"没有找到「%@」相关结果", text];
    empty.textAlignment = NSTextAlignmentCenter;
    self.tableView.backgroundView = (text.length && self.items.count == 0) ? empty : nil;
    [self.tableView reloadData];
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
    return self.query.length == 0 && self.items.count ? @"最近搜索" : nil;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.items.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell" forIndexPath:indexPath];
    NSString *word = self.items[indexPath.row];
    NSMutableAttributedString *text = [[NSMutableAttributedString alloc] initWithString:word];
    NSRange r = self.query.length ? [word rangeOfString:self.query] : NSMakeRange(NSNotFound, 0);
    if (r.location != NSNotFound) {
        [text addAttribute:NSFontAttributeName value:[UIFont boldSystemFontOfSize:17] range:r]; // 匹配部分加粗
    }
    cell.textLabel.attributedText = text;
    return cell;
}
@end
```
