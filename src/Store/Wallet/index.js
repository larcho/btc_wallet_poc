import { createSlice } from '@reduxjs/toolkit'
import { Config } from '../../Config'
import bitcore from 'bitcore-lib'

const slice = createSlice({
  name: 'wallet',
  initialState: {
    walletCreated: false,
    walletHDSeed: '',
    addressReceive: '',
    addressChange: '',
    addressReceiveIndex: 0,
    addressChangeIndex: 0,
  },
  reducers: {
    setWalletCreated: (state, action) => {
      state.walletCreated = action.payload
    },
    setWalletSeed: (state, action) => {
      const seed = action.payload
      state.walletHDSeed = seed
      state.walletCreated = !!seed
      if (!seed) return
      walletPrivateKey = new bitcore.HDPrivateKey(seed)
      receivePrivateKey = walletPrivateKey
        .deriveChild(0)
        .deriveChild(state.addressReceiveIndex, true)
      state.addressReceive = receivePrivateKey.publicKey
        .toAddress(Config.WALLET_BTC_NETWORK, Config.WALLET_BTC_ADDRESS_TYPE)
        .toString()
      changePrivateKey = walletPrivateKey
        .deriveChild(0)
        .deriveChild(state.addressChangeIndex, true)
      state.addressChange = changePrivateKey.publicKey
        .toAddress(Config.WALLET_BTC_NETWORK, Config.WALLET_BTC_ADDRESS_TYPE)
        .toString()
    },
    increaseAddressReceiveIndex: state => {
      if (!state.walletHDSeed) return
      state.addressReceiveIndex += 1
      walletPrivateKey = new bitcore.HDPrivateKey(state.walletHDSeed)
      receivePrivateKey = walletPrivateKey
        .deriveChild(0)
        .deriveChild(state.addressReceiveIndex, true)
      state.addressReceive = receivePrivateKey.publicKey
        .toAddress(Config.WALLET_BTC_NETWORK, Config.WALLET_BTC_ADDRESS_TYPE)
        .toString()
    },
    increaseAddressChangeIndex: state => {
      if (!state.walletHDSeed) return
      state.addressChangeIndex += 1
      walletPrivateKey = new bitcore.HDPrivateKey(state.walletHDSeed)
      changePrivateKey = walletPrivateKey
        .deriveChild(0)
        .deriveChild(state.addressChangeIndex, true)
      state.addressChange = changePrivateKey.publicKey
        .toAddress(Config.WALLET_BTC_NETWORK, Config.WALLET_BTC_ADDRESS_TYPE)
        .toString()
    },
  },
})

export const {
  setWalletCreated,
  setWalletSeed,
  increaseAddressReceiveIndex,
  increaseAddressChangeIndex,
} = slice.actions

export default slice.reducer
