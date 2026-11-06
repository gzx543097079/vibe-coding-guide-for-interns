待校对：用 onAppear 里 animateTo + iterations: -1 驱动无限光泽、以及 transition(TransitionEffect.OPACITY) 的写法未在真机验证，新版本 SDK 推荐用 this.getUIContext().animateTo。

```ts
@Component
struct SkeletonBlock {
  @Prop w: Length = 0
  @Prop h: Length = 12
  @Prop radius: number = 6
  @State offsetX: number = -200

  build() {
    Stack() {
      // 光泽层：平移渐变
      Column()
        .width('100%').height('100%')
        .linearGradient({ angle: 90, colors: [['#00FFFFFF', 0], ['#99FFFFFF', 0.5], ['#00FFFFFF', 1]] })
        .translate({ x: this.offsetX })
    }
    .width(this.w).height(this.h).borderRadius(this.radius)
    .backgroundColor('#E5E7EB').clip(true)
    .onAppear(() => {
      animateTo({ duration: 1400, curve: Curve.Linear, iterations: -1 }, () => { this.offsetX = 200 })
    })
  }
}

@Entry
@Component
struct ProfilePage {
  @State loading: boolean = true

  aboutToAppear() {
    setTimeout(() => animateTo({ duration: 300 }, () => { this.loading = false }), 1500) // 模拟请求
  }

  build() {
    Column() {
      if (this.loading) {
        Row({ space: 12 }) {
          SkeletonBlock({ w: 40, h: 40, radius: 20 })
          Column({ space: 8 }) {
            SkeletonBlock({ w: 180 })
            SkeletonBlock({ w: 110 })
          }.alignItems(HorizontalAlign.Start)
        }
        .accessibilityText('加载中')
      } else {
        Row({ space: 12 }) {
          Image($r('app.media.avatar')).width(40).height(40).borderRadius(20)
          Column() { Text('小鱼').fontWeight(FontWeight.Bold); Text('写代码的') }
            .alignItems(HorizontalAlign.Start)
        }
        .transition(TransitionEffect.OPACITY) // 内容淡入
      }
    }
    .padding(16)
  }
}
```
