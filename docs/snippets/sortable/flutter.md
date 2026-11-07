```dart
class SortableList extends StatefulWidget {
  const SortableList({super.key});

  @override
  State<SortableList> createState() => _SortableListState();
}

class _SortableListState extends State<SortableList> {
  final _tabs = ['首页', '消息', '发现', '我的'];

  @override
  Widget build(BuildContext context) {
    return ReorderableListView.builder(
      buildDefaultDragHandles: false, // 只从手柄拖动
      itemCount: _tabs.length,
      onReorder: (oldIndex, newIndex) {
        setState(() {
          // 往下拖时 newIndex 包含原位置，需要减一
          if (newIndex > oldIndex) newIndex -= 1;
          _tabs.insert(newIndex, _tabs.removeAt(oldIndex));
        });
      },
      // 拖起时放大并加阴影
      proxyDecorator: (child, index, animation) => ScaleTransition(
        scale: Tween(begin: 1.0, end: 1.03).animate(animation),
        child: Material(elevation: 8, child: child),
      ),
      itemBuilder: (context, i) => ListTile(
        key: ValueKey(_tabs[i]),
        title: Text(_tabs[i]),
        leading: ReorderableDragStartListener(
          index: i,
          child: const Icon(Icons.drag_handle, semanticLabel: '拖动排序'),
        ),
      ),
      // 读屏下 ReorderableListView 会自动提供上移、下移等语义操作
    );
  }
}
```
