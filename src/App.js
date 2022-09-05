import 'react-native-gesture-handler'
import React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from './Store'
import StackNavigator from './Navigators/StackNavigator'

const App = () => {
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
