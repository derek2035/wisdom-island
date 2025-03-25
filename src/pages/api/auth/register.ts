import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, nickname, password } = req.body;

    // 验证用户名格式（字母+数字）
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res.status(400).json({ message: '用户名只能包含字母和数字' });
    }

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        nickname,
        password: hashedPassword,
      },
    });

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: '注册失败，请稍后重试' });
  }
} 