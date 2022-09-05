import React from 'react'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  WalletCreationWordsContainer,
  WalletCreationConfirmWordContainer,
  WalletCreationFinishContainer,
} from '../Containers'
import TabNavigator from './TabNavigator'
import { navigationRef } from './utils'
import { useSelector } from 'react-redux'

const Stack = createStackNavigator()

// @refresh reset
const StackNavigator = () => {
  const walletCreated = useSelector(state => state.wallet.walletCreated)

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar barStyle={'dark-content'} />
      <Stack.Navigator
        initialRouteName={
          walletCreated ? 'Main' : 'WalletCreationWordsContainer'
        }
      >
        <Stack.Screen
          name="WalletCreationWordsContainer"
          component={WalletCreationWordsContainer}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen
          options={{ title: 'Confirm Word' }}
          name="WalletCreationConfirmWord"
          component={WalletCreationConfirmWordContainer}
        />
        <Stack.Screen
          options={{ title: 'Done' }}
          name="WalletCreationFinish"
          component={WalletCreationFinishContainer}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator
