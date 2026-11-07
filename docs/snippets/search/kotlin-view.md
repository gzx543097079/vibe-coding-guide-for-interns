```kotlin
// 布局：Toolbar 菜单里放 androidx.appcompat.widget.SearchView，下方放 RecyclerView 和空状态 TextView
class SearchController(
    private val searchView: SearchView,
    private val adapter: SuggestAdapter, // 自定义 ListAdapter<CharSequence, ...>
    private val emptyView: TextView,
    private val words: List<String>,
    private val recent: List<String>,
) {
    private val handler = Handler(Looper.getMainLooper())
    private var pending: Runnable? = null

    init {
        // SearchView 自带清除按钮
        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextChange(text: String): Boolean {
                pending?.let(handler::removeCallbacks)
                pending = Runnable { show(text.trim()) }.also { handler.postDelayed(it, 150) } // 防抖 150ms
                return true
            }
            override fun onQueryTextSubmit(text: String) = false
        })
        show("")
    }

    private fun show(q: String) {
        val list = if (q.isEmpty()) recent else words.filter { it.contains(q) }
        adapter.header = if (q.isEmpty()) "最近搜索" else null
        adapter.submitList(list.map { highlight(it, q) })
        emptyView.text = "没有找到「$q」相关结果"
        emptyView.isVisible = q.isNotEmpty() && list.isEmpty()
    }

    // 匹配部分加粗
    private fun highlight(word: String, q: String): CharSequence {
        val i = if (q.isEmpty()) -1 else word.indexOf(q)
        if (i < 0) return word
        return SpannableString(word).apply {
            setSpan(StyleSpan(Typeface.BOLD), i, i + q.length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        }
    }
}
```
