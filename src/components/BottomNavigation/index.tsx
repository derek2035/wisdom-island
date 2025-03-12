import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
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

const StyledLink = styled.a<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.text.secondary)};
  font-size: 12px;
  padding: 4px 8px;
`

const StyledIcon = styled.span`
  font-size: 24px;
  margin-bottom: 4px;
`

const BottomNavigation = () => {
  const router = useRouter()
  const currentPath = router.pathname

  return (
    <StyledNav>
      <Link href="/" passHref>
        <StyledLink active={currentPath === '/'}>
          <StyledIcon>🏠</StyledIcon>
          <span>首页</span>
        </StyledLink>
      </Link>
      <Link href="/learn" passHref>
        <StyledLink active={currentPath === '/learn'}>
          <StyledIcon>📚</StyledIcon>
          <span>学习</span>
        </StyledLink>
      </Link>
      <Link href="/profile" passHref>
        <StyledLink active={currentPath === '/profile'}>
          <StyledIcon>👤</StyledIcon>
          <span>我的</span>
        </StyledLink>
      </Link>
    </StyledNav>
  )
}

export default BottomNavigation 