```kotlin
// Material3 的 SearchBar 是实验性 API，签名变过几次；这里用 TextField + LazyColumn 自己组合
@Composable
fun SearchBox(words: List<String>, recent: List<String>, onSelect: (String) -> Unit) {
    var query by remember { mutableStateOf("") }
    var results by remember { mutableStateOf(recent) }

    LaunchedEffect(query) {
        delay(150) // 防抖：query 变化时上一个协程被取消
        results = if (query.isBlank()) recent else words.filter { it.contains(query) }
    }

    Column {
        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            placeholder = { Text("搜索") },
            singleLine = true,
            trailingIcon = {
                if (query.isNotEmpty()) IconButton(onClick = { query = "" }) {
                    Icon(Icons.Default.Clear, contentDescription = "清除")
                }
            },
            modifier = Modifier.fillMaxWidth(),
        )
        if (query.isBlank() && results.isNotEmpty()) Text("最近搜索", style = MaterialTheme.typography.labelMedium)
        if (query.isNotBlank() && results.isEmpty()) Text("没有找到「$query」相关结果")
        LazyColumn {
            items(results) { word ->
                Text(
                    text = highlight(word, query),
                    modifier = Modifier.fillMaxWidth().clickable { query = word; onSelect(word) }.padding(12.dp),
                )
            }
        }
    }
}

// 匹配部分加粗
private fun highlight(word: String, q: String) = buildAnnotatedString {
    val i = if (q.isBlank()) -1 else word.indexOf(q)
    if (i < 0) { append(word); return@buildAnnotatedString }
    append(word.substring(0, i))
    withStyle(SpanStyle(fontWeight = FontWeight.Bold)) { append(q) }
    append(word.substring(i + q.length))
}
```
