```swift
struct EmailField: View {
    @State private var email = ""
    @State private var error: String?
    @State private var shakes = 0
    @FocusState private var focused: Bool
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private var floating: Bool { focused || !email.isEmpty }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            ZStack(alignment: .leading) {
                // 浮动标签：获得焦点或有值时上移缩小
                Text("邮箱").foregroundStyle(.secondary)
                    .scaleEffect(floating ? 0.75 : 1, anchor: .leading)
                    .offset(y: floating ? -14 : 0)
                    .accessibilityHidden(true)
                HStack {
                    TextField("", text: $email)
                        .keyboardType(.emailAddress).textContentType(.emailAddress)
                        .textInputAutocapitalization(.never)
                        .focused($focused)
                        .accessibilityLabel("邮箱")
                    if !email.isEmpty {
                        Button { email = ""; error = nil } label: { Image(systemName: "xmark.circle.fill") }
                            .foregroundStyle(.secondary)
                            .accessibilityLabel("清除")
                    }
                }
                .padding(.top, 14)
            }
            .padding(.horizontal, 12).frame(height: 56)
            .overlay(RoundedRectangle(cornerRadius: 8).stroke(error == nil ? Color.secondary : .red))
            .modifier(Shake(progress: CGFloat(shakes)))
            .animation(reduceMotion ? nil : .easeOut(duration: 0.2), value: floating)

            if let error { Text(error).font(.footnote).foregroundStyle(.red) }
        }
        .onChange(of: focused) { isFocused in
            if !isFocused { validate() }
        }
    }

    private func validate() {
        let ok = email.isEmpty || email.range(of: #"^[^\s@]+@[^\s@]+\.[^\s@]+$"#, options: .regularExpression) != nil
        error = ok ? nil : "邮箱格式不对"
        guard !ok else { return }
        UIAccessibility.post(notification: .announcement, argument: "邮箱格式不对")
        if !reduceMotion { withAnimation(.linear(duration: 0.3)) { shakes += 1 } }
    }
}

// progress 每加 1，水平方向来回晃一次
struct Shake: GeometryEffect {
    var progress: CGFloat
    var animatableData: CGFloat { get { progress } set { progress = newValue } }
    func effectValue(size: CGSize) -> ProjectionTransform {
        ProjectionTransform(CGAffineTransform(translationX: 6 * sin(progress * .pi * 2), y: 0))
    }
}
```
