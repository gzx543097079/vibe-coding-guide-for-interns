```kotlin
@Composable
fun Accordion(items: List<Pair<String, String>>, single: Boolean = true) {
    var expanded by remember { mutableStateOf(setOf(0)) }

    Column {
        items.forEachIndexed { i, (title, body) ->
            val open = i in expanded
            val angle by animateFloatAsState(if (open) 180f else 0f, label = "chevron")

            Row(
                Modifier
                    .fillMaxWidth()
                    .clickable(role = Role.Button) {
                        expanded = when {
                            open -> expanded - i
                            single -> setOf(i) // 一次只展开一个
                            else -> expanded + i
                        }
                    }
                    .semantics { stateDescription = if (open) "已展开" else "已收起" }
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(title, Modifier.weight(1f))
                Icon(Icons.Default.KeyboardArrowDown, contentDescription = null, Modifier.rotate(angle))
            }
            AnimatedVisibility(visible = open, enter = fadeIn(), exit = fadeOut()) {
                Text(body, Modifier.padding(start = 16.dp, end = 16.dp, bottom = 16.dp))
            }
        }
    }
}
```
