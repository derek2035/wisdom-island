import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/types/user'

interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = {
        ...action.payload,
        invitedUsers: action.payload.invitedUsers || [] // 确保 invitedUsers 始终是数组
      }
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
    }
  }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer