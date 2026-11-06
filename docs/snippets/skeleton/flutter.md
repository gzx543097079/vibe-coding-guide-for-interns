```dart
class Shimmer extends StatefulWidget {
  const Shimmer({super.key, required this.child});
  final Widget child;
  @override
  State<Shimmer> createState() => _ShimmerState();
}

class _ShimmerState extends State<Shimmer> with SingleTickerProviderStateMixin {
  late final _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1400))..repeat();

  @override
  void dispose() { _c.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    // 系统要求减少动画时只显示静态灰块
    if (MediaQuery.of(context).disableAnimations) return widget.child;
    return ClipRect(
      child: Stack(children: [
        widget.child,
        Positioned.fill(
          child: AnimatedBuilder(
            animation: _c,
            builder: (_, __) => FractionalTranslation(
              translation: Offset(_c.value * 2 - 1, 0), // 只做水平平移
              child: const DecoratedBox(decoration: BoxDecoration(gradient: LinearGradient(
                colors: [Colors.transparent, Color(0x99FFFFFF), Colors.transparent]))),
            ),
          ),
        ),
      ]),
    );
  }
}

Widget profileRow(User? user) {
  const gray = Color(0xFFE5E7EB);
  Widget bar(double w) => Container(width: w, height: 12,
      decoration: BoxDecoration(color: gray, borderRadius: BorderRadius.circular(6)));
  return AnimatedSwitcher( // 加载完成后淡入替换
    duration: const Duration(milliseconds: 300),
    child: user == null
        ? Semantics(key: const ValueKey('sk'), label: '加载中', child: Shimmer(child: Row(children: [
            const CircleAvatar(radius: 20, backgroundColor: gray),
            const SizedBox(width: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [bar(180), const SizedBox(height: 8), bar(110)]),
          ])))
        : Row(key: const ValueKey('ok'), children: [ // 与骨架同结构，替换时不跳动
            CircleAvatar(radius: 20, backgroundImage: NetworkImage(user.avatar)),
            const SizedBox(width: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(user.name), Text(user.bio)]),
          ]),
  );
}
```
