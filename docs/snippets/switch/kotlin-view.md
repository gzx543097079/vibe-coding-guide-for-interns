```kotlin
// 布局中使用 androidx.appcompat.widget.SwitchCompat
val wifi = findViewById<SwitchCompat>(R.id.wifi_switch)
wifi.isChecked = true
wifi.setOnCheckedChangeListener { _, isChecked ->
    Log.d("Settings", "Wi-Fi: $isChecked")
}
```
