import React from 'react'
import _ from 'lodash'
import { SafeAreaView, StyleSheet, FlatList } from 'react-native'
import { Text, Chip, Button } from 'react-native-paper'
import { createWallet } from '../Services/wallet'

const WalletCreationWordsContainer = ({ navigation }) => {
  const newWallet = createWallet()

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.textTop}>
        Welcome to <Text style={styles.boldText}>Wallet App</Text>. We created a
        new wallet for you, please write down these twelve words and store them
        somewhere safe.
      </Text>
      <FlatList
        data={newWallet.wordlist}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Chip style={styles.wordItem}>
            {index + 1}. {item}
          </Chip>
        )}
        numColumns={2}
        contentContainerStyle={styles.wordsContainer}
      />
      <Text style={styles.textBottom}>
        These words are your only means of backup, if you lose them you{' '}
        <Text style={styles.boldText}>
          WILL NOT be able to restore your wallet
        </Text>{' '}
        and lose all cryptocurrency associated with it. Also, the wallet is not
        backed up by your system backup, if you switch to different device you
        will have to enter these words.
      </Text>
      <Button
        mode="contained"
        onPress={() => {
          const payload = {
            newWallet,
            index: 0,
            shuffledIndeces: _.slice(
              _.shuffle([...Array(newWallet.wordlist.length).keys()]),
              0,
              3,
            ),
          }
          navigation.push('WalletCreationConfirmWord', payload)
        }}
      >
        Continue
      </Button>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  wordsContainer: {
    alignItems: 'center',
  },
  wordItem: {
    margin: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  textTop: {
    textAlign: 'center',
    padding: 30,
  },
  textBottom: {
    textAlign: 'center',
    padding: 30,
  },
})

export default WalletCreationWordsContainer
