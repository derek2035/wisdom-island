import React from 'react'
import styled from 'styled-components'
import { Layout } from '@/components/Layout'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/router'

const ProfileContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const UserName = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const StatItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  .label {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  .value {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: bold;
  }
`

const LogoutButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`

const ProfilePage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/my')
    }
  }, [isAuthenticated, router])

  if (!user) {
    return null
  }

  return (
    <Layout>
      <ProfileContainer>
        <ProfileCard>
          <Avatar src={user.avatar} alt={user.username} />
          <UserName>{user.username}</UserName>
          <UserStats>
            <StatItem>
              <div className="label">等级</div>
              <div className="value">{user.level}</div>
            </StatItem>
            <StatItem>
              <div className="label">智慧点</div>
              <div className="value">{user.wisdomPoints}</div>
            </StatItem>
          </UserStats>
          <LogoutButton onClick={logout}>退出登录</LogoutButton>
        </ProfileCard>
      </ProfileContainer>
    </Layout>
  )
}

export default ProfilePage