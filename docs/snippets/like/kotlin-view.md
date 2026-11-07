```kotlin
// 布局：FrameLayout(likeBox) 内放 ImageView(heart)，旁边是 TextSwitcher(countView)
class LikeController(
    private val box: FrameLayout,
    private val heart: ImageView,
    private val countView: TextSwitcher,
    private var count: Int,
) {
    private var liked = false
    // 系统关闭动画时只切换颜色
    private val reduceMotion get() = Settings.Global.getFloat(
        box.context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f

    init {
        // TextSwitcher 进出动画（res/anim 下自定义的 translate 动画）：新数字从下方滑入，旧数字向上滑出
        countView.setInAnimation(box.context, R.anim.slide_in_bottom)
        countView.setOutAnimation(box.context, R.anim.slide_out_top)
        countView.setCurrentText(count.toString())
        box.setOnClickListener { toggle() }
    }

    private fun toggle() {
        liked = !liked
        count += if (liked) 1 else -1
        heart.setImageResource(if (liked) R.drawable.ic_heart_filled else R.drawable.ic_heart)
        box.isSelected = liked
        box.contentDescription = "赞，$count"
        if (reduceMotion) { countView.setCurrentText(count.toString()); return }
        countView.setText(count.toString())

        // 先缩小，再用 OvershootInterpolator 回弹；取消点赞只做这一步
        heart.animate().scaleX(0.7f).scaleY(0.7f).setDuration(100).withEndAction {
            heart.animate().scaleX(1f).scaleY(1f).setDuration(300).setInterpolator(OvershootInterpolator(3f)).start()
        }.start()
        if (liked) burst()
    }

    // 8 个小圆点向外飞散并淡出
    private fun burst() {
        val d = 22 * box.resources.displayMetrics.density
        repeat(8) { i ->
            val dot = View(box.context).apply { setBackgroundResource(R.drawable.red_dot) }
            box.addView(dot, FrameLayout.LayoutParams(12, 12, Gravity.CENTER))
            val a = Math.toRadians(i * 45.0)
            dot.animate().translationX((d * sin(a)).toFloat()).translationY((-d * cos(a)).toFloat())
                .scaleX(0.3f).scaleY(0.3f).alpha(0f).setDuration(500)
                .withEndAction { box.removeView(dot) }.start()
        }
    }
}
```
