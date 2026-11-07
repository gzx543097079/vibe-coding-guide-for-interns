```kotlin
// PullToRefreshBox 来自 Material3 1.3 及以上
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MessageList(viewModel: MessageViewModel) {
    val items by viewModel.items.collectAsState()
    val refreshing by viewModel.refreshing.collectAsState()

    PullToRefreshBox(
        isRefreshing = refreshing,
        onRefresh = { viewModel.refresh() },
    ) {
        LazyColumn {
            items(items, key = { it.id }) { item ->
                Text(item.title, modifier = Modifier.padding(16.dp))
            }
        }
    }
}
// 滑动删除可用 SwipeToDismissBox，不同 Material3 版本参数有变化（待校对）
```
