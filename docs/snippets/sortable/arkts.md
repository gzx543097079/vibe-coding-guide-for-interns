待校对：ForEach 的 onMove 拖拽排序按 API 12 编写，旧版本需改用 List 的 onItemDragStart / onItemDrop；长按触发拖动、浮起样式由系统提供，能否限定只从手柄拖动待核实。

```ts
@Entry
@Component
struct SortablePage {
  @State tabs: string[] = ['首页', '消息', '发现', '我的']

  build() {
    List() {
      ForEach(this.tabs, (tab: string) => {
        ListItem() {
          Row({ space: 12 }) {
            Text('⠿').fontColor('#999')
            Text(tab).layoutWeight(1)
          }
          .height(56)
          .padding({ left: 16, right: 16 })
          .backgroundColor(Color.White)
        }
      }, (tab: string) => tab)
        // 长按拖动，松手后在回调里同步数据
        .onMove((from: number, to: number) => {
          const moved: string[] = this.tabs.splice(from, 1)
          this.tabs.splice(to, 0, moved[0])
        })
    }
    .divider({ strokeWidth: 1, color: '#eee' })
  }
}
```
