```swift
import SwiftUI

// iOS 没有系统 Toast，用 overlay 自己画
struct ToastDemo: View {
    @State private var toast: String?
    @State private var snack: String?
    @State private var toastTask: Task<Void, Never>?
    @State private var snackTask: Task<Void, Never>?
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        VStack(spacing: 16) {
            Button("复制链接") { show(toast: "已复制") }
            Button("删除") { show(snack: "已删除 1 条") }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .overlay(alignment: .bottom) {
            VStack(spacing: 12) {
                if let toast {
                    Text(toast).padding(.horizontal, 16).padding(.vertical, 8)
                        .background(.black.opacity(0.8), in: Capsule()).foregroundStyle(.white)
                        .transition(reduceMotion ? .opacity : .opacity.combined(with: .offset(y: 8)))
                }
                if let snack {
                    HStack {
                        Text(snack)
                        Spacer()
                        Button("撤销") { /* 恢复 */ withAnimation { self.snack = nil } }
                    }
                    .padding().background(Color(white: 0.2), in: RoundedRectangle(cornerRadius: 8))
                    .foregroundStyle(.white)
                    .transition(reduceMotion ? .opacity : .move(edge: .bottom))
                }
            }
            .padding()
        }
    }

    private func show(toast text: String) {
        withAnimation(.easeOut(duration: 0.2)) { toast = text }
        UIAccessibility.post(notification: .announcement, argument: text) // 读屏播报
        toastTask?.cancel()
        toastTask = Task {
            try? await Task.sleep(nanoseconds: 2_000_000_000)
            guard !Task.isCancelled else { return }
            withAnimation { toast = nil }
        }
    }

    private func show(snack text: String) {
        withAnimation(.easeOut(duration: 0.25)) { snack = text } // 新消息替换旧消息
        UIAccessibility.post(notification: .announcement, argument: text)
        snackTask?.cancel()
        snackTask = Task {
            try? await Task.sleep(nanoseconds: 4_000_000_000)
            guard !Task.isCancelled else { return }
            withAnimation { snack = nil }
        }
    }
}
```
