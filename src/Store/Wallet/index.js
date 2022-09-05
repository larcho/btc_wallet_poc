import { createSlice } from '@reduxjs/toolkit'
import { Config } from '../../Config'
import bitcore from 'bitcore-lib'

const setReceiveAddress = (state, walletPrivateKey = undefined) => {
  if (!state.walletHDSeed) return
  walletPrivateKey =
    walletPrivateKey || new bitcore.HDPrivateKey(state.walletHDSeed)
  const receivePrivateKey = walletPrivateKey
    .deriveChild(Config.WALLET_BTC_DERIVE_PATH)
    .deriveChild(0)
    .deriveChild(state.addressReceiveIndex)
  state.addressReceive = receivePrivateKey.publicKey
    .toAddress(Config.WALLET_BTC_NETWORK, Config.WALLET_BTC_ADDRESS_TYPE)
    .toString()
}

const setChangeAddress = (state, walletPrivateKey = undefined) => {
  if (!state.walletHDSeed) return
  walletPrivateKey =
    walletPrivateKey || new bitcore.HDPrivateKey(state.walletHDSeed)
  const changePrivateKey = walletPrivateKey
    .deriveChild(Config.WALLET_BTC_DERIVE_PATH)
    .deriveChild(1)
    .deriveChild(state.addressChangeIndex)
  state.addressChange = changePrivateKey.publicKey
    .toAddress(Config.WALLET_BTC_NETWORK, Config.WALLET_BTC_ADDRESS_TYPE)
    .toString()
}

const slice = createSlice({
  name: 'wallet',
  initialState: {
    walletCreated: false,
    walletHDSeed: '',
    addressReceive: '',
    addressChange: '',
    addressReceiveIndex: 0,
    addressChangeIndex: 0,
    utxoAddressReceive: {},
    utxoAddressChange: {},
    transactionsHistory: [],
  },
  reducers: {
    setWalletSeed: (state, action) => {
      const seed = action.payload
      state.walletHDSeed = seed
      state.walletCreated = !!seed
      if (!seed) return
      const walletPrivateKey = new bitcore.HDPrivateKey(seed)
      setReceiveAddress(state, walletPrivateKey)
      setChangeAddress(state, walletPrivateKey)
    },
    increaseAddressReceiveIndex: state => {
      if (!state.walletHDSeed) return
      state.addressReceiveIndex += 1
      setReceiveAddress(state)
    },
    increaseAddressChangeIndex: state => {
      if (!state.walletHDSeed) return
      state.addressChangeIndex += 1
      setChangeAddress(state)
    },
    setUTXOAddressReceive: (state, action) => {
      state.utxoAddressReceive = action.payload
    },
    setUTXOAddressChange: (state, action) => {
      state.utxoAddressChange = action.payload
    },
    setTransactionsHistory: (state, action) => {
      state.transactionsHistory = action.payload
    },
  },
})

export const {
  setWalletCreated,
  setWalletSeed,
  increaseAddressReceiveIndex,
  increaseAddressChangeIndex,
  setUTXOAddressReceive,
  setUTXOAddressChange,
  setTransactionsHistory,
} = slice.actions

export default slice.reducer
