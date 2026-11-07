待校对：CheckboxGroup 的 onChange 回调参数 CheckboxGroupResult 和 SelectStatus 枚举按 API 9+ 写，未在真机上验证。

```ts
@Entry
@Component
struct NotifySettings {
  private names: string[] = ['邮件', '短信', '推送']
  @State theme: string = 'light'

  build() {
    Column({ space: 8 }) {
      // CheckboxGroup 与同 group 的 Checkbox 联动，子项部分勾选时自动显示半选
      Row() {
        CheckboxGroup({ group: 'notify' })
          .onChange((result: CheckboxGroupResult) => {
            // result.status 为 SelectStatus.All / Part / None
            console.info(`已选 ${result.name.length} 项`)
          })
        Text('全选')
      }

      ForEach(this.names, (name: string) => {
        Row() {
          Checkbox({ name: name, group: 'notify' })
            .select(name === '邮件')
          Text(name)
        }
        .margin({ left: 24 })
      }, (name: string) => name)

      // 同 group 的 Radio 互斥
      Row() {
        Radio({ value: 'light', group: 'theme' })
          .checked(this.theme === 'light')
          .onChange((isChecked: boolean) => { if (isChecked) this.theme = 'light' })
        Text('浅色')
        Radio({ value: 'dark', group: 'theme' })
          .checked(this.theme === 'dark')
          .onChange((isChecked: boolean) => { if (isChecked) this.theme = 'dark' })
        Text('深色')
      }
    }
    .padding(16)
  }
}
```
