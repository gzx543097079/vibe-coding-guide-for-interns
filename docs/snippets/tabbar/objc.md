```objc
UITabBarController *tabs = [[UITabBarController alloc] init];

HomeViewController *home = [[HomeViewController alloc] init];
home.tabBarItem = [[UITabBarItem alloc] initWithTitle:@"首页"
                                                image:[UIImage systemImageNamed:@"house"]
                                                  tag:0];

MineViewController *mine = [[MineViewController alloc] init];
mine.tabBarItem = [[UITabBarItem alloc] initWithTitle:@"我的"
                                                image:[UIImage systemImageNamed:@"person"]
                                                  tag:1];

tabs.viewControllers = @[home, mine];
self.window.rootViewController = tabs;
```
