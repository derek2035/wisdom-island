import React from 'react'
import styled from 'styled-components'
import { User } from '@/types/user'

const StyledProfile = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`

const StyledAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 16px;
`

const StyledUserInfo = styled.div`
  flex: 1;
`

const StyledUsername = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #333;
`

const StyledLevel = styled.div`
  display: inline-block;
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  color: #666;
  margin-top: 8px;
`

const StyledStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
`

const StyledStat = styled.div`
  text-align: center;
`

const StyledStatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`

const StyledStatValue = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`

interface UserProfileProps {
  currentUser: User
}

const UserProfile: React.FC<UserProfileProps> = ({ currentUser }) => {
  return (
    <StyledProfile>
      <StyledHeader>
        <StyledAvatar src={currentUser.avatar} alt={currentUser.username} />
        <StyledUserInfo>
          <StyledUsername>{currentUser.username}</StyledUsername>
          <StyledLevel>Level {currentUser.level}</StyledLevel>
        </StyledUserInfo>
      </StyledHeader>
      <StyledStats>
        <StyledStat>
          <StyledStatLabel>智慧点</StyledStatLabel>
          <StyledStatValue>{currentUser.wisdomPoints}</StyledStatValue>
        </StyledStat>
        <StyledStat>
          <StyledStatLabel>等级</StyledStatLabel>
          <StyledStatValue>{currentUser.level}</StyledStatValue>
        </StyledStat>
        <StyledStat>
          <StyledStatLabel>邀请人数</StyledStatLabel>
          <StyledStatValue>{currentUser.invitedUsers?.length || 0}</StyledStatValue>
        </StyledStat>
      </StyledStats>
    </StyledProfile>
  )
}

export default UserProfile