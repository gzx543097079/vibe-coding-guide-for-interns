```tsx
import { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, FlatList, Text, View, useWindowDimensions } from 'react-native'

export function Carousel({ banners }: { banners: string[] }) {
  const { width } = useWindowDimensions()
  const listRef = useRef<FlatList<string>>(null)
  const [index, setIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion)
  }, [])

  useEffect(() => {
    // 减少动态效果或手指拖动时不自动播放
    if (reduceMotion || dragging || banners.length < 2) return
    const t = setInterval(() => {
      const next = (index + 1) % banners.length
      listRef.current?.scrollToIndex({ index: next, animated: true })
      setIndex(next)
    }, 4000)
    return () => clearInterval(t)
  }, [index, dragging, reduceMotion, banners.length])

  return (
    <View>
      <FlatList
        ref={listRef}
        data={banners}
        horizontal
        pagingEnabled // 整页滑动
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onScrollBeginDrag={() => setDragging(true)}
        onMomentumScrollEnd={(e) => {
          setDragging(false)
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }}
        renderItem={({ item }) => <Text style={{ width, height: 180 }}>{item}</Text>}
        keyExtractor={(item) => item}
      />
      {/* 圆点指示器，当前点拉长 */}
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {banners.map((b, i) => (
          <View key={b} style={{ width: i === index ? 20 : 8, height: 8, borderRadius: 4, margin: 3, backgroundColor: '#999' }} />
        ))}
      </View>
    </View>
  )
}
```
