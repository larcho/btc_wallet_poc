import React, { useState } from 'react'
import { SafeAreaView, FlatList, StyleSheet, StatusBar } from 'react-native'
import { Text, FAB, Dialog, TextInput, Button } from 'react-native-paper'
import TransactionListItem from '../Components/TransactionListItem'

const DATA = [
  {
    id: 1,
    amount: 0.0001,
    address: 'n3jYBjCzgGNydQwf83Hz6GBzGBhMkKfgL1',
    transaction:
      '0d9e6d0b37d0ffce93189c4e2197097266c5dfca6337f23192342a44606eba86',
  },
  {
    id: 2,
    amount: 0.000001,
    address: 'n3jYBjCzgGNydQwf83Hz6GBzGBhMkKfgL1',
    transaction:
      '0d9e6d0b37d0ffce93189c4e2197097266c5dfca6337f23192342a44606eba86',
  },
]

const TransactionsContainer = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text variant="titleLarge" style={styles.title}>
        Transactions
      </Text>
      <FlatList
        data={DATA}
        renderItem={TransactionListItem}
        keyExtractor={item => item.id}
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
        }}
      >
        <Dialog.Title>Create New Transaction</Dialog.Title>
        <Dialog.Content>
          <TextInput label="Address" mode="outlined" />
          <TextInput label="Amount" mode="outlined" />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setShowCreateDialog(false)
            }}
          >
            Cancel
          </Button>
          <Button>Create</Button>
        </Dialog.Actions>
      </Dialog>
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
})

export default TransactionsContainer
