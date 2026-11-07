```swift
struct SettingsView: View {
    @State private var wifiOn = true

    var body: some View {
        Form {
            Toggle("Wi-Fi", isOn: $wifiOn)
        }
    }
}
```
