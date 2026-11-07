```dart
class ProgressDemo extends StatelessWidget {
  const ProgressDemo({super.key, required this.progress});
  final double progress; // 0.0 ~ 1.0

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(children: [
        // 确定进度：TweenAnimationBuilder 让进度平滑变化
        TweenAnimationBuilder<double>(
          tween: Tween(end: progress),
          duration: const Duration(milliseconds: 300),
          builder: (_, v, __) => LinearProgressIndicator(
            value: v,
            semanticsLabel: '上传进度',
            semanticsValue: '${(v * 100).round()}%',
          ),
        ),
        const SizedBox(height: 24),
        // 不确定进度：value 不传
        const LinearProgressIndicator(semanticsLabel: '正在加载'),
        const SizedBox(height: 24),
        Row(children: [
          // 环形进度（确定）
          CircularProgressIndicator(value: progress, semanticsLabel: '同步进度'),
          const SizedBox(width: 24),
          // 旋转加载指示器
          const CircularProgressIndicator(semanticsLabel: '加载中'),
        ]),
      ]),
    );
  }
}
```
