```java
Button button = findViewById(R.id.submit);
button.setOnClickListener(v -> {
    v.setEnabled(false); // 防止重复提交
});
```
