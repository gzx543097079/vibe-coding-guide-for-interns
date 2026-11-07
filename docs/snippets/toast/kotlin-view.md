```kotlin
// 轻提示：系统 Toast，LENGTH_SHORT 约 2 秒
copyButton.setOnClickListener {
    Toast.makeText(this, "已复制", Toast.LENGTH_SHORT).show()
}

// Snackbar（Material Components）：同一时间只显示一条，新的会替换旧的
deleteButton.setOnClickListener { v ->
    val removed = adapter.removeAt(position)
    Snackbar.make(v, "已删除 1 条", Snackbar.LENGTH_LONG)
        .setDuration(4000)
        .setAction("撤销") {
            adapter.insert(position, removed)
        }
        .show()
}
```

```xml
<!-- Snackbar 需要往上找到 CoordinatorLayout 才能跟 FAB 等联动，根布局建议用它 -->
<androidx.coordinatorlayout.widget.CoordinatorLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <!-- 页面内容 -->
</androidx.coordinatorlayout.widget.CoordinatorLayout>
```
