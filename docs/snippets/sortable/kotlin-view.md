```kotlin
// RecyclerView + ItemTouchHelper：按住手柄开始拖动，其他行由 RecyclerView 动画让位
class SortableAdapter(private val items: MutableList<String>) :
    RecyclerView.Adapter<SortableAdapter.Holder>() {
    lateinit var touchHelper: ItemTouchHelper

    class Holder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView = view.findViewById(R.id.title)
        val handle: View = view.findViewById(R.id.handle)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) =
        Holder(LayoutInflater.from(parent.context).inflate(R.layout.item_sortable, parent, false))

    @SuppressLint("ClickableViewAccessibility")
    override fun onBindViewHolder(holder: Holder, position: Int) {
        holder.title.text = items[position]
        holder.handle.setOnTouchListener { _, e ->
            if (e.actionMasked == MotionEvent.ACTION_DOWN) touchHelper.startDrag(holder)
            false
        }
    }

    override fun getItemCount() = items.size

    fun move(from: Int, to: Int) {
        items.add(to, items.removeAt(from))
        notifyItemMoved(from, to)
    }
}

fun attachSort(recycler: RecyclerView, adapter: SortableAdapter) {
    val callback = object : ItemTouchHelper.SimpleCallback(ItemTouchHelper.UP or ItemTouchHelper.DOWN, 0) {
        override fun isLongPressDragEnabled() = false // 只允许从手柄拖动
        override fun onMove(rv: RecyclerView, from: RecyclerView.ViewHolder, to: RecyclerView.ViewHolder): Boolean {
            adapter.move(from.bindingAdapterPosition, to.bindingAdapterPosition)
            return true
        }
        override fun onSwiped(vh: RecyclerView.ViewHolder, direction: Int) = Unit
        // 拿起时放大并抬高，松手后复原
        override fun onSelectedChanged(vh: RecyclerView.ViewHolder?, state: Int) {
            if (state == ItemTouchHelper.ACTION_STATE_DRAG) vh?.itemView?.apply { scaleX = 1.03f; scaleY = 1.03f; elevation = 12f }
        }
        override fun clearView(rv: RecyclerView, vh: RecyclerView.ViewHolder) {
            super.clearView(rv, vh)
            vh.itemView.apply { scaleX = 1f; scaleY = 1f; elevation = 0f }
            rv.announceForAccessibility("已放下，第 ${vh.bindingAdapterPosition + 1} 项")
        }
    }
    adapter.touchHelper = ItemTouchHelper(callback).also { it.attachToRecyclerView(recycler) }
}
```
