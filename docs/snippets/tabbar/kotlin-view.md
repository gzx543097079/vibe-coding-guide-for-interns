```kotlin
// 布局中使用 BottomNavigationView，菜单项定义在 res/menu/bottom_nav.xml
val nav = findViewById<BottomNavigationView>(R.id.bottom_nav)
nav.setOnItemSelectedListener { item ->
    when (item.itemId) {
        R.id.tab_home -> showFragment(HomeFragment())
        R.id.tab_mine -> showFragment(MineFragment())
    }
    true // 返回 true 表示选中该项
}
```
