import { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'cookies-next'

// 模拟用户数据
const mockUser = {
  id: '1',
  username: '测试用户',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  level: 1,
  wisdomPoints: 100,
  invitedUsers: [] // 初始化为空数组
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '方法不允许' })
  }

  try {
    // 设置用户 cookie
    setCookie('user', JSON.stringify(mockUser), { req, res })
    setCookie('auth', 'true', { req, res })

    // 重定向到首页
    res.redirect('/')
  } catch (error) {
    console.error('Callback error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
} 