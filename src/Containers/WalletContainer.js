import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { Text, Button, Snackbar } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { increaseAddressReceiveIndex } from '../Store/Wallet'
import { getWalletBalance } from '../Services/wallet'

const WalletContainer = () => {
  const dispatch = useDispatch()

  const { addressReceive, utxoAddressReceive, utxoAddressChange } = useSelector(
    state => state.wallet,
  )
  const [showAddressCopiedBar, setShowAddressCopiedBar] = useState(false)

  const balance = getWalletBalance(utxoAddressReceive, utxoAddressChange)

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <Text variant="headlineMedium" style={styles.text}>
          Balance
        </Text>
        <Text variant="displayMedium" style={styles.text}>
          {(balance / 100000000).toFixed(8)}
        </Text>
        <Text variant="labelMedium" style={styles.text}>
          BTC
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text variant="headlineMedium" style={styles.text}>
          Receiving Address
        </Text>
        <Text
          variant="bodyLarge"
          style={styles.text}
          onLongPress={() => {
            Clipboard.setString(addressReceive)
            setShowAddressCopiedBar(true)
          }}
        >
          {addressReceive}
        </Text>
        <Button
          mode="contained"
          style={styles.addressButton}
          onPress={() => {
            dispatch(increaseAddressReceiveIndex)
          }}
        >
          New Receive Address
        </Button>
      </View>
      <Snackbar
        visible={showAddressCopiedBar}
        onDismiss={() => {
          setShowAddressCopiedBar(false)
        }}
      >
        Address copied to clipboard
      </Snackbar>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  topContainer: {
    marginBottom: 40,
  },
  bottomContainer: {
    marginTop: 40,
  },
  text: {
    textAlign: 'center',
  },
  addressButton: {
    marginTop: 20,
  },
})

export default WalletContainer
