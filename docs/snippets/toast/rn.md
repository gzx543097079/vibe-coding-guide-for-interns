```tsx
import { useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Platform, Pressable, Text, ToastAndroid, View } from 'react-native'

export function useSnackbar() {
  const [text, setText] = useState('')
  const y = useRef(new Animated.Value(100)).current
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const undoRef = useRef<(() => void) | undefined>(undefined)

  const hide = () =>
    Animated.timing(y, { toValue: 100, duration: 200, useNativeDriver: true }).start()

  const show = async (msg: string, onUndo?: () => void) => {
    setText(msg) // 新消息替换旧消息
    undoRef.current = onUndo
    const reduce = await AccessibilityInfo.isReduceMotionEnabled()
    if (reduce) y.setValue(0)
    else Animated.timing(y, { toValue: 0, duration: 250, useNativeDriver: true }).start()
    AccessibilityInfo.announceForAccessibility(msg)
    clearTimeout(timer.current)
    timer.current = setTimeout(hide, 4000)
  }

  const host = (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={{ position: 'absolute', left: 16, right: 16, bottom: 16, flexDirection: 'row',
        padding: 12, borderRadius: 8, backgroundColor: '#323232', transform: [{ translateY: y }] }}>
      <Text style={{ color: '#fff', flex: 1 }}>{text}</Text>
      <Pressable accessibilityRole="button" onPress={() => { undoRef.current?.(); hide() }}>
        <Text style={{ color: '#8ab4f8' }}>撤销</Text>
      </Pressable>
    </Animated.View>
  )
  return { show, host }
}

// 轻提示：Android 用系统 Toast，iOS 没有，需要用上面类似的方式自己画
export function showToast(msg: string) {
  if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT)
  else AccessibilityInfo.announceForAccessibility(msg) // iOS 端配合自绘浮层
}
```
