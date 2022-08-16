import React, { useEffect } from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { WalletContainer } from '../Containers'
import { useDispatch } from 'react-redux'
import { loadWalletToStore } from '../Services/wallet'

const Stack = createStackNavigator()

// @refresh reset
const MainNavigator = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    loadWalletToStore(dispatch)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar barStyle={'dark-content'} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={WalletContainer} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default MainNavigator
