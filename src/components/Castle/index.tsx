import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchCastles } from '@/store/slices/castleSlice'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`

const StyledHeader = styled.div`
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

const StyledCastle = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const StyledCastleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const StyledCastleInfo = styled.div`
  flex: 1;
`

const StyledCastleName = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const StyledCastleLevel = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
`

const StyledCastleStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const StyledStat = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const StyledStatLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const StyledStatValue = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: bold;
`

const StyledSection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`

const StyledSectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`

const StyledCard = styled.div<{ status?: 'constructing' | 'completed' }>`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  opacity: ${({ status }) => (status === 'constructing' ? 0.7 : 1)};
`

const StyledCardTitle = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const StyledCardInfo = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

export const Castle: React.FC = () => {
  const dispatch = useAppDispatch()
  const { castles, loading } = useAppSelector((state) => state.castle)

  useEffect(() => {
    dispatch(fetchCastles())
  }, [dispatch])

  if (loading) {
    return <div>加载中...</div>
  }

  const castle = castles[0] // 目前只显示第一个城堡

  if (!castle) {
    return (
      <StyledContainer>
        <StyledHeader>
          <StyledTitle>我的城堡</StyledTitle>
          <StyledDescription>
            你还没有城堡。通过学习获得智慧点数，建造属于你的知识城堡。
          </StyledDescription>
        </StyledHeader>
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>我的城堡</StyledTitle>
        <StyledDescription>
          这里是你的知识城堡，通过学习和建设，让它变得更加宏伟壮观。
        </StyledDescription>
      </StyledHeader>

      <StyledCastle>
        <StyledCastleHeader>
          <StyledCastleInfo>
            <StyledCastleName>{castle.name}</StyledCastleName>
            <StyledCastleLevel>等级: {castle.level}</StyledCastleLevel>
          </StyledCastleInfo>
        </StyledCastleHeader>

        <StyledCastleStats>
          <StyledStat>
            <StyledStatLabel>房间数量</StyledStatLabel>
            <StyledStatValue>{castle.rooms.length}</StyledStatValue>
          </StyledStat>
          <StyledStat>
            <StyledStatLabel>建筑数量</StyledStatLabel>
            <StyledStatValue>{castle.buildings.length}</StyledStatValue>
          </StyledStat>
          <StyledStat>
            <StyledStatLabel>居民数量</StyledStatLabel>
            <StyledStatValue>
              {castle.currentCapacity}/{castle.totalCapacity}
            </StyledStatValue>
          </StyledStat>
        </StyledCastleStats>

        <StyledSection>
          <StyledSectionTitle>房间</StyledSectionTitle>
          <StyledGrid>
            {castle.rooms.map((room) => (
              <StyledCard key={room.id} status={room.status}>
                <StyledCardTitle>{room.type}</StyledCardTitle>
                <StyledCardInfo>
                  等级: {room.level}
                  <br />
                  状态: {room.status === 'completed' ? '已完成' : '建造中'}
                </StyledCardInfo>
              </StyledCard>
            ))}
          </StyledGrid>
        </StyledSection>

        <StyledSection>
          <StyledSectionTitle>建筑</StyledSectionTitle>
          <StyledGrid>
            {castle.buildings.map((building) => (
              <StyledCard key={building.id} status={building.status}>
                <StyledCardTitle>{building.type}</StyledCardTitle>
                <StyledCardInfo>
                  等级: {building.level}
                  <br />
                  状态: {building.status === 'completed' ? '已完成' : '建造中'}
                </StyledCardInfo>
              </StyledCard>
            ))}
          </StyledGrid>
        </StyledSection>
      </StyledCastle>
    </StyledContainer>
  )
}