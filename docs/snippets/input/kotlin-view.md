```xml
<!-- TextInputLayout 自带浮动标签、错误文案和清除按钮 -->
<com.google.android.material.textfield.TextInputLayout
    android:id="@+id/emailLayout"
    style="@style/Widget.Material3.TextInputLayout.OutlinedBox"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="邮箱"
    app:endIconMode="clear_text">

    <com.google.android.material.textfield.TextInputEditText
        android:id="@+id/email"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:autofillHints="emailAddress"
        android:inputType="textEmailAddress" />
</com.google.android.material.textfield.TextInputLayout>
```

```kotlin
binding.email.setOnFocusChangeListener { _, hasFocus ->
    if (hasFocus) return@setOnFocusChangeListener
    val text = binding.email.text?.toString().orEmpty()
    val ok = text.isEmpty() || Patterns.EMAIL_ADDRESS.matcher(text).matches()
    // 设置 error 后边框变红、下方出现文案，读屏也会读出
    binding.emailLayout.error = if (ok) null else "邮箱格式不对"
    if (!ok) {
        // 系统关闭动画时（动画时长缩放为 0）ObjectAnimator 会直接跳到结束值
        ObjectAnimator.ofFloat(binding.emailLayout, View.TRANSLATION_X, 0f, -12f, 12f, -6f, 0f)
            .setDuration(300)
            .start()
    }
}

// 重新输入时清掉错误
binding.email.doAfterTextChanged { binding.emailLayout.error = null }
```
