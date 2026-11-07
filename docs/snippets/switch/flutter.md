```dart
class WifiTile extends StatefulWidget {
  const WifiTile({super.key});

  @override
  State<WifiTile> createState() => _WifiTileState();
}

class _WifiTileState extends State<WifiTile> {
  bool _wifiOn = true;

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      title: const Text('Wi-Fi'),
      value: _wifiOn,
      onChanged: (value) => setState(() => _wifiOn = value),
    );
  }
}
```
