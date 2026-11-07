```xml
<!-- Material Components 1.3+ -->
<com.google.android.material.progressindicator.LinearProgressIndicator
    android:id="@+id/upload"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:contentDescription="上传进度"
    android:max="100" />

<com.google.android.material.progressindicator.LinearProgressIndicator
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:contentDescription="正在加载"
    android:indeterminate="true" />

<com.google.android.material.progressindicator.CircularProgressIndicator
    android:id="@+id/sync"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:contentDescription="同步进度"
    app:indicatorSize="48dp" />

<com.google.android.material.progressindicator.CircularProgressIndicator
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:contentDescription="加载中"
    android:indeterminate="true" />
```

```kotlin
// 第二个参数 true 表示带动画过渡到新进度
binding.upload.setProgressCompat(40, true)
binding.sync.setProgressCompat(40, true)
```
