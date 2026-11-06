待校对：Search 组件自带的清除按钮样式随 API 版本不同；Span 嵌在 Text 内做加粗的写法待真机验证。

```ts
@Entry
@Component
struct SearchPage {
  private words: string[] = ['苹果', '苹果手机', '苹果电脑', '香蕉', '橙子']
  private recent: string[] = ['耳机', '充电器']
  private timer: number = -1
  @State query: string = ''
  @State results: string[] = this.recent

  // 防抖 150ms
  onInput(value: string) {
    this.query = value
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      const q = value.trim()
      this.results = q ? this.words.filter((w: string) => w.includes(q)) : this.recent
    }, 150)
  }

  build() {
    Column() {
      Search({ value: this.query, placeholder: '搜索' })
        .onChange((value: string) => this.onInput(value))
        .onSubmit((value: string) => this.onInput(value))
      if (!this.query && this.results.length > 0) {
        Text('最近搜索').fontSize(13).fontColor('#888')
      }
      if (this.query && this.results.length === 0) {
        Text(`没有找到「${this.query}」相关结果`).margin(24)
      }
      List() {
        ForEach(this.results, (w: string) => {
          ListItem() {
            // 匹配部分加粗
            Text() {
              Span(this.query && w.includes(this.query) ? w.slice(0, w.indexOf(this.query)) : w)
              Span(this.query && w.includes(this.query) ? this.query : '').fontWeight(FontWeight.Bold)
              Span(this.query && w.includes(this.query) ? w.slice(w.indexOf(this.query) + this.query.length) : '')
            }
            .padding(12)
          }
          .onClick(() => this.onInput(w))
        }, (w: string) => w)
      }
    }
  }
}
```
