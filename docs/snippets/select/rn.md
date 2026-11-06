```tsx
import { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Modal, Pressable, Text, View } from 'react-native'

type Option = { value: string; label: string; disabled?: boolean }
type Props = { options: Option[]; value: string; onChange: (v: string) => void }

// 核心库已移除 Picker，这里用 Modal + 列表自己写
export function Select({ options, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const rotate = useRef(new Animated.Value(0)).current
  const current = options.find((o) => o.value === value)

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) =>
      Animated.timing(rotate, { toValue: open ? 1 : 0, duration: reduce ? 0 : 200, useNativeDriver: true }).start(),
    )
  }, [open])
  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })

  return (
    <>
      <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel={`城市，${current?.label}`}
        accessibilityState={{ expanded: open }}
        style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderWidth: 1, borderRadius: 8 }}>
        <Text>{current?.label}</Text>
        <Animated.Text style={{ transform: [{ rotate: spin }] }}>▾</Animated.Text>
      </Pressable>
      {/* 安卓返回键会触发 onRequestClose */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'center', padding: 32, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setOpen(false)}>
          <View style={{ borderRadius: 12, backgroundColor: '#fff' }}>
            {options.map((o) => (
              <Pressable key={o.value} disabled={o.disabled} accessibilityRole="button"
                accessibilityState={{ selected: o.value === value, disabled: o.disabled }}
                onPress={() => { onChange(o.value); setOpen(false) }}
                style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 14, opacity: o.disabled ? 0.4 : 1 }}>
                <Text>{o.label}</Text>
                {o.value === value && <Text>✓</Text>}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  )
}
```
