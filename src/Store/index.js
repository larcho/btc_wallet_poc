import AsyncStorage from '@react-native-async-storage/async-storage'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

// Will be updated with Reduxjs toolkit query service, don't use axios
// import { api } from '@/Services/api'
import theme from './Theme'
import wallet from './Wallet'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['wallet'],
}

const walletConfig = {
  key: 'wallet',
  storage: AsyncStorage,
  blacklist: ['walletHDSeed'],
}

const reducers = combineReducers({
  theme,
  wallet: persistReducer(walletConfig, wallet),
  //api: api.reducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })

    if (__DEV__ && !process.env.JEST_WORKER_ID) {
      const createDebugger = require('redux-flipper').default
      middlewares.push(createDebugger())
    }

    return middlewares
  },
})

const persistor = persistStore(store)

setupListeners(store.dispatch)

export { store, persistor }
