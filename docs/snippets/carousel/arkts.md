待校对：Swiper 的 indicator 传 DotIndicator 的写法与 selectedItemWidth 属性按 API 10+ 编写，旧版本待核实；减少动态效果没有找到确定的系统接口，未处理。

```ts
@Entry
@Component
struct BannerPage {
  private banners: string[] = ['新品上架', '限时优惠', '会员专享']
  private controller: SwiperController = new SwiperController()
  @State current: number = 0

  build() {
    Column() {
      Swiper(this.controller) {
        ForEach(this.banners, (item: string) => {
          Text(item)
            .width('100%')
            .height(180)
            .textAlign(TextAlign.Center)
            .backgroundColor('#e8f0fe')
        }, (item: string) => item)
      }
      .index(this.current)
      .autoPlay(true)      // 自动播放
      .interval(4000)      // 间隔 4 秒
      .loop(true)
      .indicator(new DotIndicator().selectedItemWidth(20)) // 当前点拉长
      .onChange((index: number) => {
        this.current = index
      })

      Row({ space: 16 }) {
        Button('上一张').onClick(() => this.controller.showPrevious())
        Button('下一张').onClick(() => this.controller.showNext())
      }
      .margin({ top: 12 })
    }
  }
}
```
