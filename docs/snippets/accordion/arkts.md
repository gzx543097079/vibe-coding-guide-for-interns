待校对：accessibilityText 等无障碍属性需 API 10+，读屏是否会播报展开状态待核实；新版本 SDK 推荐用 this.getUIContext().animateTo。

```ts
interface Section { title: string; body: string }

@Entry
@Component
struct AccordionPage {
  private sections: Section[] = [
    { title: '配送说明', body: '下单后 48 小时内发货。' },
    { title: '退换政策', body: '7 天无理由退换。' },
  ]
  private single: boolean = true // 一次只展开一个
  @State expanded: number[] = [0]

  toggle(i: number) {
    animateTo({ duration: 200 }, () => {
      if (this.expanded.includes(i)) {
        this.expanded = this.expanded.filter((x) => x !== i)
      } else {
        this.expanded = this.single ? [i] : this.expanded.concat([i])
      }
    })
  }

  build() {
    Column() {
      ForEach(this.sections, (s: Section, i: number) => {
        Column() {
          Row() {
            Text(s.title).layoutWeight(1)
            Text('▾')
              .rotate({ angle: this.expanded.includes(i) ? 180 : 0 })
          }
          .width('100%').padding(16)
          .onClick(() => this.toggle(i))
          .accessibilityText(`${s.title}，${this.expanded.includes(i) ? '已展开' : '已收起'}`)

          if (this.expanded.includes(i)) {
            Text(s.body).padding({ left: 16, right: 16, bottom: 16 })
              .transition(TransitionEffect.OPACITY)
          }
        }
      }, (s: Section) => s.title)
    }
  }
}
```
