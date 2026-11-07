待校对：线性 Progress 没有找到确定的「不确定进度」模式，这里用 LoadingProgress 代替；Ring 类型的 style 参数随 API 版本变化，待核实。

```ts
@Entry
@Component
struct ProgressDemo {
  @State value: number = 40

  build() {
    Column({ space: 24 }) {
      // 确定进度的线性进度条
      Progress({ value: this.value, total: 100, type: ProgressType.Linear })
        .width('100%')
        .accessibilityText('上传进度')

      // 环形进度（确定）
      Progress({ value: this.value, total: 100, type: ProgressType.Ring })
        .width(48)
        .style({ strokeWidth: 4 })
        .accessibilityText('同步进度')

      // 旋转加载指示器
      LoadingProgress()
        .width(32).height(32)
        .accessibilityText('加载中')

      Button('+10').onClick(() => {
        animateTo({ duration: 300 }, () => {
          this.value = Math.min(100, this.value + 10)
        })
      })
    }
    .padding(16)
  }
}
```
