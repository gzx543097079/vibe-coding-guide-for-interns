```swift
// iOS 没有原生复选框（.toggleStyle(.checkbox) 只在 macOS 可用），这里自己画
struct NotifySettings: View {
    private let names = ["邮件", "短信", "推送"]
    @State private var picked: Set<String> = ["邮件"]
    @State private var theme = "浅色"
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private var parentSymbol: String? { picked.isEmpty ? nil : picked.count == names.count ? "checkmark" : "minus" }

    var body: some View {
        Form {
            Section("通知方式") {
                row("全选", mark: CheckMark(symbol: parentSymbol)) {
                    picked = picked.count == names.count ? [] : Set(names)
                }
                .accessibilityValue(parentSymbol == "minus" ? "部分选中" : "")
                ForEach(names, id: \.self) { name in
                    row(name, mark: CheckMark(symbol: picked.contains(name) ? "checkmark" : nil)) {
                        if picked.contains(name) { picked.remove(name) } else { picked.insert(name) }
                    }
                    .accessibilityAddTraits(picked.contains(name) ? .isSelected : [])
                }
            }
            Section("主题") {
                ForEach(["浅色", "深色"], id: \.self) { t in
                    row(t, mark: RadioDot(on: theme == t)) { theme = t }
                        .accessibilityAddTraits(theme == t ? .isSelected : [])
                }
            }
        }
        .animation(reduceMotion ? nil : .easeOut(duration: 0.2), value: picked)
        .animation(reduceMotion ? nil : .easeOut(duration: 0.2), value: theme)
    }

    private func row(_ title: String, mark: some View, action: @escaping () -> Void) -> some View {
        Button(action: action) { HStack { mark; Text(title).foregroundStyle(.primary) } }
    }
}

struct CheckMark: View {
    let symbol: String? // nil 未选；checkmark 已选；minus 半选
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 4).stroke(.secondary, lineWidth: 2)
            Image(systemName: symbol ?? "checkmark").font(.caption.bold())
                .scaleEffect(symbol == nil ? 0.3 : 1).opacity(symbol == nil ? 0 : 1)
        }
        .frame(width: 20, height: 20)
    }
}
struct RadioDot: View {
    let on: Bool
    var body: some View {
        ZStack {
            Circle().stroke(.secondary, lineWidth: 2)
            Circle().fill(.tint).frame(width: 10, height: 10).scaleEffect(on ? 1 : 0)
        }
        .frame(width: 20, height: 20)
    }
}
```
