```kotlin
// 底部弹窗：Material Components 的 BottomSheetDialog
val sheet = BottomSheetDialog(this)
sheet.setContentView(R.layout.sheet_share)
sheet.show()

// 确认对话框
MaterialAlertDialogBuilder(this)
    .setTitle("删除这篇文档？")
    .setMessage("删除后无法恢复。")
    .setNegativeButton("取消", null)
    .setPositiveButton("删除") { _, _ -> /* 删除 */ }
    .show()
```
