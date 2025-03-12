import axios from 'axios'
import {
  User,
  UserProfileUpdate,
  KnowledgePoint,
  Castle,
  Room,
  Building,
  Category,
  APIResponse,
} from '../types'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 用户相关 API
export const userAPI = {
  login: (data: { username: string; password: string }) =>
    api.post<void, APIResponse<{ token: string; user: User }>>('/auth/login', data),
  register: (data: { username: string; password: string; inviteCode?: string }) =>
    api.post<void, APIResponse<{ token: string; user: User }>>('/auth/register', data),
  getProfile: () => api.get<void, APIResponse<User>>('/user/profile'),
  updateProfile: (data: UserProfileUpdate) =>
    api.put<void, APIResponse<User>>('/user/profile', data),
}

// 学习相关 API
export const learningAPI = {
  getKnowledgePoints: async () => {
    const response = await api.get<{
      success: boolean;
      data: KnowledgePoint[];
    }>('/knowledge/points');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get<{
      success: boolean;
      data: Category[];
    }>('/knowledge/categories');
    return response.data;
  },
  
  getKnowledgePoint: (id: string) => 
    api.get<void, APIResponse<KnowledgePoint>>(`/knowledge/points/${id}`),
  
  completeKnowledgePoint: (id: string) => 
    api.post<void, APIResponse<KnowledgePoint>>(`/knowledge/points/${id}/complete`),
  
  submitAnswer: (id: string, data: { answer: string }) => 
    api.post<void, APIResponse<{ isCorrect: boolean; explanation: string }>>(`/knowledge/points/${id}/answer`, data),
}

// 城堡相关 API
export const castleAPI = {
  getCastles: () => api.get<void, APIResponse<Castle[]>>('/castles'),
  getCastle: (id: string) => api.get<void, APIResponse<Castle>>(`/castles/${id}`),
  createCastle: (data: { name: string }) =>
    api.post<void, APIResponse<Castle>>('/castles', data),
  updateCastle: (id: string, data: Partial<Castle>) =>
    api.put<void, APIResponse<Castle>>(`/castles/${id}`, data),
  addRoom: (castleId: string, data: Omit<Room, 'id'>) =>
    api.post<void, APIResponse<Room>>(`/castles/${castleId}/rooms`, data),
  updateRoom: (castleId: string, roomId: string, data: Partial<Room>) =>
    api.put<void, APIResponse<Room>>(`/castles/${castleId}/rooms/${roomId}`, data),
  addBuilding: (castleId: string, data: Omit<Building, 'id'>) =>
    api.post<void, APIResponse<Building>>(`/castles/${castleId}/buildings`, data),
  updateBuilding: (
    castleId: string,
    buildingId: string,
    data: Partial<Building>
  ) =>
    api.put<void, APIResponse<Building>>(
      `/castles/${castleId}/buildings/${buildingId}`,
      data
    ),
}

const DIFY_API_KEY = process.env.NEXT_PUBLIC_DIFY_API_KEY
const DIFY_API_URL = process.env.NEXT_PUBLIC_DIFY_API_URL

if (!DIFY_API_KEY || !DIFY_API_URL) {
  throw new Error('Dify API configuration is missing')
}

export const difyAPI = axios.create({
  baseURL: DIFY_API_URL,
  headers: {
    'Authorization': `Bearer ${DIFY_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const aiAPI = {
  chat: async (message: string) => {
    const response = await difyAPI.post('/chat-messages', {
      query: message,
      response_mode: 'blocking',
      conversation_id: localStorage.getItem('conversationId') || undefined
    })

    // 保存会话ID
    if (response.data.conversation_id) {
      localStorage.setItem('conversationId', response.data.conversation_id)
    }

    return {
      data: {
        reply: response.data.answer
      }
    }
  }
}

export default api