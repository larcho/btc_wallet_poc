import { Config } from '../Config'
import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store'
import Mnemonic from 'bitcore-mnemonic'
import { setWalletSeed } from '../Store/Wallet'

const WALLET_SECUREKEYSTORE_KEY = 'walletHDSeed'

export const createWallet = async dispatch => {
  const code = new Mnemonic(Mnemonic.Words.ENGLISH)
  const HDPrivateKey = code.toHDPrivateKey('', Config.WALLET_NETWORK)
  try {
    await RNSecureKeyStore.set(
      WALLET_SECUREKEYSTORE_KEY,
      HDPrivateKey.xprivkey,
      {
        accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      },
    )
    dispatch(setWalletSeed(HDPrivateKey.xprivkey))
    return code.toString()
  } catch (error) {
    console.error(error)
    return false
  }
}

export const loadWalletToStore = async dispatch => {
  try {
    const walletHDSeed = await RNSecureKeyStore.get(WALLET_SECUREKEYSTORE_KEY)
    dispatch(setWalletSeed(walletHDSeed))
  } catch (error) {
    console.error(error)
  }
}
