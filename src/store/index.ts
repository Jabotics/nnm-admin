import { Action, configureStore, Dispatch, Middleware, ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { RequestHandler } from "./RequestHandler";
import { categoriesApi } from "./actions";
import { setupListeners } from '@reduxjs/toolkit/query'

import { persistStore } from 'redux-persist'

export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,

    // @ts-expect-error check this middleware
    middleware: (getDefaultMiddleware) => {
      const middleware = getDefaultMiddleware({
        serializableCheck: false,
      }).concat(
        RequestHandler.middleware,
        categoriesApi.middleware,

      );

      const middlewareTuple = middleware as Middleware<
        object,
        RootState,
        Dispatch<UnknownAction>
      >[]
      return middlewareTuple
    },
    preloadedState,
  })

  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

export type AppStore = typeof store

export const persistor = persistStore(store)
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>