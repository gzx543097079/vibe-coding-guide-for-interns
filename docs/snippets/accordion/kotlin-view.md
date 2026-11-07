```kotlin
// 每个分组是 item_accordion.xml：header（标题 + 箭头 ImageView）+ body（默认 gone）
class AccordionController(
    private val sections: List<ItemAccordionBinding>,
    private val single: Boolean = true, // 一次只展开一个
) {
    private val animationsOff: Boolean

    init {
        val resolver = sections.first().root.context.contentResolver
        animationsOff = Settings.Global.getFloat(resolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
        sections.forEachIndexed { i, b ->
            ViewCompat.setAccessibilityDelegate(b.header, object : AccessibilityDelegateCompat() {
                override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfoCompat) {
                    super.onInitializeAccessibilityNodeInfo(host, info)
                    info.className = Button::class.java.name // 读屏报「按钮」
                }
            })
            b.header.setOnClickListener { toggle(i) }
            setOpen(b, i == 0)
        }
    }

    private fun toggle(index: Int) {
        val open = sections[index].body.visibility != View.VISIBLE
        if (single && open) sections.forEach { setOpen(it, false) }
        setOpen(sections[index], open)
    }

    private fun setOpen(b: ItemAccordionBinding, open: Boolean) {
        b.body.visibility = if (open) View.VISIBLE else View.GONE
        if (open) { b.body.alpha = 0f; b.body.animate().alpha(1f).setDuration(if (animationsOff) 0 else 200) }
        b.arrow.animate().rotation(if (open) 180f else 0f).setDuration(if (animationsOff) 0 else 200)
        ViewCompat.setStateDescription(b.header, if (open) "已展开" else "已收起")
    }
}
```
