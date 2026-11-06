```swift
struct CitySelect: View {
    private let cities = ["北京", "上海", "广州", "深圳"]
    private let disabled: Set<String> = ["广州"]
    @State private var city = "北京"

    var body: some View {
        // Menu 弹出系统菜单，键盘、读屏、点外部关闭都由系统处理
        // 拿不到菜单开合状态，箭头不做旋转，用上下双箭头图标
        Menu {
            ForEach(cities, id: \.self) { c in
                Button { city = c } label: {
                    if c == city {
                        Label(c, systemImage: "checkmark")
                    } else {
                        Text(c)
                    }
                }
                .disabled(disabled.contains(c))
            }
        } label: {
            HStack {
                Text(city)
                Image(systemName: "chevron.up.chevron.down")
            }
        }
        .accessibilityLabel("城市")
        .accessibilityValue(city)
    }
}

// 不需要禁用项时可以直接用 Picker，当前项自带对勾：
// Picker("城市", selection: $city) { ForEach(cities, id: \.self) { Text($0) } }
//     .pickerStyle(.menu)
```
