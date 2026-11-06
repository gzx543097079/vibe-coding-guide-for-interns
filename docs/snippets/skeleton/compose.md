```kotlin
// 光泽：在内容上画一条渐变，用 translate 平移；系统动画缩放为 0 时不画
@Composable
fun Modifier.shimmer(): Modifier {
    val context = LocalContext.current
    val animationsOff = remember {
        Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
    }
    if (animationsOff) return this
    val x by rememberInfiniteTransition(label = "shimmer").animateFloat(
        initialValue = -1f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(1400, easing = LinearEasing)), label = "x",
    )
    return this.clipToBounds().drawWithContent {
        drawContent()
        translate(left = x * size.width) {
            drawRect(Brush.horizontalGradient(listOf(Color.Transparent, Color.White.copy(alpha = 0.6f), Color.Transparent)))
        }
    }
}

@Composable
fun ProfileRow(user: User?) {
    Crossfade(targetState = user, label = "profile") { u ->
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            if (u == null) {
                val gray = Color(0xFFE5E7EB)
                Box(Modifier.size(40.dp).clip(CircleShape).background(gray).shimmer())
                Column(Modifier.semantics { contentDescription = "加载中" }, verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Box(Modifier.width(180.dp).height(12.dp).clip(RoundedCornerShape(6.dp)).background(gray).shimmer())
                    Box(Modifier.width(110.dp).height(12.dp).clip(RoundedCornerShape(6.dp)).background(gray).shimmer())
                }
            } else {
                // AsyncImage 来自 Coil
                AsyncImage(model = u.avatarUrl, contentDescription = null, modifier = Modifier.size(40.dp).clip(CircleShape))
                Column { Text(u.name, fontWeight = FontWeight.Bold); Text(u.bio) }
            }
        }
    }
}
```
