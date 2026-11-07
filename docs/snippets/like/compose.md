待校对：AnimatedContent 的 togetherWith 需要 Compose 1.5 以上（旧版本用 with 且要 @OptIn）；未处理系统「移除动画」设置。

```kotlin
@Composable
fun LikeButton(initial: Int) {
    var liked by remember { mutableStateOf(false) }
    var count by remember { mutableIntStateOf(initial) }
    val scale = remember { Animatable(1f) }
    val burst = remember { Animatable(1f) } // 0→1 表示爆发进度，1 为结束
    val scope = rememberCoroutineScope()

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .toggleable(value = liked, role = Role.Switch) { on ->
                liked = on
                count += if (on) 1 else -1
                scope.launch {
                    // 先缩小，再弹簧回弹；取消点赞只做这一步
                    scale.animateTo(0.7f, tween(100))
                    scale.animateTo(1f, spring(dampingRatio = 0.4f, stiffness = Spring.StiffnessMedium))
                }
                if (on) scope.launch { burst.snapTo(0f); burst.animateTo(1f, tween(500)) }
            }
            .semantics { contentDescription = "赞" }
            .padding(8.dp),
    ) {
        Box(contentAlignment = Alignment.Center) {
            // 8 个小圆点向外飞散并淡出
            repeat(8) { i ->
                val angle = Math.toRadians(i * 45.0)
                Box(
                    Modifier.size(5.dp)
                        .graphicsLayer {
                            val d = 22.dp.toPx() * burst.value
                            translationX = (d * sin(angle)).toFloat()
                            translationY = (-d * cos(angle)).toFloat()
                            alpha = 1f - burst.value
                        }
                        .background(Color.Red, CircleShape)
                )
            }
            Icon(
                if (liked) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                contentDescription = null,
                tint = if (liked) Color.Red else Color.Gray,
                modifier = Modifier.graphicsLayer { scaleX = scale.value; scaleY = scale.value },
            )
        }
        // 数字向上滚动切换
        AnimatedContent(targetState = count, transitionSpec = {
            slideInVertically { it } togetherWith slideOutVertically { -it }
        }, label = "count") { Text("$it") }
    }
}
```
