```dart
class OrdersPage extends StatefulWidget {
  const OrdersPage({super.key});
  @override
  State<OrdersPage> createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage> with SingleTickerProviderStateMixin {
  static const titles = ['全部', '待付款', '待发货', '已完成'];
  late final controller = TabController(length: titles.length, vsync: this)
    ..addListener(() => setState(() {}));

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reduce = MediaQuery.disableAnimationsOf(context);
    return Column(children: [
      // TabBar 的下划线指示器自带滑动动画，标签带 tab 语义
      TabBar(controller: controller, tabs: [for (final t in titles) Tab(text: t)]),
      // 不用 TabBarView 的左右滑动，换成淡入
      Expanded(
        child: AnimatedSwitcher(
          duration: reduce ? Duration.zero : const Duration(milliseconds: 200),
          child: Center(
            key: ValueKey(controller.index),
            child: Text('${titles[controller.index]}订单'),
          ),
        ),
      ),
    ]);
  }
}
```
