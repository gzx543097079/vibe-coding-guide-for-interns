```kotlin
@Composable
fun RootScreen() {
    var selected by remember { mutableIntStateOf(0) }
    val tabs = listOf("首页" to Icons.Filled.Home, "我的" to Icons.Filled.Person)

    Scaffold(
        bottomBar = {
            NavigationBar {
                tabs.forEachIndexed { index, (label, icon) ->
                    NavigationBarItem(
                        selected = selected == index,
                        onClick = { selected = index },
                        icon = { Icon(icon, contentDescription = null) },
                        label = { Text(label) },
                    )
                }
            }
        },
    ) { padding ->
        Box(Modifier.padding(padding)) {
            if (selected == 0) HomeScreen() else MineScreen()
        }
    }
}
```
