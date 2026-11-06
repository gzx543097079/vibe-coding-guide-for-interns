```kotlin
@Composable
fun ToastDemo() {
    val context = LocalContext.current
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    Scaffold(snackbarHost = { SnackbarHost(snackbarHostState) }) { padding ->
        Column(Modifier.padding(padding).padding(16.dp)) {
            // 轻提示直接用系统 Toast
            Button(onClick = { Toast.makeText(context, "已复制", Toast.LENGTH_SHORT).show() }) {
                Text("复制链接")
            }
            Button(onClick = {
                scope.launch {
                    // showSnackbar 默认排队，先关掉当前这条，实现「新消息替换旧消息」
                    snackbarHostState.currentSnackbarData?.dismiss()
                    val result = snackbarHostState.showSnackbar(
                        message = "已删除 1 条",
                        actionLabel = "撤销",
                        duration = SnackbarDuration.Short, // 约 4 秒
                    )
                    if (result == SnackbarResult.ActionPerformed) {
                        // 恢复
                    }
                }
            }) { Text("删除") }
        }
    }
}
```
