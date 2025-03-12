import React from 'react'
import styled from 'styled-components'
import type { Room } from '@/types'

const StyledCard = styled.div<{ $isRented: boolean }>`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 2px solid
    ${({ theme, $isRented }) =>
      $isRented ? theme.colors.success : theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const StyledTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`

const StyledPrice = styled.span`
  color: ${({ theme }) => theme.colors.warning};
  font-weight: bold;
`

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const StyledStatus = styled.div<{ $isRented: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({ theme, $isRented }) =>
    $isRented ? theme.colors.success + '20' : theme.colors.primary + '20'};
  color: ${({ theme, $isRented }) =>
    $isRented ? theme.colors.success : theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
`

const getRoomTypeName = (type: Room['type']) => {
  const typeMap: Record<Room['type'], string> = {
    cottage: '小屋',
    villa: '别墅',
    apartment: '公寓',
    hotel: '酒店',
    superApartment: '豪华公寓',
  }
  return typeMap[type]
}

interface RoomCardProps {
  room: Room
  onClick: () => void
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  return (
    <StyledCard $isRented={room.isRented} onClick={onClick}>
      <StyledHeader>
        <StyledTitle>{getRoomTypeName(room.type)}</StyledTitle>
        <StyledPrice>🪙 {room.price}</StyledPrice>
      </StyledHeader>
      <StyledInfo>
        <div>容量: {room.capacity} 人</div>
        {room.isRented && room.rentExpiresAt && (
          <div>
            到期时间:{' '}
            {new Date(room.rentExpiresAt).toLocaleDateString('zh-CN')}
          </div>
        )}
      </StyledInfo>
      <StyledStatus $isRented={room.isRented}>
        {room.isRented ? '已出租' : '可租用'}
      </StyledStatus>
    </StyledCard>
  )
}