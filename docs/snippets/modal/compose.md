```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShareEntry() {
    var showSheet by remember { mutableStateOf(false) }

    Button(onClick = { showSheet = true }) { Text("分享") }

    if (showSheet) {
        ModalBottomSheet(onDismissRequest = { showSheet = false }) {
            Text("复制链接", modifier = Modifier.padding(24.dp))
        }
    }
}
```
