待校对：浮动标签用 Stack 叠 Text 自己写，scale 的 centerX/centerY 取值和 animateTo 的 playMode 往返效果未在真机验证；没用 TextInput 的 showError / cancelButton，它们的起始 API 版本待核实。

```ts
@Entry
@Component
struct EmailField {
  @State email: string = ''
  @State focused: boolean = false
  @State error: string = ''
  @State shakeX: number = 0

  isFloating(): boolean {
    return this.focused || this.email.length > 0
  }

  validate() {
    const ok = this.email.length === 0 || new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$').test(this.email)
    this.error = ok ? '' : '邮箱格式不对'
    if (!ok) {
      // 往返 4 次；结束后复位为 0，下次赋值才会再触发
      animateTo({ duration: 75, iterations: 4, playMode: PlayMode.Alternate, onFinish: () => { this.shakeX = 0 } }, () => { this.shakeX = 6 })
    }
  }

  build() {
    Column({ space: 4 }) {
      Stack({ alignContent: Alignment.TopStart }) {
        Row() {
          TextInput({ text: this.email })
            .type(InputType.Email)
            .layoutWeight(1)
            .backgroundColor(Color.Transparent)
            .padding({ top: 18, left: 12 })
            .onChange((value: string) => { this.email = value })
            .onFocus(() => { this.focused = true })
            .onBlur(() => { this.focused = false; this.validate() })
          if (this.email.length > 0) {
            Button('×').type(ButtonType.Circle).width(28).height(28).margin({ right: 8 })
              .accessibilityText('清除')
              .onClick(() => { this.email = ''; this.error = '' })
          }
        }
        .height(56)
        .borderRadius(8)
        .border({ width: 1, color: this.error.length > 0 ? Color.Red : '#8a919c' })

        Text('邮箱')
          .fontColor('#5f6368')
          .margin({ left: 12, top: 18 })
          .hitTestBehavior(HitTestMode.None)
          .translate({ y: this.isFloating() ? -12 : 0 })
          .scale({ x: this.isFloating() ? 0.75 : 1, y: this.isFloating() ? 0.75 : 1, centerX: 0, centerY: 0 })
          .animation({ duration: 200 })
      }
      .translate({ x: this.shakeX })

      if (this.error.length > 0) {
        Text(this.error).fontColor(Color.Red).fontSize(13)
      }
    }
    .padding(16)
  }
}
```
