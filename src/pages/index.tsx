import React from 'react'
import styled from 'styled-components'
import { Layout } from '@/components/Layout'
import UserProfile from '@/components/UserProfile'
import { useAppSelector } from '@/hooks'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`

const StyledWelcome = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const StyledTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const StyledDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  max-width: 600px;
  margin: 0 auto;
`

const HomePage = () => {
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.user)

  return (
    <Layout>
      <StyledContainer>
        <StyledWelcome>
          <StyledTitle>欢迎来到智慧岛</StyledTitle>
          <StyledDescription>
            在这里，你可以通过学习获得智慧点数，建造和升级你的城堡，
            与其他学习者交流互动。让我们开始这段奇妙的学习之旅吧！
          </StyledDescription>
        </StyledWelcome>
        {isAuthenticated && currentUser && <UserProfile currentUser={currentUser} />}
      </StyledContainer>
    </Layout>
  )
}

export default HomePage