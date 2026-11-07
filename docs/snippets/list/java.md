```java
// 下拉刷新：布局中用 SwipeRefreshLayout 包住 RecyclerView
SwipeRefreshLayout swipe = findViewById(R.id.swipe);
swipe.setOnRefreshListener(() -> {
    // 拉取数据完成后：
    swipe.setRefreshing(false);
});

// 左滑删除
ItemTouchHelper.SimpleCallback callback =
    new ItemTouchHelper.SimpleCallback(0, ItemTouchHelper.LEFT) {
        @Override
        public boolean onMove(@NonNull RecyclerView rv, @NonNull RecyclerView.ViewHolder vh,
                              @NonNull RecyclerView.ViewHolder target) {
            return false;
        }

        @Override
        public void onSwiped(@NonNull RecyclerView.ViewHolder vh, int direction) {
            int position = vh.getBindingAdapterPosition();
            items.remove(position);
            adapter.notifyItemRemoved(position);
        }
    };
new ItemTouchHelper(callback).attachToRecyclerView(recyclerView);
```
