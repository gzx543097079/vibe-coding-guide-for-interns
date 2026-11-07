待校对：animateTo 嵌套 onFinish 串联两段动画的写法、Text 数字切换用 transition 的效果待真机验证；ArkUI 减少动态效果的系统接口待核实，未处理。

```ts
@Component
export struct LikeButton {
  @State liked: boolean = false
  @State count: number = 128
  @State heartScale: number = 1
  @State burst: number = 1 // 0→1 为爆发进度
  private dots: number[] = [0, 1, 2, 3, 4, 5, 6, 7]

  toggle() {
    this.liked = !this.liked
    this.count += this.liked ? 1 : -1
    // 先缩小，再弹簧回弹；取消点赞只做这一步
    animateTo({ duration: 100, onFinish: () => {
      animateTo({ curve: curves.springMotion(0.35, 0.45) }, () => { this.heartScale = 1 })
    } }, () => { this.heartScale = 0.7 })
    if (this.liked) {
      this.burst = 0
      animateTo({ duration: 500, curve: Curve.EaseOut }, () => { this.burst = 1 })
    }
  }

  build() {
    Row({ space: 6 }) {
      Stack() {
        // 8 个小圆点向外飞散并淡出
        ForEach(this.dots, (i: number) => {
          Circle({ width: 5, height: 5 })
            .fill(Color.Red)
            .translate({ x: 22 * this.burst * Math.sin(i * Math.PI / 4), y: -22 * this.burst * Math.cos(i * Math.PI / 4) })
            .opacity(1 - this.burst)
        }, (i: number) => i.toString())
        Image(this.liked ? $r('app.media.heart_filled') : $r('app.media.heart'))
          .width(24)
          .fillColor(this.liked ? Color.Red : Color.Gray)
          .scale({ x: this.heartScale, y: this.heartScale })
      }
      Text(this.count.toString())
    }
    .onClick(() => this.toggle())
    .accessibilityText(`赞，${this.count}`)
  }
}
```
