待校对：较新的 Flutter 版本里，带 action 的 SnackBar 在开启无障碍导航时可能不会自动消失（有 persist 相关调整），具体行为随版本变化，待核实。

```dart
class ToastDemo extends StatelessWidget {
  const ToastDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          // Flutter 没有 Toast，用悬浮的短时 SnackBar 代替
          FilledButton(
            onPressed: () => ScaffoldMessenger.of(context)
              ..hideCurrentSnackBar()
              ..showSnackBar(const SnackBar(
                content: Text('已复制'),
                behavior: SnackBarBehavior.floating,
                duration: Duration(seconds: 2),
              )),
            child: const Text('复制链接'),
          ),
          FilledButton(
            onPressed: () => ScaffoldMessenger.of(context)
              ..hideCurrentSnackBar() // 新消息替换旧消息，不排队
              ..showSnackBar(SnackBar(
                content: const Text('已删除 1 条'),
                duration: const Duration(seconds: 4),
                action: SnackBarAction(label: '撤销', onPressed: () {
                  // 恢复
                }),
              )),
            child: const Text('删除'),
          ),
        ]),
      ),
    );
  }
}
```
