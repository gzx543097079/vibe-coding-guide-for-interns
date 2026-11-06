```tsx
import { useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'

export function SubmitButton() {
  const [loading, setLoading] = useState(false)

  return (
    <Pressable
      accessibilityRole="button"
      disabled={loading}
      onPress={() => setLoading(true)}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>提交</Text>}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: { height: 44, borderRadius: 10, backgroundColor: '#2f5bd3', alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  text: { color: '#fff', fontWeight: '600' },
})
```
