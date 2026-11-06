```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <!-- TabLayout 的下划线指示器自带滑动动画 -->
    <com.google.android.material.tabs.TabLayout
        android:id="@+id/tabs"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:tabMode="fixed" />

    <TextView
        android:id="@+id/content"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:padding="16dp" />
</LinearLayout>
```

```kotlin
val titles = listOf("全部", "待付款", "待发货", "已完成")
titles.forEach { binding.tabs.addTab(binding.tabs.newTab().setText(it)) }
binding.content.text = "${titles[0]}订单"

binding.tabs.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
    override fun onTabSelected(tab: TabLayout.Tab) {
        binding.content.text = "${titles[tab.position]}订单"
        // 内容区淡入；系统关闭动画时时长缩放为 0，会直接显示
        binding.content.alpha = 0f
        binding.content.animate().alpha(1f).setDuration(200).start()
    }
    override fun onTabUnselected(tab: TabLayout.Tab) {}
    override fun onTabReselected(tab: TabLayout.Tab) {}
})
// 配合 ViewPager2 左右滑动时，用 TabLayoutMediator 把两者绑在一起
```
