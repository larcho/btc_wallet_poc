import React from 'react'
import { List } from 'react-native-paper'

const TransactionListItem = ({ item }) => {
  return (
    <List.Item
      title={`Sent ${item.amount} BTC to`}
      description={`${item.address}`}
      left={props => (
        <List.Icon {...props} icon="arrow-right-bold-box-outline" />
      )}
    />
  )
}

export default TransactionListItem
