```dart
class MessageList extends StatefulWidget {
  const MessageList({super.key});

  @override
  State<MessageList> createState() => _MessageListState();
}

class _MessageListState extends State<MessageList> {
  final List<String> _items = ['构建通知', '代码审查', '导师'];

  Future<void> _refresh() async {
    // 拉取数据完成后 setState
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _refresh, // 下拉刷新
      child: ListView.builder(
        itemCount: _items.length,
        itemBuilder: (context, index) {
          final item = _items[index];
          return Dismissible(
            key: ValueKey(item),
            direction: DismissDirection.endToStart, // 左滑删除
            onDismissed: (_) => setState(() => _items.removeAt(index)),
            background: Container(color: Colors.red),
            child: ListTile(title: Text(item)),
          );
        },
      ),
    );
  }
}
```
