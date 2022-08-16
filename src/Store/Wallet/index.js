import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'wallet',
  initialState: {
    walletCreated: false,
    walletHDSeed: '',
    addressReceiveIndex: 0,
    addressChangeIndex: 0,
  },
  reducers: {
    setWalletCreated: (state, { payload: { walletCreated } }) => {
      state.walletCreated = walletCreated
    },
    setWalletSeed: (state, { payload: { hdSeed } }) => {
      state.walletHDSeed = hdSeed
      state.walletCreated = true
    },
    increaseAddressReceiveIndex: state => {
      state.addressReceiveIndex += 1
    },
    increaseAddressChangeIndex: state => {
      state.addressChangeIndex += 1
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
