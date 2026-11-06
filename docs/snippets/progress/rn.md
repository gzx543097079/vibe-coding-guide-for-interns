```tsx
import { useEffect, useRef } from 'react'
import { AccessibilityInfo, ActivityIndicator, Animated, View } from 'react-native'

// 线性进度条：RN 没有跨平台系统组件，用 scaleX + transformOrigin（RN 0.73+）
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const scale = useRef(new Animated.Value(value)).current

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce) scale.setValue(value)
      else Animated.timing(scale, { toValue: value, duration: 300, useNativeDriver: true }).start()
    })
  }, [value])

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={{ height: 4, borderRadius: 2, backgroundColor: '#e5e7eb', overflow: 'hidden' }}
    >
      <Animated.View
        style={{ flex: 1, backgroundColor: '#2563eb', transformOrigin: 'left', transform: [{ scaleX: scale }] }}
      />
    </View>
  )
}

// 旋转加载指示器：系统 ActivityIndicator
export function Loading() {
  return <ActivityIndicator size="small" accessibilityLabel="加载中" />
}
// 环形进度通常借助 react-native-svg 画两个 circle，用 strokeDashoffset 表示进度
```
