```kotlin
// 下拉刷新：布局中用 SwipeRefreshLayout 包住 RecyclerView
val swipe = findViewById<SwipeRefreshLayout>(R.id.swipe)
swipe.setOnRefreshListener {
    // 拉取数据完成后：
    swipe.isRefreshing = false
}

// 左滑删除
val callback = object : ItemTouchHelper.SimpleCallback(0, ItemTouchHelper.LEFT) {
    override fun onMove(
        rv: RecyclerView,
        vh: RecyclerView.ViewHolder,
        target: RecyclerView.ViewHolder,
    ) = false

    override fun onSwiped(vh: RecyclerView.ViewHolder, direction: Int) {
        val position = vh.bindingAdapterPosition
        items.removeAt(position)
        adapter.notifyItemRemoved(position)
    }
}
ItemTouchHelper(callback).attachToRecyclerView(recyclerView)
```
