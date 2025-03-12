import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from './useStore'
import { setUser, clearUser } from '@/store/slices/userSlice'
import { User } from '@/types/user'

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }
  return null
}

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { currentUser, isLoading } = useAppSelector((state) => state.user)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userCookie = getCookie('user')
        const authCookie = getCookie('auth')

        if (userCookie && authCookie) {
          const userData = JSON.parse(userCookie)
          dispatch(setUser(userData as User))
        } else {
          dispatch(clearUser())
        }
      } catch (error) {
        console.error('Failed to parse user data:', error)
        dispatch(clearUser())
      }
    }

    checkAuth()
    // 添加事件监听器以处理页面聚焦时的状态更新
    window.addEventListener('focus', checkAuth)
    return () => {
      window.removeEventListener('focus', checkAuth)
    }
  }, [dispatch])

  const logout = () => {
    // 清除 cookie
    document.cookie = 'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    document.cookie = 'auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    
    // 清除 Redux store 中的用户信息
    dispatch(clearUser())
    
    // 重定向到登录页
    router.push('/login')
  }

  return {
    user: currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    logout
  }
}