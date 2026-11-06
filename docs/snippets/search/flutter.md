```dart
class SearchBox extends StatefulWidget {
  const SearchBox({super.key, required this.words, required this.recent});
  final List<String> words;
  final List<String> recent;

  @override
  State<SearchBox> createState() => _SearchBoxState();
}

class _SearchBoxState extends State<SearchBox> {
  final _controller = TextEditingController();
  Timer? _debounce;
  String _q = '';

  void _onChanged(String text) {
    setState(() {}); // 刷新清除按钮
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 150), () => setState(() => _q = text.trim()));
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final items = _q.isEmpty ? widget.recent : widget.words.where((w) => w.contains(_q)).toList();
    return Column(children: [
      TextField(
        controller: _controller,
        onChanged: _onChanged,
        decoration: InputDecoration(
          hintText: '搜索',
          suffixIcon: _controller.text.isEmpty ? null
              : IconButton(icon: const Icon(Icons.clear), tooltip: '清除',
                  onPressed: () { _controller.clear(); _onChanged(''); }),
        ),
      ),
      if (_q.isEmpty && items.isNotEmpty) const ListTile(dense: true, title: Text('最近搜索')),
      if (_q.isNotEmpty && items.isEmpty) Padding(padding: const EdgeInsets.all(24), child: Text('没有找到「$_q」相关结果')),
      for (final w in items)
        ListTile(title: _highlight(w), onTap: () { _controller.text = w; _onChanged(w); }),
    ]);
  }

  // 匹配部分加粗
  Widget _highlight(String w) {
    final i = _q.isEmpty ? -1 : w.indexOf(_q);
    if (i < 0) return Text(w);
    return Text.rich(TextSpan(children: [
      TextSpan(text: w.substring(0, i)),
      TextSpan(text: _q, style: const TextStyle(fontWeight: FontWeight.bold)),
      TextSpan(text: w.substring(i + _q.length)),
    ]));
  }
}
```
