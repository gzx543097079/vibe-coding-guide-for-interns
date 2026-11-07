```kotlin
@Composable
fun SubmitButton(onSubmit: () -> Unit) {
    var loading by remember { mutableStateOf(false) }

    Button(
        onClick = {
            loading = true
            onSubmit()
        },
        enabled = !loading,
    ) {
        if (loading) {
            CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
        } else {
            Text("提交")
        }
    }
}
```
