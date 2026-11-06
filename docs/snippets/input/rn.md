```tsx
import { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Pressable, Text, TextInput, View } from 'react-native'

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export function EmailField() {
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState('')
  const up = useRef(new Animated.Value(0)).current
  const shakeX = useRef(new Animated.Value(0)).current
  const reduce = useRef(false)

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((v) => (reduce.current = v))
  }, [])
  // 浮动标签：获得焦点或有值时上移缩小
  useEffect(() => {
    const toValue = focused || email ? 1 : 0
    Animated.timing(up, { toValue, duration: reduce.current ? 0 : 200, useNativeDriver: true }).start()
  }, [focused, email])

  function onBlur() {
    setFocused(false)
    const bad = email !== '' && !isEmail(email)
    setError(bad ? '邮箱格式不对' : '')
    if (bad && !reduce.current) {
      Animated.sequence(
        [6, -6, 0].map((x) => Animated.timing(shakeX, { toValue: x, duration: 100, useNativeDriver: true })),
      ).start()
    }
  }

  const labelMove = [
    { translateY: up.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) },
    { scale: up.interpolate({ inputRange: [0, 1], outputRange: [1, 0.75] }) },
  ]

  return (
    <View>
      <Animated.View style={{ transform: [{ translateX: shakeX }], borderWidth: 1, borderRadius: 8, borderColor: error ? '#d93025' : '#8a919c', paddingTop: 18, paddingHorizontal: 12 }}>
        <Animated.Text style={{ position: 'absolute', left: 12, top: 14, color: '#5f6368', transform: labelMove }}>邮箱</Animated.Text>
        <TextInput value={email} onChangeText={setEmail} onFocus={() => setFocused(true)} onBlur={onBlur}
          keyboardType="email-address" autoCapitalize="none" accessibilityLabel="邮箱" style={{ height: 36, paddingRight: 32 }} />
        {email !== '' && (
          <Pressable onPress={() => { setEmail(''); setError('') }} accessibilityRole="button" accessibilityLabel="清除" hitSlop={8}
            style={{ position: 'absolute', right: 10, top: 18 }}>
            <Text>✕</Text>
          </Pressable>
        )}
      </Animated.View>
      {error !== '' && <Text accessibilityLiveRegion="polite" style={{ color: '#d93025' }}>{error}</Text>}
    </View>
  )
}
```
