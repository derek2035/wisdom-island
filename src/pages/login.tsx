import React from 'react'
import styled from 'styled-components'
import { Layout } from '@/components/Layout'
import { useRouter } from 'next/router'

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: ${({ theme }) => theme.spacing.lg};
`

const LoginTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.md};
`

const LoginPage: React.FC = () => {
  const router = useRouter()
  const { error } = router.query

  const handleLogin = () => {
    // 直接调用 Mock 登录接口
    window.location.href = '/api/auth/wechat/callback'
  }

  return (
    <Layout>
      <LoginContainer>
        <LoginTitle>欢迎登录智慧岛</LoginTitle>
        <LoginButton onClick={handleLogin}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.83l6.59-6.59L15.17 6 9 12.17l-2.17-2.17L5.41 11.41 10 16z" />
          </svg>
          一键登录
        </LoginButton>
        {error === 'auth_failed' && (
          <ErrorMessage>登录失败，请重试</ErrorMessage>
        )}
      </LoginContainer>
    </Layout>
  )
}

export default LoginPage