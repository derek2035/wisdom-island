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
  user: {
    id: string
    name: string
    email: string
  } | null
}

const initialState: LearningState = {
  knowledgePoints: [],
  currentKnowledgePoint: null,
  loading: false,
  error: null,
  learningProgress: {},
  user: null
}

// 异步 action creators
export const fetchKnowledgePoints = createAsyncThunk(
  'learning/fetchKnowledgePoints',
  async () => {
    const response = await learningAPI.getKnowledgePoints()
    return response
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

export const sendMessage = createAsyncThunk(
  'learning/sendMessage',
  async ({ 
    content, 
    apiKey, 
    conversation_id, 
    onMessage 
  }: { 
    content: string; 
    apiKey: string; 
    conversation_id?: string;
    onMessage?: (chunk: string) => void;
  }) => {
    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        response_mode: 'streaming',
        conversation_id: conversation_id || '',
        user: 'user',
        inputs: {},
        query: content,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Failed to get response reader')
    }

    let conversationId = ''
    let fullContent = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = new TextDecoder().decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.event === 'message' && data.data) {
              if (data.data.conversation_id) {
                conversationId = data.data.conversation_id
              }
              if (data.data.answer) {
                fullContent += data.data.answer
                onMessage?.(data.data.answer)
              }
            } else if (data.event === 'error') {
              console.error('Error from API:', data.data)
              throw new Error(data.data.message || 'API error')
            }
          } catch (e) {
            console.error('Error parsing chunk:', e)
          }
        }
      }
    }

    return {
      content: fullContent,
      conversation_id: conversationId
    }
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