```swift
struct FAQ: Identifiable {
    let id: Int
    let title: String
    let body: String
}

struct AccordionView: View {
    let items: [FAQ]
    @State private var expanded: Int? = 0 // 只存一个 id：一次只展开一个
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        List(items) { item in
            // DisclosureGroup 自带按钮语义和展开状态播报；系统箭头旋转 90°
            DisclosureGroup(isExpanded: binding(for: item.id)) {
                Text(item.body)
            } label: {
                Text(item.title)
            }
        }
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.2), value: expanded)
    }

    private func binding(for id: Int) -> Binding<Bool> {
        Binding(
            get: { expanded == id },
            set: { expanded = $0 ? id : nil }
        )
    }
}

// 允许同时展开多个：把 expanded 换成 Set<Int>，get 用 contains，set 里 insert / remove
// 想要 180° 的自定义箭头：iOS 16+ 可实现 DisclosureGroupStyle，在 label 旁放 chevron 并 rotationEffect
```
