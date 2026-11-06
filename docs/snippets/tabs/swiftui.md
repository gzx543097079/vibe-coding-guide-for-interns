```swift
enum OrderTab: String, CaseIterable, Identifiable {
    case all = "全部", pay = "待付款", ship = "待发货", done = "已完成"
    var id: Self { self }
}

struct OrdersView: View {
    @State private var tab: OrderTab = .all
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        VStack {
            // 分段控件自带滑块动画、读屏语义和外接键盘支持
            Picker("订单状态", selection: $tab) {
                ForEach(OrderTab.allCases) { Text($0.rawValue).tag($0) }
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)

            OrderList(status: tab)
                .id(tab) // 换 id 让视图重建，配合 transition 淡入
                .transition(.opacity)
        }
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.2), value: tab)
    }
}

struct OrderList: View {
    let status: OrderTab
    var body: some View {
        Text("\(status.rawValue)订单")
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
```
