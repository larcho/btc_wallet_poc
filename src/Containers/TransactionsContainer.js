import React, { useState } from 'react'
import { SafeAreaView, FlatList, StyleSheet, StatusBar } from 'react-native'
import {
  Text,
  FAB,
  Dialog,
  TextInput,
  Button,
  Snackbar,
} from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import {
  setUTXOAddressReceive,
  setUTXOAddressChange,
  setTransactionsHistory,
  increaseAddressChangeIndex,
} from '../Store/Wallet'
import TransactionListItem from '../Components/TransactionListItem'
import { createTransaction } from '../Services/wallet'
import { broadcastTransaction, fetchUTXOs } from '../Services/electrumx'

const TransactionsContainer = () => {
  const dispatch = useDispatch()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [inputAddress, setInputAddress] = useState('')
  const [inputAmount, setInputAmount] = useState('')
  const [confirmTransaction, setConfirmTransaction] = useState(undefined)
  const [snackMessage, setSnackMessage] = useState('')
  const [fetchingUTXOs, setFetchingUTXOs] = useState(false)

  const transactionsHistory = useSelector(
    state => state.wallet.transactionsHistory,
  )

  const componentFetchUTXOs = async () => {
    setFetchingUTXOs(true)
    await fetchUTXOs()
    setFetchingUTXOs(false)
  }

  const submitTransaction = () => {
    broadcastTransaction(confirmTransaction.tx.serialize())
      .then(result => {
        const newTransaction = {
          txid: result,
          time: Math.round(new Date().getTime() / 1000),
          address: inputAddress,
          amount: parseFloat(inputAmount),
          type: 'send',
        }
        dispatch(
          setTransactionsHistory([...transactionsHistory, newTransaction]),
        )
        dispatch(setUTXOAddressReceive(confirmTransaction.utxoAddressReceive))
        dispatch(setUTXOAddressChange(confirmTransaction.utxoAddressChange))
        dispatch(increaseAddressChangeIndex())
        setSnackMessage('Transaction sent')
      })
      .catch(error => {
        setSnackMessage(error.message)
      })
      .finally(() => {
        setConfirmTransaction(false)
        setInputAddress('')
        setInputAmount('')
      })
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text variant="titleLarge" style={styles.title}>
        Transactions
      </Text>
      <FlatList
        data={transactionsHistory}
        renderItem={TransactionListItem}
        keyExtractor={item => item.txid}
        refreshing={fetchingUTXOs}
        onRefresh={componentFetchUTXOs}
      />
      <FAB
        icon="open-in-new"
        label="Create Transaction"
        onPress={() => {
          setShowCreateDialog(true)
        }}
        style={styles.createTransactionButton}
      />
      <Dialog
        visible={showCreateDialog}
        onDismiss={() => {
          setShowCreateDialog(false)
          setInputAddress('')
          setInputAmount('')
        }}
      >
        <Dialog.Title>Create New Transaction</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Address"
            mode="outlined"
            autoCorrect={false}
            autoCapitalize={false}
            keyboardType="default"
            onChangeText={text => setInputAddress(text)}
          />
          <TextInput
            label="Amount"
            mode="outlined"
            autoCorrect={false}
            keyboardType="decimal-pad"
            onChangeText={text => setInputAmount(text)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setShowCreateDialog(false)
              setInputAddress('')
              setInputAmount('')
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={() => {
              setShowCreateDialog(false)
              try {
                let amountSatoshis = parseFloat(inputAmount)
                if (amountSatoshis) {
                  amountSatoshis = Math.round(amountSatoshis * 100000000)
                }
                if (amountSatoshis) {
                  setConfirmTransaction(
                    createTransaction(inputAddress, amountSatoshis),
                  )
                }
              } catch (error) {
                setSnackMessage(error.message)
                setInputAddress('')
                setInputAmount('')
              }
            }}
            disabled={!inputAddress || !inputAmount}
          >
            Create
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog
        visible={!!confirmTransaction}
        onDismiss={() => {
          setConfirmTransaction(undefined)
          setInputAddress('')
          setInputAmount('')
        }}
      >
        <Dialog.Title>Confirm Transaction</Dialog.Title>
        <Dialog.Content>
          {confirmTransaction && (
            <Text>
              Confirm sending{' '}
              <Text style={styles.boldText}>
                {parseFloat(inputAmount).toFixed(8)} BTC
              </Text>{' '}
              to address <Text style={styles.boldText}>{inputAddress}</Text> for
              a fee of{' '}
              <Text style={styles.boldText}>
                {(confirmTransaction.tx.getFee() / 100000000).toFixed(8)} BTC
              </Text>
            </Text>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setConfirmTransaction(undefined)
              setInputAddress('')
              setInputAmount('')
            }}
          >
            Cancel
          </Button>
          <Button onPress={submitTransaction}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
      <Snackbar
        visible={!!snackMessage}
        onDismiss={() => {
          setSnackMessage('')
        }}
      >
        {snackMessage}
      </Snackbar>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  title: {
    margin: 16,
  },
  createTransactionButton: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  boldText: {
    fontWeight: 'bold',
  },
})

export default TransactionsContainer
