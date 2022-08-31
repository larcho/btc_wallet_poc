import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { NavigationContainer } from '@react-navigation/native'
import { WalletContainer, TransactionsContainer } from '../Containers'
import { loadWalletToStore } from '../Services/wallet'
import { fetchUTXOs } from '../Services/electrumx'

const Tab = createMaterialBottomTabNavigator()

// @refresh reset
const MainNavigator = () => {
  useEffect(() => {
    loadWalletToStore()
    fetchUTXOs()
  }, [])

  return (
    <NavigationContainer>
      <StatusBar barStyle={'dark-content'} />
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Receive"
          component={WalletContainer}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="wallet" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Send"
          component={TransactionsContainer}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="send-circle"
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
