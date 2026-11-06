待校对：Compose 没有内置拖拽排序，这里手写；Modifier.animateItem() 需要 Compose 1.7 以上（旧版是实验性的 animateItemPlacement），拖动中重排时手势是否保持待真机验证。

```kotlin
@Composable
fun SortableList(initial: List<String>) {
    val list = remember { initial.toMutableStateList() }
    var dragging by remember { mutableStateOf<String?>(null) }
    var offset by remember { mutableFloatStateOf(0f) }
    val rowPx = with(LocalDensity.current) { 56.dp.toPx() }
    val move = { from: Int, to: Int -> if (to in list.indices) list.add(to, list.removeAt(from)) }

    LazyColumn {
        items(list, key = { it }) { item ->
            val lifted = dragging == item
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .then(if (lifted) Modifier else Modifier.animateItem()) // 其他行动画让位
                    .zIndex(if (lifted) 1f else 0f)
                    .graphicsLayer {
                        translationY = if (lifted) offset else 0f
                        scaleX = if (lifted) 1.03f else 1f; scaleY = scaleX
                        shadowElevation = if (lifted) 12.dp.toPx() else 0f
                    }
                    .background(MaterialTheme.colorScheme.surface)
                    .height(56.dp)
                    .fillMaxWidth()
                    // 读屏用户通过自定义操作上移/下移
                    .semantics {
                        customActions = listOf(
                            CustomAccessibilityAction("上移") { val i = list.indexOf(item); move(i, i - 1); true },
                            CustomAccessibilityAction("下移") { val i = list.indexOf(item); move(i, i + 1); true },
                        )
                    },
            ) {
                Text("⠿", modifier = Modifier.padding(16.dp).pointerInput(item) {
                    detectDragGestures(
                        onDragStart = { dragging = item; offset = 0f },
                        onDragEnd = { dragging = null; offset = 0f },
                        onDragCancel = { dragging = null; offset = 0f },
                    ) { change, amount ->
                        change.consume()
                        offset += amount.y
                        // 越过半行就和相邻行交换，并把偏移量扣回去
                        val from = list.indexOf(item)
                        val to = (from + (offset / rowPx).roundToInt()).coerceIn(0, list.lastIndex)
                        if (to != from) { move(from, to); offset -= (to - from) * rowPx }
                    }
                })
                Text(item)
            }
        }
    }
}
```
