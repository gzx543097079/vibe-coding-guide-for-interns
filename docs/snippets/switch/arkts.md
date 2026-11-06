```ts
@Entry
@Component
struct SettingsPage {
  @State wifiOn: boolean = true

  build() {
    Row() {
      Text('Wi-Fi').layoutWeight(1)
      Toggle({ type: ToggleType.Switch, isOn: this.wifiOn })
        .onChange((isOn: boolean) => {
          this.wifiOn = isOn
        })
    }
    .padding(16)
  }
}
```
