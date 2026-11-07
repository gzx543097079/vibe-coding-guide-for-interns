```xml
<!-- 依赖：com.facebook.shimmer:shimmer:0.5.0 -->
<FrameLayout android:layout_width="match_parent" android:layout_height="wrap_content">

    <com.facebook.shimmer.ShimmerFrameLayout
        android:id="@+id/skeleton"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:contentDescription="加载中">
        <!-- 和真实布局一致：头像圆 + 两行文字条 -->
        <include layout="@layout/item_profile_placeholder" />
    </com.facebook.shimmer.ShimmerFrameLayout>

    <include android:id="@+id/content" layout="@layout/item_profile"
        android:visibility="gone" />
</FrameLayout>
```

```kotlin
val animationsOff = Settings.Global.getFloat(
    contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f
) == 0f

// 系统关闭动画时只显示静态灰块
if (animationsOff) binding.skeleton.hideShimmer() else binding.skeleton.startShimmer()

viewModel.user.observe(this) { user ->
    bindProfile(binding.content, user)
    binding.skeleton.stopShimmer()
    binding.skeleton.visibility = View.GONE
    binding.content.root.alpha = 0f
    binding.content.root.visibility = View.VISIBLE
    binding.content.root.animate().alpha(1f).setDuration(300).start() // 内容淡入
}
```
