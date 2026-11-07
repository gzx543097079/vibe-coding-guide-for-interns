```kotlin
@Composable
fun NotifySettings() {
    val names = listOf("邮件", "短信", "推送")
    val picked = remember { mutableStateListOf(true, false, false) }
    var theme by remember { mutableStateOf("浅色") }
    val parent = when {
        picked.all { it } -> ToggleableState.On
        picked.none { it } -> ToggleableState.Off
        else -> ToggleableState.Indeterminate
    }

    Column {
        // 整行可点；Checkbox 自身 onClick 传 null，避免读屏重复
        Row(
            Modifier.fillMaxWidth().triStateToggleable(state = parent, role = Role.Checkbox) {
                val target = parent != ToggleableState.On
                for (i in picked.indices) picked[i] = target
            },
            verticalAlignment = Alignment.CenterVertically,
        ) {
            TriStateCheckbox(state = parent, onClick = null)
            Text("全选")
        }
        names.forEachIndexed { i, name ->
            Row(
                Modifier.fillMaxWidth().padding(start = 24.dp)
                    .toggleable(value = picked[i], role = Role.Checkbox) { picked[i] = it },
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Checkbox(checked = picked[i], onCheckedChange = null)
                Text(name)
            }
        }

        // selectableGroup 让读屏把这几项识别为一组单选
        Column(Modifier.selectableGroup()) {
            listOf("浅色", "深色").forEach { option ->
                Row(
                    Modifier.fillMaxWidth()
                        .selectable(selected = theme == option, role = Role.RadioButton) { theme = option },
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    RadioButton(selected = theme == option, onClick = null)
                    Text(option)
                }
            }
        }
    }
}
```
