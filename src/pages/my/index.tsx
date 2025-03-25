import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { useRouter } from 'next/router';

// 容器样式
const Container = styled.div`
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
`;

// 表单样式
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// 标题样式
const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 24px 0;
  text-align: center;
`;

// 输入框样式
const Input = styled.input`
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

// 按钮样式
const Button = styled.button`
  background: #4f46e5;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4338ca;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

// 错误消息样式
const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 14px;
  margin-top: 4px;
`;

// 切换链接样式
const SwitchLink = styled.a`
  color: #4f46e5;
  text-decoration: none;
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// 用户信息样式
const UserInfo = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const UserName = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`;

const UserNickname = styled.p`
  color: #6b7280;
  margin: 0;
`;

const LogoutButton = styled(Button)`
  margin-top: 16px;
  background: #ef4444;

  &:hover {
    background: #dc2626;
  }
`;

const MyPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 处理表单输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // 登录
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || '登录失败');
        }

        // 保存用户信息和token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.removeItem('conversationId');
        setUser(data.user);
      } else {
        // 注册
        if (formData.password !== formData.confirmPassword) {
          throw new Error('两次输入的密码不一致');
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            nickname: formData.nickname,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || '注册失败');
        }

        // 注册成功后自动登录
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
          throw new Error(loginData.message || '登录失败');
        }

        localStorage.setItem('token', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        setUser(loginData.user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setFormData({
      username: '',
      nickname: '',
      password: '',
      confirmPassword: '',
    });
  };

  // 检查用户是否已登录
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  if (user) {
    return (
      <Layout>
        <Container>
          <UserInfo>
            <UserName>{user.username}</UserName>
            <UserNickname>{user.nickname}</UserNickname>
            <LogoutButton onClick={handleLogout}>退出登录</LogoutButton>
          </UserInfo>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Title>{isLogin ? '登录' : '注册'}</Title>
          <Input
            type="text"
            name="username"
            placeholder="用户名"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          {!isLogin && (
            <Input
              type="text"
              name="nickname"
              placeholder="昵称"
              value={formData.nickname}
              onChange={handleInputChange}
              required
            />
          )}
          <Input
            type="password"
            name="password"
            placeholder="密码"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {!isLogin && (
            <Input
              type="password"
              name="confirmPassword"
              placeholder="确认密码"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          )}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '处理中...' : isLogin ? '登录' : '注册'}
          </Button>
          <SwitchLink onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
          </SwitchLink>
        </Form>
      </Container>
    </Layout>
  );
};

export default MyPage; 