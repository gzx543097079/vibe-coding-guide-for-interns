```dart
class CitySelect extends StatefulWidget {
  const CitySelect({super.key});
  @override
  State<CitySelect> createState() => _CitySelectState();
}

class _CitySelectState extends State<CitySelect> {
  static const cities = ['北京', '上海', '广州', '深圳'];
  static const disabled = {'广州'};
  String city = '北京';

  @override
  Widget build(BuildContext context) {
    // DropdownMenu（Material 3）自带方向键、回车选择和 Esc 关闭；
    // 箭头是展开 / 收起两个图标切换，不是旋转
    return DropdownMenu<String>(
      initialSelection: city,
      label: const Text('城市'),
      onSelected: (v) {
        if (v != null) setState(() => city = v);
      },
      dropdownMenuEntries: [
        for (final c in cities)
          DropdownMenuEntry(
            value: c,
            label: c,
            enabled: !disabled.contains(c),
            trailingIcon: c == city ? const Icon(Icons.check) : null,
          ),
      ],
    );
  }
}
```
