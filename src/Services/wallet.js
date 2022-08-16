import { Config } from '../Config'
import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store'

export const createWallet = async () => {
  const Mnemonic = require('bitcore-mnemonic')
  const code = new Mnemonic(Mnemonic.Words.ENGLISH)
  const HDPrivateKey = code.toHDPrivateKey('', Config.WALLET_NETWORK)
  try {
    await RNSecureKeyStore.set('walletHDSeed', HDPrivateKey, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    })
    return code.toString()
  } catch (error) {
    console.error(error)
    return false
  }
}
