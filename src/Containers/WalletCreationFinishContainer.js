import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { Text, Button, Avatar } from 'react-native-paper'
import { storeWallet } from '../Services/wallet'
import { navigateAndSimpleReset } from '../Navigators/utils'

const WalletCreationFinishContainer = ({ route }) => {
  const { newWallet } = route.params

  useEffect(() => {
    storeWallet(newWallet.hdSeed)
  }, [])

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.middleContainer}>
        <Avatar.Icon size={128} icon="wallet-plus-outline" />
        <Text style={styles.textBottom}>Your wallet is ready.</Text>
      </View>
      <View style={styles.bottomButtonContainer}>
        <Button
          mode="contained"
          onPress={() => {
            navigateAndSimpleReset('Main')
          }}
        >
          Go to Wallet
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
  },
  textBottom: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  bottomButtonContainer: {
    alignItems: 'center',
  },
})

export default WalletCreationFinishContainer
