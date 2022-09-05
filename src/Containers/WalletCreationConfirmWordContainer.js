import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Text, TextInput, Button, Dialog } from 'react-native-paper'

const WalletCreationConfirmWordContainer = ({ navigation, route }) => {
  const { newWallet, index, shuffledIndeces } = route.params
  const [displayError, setDisplayError] = useState('')
  const [typedWord, setTypedWord] = useState('')

  const continueAction = () => {
    if (
      typedWord.toLowerCase() !== newWallet.wordlist[shuffledIndeces[index]]
    ) {
      setDisplayError('Wrong word')
      return
    }
    if (index < shuffledIndeces.length - 1) {
      const payload = {
        newWallet,
        shuffledIndeces,
        index: index + 1,
      }
      navigation.push('WalletCreationConfirmWord', payload)
    } else {
      navigation.push('WalletCreationFinish', { newWallet: newWallet })
    }
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.mainContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.middleContainer}>
          <Text style={styles.textTop}>
            Confirm word{' '}
            <Text style={styles.boldText}>
              number {shuffledIndeces[index] + 1}:
            </Text>
          </Text>
          <TextInput
            mode="outlined"
            style={styles.wordInput}
            autoFocus={true}
            autoCorrect={false}
            autoCapitalize={false}
            returnKeyType="next"
            onChangeText={text => {
              setTypedWord(text)
            }}
            onSubmitEditing={continueAction}
          />
        </View>
        <View style={styles.bottomButtonContainer}>
          <Button mode="contained" onPress={continueAction}>
            Continue
          </Button>
        </View>
      </KeyboardAvoidingView>
      <Dialog
        visible={!!displayError}
        onDismiss={() => {
          setDisplayError('')
        }}
      >
        <Dialog.Title>Error</Dialog.Title>
        <Dialog.Content>
          <Text>{displayError}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setDisplayError('')
            }}
          >
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
    margin: 30,
  },
  textTop: {
    textAlign: 'center',
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  wordInput: {
    height: 50,
  },
  bottomButtonContainer: {
    alignItems: 'center',
  },
})

export default WalletCreationConfirmWordContainer
