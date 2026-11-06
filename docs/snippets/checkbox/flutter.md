待校对：Flutter 3.32 起 Radio / RadioListTile 的 groupValue、onChanged 被标为弃用，改由 RadioGroup 统一管理，版本待核实；这里按旧写法。

```dart
class NotifySettings extends StatefulWidget {
  const NotifySettings({super.key});
  @override
  State<NotifySettings> createState() => _NotifySettingsState();
}

class _NotifySettingsState extends State<NotifySettings> {
  final names = ['邮件', '短信', '推送'];
  final picked = [true, false, false];
  String theme = 'light';

  // tristate 下 value 为 null 表示半选
  bool? get allValue =>
      picked.every((v) => v) ? true : (picked.any((v) => v) ? null : false);

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      CheckboxListTile(
        tristate: true,
        value: allValue,
        title: const Text('全选'),
        onChanged: (_) => setState(() {
          final target = allValue != true;
          picked.fillRange(0, picked.length, target);
        }),
      ),
      for (var i = 0; i < names.length; i++)
        CheckboxListTile(
          contentPadding: const EdgeInsets.only(left: 40, right: 16),
          value: picked[i],
          title: Text(names[i]),
          onChanged: (v) => setState(() => picked[i] = v ?? false),
        ),
      for (final t in const ['light', 'dark'])
        RadioListTile<String>(
          value: t,
          groupValue: theme,
          title: Text(t == 'light' ? '浅色' : '深色'),
          onChanged: (v) => setState(() => theme = v!),
        ),
    ]);
  }
}
```
