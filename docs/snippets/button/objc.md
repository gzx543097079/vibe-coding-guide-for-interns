```objc
UIButton *button = [UIButton buttonWithType:UIButtonTypeSystem];
[button setTitle:@"提交" forState:UIControlStateNormal];
button.frame = CGRectMake(20, 100, 160, 44);
[button addTarget:self
           action:@selector(onSubmit:)
 forControlEvents:UIControlEventTouchUpInside];
[self.view addSubview:button];

- (void)onSubmit:(UIButton *)sender {
    sender.enabled = NO; // 防止重复提交
}
```
