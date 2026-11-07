```dart
class Carousel extends StatefulWidget {
  const Carousel({super.key, required this.banners});
  final List<String> banners;

  @override
  State<Carousel> createState() => _CarouselState();
}

class _CarouselState extends State<Carousel> {
  final _controller = PageController();
  Timer? _timer;
  int _index = 0;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _timer?.cancel();
    // 系统关闭动画时不自动播放
    if (MediaQuery.of(context).disableAnimations || widget.banners.length < 2) return;
    _timer = Timer.periodic(const Duration(seconds: 4), (_) {
      _controller.animateToPage((_index + 1) % widget.banners.length,
          duration: const Duration(milliseconds: 400), curve: Curves.easeOut);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(alignment: Alignment.bottomCenter, children: [
      SizedBox(
        height: 180,
        child: PageView.builder(
          controller: _controller,
          itemCount: widget.banners.length,
          onPageChanged: (i) => setState(() => _index = i),
          itemBuilder: (_, i) => Center(child: Text(widget.banners[i])),
        ),
      ),
      // 圆点指示器，当前点拉长
      Row(mainAxisSize: MainAxisSize.min, children: [
        for (var i = 0; i < widget.banners.length; i++)
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            margin: const EdgeInsets.all(3),
            width: i == _index ? 20 : 8,
            height: 8,
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(4)),
          ),
      ]),
    ]);
  }
}
```
