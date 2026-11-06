```swift
let home = HomeViewController()
home.tabBarItem = UITabBarItem(title: "首页", image: UIImage(systemName: "house"), tag: 0)

let mine = MineViewController()
mine.tabBarItem = UITabBarItem(title: "我的", image: UIImage(systemName: "person"), tag: 1)

let tabs = UITabBarController()
tabs.viewControllers = [home, mine]
window?.rootViewController = tabs
```
