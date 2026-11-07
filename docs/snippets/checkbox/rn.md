```tsx
import { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Pressable, Text, View } from 'react-native'

type Checked = boolean | 'mixed'

// RN 核心库没有 CheckBox，用 Pressable 自己画
function Box({ label, checked, onPress, radio = false }: { label: string; checked: Checked; onPress: () => void; radio?: boolean }) {
  const scale = useRef(new Animated.Value(checked ? 1 : 0)).current
  useEffect(() => {
    const to = checked ? 1 : 0
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce) scale.setValue(to)
      else Animated.timing(scale, { toValue: to, duration: 200, useNativeDriver: true }).start()
    })
  }, [checked])

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={radio ? 'radio' : 'checkbox'}
      accessibilityState={{ checked }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 }}
    >
      <View style={{ width: 20, height: 20, borderWidth: 2, borderRadius: radio ? 10 : 4, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.Text style={{ opacity: scale, transform: [{ scale }] }}>
          {radio ? '●' : checked === 'mixed' ? '−' : '✓'}
        </Animated.Text>
      </View>
      <Text>{label}</Text>
    </Pressable>
  )
}

const NAMES = ['邮件', '短信', '推送']

export function NotifySettings() {
  const [picked, setPicked] = useState([true, false, false])
  const [theme, setTheme] = useState('light')
  const n = picked.filter(Boolean).length
  const all: Checked = n === 0 ? false : n === picked.length ? true : 'mixed'

  return (
    <View>
      <Box label="全选" checked={all} onPress={() => setPicked(picked.map(() => all !== true))} />
      {NAMES.map((name, i) => (
        <Box key={name} label={name} checked={picked[i]} onPress={() => setPicked(picked.map((v, j) => (j === i ? !v : v)))} />
      ))}
      <View accessibilityRole="radiogroup">
        {['light', 'dark'].map((t) => (
          <Box key={t} radio label={t === 'light' ? '浅色' : '深色'} checked={theme === t} onPress={() => setTheme(t)} />
        ))}
      </View>
    </View>
  )
}
```
