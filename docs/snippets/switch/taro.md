```tsx
import { useState } from 'react'
import { Switch, Text, View } from '@tarojs/components'

export default function WifiRow() {
  const [on, setOn] = useState(true)

  return (
    <View className='row'>
      <Text>Wi-Fi</Text>
      <Switch checked={on} onChange={(e) => setOn(e.detail.value)} />
    </View>
  )
}
```
