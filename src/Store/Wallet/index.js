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
    setWalletCreated: (state, action) => {
      state.walletCreated = action.payload
    },
    setWalletSeed: (state, action) => {
      state.walletHDSeed = action.payload
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
