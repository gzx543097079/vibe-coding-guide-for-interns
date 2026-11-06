```objc
UIAlertController *sheet =
    [UIAlertController alertControllerWithTitle:@"分享到"
                                        message:nil
                                 preferredStyle:UIAlertControllerStyleActionSheet];
[sheet addAction:[UIAlertAction actionWithTitle:@"复制链接"
                                          style:UIAlertActionStyleDefault
                                        handler:^(UIAlertAction *action) {
    // 复制链接
}]];
[sheet addAction:[UIAlertAction actionWithTitle:@"取消"
                                          style:UIAlertActionStyleCancel
                                        handler:nil]];
// iPad 上需要设置 sheet.popoverPresentationController 的 sourceView
[self presentViewController:sheet animated:YES completion:nil];
```
