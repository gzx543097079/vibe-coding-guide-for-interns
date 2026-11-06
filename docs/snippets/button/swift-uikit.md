```swift
var config = UIButton.Configuration.filled()
config.title = "提交"

let button = UIButton(configuration: config, primaryAction: UIAction { action in
    // 防止重复提交
    (action.sender as? UIButton)?.isEnabled = false
})
view.addSubview(button)
```
