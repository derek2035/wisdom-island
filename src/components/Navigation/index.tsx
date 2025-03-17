import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

const StyledNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;
`

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.text.secondary)};
  font-size: 12px;
  padding: 4px 8px;
  cursor: pointer;
`

const StyledIcon = styled.span`
  font-size: 24px;
  margin-bottom: 4px;
`

const Navigation = () => {
  const router = useRouter()

  const navigate = (path: string) => {
    router.push(path)
  }

  return (
    <StyledNav>
      <NavItem $active={router.pathname === '/'} onClick={() => navigate('/')}>
        <StyledIcon>🏠</StyledIcon>
        <span>首页</span>
      </NavItem>
      <NavItem $active={router.pathname === '/learn'} onClick={() => navigate('/learn')}>
        <StyledIcon>📚</StyledIcon>
        <span>学习</span>
      </NavItem>
      <NavItem $active={router.pathname === '/castle'} onClick={() => navigate('/castle')}>
        <StyledIcon>🏰</StyledIcon>
        <span>城堡</span>
      </NavItem>
      <NavItem $active={router.pathname === '/profile'} onClick={() => navigate('/profile')}>
        <StyledIcon>👤</StyledIcon>
        <span>我的</span>
      </NavItem>
    </StyledNav>
  )
}

export default Navigation 