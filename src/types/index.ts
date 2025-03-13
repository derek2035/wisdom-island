// 用户相关类型
export interface User {
  id: string
  username: string
  level: number
  wisdomPoints: number
  title: string
  invitedUsers: string[]
}

export interface UserProfileUpdate {
  username?: string
  title?: string
}

// 学习相关类型
export interface KnowledgePoint {
  id: number
  title: string
  level: number
  grade: number
  content: string
  order_index: number
  category_id: number
  parent_id: number | null
  objective: string
  keyPoints: string[] | null
  category?: Omit<Category, 'created_at'>
  parent?: KnowledgePoint | null
  children?: KnowledgePoint[]
  UserKnowledgeProgress?: UserKnowledgeProgress[]
  isCompleted?: boolean
  completionCount?: number
  lastCompletedAt?: Date | null
}

export interface Category {
  id: number
  name: string
  description?: string
  created_at?: string
}

export interface LearningProgress {
  completed: boolean
  lastAccessed: string
}

// 城堡相关类型
export interface Room {
  id: string
  type: string
  level: number
  position: {
    x: number
    y: number
  }
  status: 'constructing' | 'completed'
  constructionStartTime?: string
  constructionEndTime?: string
  isRented: boolean
  price: number
  capacity: number
  rentExpiresAt: string | null
}

export interface Building {
  id: string
  type: string
  level: number
  position: {
    x: number
    y: number
  }
  status: 'constructing' | 'completed'
  constructionStartTime?: string
  constructionEndTime?: string
}

export interface Castle {
  id: string
  name: string
  level: number
  rooms: Room[]
  buildings: Building[]
  currentCapacity: number
  totalCapacity: number
  createdAt: string
  updatedAt: string
}

// API 响应类型
export interface APIResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface UserKnowledgeProgress {
  id: number
  user_id: string
  knowledge_point_id: number
  completed_times: number
  last_completed_at: Date
  knowledge_point?: KnowledgePoint
}

export * from './castle' 