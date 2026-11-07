```dart
import 'dart:math';

class LikeButton extends StatefulWidget {
  const LikeButton({super.key, this.initial = 0});
  final int initial;

  @override
  State<LikeButton> createState() => _LikeButtonState();
}

class _LikeButtonState extends State<LikeButton> with TickerProviderStateMixin {
  late final _scale = AnimationController(vsync: this, duration: const Duration(milliseconds: 450));
  late final _burst = AnimationController(vsync: this, duration: const Duration(milliseconds: 500));
  // 先缩小到 0.7，再回弹到 1.2，最后回到 1
  late final _heart = TweenSequence([
    TweenSequenceItem(tween: Tween(begin: 1.0, end: 0.7), weight: 30),
    TweenSequenceItem(tween: Tween(begin: 0.7, end: 1.2), weight: 40),
    TweenSequenceItem(tween: Tween(begin: 1.2, end: 1.0), weight: 30),
  ]).animate(_scale);
  bool _liked = false;
  late int _count = widget.initial;
  void _toggle() {
    setState(() { _liked = !_liked; _count += _liked ? 1 : -1; });
    if (MediaQuery.of(context).disableAnimations) return; // 只切换颜色
    _scale.forward(from: 0); // 取消点赞也回弹，但不爆发
    if (_liked) _burst.forward(from: 0);
  }

  @override
  void dispose() { _scale.dispose(); _burst.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true, toggled: _liked, label: '赞', value: '$_count',
      child: InkWell(onTap: _toggle, child: Row(mainAxisSize: MainAxisSize.min, children: [
        Stack(alignment: Alignment.center, children: [
          // 8 个小圆点向外飞散并淡出
          for (var i = 0; i < 8; i++)
            AnimatedBuilder(animation: _burst, builder: (_, __) {
              final t = _burst.value, a = i * pi / 4;
              return Transform.translate(
                offset: Offset(22 * t * sin(a), -22 * t * cos(a)),
                child: Opacity(opacity: _burst.isAnimating ? 1 - t : 0,
                  child: const CircleAvatar(radius: 2.5, backgroundColor: Colors.red)),
              );
            }),
          ScaleTransition(scale: _heart,
            child: Icon(_liked ? Icons.favorite : Icons.favorite_border, color: _liked ? Colors.red : Colors.grey)),
        ]),
        // 数字向上滚动切换
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 250),
          transitionBuilder: (child, anim) => SlideTransition(
            position: Tween(begin: const Offset(0, 1), end: Offset.zero).animate(anim), child: child),
          child: Text('$_count', key: ValueKey(_count)),
        ),
      ])),
    );
  }
}
```
