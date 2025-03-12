import React from 'react'
import styled from 'styled-components'
import type { KnowledgePoint } from '@/types'

const StyledCard = styled.div<{ $isUnlocked: boolean; $isCompleted: boolean }>`
  background-color: ${({ theme, $isUnlocked, $isCompleted }) =>
    $isCompleted
      ? theme.colors.success + '20'
      : $isUnlocked
      ? theme.colors.white
      : theme.colors.text.disabled + '20'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: ${({ $isUnlocked }) => ($isUnlocked ? 'pointer' : 'not-allowed')};
  transition: all 0.2s ease-in-out;
  border: 2px solid
    ${({ theme, $isUnlocked, $isCompleted }) =>
      $isCompleted
        ? theme.colors.success
        : $isUnlocked
        ? theme.colors.primary
        : 'transparent'};

  &:hover {
    transform: ${({ $isUnlocked }) => ($isUnlocked ? 'translateY(-2px)' : 'none')};
    box-shadow: ${({ theme, $isUnlocked }) =>
      $isUnlocked ? theme.shadows.md : theme.shadows.sm};
  }
`

const StyledTitle = styled.h3<{ $isUnlocked: boolean }>`
  color: ${({ theme, $isUnlocked }) =>
    $isUnlocked ? theme.colors.text.primary : theme.colors.text.disabled};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const StyledDescription = styled.p<{ $isUnlocked: boolean }>`
  color: ${({ theme, $isUnlocked }) =>
    $isUnlocked ? theme.colors.text.secondary : theme.colors.text.disabled};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const StyledStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const StyledBadge = styled.span<{ $type: 'locked' | 'completed' | 'inProgress' }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, $type }) =>
    $type === 'completed'
      ? theme.colors.success + '20'
      : $type === 'inProgress'
      ? theme.colors.primary + '20'
      : theme.colors.text.disabled + '20'};
  color: ${({ theme, $type }) =>
    $type === 'completed'
      ? theme.colors.success
      : $type === 'inProgress'
      ? theme.colors.primary
      : theme.colors.text.disabled};
`

interface KnowledgeCardProps {
  knowledge: KnowledgePoint
  onClick: () => void
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  knowledge,
  onClick,
}) => {
  const getStatus = () => {
    if (!knowledge.isUnlocked) return '🔒 未解锁'
    if (knowledge.isCompleted) return '✅ 已完成'
    return '📚 学习中'
  }

  const getBadgeType = (): 'locked' | 'completed' | 'inProgress' => {
    if (!knowledge.isUnlocked) return 'locked'
    if (knowledge.isCompleted) return 'completed'
    return 'inProgress'
  }

  return (
    <StyledCard
      $isUnlocked={knowledge.isUnlocked}
      $isCompleted={knowledge.isCompleted}
      onClick={knowledge.isUnlocked ? onClick : undefined}
    >
      <StyledTitle $isUnlocked={knowledge.isUnlocked}>
        {knowledge.title}
      </StyledTitle>
      <StyledDescription $isUnlocked={knowledge.isUnlocked}>
        {knowledge.description}
      </StyledDescription>
      <StyledStatus>
        <StyledBadge $type={getBadgeType()}>{getStatus()}</StyledBadge>
        {knowledge.completionCount > 0 && (
          <span>完成次数: {knowledge.completionCount}</span>
        )}
      </StyledStatus>
    </StyledCard>
  )
} 