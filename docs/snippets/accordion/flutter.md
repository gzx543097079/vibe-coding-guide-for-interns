```dart
class AccordionDemo extends StatelessWidget {
  const AccordionDemo({super.key});

  static const sections = [
    ('配送说明', '下单后 48 小时内发货。'),
    ('退换政策', '7 天无理由退换。'),
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      // radio 版本：一次只展开一个；箭头（ExpandIcon）由系统旋转 180°
      child: ExpansionPanelList.radio(
        initialOpenPanelValue: 0,
        children: [
          for (var i = 0; i < sections.length; i++)
            ExpansionPanelRadio(
              value: i,
              canTapOnHeader: true,
              headerBuilder: (context, isExpanded) => ListTile(title: Text(sections[i].$1)),
              body: Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                child: Text(sections[i].$2),
              ),
            ),
        ],
      ),
    );
  }
}

// 允许同时展开多个：每组用一个 ExpansionTile，各自管理展开状态
// ExpansionTile(title: Text('配送说明'), children: [Text('下单后 48 小时内发货。')])
```
