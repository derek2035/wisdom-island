import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/store/slices/userSlice'
import learningReducer from '@/store/slices/learningSlice'
import castleReducer from '@/store/slices/castleSlice'
import { errorMiddleware } from '@/store/middleware/errorMiddleware'

export const store = configureStore({
  reducer: {
    user: userReducer,
    learning: learningReducer,
    castle: castleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(errorMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch