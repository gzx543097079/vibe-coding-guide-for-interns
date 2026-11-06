待校对：Tabs 内用 ForEach 生成 TabContent、SubTabBarStyle.of 的写法按 API 9+ 写，未在真机上验证；Tabs 切换是左右滑动，不是淡入。

```ts
@Entry
@Component
struct OrdersPage {
  private titles: string[] = ['全部', '待付款', '待发货', '已完成']
  @State current: number = 0

  build() {
    Tabs({ barPosition: BarPosition.Start, index: this.current }) {
      ForEach(this.titles, (title: string) => {
        TabContent() {
          Column() {
            Text(`${title}订单`).fontSize(16)
          }
          .width('100%')
          .height('100%')
          .padding(16)
        }
        // 子页签样式：选中项带下划线指示器，切换时指示器滑动
        .tabBar(SubTabBarStyle.of(title))
      }, (title: string) => title)
    }
    .barMode(BarMode.Fixed)
    .animationDuration(250)
    .onChange((index: number) => {
      this.current = index
    })
  }
}
```
