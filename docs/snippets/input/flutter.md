```dart
import 'dart:math';

class EmailField extends StatefulWidget {
  const EmailField({super.key});
  @override
  State<EmailField> createState() => _EmailFieldState();
}

class _EmailFieldState extends State<EmailField> with SingleTickerProviderStateMixin {
  final controller = TextEditingController();
  final focus = FocusNode();
  late final shake = AnimationController(vsync: this, duration: const Duration(milliseconds: 300));
  String? error;

  @override
  void initState() {
    super.initState();
    controller.addListener(() => setState(() {})); // 刷新清除按钮
    focus.addListener(() {
      if (focus.hasFocus) return;
      final text = controller.text;
      final ok = text.isEmpty || RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(text);
      setState(() => error = ok ? null : '邮箱格式不对');
      if (!ok && !MediaQuery.disableAnimationsOf(context)) shake.forward(from: 0);
    });
  }

  @override
  void dispose() { controller.dispose(); focus.dispose(); shake.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: shake,
      builder: (context, child) =>
          Transform.translate(offset: Offset(sin(shake.value * pi * 2) * 6, 0), child: child),
      child: TextField(
        controller: controller,
        focusNode: focus,
        keyboardType: TextInputType.emailAddress,
        decoration: InputDecoration(
          labelText: '邮箱', // 获得焦点或有值时自动上浮
          errorText: error, // 非 null 时边框变红并显示文案
          border: const OutlineInputBorder(),
          suffixIcon: controller.text.isEmpty
              ? null
              : IconButton(
                  icon: const Icon(Icons.clear),
                  tooltip: '清除',
                  onPressed: () {
                    controller.clear();
                    setState(() => error = null);
                  },
                ),
        ),
      ),
    );
  }
}
```
