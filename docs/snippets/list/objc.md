```objc
// 下拉刷新
- (void)viewDidLoad {
    [super viewDidLoad];
    UIRefreshControl *refresh = [[UIRefreshControl alloc] init];
    [refresh addTarget:self action:@selector(onRefresh:) forControlEvents:UIControlEventValueChanged];
    self.tableView.refreshControl = refresh;
}

- (void)onRefresh:(UIRefreshControl *)sender {
    // 拉取数据完成后：
    [self.tableView reloadData];
    [sender endRefreshing];
}

// 左滑删除
- (UISwipeActionsConfiguration *)tableView:(UITableView *)tableView
    trailingSwipeActionsConfigurationForRowAtIndexPath:(NSIndexPath *)indexPath {
    UIContextualAction *del =
        [UIContextualAction contextualActionWithStyle:UIContextualActionStyleDestructive
                                                title:@"删除"
                                              handler:^(UIContextualAction *action, UIView *view,
                                                        void (^completion)(BOOL)) {
        [self.items removeObjectAtIndex:indexPath.row];
        [tableView deleteRowsAtIndexPaths:@[indexPath]
                         withRowAnimation:UITableViewRowAnimationAutomatic];
        completion(YES);
    }];
    return [UISwipeActionsConfiguration configurationWithActions:@[del]];
}
```
