```ts
@Entry
@Component
struct SubmitPage {
  @State loading: boolean = false

  build() {
    Button(this.loading ? '提交中…' : '提交')
      .enabled(!this.loading)
      .onClick(() => {
        this.loading = true
      })
  }
}
```
