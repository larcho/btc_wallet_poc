import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { WalletContainer, TransactionsContainer } from '../Containers'

const Tab = createMaterialBottomTabNavigator()

const TabNavigator = () => {
  return (
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
  )
}

export default TabNavigator
