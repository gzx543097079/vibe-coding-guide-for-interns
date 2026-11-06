待校对：全局 promptAction 和 animateTo 在新版本 SDK 里推荐改用 this.getUIContext() 上的同名方法，Snackbar 部分是自绘，未在真机验证。

```ts
import { promptAction } from '@kit.ArkUI'

@Entry
@Component
struct ToastDemo {
  @State snackText: string = ''
  @State snackShown: boolean = false
  private timer: number = -1

  showSnackbar(text: string) {
    this.snackText = text // 新消息替换旧消息
    clearTimeout(this.timer)
    animateTo({ duration: 250 }, () => { this.snackShown = true })
    this.timer = setTimeout(() => {
      animateTo({ duration: 250 }, () => { this.snackShown = false })
    }, 4000)
  }

  build() {
    Stack({ alignContent: Alignment.Bottom }) {
      Column({ space: 12 }) {
        // 轻提示用系统 Toast
        Button('复制链接').onClick(() => {
          promptAction.showToast({ message: '已复制', duration: 2000 })
        })
        Button('删除').onClick(() => this.showSnackbar('已删除 1 条'))
      }
      .width('100%').height('100%').justifyContent(FlexAlign.Center)

      // 系统没有 Snackbar，自己画一条，从底部平移进入
      Row() {
        Text(this.snackText).fontColor(Color.White).layoutWeight(1)
        Button('撤销')
          .backgroundColor(Color.Transparent).fontColor('#8AB4F8')
          .onClick(() => {
            // 恢复
            clearTimeout(this.timer)
            this.snackShown = false
          })
      }
      .width('92%').padding(12).margin({ bottom: 16 })
      .borderRadius(8).backgroundColor('#323232')
      .translate({ y: this.snackShown ? 0 : 120 })
      .opacity(this.snackShown ? 1 : 0)
    }
    .width('100%').height('100%')
  }
}
```
