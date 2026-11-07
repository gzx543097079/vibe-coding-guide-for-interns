```kotlin
@Composable
fun ProgressDemo(progress: Float) {
    // 进度变化时平滑过渡
    val animated by animateFloatAsState(progress, label = "progress")

    Column(verticalArrangement = Arrangement.spacedBy(24.dp), modifier = Modifier.padding(16.dp)) {
        // 确定进度（Material3 1.2 起 progress 参数是 lambda）
        LinearProgressIndicator(
            progress = { animated },
            modifier = Modifier.fillMaxWidth().semantics { contentDescription = "上传进度" },
        )
        // 不确定进度
        LinearProgressIndicator(Modifier.fillMaxWidth().semantics { contentDescription = "正在加载" })

        Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            // 环形进度（确定）
            CircularProgressIndicator(
                progress = { animated },
                modifier = Modifier.semantics { contentDescription = "同步进度" },
            )
            // 旋转加载指示器
            CircularProgressIndicator(Modifier.semantics { contentDescription = "加载中" })
        }
    }
}
// 组件自带 progressBarRangeInfo 语义，读屏会读出百分比
```
