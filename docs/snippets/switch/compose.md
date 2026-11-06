```kotlin
@Composable
fun WifiRow() {
    var checked by remember { mutableStateOf(true) }

    Row(verticalAlignment = Alignment.CenterVertically) {
        Text("Wi-Fi", modifier = Modifier.weight(1f))
        Switch(checked = checked, onCheckedChange = { checked = it })
    }
}
```
