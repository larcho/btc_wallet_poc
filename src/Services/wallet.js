import _ from 'lodash'
import { Config } from '../Config'
import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store'
import Mnemonic from 'bitcore-mnemonic'
import bitcore from 'bitcore-lib'
import { setWalletSeed } from '../Store/Wallet'
import { store } from '../Store'

const WALLET_SECUREKEYSTORE_KEY = 'walletHDSeed'

export const createWallet = () => {
  const code = new Mnemonic(Mnemonic.Words.ENGLISH)
  const HDPrivateKey = code.toHDPrivateKey('', Config.WALLET_BTC_NETWORK)
  return { wordlist: code.toString().split(' '), hdSeed: HDPrivateKey.xprivkey }
}

export const storeWallet = async hdSeed => {
  try {
    await RNSecureKeyStore.set(WALLET_SECUREKEYSTORE_KEY, hdSeed, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    })
    store.dispatch(setWalletSeed(hdSeed))
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const loadWalletToStore = async () => {
  try {
    const walletHDSeed = await RNSecureKeyStore.get(WALLET_SECUREKEYSTORE_KEY)
    store.dispatch(setWalletSeed(walletHDSeed))
  } catch (error) {
    console.error(error)
  }
}

export const getWalletBalance = (utxoAddressReceive, utxoAddressChange) => {
  return _.sumBy(
    _.concat(_.flatMap(utxoAddressReceive), _.flatMap(utxoAddressChange)),
    x => x.value,
  )
}

export const createTransaction = (sendToAddress, amount) => {
  const { wallet } = store.getState()
  const balance = getWalletBalance(
    wallet.utxoAddressReceive,
    wallet.utxoAddressChange,
  )
  if (amount > balance) throw new Error('Not enough Balance')
  const walletPrivateKey = new bitcore.HDPrivateKey(wallet.walletHDSeed)
  let outputs = []
  let outputSatoshiSum = 0
  let privateKeys = []
  let utxoAddressReceive = { ...wallet.utxoAddressReceive }
  let utxoAddressChange = { ...wallet.utxoAddressChange }
  // Search for outputs, first within receive addresses, then change addresses
  for (let j = 0; j < 2; j++) {
    const utxos = j === 0 ? utxoAddressReceive : utxoAddressChange
    const startIndex = 0
    const endIndex =
      j === 0 ? wallet.addressReceiveIndex : wallet.addressChangeIndex
    for (let i = startIndex; i <= endIndex; i++) {
      const derivedPrivateKey = walletPrivateKey
        .deriveChild(Config.WALLET_BTC_DERIVE_PATH)
        .deriveChild(j)
        .deriveChild(i)
      const address = derivedPrivateKey.publicKey.toAddress(
        Config.WALLET_BTC_NETWORK,
        Config.WALLET_BTC_ADDRESS_TYPE,
      )
      const addressUTXOs = [..._.get(utxos, address.toString(), [])]
      let utxo
      while ((utxo = _.pullAt(addressUTXOs, 0)[0])) {
        const data = {
          txid: utxo.tx_hash,
          vout: utxo.tx_pos,
          script: new bitcore.Script(address),
          satoshis: utxo.value,
          address,
        }
        outputs = [...outputs, new bitcore.Transaction.UnspentOutput(data)]
        outputSatoshiSum += data.satoshis
        if (outputSatoshiSum > amount) break
      }
      if (utxo) {
        privateKeys = [...privateKeys, derivedPrivateKey.privateKey]
      }
      utxos[address.toString()] = addressUTXOs
      if (outputSatoshiSum > amount) break
    }
    if (j === 0) {
      utxoAddressReceive = utxos
    } else {
      utxoAddressChange = utxos
    }
    if (outputSatoshiSum > amount) break
  }
  // Create transactions together with required items
  const changeAddress = walletPrivateKey
    .deriveChild(Config.WALLET_BTC_DERIVE_PATH)
    .deriveChild(1) //Change path
    .deriveChild(wallet.addressChangeIndex)
    .publicKey.toAddress(
      Config.WALLET_BTC_NETWORK,
      Config.WALLET_BTC_ADDRESS_TYPE,
    )

  const transaction = new bitcore.Transaction()
    .from(outputs)
    .to(sendToAddress, amount)
    .change(changeAddress)
    .sign(privateKeys)

  const changeOutput = transaction.getChangeOutput()
  if (changeOutput) {
    const electrumChangeOutput = {
      tx_hash: transaction.hash,
      tx_pos: transaction.toObject().changeIndex,
      value: changeOutput.satoshis,
    }
    const address = changeOutput.script.toAddress().toString()
    utxoAddressChange[address] = [electrumChangeOutput]
  }
  return {
    tx: transaction,
    utxoAddressReceive,
    utxoAddressChange,
  }
}
