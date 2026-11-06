```tsx
import { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Pressable, Text, View } from 'react-native'

export function LikeButton({ initial = 0 }: { initial?: number }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initial)
  const [reduceMotion, setReduceMotion] = useState(false)
  const scale = useRef(new Animated.Value(1)).current
  const burst = useRef(new Animated.Value(1)).current // 0→1 为爆发进度
  const roll = useRef(new Animated.Value(0)).current

  useEffect(() => { AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion) }, [])

  const toggle = () => {
    const next = !liked
    setLiked(next)
    setCount((c) => c + (next ? 1 : -1))
    if (reduceMotion) return // 只切换颜色
    // 先缩小，再弹簧回弹；取消点赞只做这一步
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.7, duration: 100, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start()
    roll.setValue(12) // 新数字从下方滑上来
    Animated.timing(roll, { toValue: 0, duration: 250, useNativeDriver: true }).start()
    if (next) {
      burst.setValue(0)
      Animated.timing(burst, { toValue: 1, duration: 500, useNativeDriver: true }).start()
    }
  }

  return (
    <Pressable onPress={toggle} accessibilityRole="button" accessibilityLabel={`赞，${count}`}
      accessibilityState={{ selected: liked }} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
        {/* 8 个小圆点向外飞散并淡出 */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4
          const move = (d: number) => burst.interpolate({ inputRange: [0, 1], outputRange: [0, d] })
          return (
            <Animated.View key={i} style={{
              position: 'absolute', width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'red',
              opacity: burst.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              transform: [{ translateX: move(22 * Math.sin(a)) }, { translateY: move(-22 * Math.cos(a)) }],
            }} />
          )
        })}
        <Animated.Text style={{ fontSize: 20, color: liked ? 'red' : '#888', transform: [{ scale }] }}>
          {liked ? '♥' : '♡'}
        </Animated.Text>
      </View>
      <Animated.Text style={{ transform: [{ translateY: roll }] }}>{count}</Animated.Text>
    </Pressable>
  )
}
```
