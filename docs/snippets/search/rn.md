```tsx
import { useEffect, useState } from 'react'
import { FlatList, Pressable, Text, TextInput, View } from 'react-native'

export function SearchBox({ words, recent }: { words: string[]; recent: string[] }) {
  const [query, setQuery] = useState('')
  const [q, setQ] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setQ(query.trim()), 150) // 防抖 150ms
    return () => clearTimeout(t)
  }, [query])

  const items = q ? words.filter((w) => w.includes(q)) : recent

  // 匹配部分加粗：嵌套 Text 设置 fontWeight
  const highlight = (w: string) => {
    const i = q ? w.indexOf(q) : -1
    if (i < 0) return <Text>{w}</Text>
    return <Text>{w.slice(0, i)}<Text style={{ fontWeight: '700' }}>{q}</Text>{w.slice(i + q.length)}</Text>
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput style={{ flex: 1 }} value={query} onChangeText={setQuery}
          placeholder="搜索" returnKeyType="search" accessibilityLabel="搜索" />
        {/* iOS 可用 clearButtonMode，这里自己画以兼容 Android */}
        {query !== '' && (
          <Pressable onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel="清除" hitSlop={8}>
            <Text>×</Text>
          </Pressable>
        )}
      </View>
      <FlatList
        data={items}
        keyExtractor={(w) => w}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={!q && items.length ? <Text>最近搜索</Text> : null}
        ListEmptyComponent={q ? <Text accessibilityLiveRegion="polite">没有找到「{q}」相关结果</Text> : null}
        renderItem={({ item }) => (
          <Pressable onPress={() => setQuery(item)} accessibilityRole="button" style={{ padding: 12 }}>
            {highlight(item)}
          </Pressable>
        )}
      />
    </View>
  )
}
```
