待校对：MaterialCheckBox 的 checkedState 与 addOnCheckedStateChangedListener 需要 Material Components 1.6.0 起，具体版本待核实。

```xml
<LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="vertical">
    <com.google.android.material.checkbox.MaterialCheckBox
        android:id="@+id/all" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="全选" />
    <com.google.android.material.checkbox.MaterialCheckBox
        android:id="@+id/email" android:layout_width="wrap_content" android:layout_height="wrap_content"
        android:layout_marginStart="24dp" android:checked="true" android:text="邮件" />
    <com.google.android.material.checkbox.MaterialCheckBox
        android:id="@+id/sms" android:layout_width="wrap_content" android:layout_height="wrap_content"
        android:layout_marginStart="24dp" android:text="短信" />
    <RadioGroup android:id="@+id/theme" android:layout_width="wrap_content" android:layout_height="wrap_content">
        <com.google.android.material.radiobutton.MaterialRadioButton
            android:id="@+id/light" android:layout_width="wrap_content" android:layout_height="wrap_content"
            android:checked="true" android:text="浅色" />
        <com.google.android.material.radiobutton.MaterialRadioButton
            android:id="@+id/dark" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="深色" />
    </RadioGroup>
</LinearLayout>
```

```kotlin
val children = listOf(binding.email, binding.sms)
var syncing = false // 防止父子互相触发

fun syncParent() {
    val n = children.count { it.isChecked }
    syncing = true
    binding.all.checkedState = when (n) {
        0 -> MaterialCheckBox.STATE_UNCHECKED
        children.size -> MaterialCheckBox.STATE_CHECKED
        else -> MaterialCheckBox.STATE_INDETERMINATE
    }
    syncing = false
}

children.forEach { it.setOnCheckedChangeListener { _, _ -> if (!syncing) syncParent() } }
binding.all.addOnCheckedStateChangedListener { _, state ->
    if (syncing || state == MaterialCheckBox.STATE_INDETERMINATE) return@addOnCheckedStateChangedListener
    syncing = true
    children.forEach { it.isChecked = state == MaterialCheckBox.STATE_CHECKED }
    syncing = false
}
syncParent()

// RadioGroup 自己保证只选中一个
binding.theme.setOnCheckedChangeListener { _, checkedId -> /* checkedId 为选中项 id */ }
```
