import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter.slice';
import { baseApi } from './baseApi/baseApi';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        [baseApi.reducerPath]: baseApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch