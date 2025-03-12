import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { KnowledgePoint } from '@/types'
import { learningAPI } from '@/services/api'

interface LearningState {
  knowledgePoints: KnowledgePoint[]
  currentKnowledgePoint: KnowledgePoint | null
  loading: boolean
  error: string | null
  learningProgress: {
    [key: number]: {
      completed: boolean
      lastAccessed: string
    }
  }
}

const initialState: LearningState = {
  knowledgePoints: [],
  currentKnowledgePoint: null,
  loading: false,
  error: null,
  learningProgress: {}
}

// 异步 action creators
export const fetchKnowledgePoints = createAsyncThunk(
  'learning/fetchKnowledgePoints',
  async () => {
    const response = await learningAPI.getKnowledgePoints()
    return response.data
  }
)

export const fetchKnowledgePoint = createAsyncThunk(
  'learning/fetchKnowledgePoint',
  async (id: string) => {
    const response = await learningAPI.getKnowledgePoint(id)
    return response.data
  }
)

export const completeKnowledgePoint = createAsyncThunk(
  'learning/completeKnowledgePoint',
  async (id: string) => {
    const response = await learningAPI.completeKnowledgePoint(id)
    return response.data
  }
)

export const submitAnswer = createAsyncThunk(
  'learning/submitAnswer',
  async ({ id, answer }: { id: string; answer: string }) => {
    const response = await learningAPI.submitAnswer(id, { answer })
    return response.data
  }
)

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentKnowledgePoint: (state) => {
      state.currentKnowledgePoint = null
    },
    setCurrentKnowledgePoint: (state, action: PayloadAction<KnowledgePoint>) => {
      state.currentKnowledgePoint = action.payload
    },
    updateLearningProgress: (state, action: PayloadAction<{ pointId: number; completed: boolean }>) => {
      const { pointId, completed } = action.payload
      state.learningProgress[pointId] = {
        completed,
        lastAccessed: new Date().toISOString()
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Knowledge Points
      .addCase(fetchKnowledgePoints.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchKnowledgePoints.fulfilled, (state, action) => {
        state.loading = false
        state.knowledgePoints = action.payload
      })
      .addCase(fetchKnowledgePoints.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '获取知识点列表失败'
      })
      // Fetch Knowledge Point
      .addCase(fetchKnowledgePoint.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchKnowledgePoint.fulfilled, (state, action) => {
        state.loading = false
        state.currentKnowledgePoint = action.payload
      })
      .addCase(fetchKnowledgePoint.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '获取知识点详情失败'
      })
      // Complete Knowledge Point
      .addCase(completeKnowledgePoint.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(completeKnowledgePoint.fulfilled, (state, action) => {
        state.loading = false
        state.currentKnowledgePoint = action.payload
        const index = state.knowledgePoints.findIndex(
          (point) => point.id === action.payload.id
        )
        if (index !== -1) {
          state.knowledgePoints[index] = action.payload
        }
      })
      .addCase(completeKnowledgePoint.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '完成知识点失败'
      })
      // Submit Answer
      .addCase(submitAnswer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitAnswer.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '提交答案失败'
      })
  },
})

export const { clearError, clearCurrentKnowledgePoint, setCurrentKnowledgePoint, updateLearningProgress } = learningSlice.actions
export default learningSlice.reducer