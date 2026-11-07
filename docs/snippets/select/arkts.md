待校对：Select 组件没有单项禁用属性（待核实），这里在 onSelect 里拦截并提示；拦截后组件显示的文字是否会回退未验证。

```ts
import promptAction from '@ohos.promptAction'

@Entry
@Component
struct CitySelect {
  private options: SelectOption[] = [
    { value: '北京' }, { value: '上海' }, { value: '广州（暂未开通）' }, { value: '深圳' },
  ]
  private disabled: number[] = [2]
  @State index: number = 0

  build() {
    Column({ space: 8 }) {
      Text('城市')
      // 系统下拉菜单，当前项高亮，箭头由组件自带
      Select(this.options)
        .selected(this.index)
        .value(this.options[this.index].value)
        .onSelect((index: number) => {
          if (this.disabled.includes(index)) {
            promptAction.showToast({ message: '暂未开通' })
            return
          }
          this.index = index
        })
    }
    .padding(16)
  }
}
```
