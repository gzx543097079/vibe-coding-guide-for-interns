```swift
final class CitySelectViewController: UIViewController {
    private let cities = ["北京", "上海", "广州", "深圳"]
    private let disabled: Set<String> = ["广州"]
    private var selected = "北京"
    private let button = UIButton(configuration: .bordered())

    override func viewDidLoad() {
        super.viewDidLoad()
        button.configuration?.image = UIImage(systemName: "chevron.up.chevron.down")
        button.configuration?.imagePlacement = .trailing
        button.configuration?.imagePadding = 6
        button.showsMenuAsPrimaryAction = true // 点一下直接弹出菜单
        button.changesSelectionAsPrimaryAction = true // iOS 15+：当前项带对勾，按钮标题跟随选中项
        button.menu = makeMenu()
        button.accessibilityLabel = "城市"
        view.addSubview(button) // 约束省略
    }

    private func makeMenu() -> UIMenu {
        let actions = cities.map { city in
            UIAction(
                title: city,
                attributes: disabled.contains(city) ? .disabled : [],
                state: city == selected ? .on : .off
            ) { [weak self] action in
                self?.selected = action.title
            }
        }
        return UIMenu(title: "城市", children: actions)
    }
}
```
