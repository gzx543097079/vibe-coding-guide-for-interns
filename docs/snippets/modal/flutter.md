```dart
// 底部弹窗
void openShare(BuildContext context) {
  showModalBottomSheet<void>(
    context: context,
    showDragHandle: true,
    builder: (context) => const ListTile(title: Text('复制链接')),
  );
}

// 确认对话框
Future<void> confirmDelete(BuildContext context) async {
  final ok = await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text('删除这篇文档？'),
      content: const Text('删除后无法恢复。'),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('取消')),
        TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('删除')),
      ],
    ),
  );
  if (ok == true) {
    // 删除
  }
}
```
