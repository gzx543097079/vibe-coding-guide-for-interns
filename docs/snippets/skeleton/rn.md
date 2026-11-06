```tsx
import { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Easing, Image, Text, View } from 'react-native'

// 不引入渐变库：用一条半透明白色窄条平移代替渐变光泽
function SkeletonBlock({ width, height = 12, radius = 6 }: { width: number; height?: number; radius?: number }) {
  const x = useRef(new Animated.Value(0)).current
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce)
  }, [])

  useEffect(() => {
    if (reduce) return
    const loop = Animated.loop(
      Animated.timing(x, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true }),
    )
    loop.start()
    return () => loop.stop()
  }, [reduce])

  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [-width, width] })
  return (
    <View style={{ width, height, borderRadius: radius, backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
      {!reduce && (
        <Animated.View style={{ width: width / 3, height, backgroundColor: 'rgba(255,255,255,0.5)', transform: [{ translateX }] }} />
      )}
    </View>
  )
}

export function ProfileRow({ user }: { user: User | null }) {
  const opacity = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (user) Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start()
  }, [user])

  if (!user) {
    return (
      <View accessible accessibilityLabel="加载中" style={{ flexDirection: 'row', gap: 12 }}>
        <SkeletonBlock width={40} height={40} radius={20} />
        <View style={{ gap: 8, justifyContent: 'center' }}>
          <SkeletonBlock width={180} />
          <SkeletonBlock width={110} />
        </View>
      </View>
    )
  }
  return (
    <Animated.View style={{ flexDirection: 'row', gap: 12, opacity }}>
      <Image source={{ uri: user.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
      <View><Text style={{ fontWeight: 'bold' }}>{user.name}</Text><Text>{user.bio}</Text></View>
    </Animated.View>
  )
}
```
