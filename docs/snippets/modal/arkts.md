```ts
// bindSheet 需要 API 10 及以上（待校对）
@Entry
@Component
struct SharePage {
  @State showSheet: boolean = false

  @Builder
  sheetContent() {
    Column() {
      Text('复制链接').padding(24)
    }
  }

  build() {
    Button('分享')
      .onClick(() => {
        this.showSheet = true
      })
      .bindSheet($$this.showSheet, this.sheetContent(), {
        height: SheetSize.MEDIUM,
        dragBar: true,
      })
  }
}
```
