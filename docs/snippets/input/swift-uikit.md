```swift
final class EmailFieldView: UIView, UITextFieldDelegate {
    let field = UITextField()
    private let floatLabel = UILabel()
    private let errorLabel = UILabel()

    override init(frame: CGRect) {
        super.init(frame: frame)
        floatLabel.text = "邮箱"
        floatLabel.textColor = .secondaryLabel
        floatLabel.isAccessibilityElement = false
        field.accessibilityLabel = "邮箱"
        field.keyboardType = .emailAddress
        field.textContentType = .emailAddress
        field.autocapitalizationType = .none
        field.clearButtonMode = .always // 有值就显示系统清除按钮
        field.delegate = self
        field.layer.borderWidth = 1
        field.layer.cornerRadius = 8
        field.layer.borderColor = UIColor.separator.cgColor
        errorLabel.textColor = .systemRed
        errorLabel.font = .preferredFont(forTextStyle: .footnote)
        field.addTarget(self, action: #selector(updateLabel), for: [.editingDidBegin, .editingChanged, .editingDidEnd])
        field.addTarget(self, action: #selector(validate), for: .editingDidEnd)
        [field, floatLabel, errorLabel].forEach(addSubview(_:)) // 约束省略；floatLabel 叠在 field 左侧
    }

    required init?(coder: NSCoder) { fatalError() }

    @objc private func updateLabel() {
        let up = field.isEditing || !(field.text ?? "").isEmpty
        let t = up ? CGAffineTransform(translationX: 0, y: -14).scaledBy(x: 0.75, y: 0.75) : .identity
        UIView.animate(withDuration: UIAccessibility.isReduceMotionEnabled ? 0 : 0.2) { self.floatLabel.transform = t }
    }

    @objc private func validate() {
        let text = field.text ?? ""
        let ok = text.isEmpty || text.range(of: #"^[^\s@]+@[^\s@]+\.[^\s@]+$"#, options: .regularExpression) != nil
        setError(ok ? nil : "邮箱格式不对")
        guard !ok, !UIAccessibility.isReduceMotionEnabled else { return }
        let shake = CAKeyframeAnimation(keyPath: "transform.translation.x")
        shake.values = [0, -6, 6, -3, 0]
        shake.duration = 0.3
        field.layer.add(shake, forKey: "shake")
    }

    private func setError(_ message: String?) {
        errorLabel.text = message
        field.layer.borderColor = (message == nil ? UIColor.separator : UIColor.systemRed).cgColor
        if let message { UIAccessibility.post(notification: .announcement, argument: message) }
    }

    // 点系统清除按钮不会触发 editingChanged，这里手动复位
    func textFieldShouldClear(_ textField: UITextField) -> Bool {
        setError(nil)
        DispatchQueue.main.async { self.updateLabel() }
        return true
    }
}
```
