```java
// 布局中使用 androidx.appcompat.widget.SwitchCompat
SwitchCompat wifi = findViewById(R.id.wifi_switch);
wifi.setChecked(true);
wifi.setOnCheckedChangeListener((buttonView, isChecked) -> {
    Log.d("Settings", "Wi-Fi: " + isChecked);
});
```
