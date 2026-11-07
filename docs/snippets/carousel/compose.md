待校对：HorizontalPager 在部分 Compose 版本仍需 @OptIn(ExperimentalFoundationApi::class)，rememberPagerState(pageCount = {}) 的签名待核实；系统「移除动画」用 ANIMATOR_DURATION_SCALE 判断。

```kotlin
@OptIn(ExperimentalFoundationApi::class)
@Composable
fun Carousel(banners: List<String>) {
    val pagerState = rememberPagerState(pageCount = { banners.size })
    val dragged by pagerState.interactionSource.collectIsDraggedAsState()
    val context = LocalContext.current
    // 系统关闭动画时不自动播放
    val reduceMotion = remember {
        Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
    }

    LaunchedEffect(dragged, reduceMotion) {
        if (dragged || reduceMotion || banners.size < 2) return@LaunchedEffect
        while (true) {
            delay(4000)
            pagerState.animateScrollToPage((pagerState.currentPage + 1) % banners.size)
        }
    }

    Box {
        HorizontalPager(state = pagerState, modifier = Modifier.height(180.dp)) { page ->
            Text(banners[page], modifier = Modifier.fillMaxSize())
        }
        // 圆点指示器，当前点拉长
        Row(Modifier.align(Alignment.BottomCenter).padding(8.dp)) {
            repeat(banners.size) { i ->
                val selected = pagerState.currentPage == i
                Box(
                    Modifier.padding(3.dp)
                        .size(width = if (selected) 20.dp else 8.dp, height = 8.dp)
                        .clip(CircleShape)
                        .background(if (selected) Color.White else Color.White.copy(alpha = 0.5f))
                )
            }
        }
    }
}
```
