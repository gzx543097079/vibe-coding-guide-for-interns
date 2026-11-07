待校对：ExposedDropdownMenuBox 是实验性 API，menuAnchor 的参数在不同 Material3 版本里改过（无参 / MenuAnchorType / ExposedDropdownMenuAnchorType），按 1.3 写法，需按项目版本核对。

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CitySelect() {
    val cities = listOf("北京", "上海", "广州", "深圳")
    val disabled = setOf("广州")
    var expanded by remember { mutableStateOf(false) }
    var selected by remember { mutableStateOf(cities[0]) }

    ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = it }) {
        OutlinedTextField(
            value = selected,
            onValueChange = {},
            readOnly = true,
            label = { Text("城市") },
            // 展开时箭头自动旋转
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            modifier = Modifier.menuAnchor(MenuAnchorType.PrimaryNotEditable).fillMaxWidth(),
        )
        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            cities.forEach { city ->
                DropdownMenuItem(
                    text = { Text(city) },
                    enabled = city !in disabled,
                    trailingIcon = {
                        if (city == selected) Icon(Icons.Default.Check, contentDescription = "已选")
                    },
                    onClick = {
                        selected = city
                        expanded = false
                    },
                )
            }
        }
    }
}
```
