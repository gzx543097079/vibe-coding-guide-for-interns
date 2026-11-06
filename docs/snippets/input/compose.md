```kotlin
@Composable
fun EmailField() {
    var email by remember { mutableStateOf("") }
    var error by remember { mutableStateOf<String?>(null) }
    var wasFocused by remember { mutableStateOf(false) }
    val shake = remember { Animatable(0f) }
    val scope = rememberCoroutineScope()

    OutlinedTextField(
        value = email,
        onValueChange = { email = it },
        label = { Text("邮箱") }, // 获得焦点或有值时自动上移缩小
        singleLine = true,
        isError = error != null, // 边框变红，并给读屏加错误语义
        supportingText = { error?.let { Text(it) } },
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
        trailingIcon = {
            if (email.isNotEmpty()) {
                IconButton(onClick = { email = ""; error = null }) {
                    Icon(Icons.Default.Clear, contentDescription = "清除")
                }
            }
        },
        modifier = Modifier
            .graphicsLayer { translationX = shake.value }
            .onFocusChanged { state ->
                if (wasFocused && !state.isFocused) {
                    val ok = email.isEmpty() || Patterns.EMAIL_ADDRESS.matcher(email).matches()
                    error = if (ok) null else "邮箱格式不对"
                    if (!ok) scope.launch {
                        shake.animateTo(0f, keyframes {
                            durationMillis = 300
                            -12f at 75
                            12f at 150
                            -6f at 225
                        })
                    }
                }
                wasFocused = state.isFocused
            },
    )
}
```
