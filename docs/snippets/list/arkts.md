```ts
// Refresh 与 ListItem.swipeAction 的参数以所用 API 版本文档为准（待校对）
@Entry
@Component
struct MessageList {
  @State items: string[] = ['构建通知', '代码审查', '导师']
  @State refreshing: boolean = false

  @Builder
  deleteButton(index: number) {
    Button('删除')
      .backgroundColor(Color.Red)
      .onClick(() => {
        this.items.splice(index, 1)
      })
  }

  build() {
    Refresh({ refreshing: $$this.refreshing }) {
      List() {
        ForEach(this.items, (item: string, index: number) => {
          ListItem() {
            Text(item).padding(16)
          }
          .swipeAction({ end: this.deleteButton(index) })
        }, (item: string) => item)
      }
    }
    .onRefreshing(() => {
      // 拉取数据完成后：
      this.refreshing = false
    })
  }
}
```
