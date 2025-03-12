import React from 'react'
import styled from 'styled-components'
import type { Building } from '@/types'

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 2px solid ${({ theme }) => theme.colors.secondary};
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

const StyledLevel = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: bold;
`

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const StyledPosition = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({ theme }) => theme.colors.secondary + '20'};
  color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
`

interface BuildingCardProps {
  building: Building
  onClick: () => void
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  onClick,
}) => {
  return (
    <StyledCard onClick={onClick}>
      <StyledHeader>
        <StyledTitle>{building.type}</StyledTitle>
        <StyledLevel>Lv.{building.level}</StyledLevel>
      </StyledHeader>
      <StyledInfo>
        <div>类型: {building.type}</div>
        <div>等级: {building.level}</div>
      </StyledInfo>
      <StyledPosition>
        位置: ({building.position.x}, {building.position.y})
      </StyledPosition>
    </StyledCard>
  )
}