待校对：RN 没有内置拖拽排序，这里用 PanResponder 手写并假设行高固定；嵌在 ScrollView 里时需处理手势冲突。生产环境常用 react-native-draggable-flatlist。

```tsx
import { useRef, useState } from 'react'
import { AccessibilityInfo, PanResponder, Text, View } from 'react-native'

const H = 56
const move = (a: string[], from: number, to: number) => { const b = [...a]; b.splice(to, 0, ...b.splice(from, 1)); return b }

export function Sortable({ initial }: { initial: string[] }) {
  const [items, setItems] = useState(initial)
  const [drag, setDrag] = useState<{ from: number; dy: number } | null>(null)
  const clamp = (i: number) => Math.max(0, Math.min(items.length - 1, i))
  const to = drag ? clamp(drag.from + Math.round(drag.dy / H)) : -1
  const drop = (from: number, target: number) => {
    setItems((list) => move(list, from, target)); setDrag(null)
    AccessibilityInfo.announceForAccessibility(`已移到第 ${target + 1} 项，共 ${items.length} 项`)
  }

  return (
    <View>
      {items.map((label, i) => {
        const lifted = drag?.from === i
        const shift = !drag || lifted ? 0 : i > drag.from && i <= to ? -H : i < drag.from && i >= to ? H : 0
        return (
          <View key={label} style={{
            height: H, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', zIndex: lifted ? 1 : 0,
            elevation: lifted ? 8 : 0, shadowOpacity: lifted ? 0.2 : 0, shadowRadius: 8,
            transform: [{ translateY: lifted && drag ? drag.dy : shift }, { scale: lifted ? 1.03 : 1 }],
          }}
            accessible accessibilityLabel={label}
            accessibilityActions={[{ name: 'up', label: '上移' }, { name: 'down', label: '下移' }]}
            onAccessibilityAction={(e) => drop(i, clamp(i + (e.nativeEvent.actionName === 'up' ? -1 : 1)))}>
            <Handle index={i} onMove={(from, dy) => setDrag({ from, dy })}
              onDrop={(from, dy) => drop(from, clamp(from + Math.round(dy / H)))} />
            <Text>{label}</Text>
          </View>
        )
      })}
    </View>
  )
}

// 手柄：PanResponder 只创建一次，回调通过 ref 读取最新值
function Handle(props: { index: number; onMove: (i: number, dy: number) => void; onDrop: (i: number, dy: number) => void }) {
  const latest = useRef(props); latest.current = props
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => latest.current.onMove(latest.current.index, g.dy),
    onPanResponderRelease: (_, g) => latest.current.onDrop(latest.current.index, g.dy),
    onPanResponderTerminate: (_, g) => latest.current.onDrop(latest.current.index, g.dy),
  })).current
  return <Text {...pan.panHandlers} style={{ padding: 16 }}>⠿</Text>
}
```
