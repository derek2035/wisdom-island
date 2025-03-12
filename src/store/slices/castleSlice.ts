import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Castle, Room, Building } from '@/types'
import { castleAPI } from '@/services/api'

// export interface Room {
//   id: string
//   type: 'cottage' | 'villa' | 'apartment' | 'hotel' | 'superApartment'
//   capacity: number
//   price: number
//   isRented: boolean
//   rentedBy: string | null
//   rentExpiresAt: string | null
// }

// export interface Building {
//   id: string
//   type: string
//   level: number
//   position: {
//     x: number
//     y: number
//   }
// }

// export interface Castle {
//   id: string
//   name: string
//   ownerId: string
//   level: string // village | town | county | city | state
//   rank: number // 1-5 stars
//   rooms: Room[]
//   buildings: Building[]
//   residents: string[]
//   totalCapacity: number
//   currentCapacity: number
// }

export interface CastleState {
  castles: Castle[]
  currentCastle: Castle | null
  loading: boolean
  error: string | null
}

const initialState: CastleState = {
  castles: [],
  currentCastle: null,
  loading: false,
  error: null,
}

// 异步 action creators
export const fetchCastles = createAsyncThunk('castle/fetchCastles', async () => {
  const response = await castleAPI.getCastles()
  return response.data
})

export const fetchCastle = createAsyncThunk(
  'castle/fetchCastle',
  async (id: string) => {
    const response = await castleAPI.getCastle(id)
    return response.data
  }
)

export const createCastle = createAsyncThunk(
  'castle/createCastle',
  async (data: { name: string }) => {
    const response = await castleAPI.createCastle(data)
    return response.data
  }
)

export const updateCastle = createAsyncThunk(
  'castle/updateCastle',
  async ({ id, data }: { id: string; data: Partial<Castle> }) => {
    const response = await castleAPI.updateCastle(id, data)
    return response.data
  }
)

export const addRoom = createAsyncThunk(
  'castle/addRoom',
  async ({ castleId, data }: { castleId: string; data: Omit<Room, 'id'> }) => {
    const response = await castleAPI.addRoom(castleId, data)
    return { castleId, room: response.data }
  }
)

export const updateRoom = createAsyncThunk(
  'castle/updateRoom',
  async ({
    castleId,
    roomId,
    data,
  }: {
    castleId: string
    roomId: string
    data: Partial<Room>
  }) => {
    const response = await castleAPI.updateRoom(castleId, roomId, data)
    return { castleId, room: response.data }
  }
)

export const addBuilding = createAsyncThunk(
  'castle/addBuilding',
  async ({
    castleId,
    data,
  }: {
    castleId: string
    data: Omit<Building, 'id'>
  }) => {
    const response = await castleAPI.addBuilding(castleId, data)
    return { castleId, building: response.data }
  }
)

export const updateBuilding = createAsyncThunk(
  'castle/updateBuilding',
  async ({
    castleId,
    buildingId,
    data,
  }: {
    castleId: string
    buildingId: string
    data: Partial<Building>
  }) => {
    const response = await castleAPI.updateBuilding(castleId, buildingId, data)
    return { castleId, building: response.data }
  }
)

const castleSlice = createSlice({
  name: 'castle',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentCastle: (state) => {
      state.currentCastle = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Castles
      .addCase(fetchCastles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCastles.fulfilled, (state, action) => {
        state.loading = false
        state.castles = action.payload
      })
      .addCase(fetchCastles.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '获取城堡列表失败'
      })
      // Fetch Castle
      .addCase(fetchCastle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCastle.fulfilled, (state, action) => {
        state.loading = false
        state.currentCastle = action.payload
      })
      .addCase(fetchCastle.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '获取城堡详情失败'
      })
      // Create Castle
      .addCase(createCastle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCastle.fulfilled, (state, action) => {
        state.loading = false
        state.castles.push(action.payload)
        state.currentCastle = action.payload
      })
      .addCase(createCastle.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '创建城堡失败'
      })
      // Update Castle
      .addCase(updateCastle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCastle.fulfilled, (state, action) => {
        state.loading = false
        state.currentCastle = action.payload
        const index = state.castles.findIndex(
          (castle) => castle.id === action.payload.id
        )
        if (index !== -1) {
          state.castles[index] = action.payload
        }
      })
      .addCase(updateCastle.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '更新城堡失败'
      })
      // Add Room
      .addCase(addRoom.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.loading = false
        if (state.currentCastle?.id === action.payload.castleId) {
          state.currentCastle.rooms.push(action.payload.room)
        }
      })
      .addCase(addRoom.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '添加房间失败'
      })
      // Update Room
      .addCase(updateRoom.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false
        if (state.currentCastle?.id === action.payload.castleId) {
          const index = state.currentCastle.rooms.findIndex(
            (room) => room.id === action.payload.room.id
          )
          if (index !== -1) {
            state.currentCastle.rooms[index] = action.payload.room
          }
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '更新房间失败'
      })
      // Add Building
      .addCase(addBuilding.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addBuilding.fulfilled, (state, action) => {
        state.loading = false
        if (state.currentCastle?.id === action.payload.castleId) {
          state.currentCastle.buildings.push(action.payload.building)
        }
      })
      .addCase(addBuilding.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '添加建筑失败'
      })
      // Update Building
      .addCase(updateBuilding.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBuilding.fulfilled, (state, action) => {
        state.loading = false
        if (state.currentCastle?.id === action.payload.castleId) {
          const index = state.currentCastle.buildings.findIndex(
            (building) => building.id === action.payload.building.id
          )
          if (index !== -1) {
            state.currentCastle.buildings[index] = action.payload.building
          }
        }
      })
      .addCase(updateBuilding.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '更新建筑失败'
      })
  },
})

export const { clearError, clearCurrentCastle } = castleSlice.actions
export default castleSlice.reducer