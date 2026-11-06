```tsx
import { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Pressable, Text, View } from 'react-native'

function Section({ title, body, open, onPress }: { title: string; body: string; open: boolean; onPress: () => void }) {
  const rotate = useRef(new Animated.Value(open ? 1 : 0)).current

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce) rotate.setValue(open ? 1 : 0)
      else Animated.timing(rotate, { toValue: open ? 1 : 0, duration: 200, useNativeDriver: true }).start()
    })
  }, [open])

  const angle = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
  return (
    <View>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={onPress}
                 style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
        <Text>{title}</Text>
        <Animated.Text style={{ transform: [{ rotate: angle }] }}>▾</Animated.Text>
      </Pressable>
      {open && <Text style={{ paddingHorizontal: 16, paddingBottom: 16 }}>{body}</Text>}
    </View>
  )
}

export function Accordion({ items, single = true }: { items: { title: string; body: string }[]; single?: boolean }) {
  const [open, setOpen] = useState<number[]>([0])
  const toggle = (i: number) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : single ? [i] : [...prev, i]))

  return (
    <View>
      {items.map((it, i) => (
        <Section key={it.title} {...it} open={open.includes(i)} onPress={() => toggle(i)} />
      ))}
    </View>
  )
}
```
