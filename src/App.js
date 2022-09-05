import 'react-native-gesture-handler'
import React, { useRef, useEffect } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from './Store'
import StackNavigator from './Navigators/StackNavigator'
import { AppState } from 'react-native'
import { fetchUTXOs } from './Services/electrumx'

const App = () => {
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    const appStateSubs = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        fetchUTXOs()
      }
      appState.current = nextAppState
    })

    fetchUTXOs()
    return () => {
      appStateSubs.remove()
    }
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <StackNavigator />
        </PaperProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
