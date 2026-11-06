```objc
UISwitch *wifiSwitch = [[UISwitch alloc] init];
wifiSwitch.on = YES;
[wifiSwitch addTarget:self
               action:@selector(onToggle:)
     forControlEvents:UIControlEventValueChanged];
[self.view addSubview:wifiSwitch];

- (void)onToggle:(UISwitch *)sender {
    NSLog(@"Wi-Fi: %@", sender.isOn ? @"开" : @"关");
}
```
