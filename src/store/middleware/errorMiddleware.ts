import { Middleware, AnyAction } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

export const errorMiddleware: Middleware = () => (next) => (action: unknown) => {
  // 检查是否是 rejected 的 action
  if (typeof action === 'object' && action !== null && 'type' in action && typeof (action as AnyAction).type === 'string' && (action as AnyAction).type.endsWith('/rejected')) {
    const rejectedAction = action as AnyAction
    const errorMessage = rejectedAction.error?.message || '操作失败'
    toast.error(errorMessage)
  }

  return next(action)
} 