import React from 'react'
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import { useSelector } from 'react-redux'
import { createWallet as createWalletService } from '../Services/wallet'

const WalletContainer = () => {
  const addressReceiveIndex = useSelector(
    state => state.wallet.addressReceiveIndex,
  )

  const createWallet = async () => {
    const mnemonicWords = await createWalletService()
    Alert.alert('Wallet created', `Your mnemonic words are ${mnemonicWords}`, [
      { text: 'OK' },
    ])
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.text}>Seed</Text>
      <Text style={styles.text}>Address</Text>
      <Text style={styles.text}>Derive Index: {addressReceiveIndex}</Text>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Create new Public Address</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={createWallet}>
        <Text style={styles.buttonText}>Create Wallet</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
  },
  text: {
    flex: 1,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 32,
    margin: 10,
  },
  buttonText: {
    color: 'white',
  },
})

export default WalletContainer
