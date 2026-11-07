```swift
// iOS 15 起可用 UISheetPresentationController 实现半屏弹窗
let shareVC = ShareViewController()
if let sheet = shareVC.sheetPresentationController {
    sheet.detents = [.medium(), .large()]
    sheet.prefersGrabberVisible = true
}
present(shareVC, animated: true)
```
