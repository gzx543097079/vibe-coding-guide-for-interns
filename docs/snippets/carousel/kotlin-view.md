```kotlin
// 布局中使用 androidx.viewpager2.widget.ViewPager2，adapter 为普通 RecyclerView.Adapter
class BannerController(private val pager: ViewPager2, private val count: Int) {
    private val handler = Handler(Looper.getMainLooper())
    private val next = object : Runnable {
        override fun run() {
            pager.currentItem = (pager.currentItem + 1) % count
            handler.postDelayed(this, 4000)
        }
    }

    // 系统关闭动画（开发者选项或无障碍的「移除动画」）时不自动播放
    private val reduceMotion: Boolean
        get() = Settings.Global.getFloat(
            pager.context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f
        ) == 0f

    init {
        pager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageScrollStateChanged(state: Int) {
                // 手指拖动时暂停，停下后恢复
                if (state == ViewPager2.SCROLL_STATE_DRAGGING) stop()
                if (state == ViewPager2.SCROLL_STATE_IDLE) start()
            }
            override fun onPageSelected(position: Int) {
                // 在这里更新圆点指示器，例如 TabLayoutMediator 或自绘指示器
            }
        })
    }

    fun start() {
        stop()
        if (!reduceMotion && count > 1) handler.postDelayed(next, 4000)
    }

    fun stop() = handler.removeCallbacks(next)
}
```
