import { configureStore } from '@reduxjs/toolkit'
import { paymentsApi } from '../features/paymentApi'

export const store = configureStore({
  reducer: {
    [paymentsApi.reducerPath]: paymentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(paymentsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
