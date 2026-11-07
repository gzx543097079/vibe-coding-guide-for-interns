```tsx
import { useState } from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'

export function WifiRow() {
  const [on, setOn] = useState(true)

  return (
    <View style={styles.row}>
      <Text>Wi-Fi</Text>
      <Switch value={on} onValueChange={setOn} accessibilityLabel="Wi-Fi" />
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
})
```
