```tsx
// 依赖 @react-navigation/native 与 @react-navigation/bottom-tabs
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: '首页' }} />
        <Tab.Screen name="Mine" component={MineScreen} options={{ title: '我的' }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
```
