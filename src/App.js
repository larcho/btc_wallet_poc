import 'react-native-gesture-handler'
import React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from './Store'
import MainNavigator from './Navigators/MainNavigator'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <MainNavigator />
        </PaperProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
