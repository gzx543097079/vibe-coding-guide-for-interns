```swift
struct SubmitButton: View {
    @State private var isLoading = false

    var body: some View {
        Button {
            isLoading = true
        } label: {
            if isLoading {
                ProgressView()
            } else {
                Text("提交")
            }
        }
        .buttonStyle(.borderedProminent)
        .disabled(isLoading)
    }
}
```
