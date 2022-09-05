import _ from 'lodash'
import { Config } from '../Config'
import { store } from '../Store'
import {
  setUTXOAddressChange,
  setUTXOAddressReceive,
  setTransactionsHistory,
} from '../Store/Wallet'
import bitcore from 'bitcore-lib'

var sendMessageCounter = 1

const connectToServer = async () => {
  const ws = new WebSocket(Config.ELECTRUMX_SERVER)
  return new Promise((resolve, reject) => {
    const timeoutStart = new Date()
    const timer = setInterval(() => {
      if (ws.readyState === 1) {
        clearInterval(timer)
        resolve(ws)
      }
      if (new Date() - timeoutStart > 1000 * 30) {
        clearInterval(timer)
        reject(new Error('Unable to connect'))
      }
    }, 10)
  })
}

const sendCommand = async (ws, method, params = []) => {
  return new Promise((resolve, reject) => {
    const timeoutStart = new Date()
    const messageID = sendMessageCounter
    const onMessage = event => {
      ws.removeEventListener('message', onMessage)
      clearInterval(timer)
      const response = JSON.parse(event.data)
      if (response.id !== messageID) {
        const error = new Error('Message ID missmatch')
        error.responseID = response.id
        error.messageID = messageID
        reject(error)
      } else {
        resolve(JSON.parse(event.data))
      }
    }
    const timer = setInterval(() => {
      if (new Date() - timeoutStart > 1000 * 30) {
        ws.removeEventListener('message', onMessage)
        clearInterval(timer)
        reject(new Error('Message timeout'))
      }
    }, 10)
    ws.addEventListener('message', onMessage)
    const payload = {
      method,
      params,
      id: messageID,
    }
    ws.send(JSON.stringify(payload))
    sendMessageCounter++
  })
}

export const fetchUTXOs = async () => {
  let ws
  try {
    ws = await connectToServer()
    console.log("Fetching UTXOs")
    const { wallet } = store.getState()
    if (!wallet.walletCreated || !wallet.walletHDSeed) {
      ws.close()
      return false
    }
    let transactionsHistory = [...wallet.transactionsHistory]
    const walletPrivateKey = new bitcore.HDPrivateKey(wallet.walletHDSeed)
    for (let j = 0; j < 2; j++) {
      const utxoAddresses = {}
      let startIndex = j === 0 ? 0 : wallet.addressChangeIndex - 5
      if (startIndex < 0) startIndex = 0
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
        const script = new bitcore.Script(address)
        const hash = bitcore.crypto.Hash.sha256(script.toBuffer())
        const hashReverse = bitcore.util.buffer.reverse(hash)
        const unspentResponse = await sendCommand(
          ws,
          'blockchain.scripthash.listunspent',
          [hashReverse.toString('hex')],
        )
        if (unspentResponse.result) {
          utxoAddresses[address.toString()] = unspentResponse.result
          if (j === 0 && unspentResponse.result.length > 0) {
            transactionsHistory = await fetchTransactionsDetail(
              ws,
              unspentResponse.result.map(x => x.tx_hash),
              transactionsHistory,
              address.toString(),
            )
          }
        }
      }
      store.dispatch(
        j === 0
          ? setUTXOAddressReceive(utxoAddresses)
          : setUTXOAddressChange(utxoAddresses),
      )
    }
    store.dispatch(setTransactionsHistory(transactionsHistory))
  } catch (error) {
    console.log(error)
  } finally {
    if (ws) ws.close()
  }
  return true
}

const fetchTransactionsDetail = async (
  ws,
  txids,
  transactionsHistory,
  lookupAddress,
) => {
  for (let txid of txids) {
    if (!_.find(transactionsHistory, o => o.txid === txid)) {
      const transactionResponse = await sendCommand(
        ws,
        'blockchain.transaction.get',
        [txid, true],
      )
      const { result } = transactionResponse
      if (result && result.confirmations >= 6) {
        const transactionItem = {
          txid: result.txid,
          time: result.time,
          address: lookupAddress,
          amount: result.vout.filter(
            x =>
              x.scriptPubKey.address &&
              x.scriptPubKey.address === lookupAddress,
          )[0].value,
          type: 'receive',
        }
        transactionsHistory = [...transactionsHistory, transactionItem]
      }
    }
  }
  return transactionsHistory
}

export const broadcastTransaction = serializedTransaction => {
  return new Promise((resolve, reject) => {
    connectToServer()
      .then(ws => {
        sendCommand(ws, 'blockchain.transaction.broadcast', [
          serializedTransaction,
        ])
          .then(broadcastResponse => {
            if (broadcastResponse.result) {
              resolve(broadcastResponse.result)
            } else {
              reject(broadcastResponse.error || new Error('Unexpected error'))
            }
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            ws.close()
          })
      })
      .catch(error => {
        reject(error)
      })
  })
}
