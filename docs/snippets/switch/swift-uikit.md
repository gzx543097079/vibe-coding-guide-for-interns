```swift
let wifiSwitch = UISwitch()
wifiSwitch.isOn = true
wifiSwitch.addAction(UIAction { action in
    guard let sender = action.sender as? UISwitch else { return }
    print("Wi-Fi:", sender.isOn)
}, for: .valueChanged)
view.addSubview(wifiSwitch)
```
