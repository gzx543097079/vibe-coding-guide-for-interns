```tsx
import { useCallback, useState } from 'react'
import { FlatList, Text } from 'react-native'

export function MessageList() {
  const [items, setItems] = useState([{ id: '1', title: '构建通知' }])
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    // 拉取数据后 setItems(...)
    setRefreshing(false)
  }, [])

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text style={{ padding: 16 }}>{item.title}</Text>}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  )
}
// 滑动删除：核心库没有内置组件，常用 react-native-gesture-handler 提供的 Swipeable
```
