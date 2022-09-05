import React from 'react'
import { List } from 'react-native-paper'

const TransactionListItem = ({ item }) => {
  return (
    <List.Item
      title={`${item.type === 'send' ? 'Sent' : 'Received'} ${
        item.amount
      } BTC to`}
      description={`${item.address}`}
      left={props => (
        <List.Icon
          {...props}
          icon={
            item.type === 'send'
              ? 'arrow-right-bold-box-outline'
              : 'arrow-left-bold-box-outline'
          }
        />
      )}
    />
  )
}

export default TransactionListItem
