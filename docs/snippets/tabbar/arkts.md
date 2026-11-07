```ts
@Entry
@Component
struct RootPage {
  build() {
    Tabs({ barPosition: BarPosition.End }) {
      TabContent() {
        Text('首页内容')
      }
      .tabBar('首页')

      TabContent() {
        Text('我的内容')
      }
      .tabBar('我的')
    }
  }
}
```
