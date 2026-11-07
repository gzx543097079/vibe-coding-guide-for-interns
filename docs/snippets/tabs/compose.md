待校对：新版 Material3 用 PrimaryTabRow 取代 TabRow，起始版本待核实；旧版本把 PrimaryTabRow 换成 TabRow 即可，参数相同。

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrdersScreen() {
    val titles = listOf("全部", "待付款", "待发货", "已完成")
    var selected by rememberSaveable { mutableIntStateOf(0) }

    Column {
        // 默认指示器会滑到选中标签；Tab 自带 Role.Tab 语义，外接键盘可用方向键移动焦点
        PrimaryTabRow(selectedTabIndex = selected) {
            titles.forEachIndexed { i, title ->
                Tab(
                    selected = selected == i,
                    onClick = { selected = i },
                    text = { Text(title) },
                )
            }
        }

        // 内容区淡入淡出
        Crossfade(targetState = selected, label = "tabContent") { index ->
            Box(Modifier.fillMaxSize().padding(16.dp)) {
                Text("${titles[index]}订单")
            }
        }
    }
}
```
