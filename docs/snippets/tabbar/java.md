```java
// 布局中使用 BottomNavigationView，菜单项定义在 res/menu/bottom_nav.xml
BottomNavigationView nav = findViewById(R.id.bottom_nav);
nav.setOnItemSelectedListener(item -> {
    int id = item.getItemId();
    if (id == R.id.tab_home) {
        showFragment(new HomeFragment());
    } else if (id == R.id.tab_mine) {
        showFragment(new MineFragment());
    }
    return true; // 返回 true 表示选中该项
});
```
