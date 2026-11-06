```dart
class SubmitButton extends StatefulWidget {
  const SubmitButton({super.key});

  @override
  State<SubmitButton> createState() => _SubmitButtonState();
}

class _SubmitButtonState extends State<SubmitButton> {
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      // onPressed 为 null 时按钮自动变为禁用
      onPressed: _loading ? null : () => setState(() => _loading = true),
      child: _loading
          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
          : const Text('提交'),
    );
  }
}
```
