```tsx
import { useState } from 'react'
import { Alert, Button, Modal, Pressable, StyleSheet, Text, View } from 'react-native'

export function ShareEntry() {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Button title="分享" onPress={() => setVisible(true)} />
      <Button
        title="删除"
        onPress={() =>
          Alert.alert('删除这篇文档？', '删除后无法恢复。', [
            { text: '取消', style: 'cancel' },
            { text: '删除', style: 'destructive', onPress: () => {} },
          ])
        }
      />
      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />
        <View style={styles.sheet}>
          <Text>复制链接</Text>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { padding: 24, borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: '#fff' },
})
```
