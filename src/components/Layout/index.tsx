import React from 'react'
import styled from 'styled-components'
import Navigation from '../Navigation'

const StyledLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 60px; // 为底部导航预留空间
`

const StyledMain = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  
  @media (min-width: 768px) {
    max-width: 768px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.lg};
  }
`

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <StyledMain>{children}</StyledMain>
      <Navigation />
    </StyledLayout>
  )
} 