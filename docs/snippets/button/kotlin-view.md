```kotlin
val button = findViewById<Button>(R.id.submit)
button.setOnClickListener { view ->
    view.isEnabled = false // 防止重复提交
}
```
