```tsx
import { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Pressable, Text, View, type LayoutRectangle } from 'react-native'

const TABS = ['全部', '待付款', '待发货', '已完成']
const BASE = 100 // 指示器基准宽度，实际宽度用 scaleX 换算

export function OrdersTabs() {
  const [current, setCurrent] = useState(0)
  const [layouts, setLayouts] = useState<LayoutRectangle[]>([])
  const x = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0)).current
  const fade = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const l = layouts[current]
    if (!l) return
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      const duration = reduce ? 0 : 250
      // scaleX 以中心为原点，平移时补偿 (宽度 - 基准) / 2 才能和标签左对齐
      Animated.parallel([
        Animated.timing(x, { toValue: l.x + (l.width - BASE) / 2, duration, useNativeDriver: true }),
        Animated.timing(scale, { toValue: l.width / BASE, duration, useNativeDriver: true }),
      ]).start()
      fade.setValue(reduce ? 1 : 0)
      Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }).start()
    })
  }, [current, layouts])

  return (
    <View>
      <View accessibilityRole="tablist" style={{ flexDirection: 'row' }}>
        {TABS.map((t, i) => (
          <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: current === i }}
            onPress={() => setCurrent(i)} style={{ paddingVertical: 12, paddingHorizontal: 16 }}
            onLayout={(e) => {
              const l = e.nativeEvent.layout
              setLayouts((prev) => { const next = [...prev]; next[i] = l; return next })
            }}>
            <Text style={{ color: current === i ? '#1a73e8' : '#333' }}>{t}</Text>
          </Pressable>
        ))}
        <Animated.View style={{ position: 'absolute', left: 0, bottom: 0, width: BASE, height: 2, backgroundColor: '#1a73e8',
          transform: [{ translateX: x }, { scaleX: scale }] }} />
      </View>
      <Animated.View style={{ opacity: fade, padding: 16 }}>
        <Text>{TABS[current]}订单</Text>
      </Animated.View>
    </View>
  )
}
```
