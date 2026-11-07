待校对：Spinner 下拉模式是否给当前项打勾取决于下拉项布局（这里用 simple_list_item_single_choice），未在各系统版本上验证。

```xml
<Spinner
    android:id="@+id/citySpinner"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:contentDescription="城市"
    android:spinnerMode="dropdown" />
```

```kotlin
val cities = listOf("北京", "上海", "广州", "深圳")
val disabled = setOf("广州")

val adapter = object : ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, cities) {
    // 禁用项：不可点，下拉里显示为半透明
    override fun isEnabled(position: Int) = cities[position] !in disabled
    override fun areAllItemsEnabled() = false

    override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = super.getDropDownView(position, convertView, parent)
        view.alpha = if (isEnabled(position)) 1f else 0.4f
        return view
    }
}
adapter.setDropDownViewResource(android.R.layout.simple_list_item_single_choice)
binding.citySpinner.adapter = adapter

binding.citySpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
    override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
        val city = cities[position]
        // 处理选中
    }
    override fun onNothingSelected(parent: AdapterView<*>) {}
}
```
