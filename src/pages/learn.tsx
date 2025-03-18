import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { Layout } from '@/components/Layout'
import KnowledgeMap from '@/components/KnowledgeMap'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchKnowledgePoints } from '@/store/slices/learningSlice'
import type { KnowledgePoint } from '@/types'
import type { RootState } from '@/store'

const StyledContainer = styled.div`
  // padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const StyledSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const StyledTitle = styled.h2`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 20px;
`

const StyledButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary + 'dd'};
  }
`

const LearnPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const knowledgePoints = useAppSelector((state: RootState) => state.learning.knowledgePoints)
  const userProgress = useAppSelector((state: RootState) => state.learning.learningProgress)
  const loading = useAppSelector((state: RootState) => state.learning.loading)

  console.log({ knowledgePoints, userProgress, loading });
  useEffect(() => {
    dispatch(fetchKnowledgePoints())
  }, [dispatch])

  const handleStartLearning = () => {
    if (!knowledgePoints || knowledgePoints.length === 0) {
      alert('知识点数据正在加载中，请稍后再试...')
      return
    }

    // 获取所有知识点的完成次数
    const pointsWithProgress = knowledgePoints.map((point: KnowledgePoint) => {
      const progress = userProgress[point.id]
      return {
        ...point,
        completionCount: progress?.completed ? 1 : 0
      }
    })

    // 按完成次数和难度排序
    const sortedPoints = pointsWithProgress.sort((a, b) => {
      // 首先按完成次数排序
      if (a.completionCount !== b.completionCount) {
        return a.completionCount - b.completionCount
      }
      // 完成次数相同时，按难度级别排序
      if (a.level !== b.level) {
        return a.level - b.level
      }
      // 难度级别相同时，按年级排序
      return a.grade - b.grade
    })

    // 选择排序后的第一个知识点
    const selectedPoint = sortedPoints[0]
    router.push(`/learn/${selectedPoint.id}/study`)
  }

  return (
    <Layout>
      <StyledContainer>
        <KnowledgeMap />
        <StyledSection>
          <StyledTitle>自由学习</StyledTitle>
          <StyledButton
            onClick={handleStartLearning}
            disabled={
              loading || !knowledgePoints || knowledgePoints.length === 0
            }
          >
            {loading ? '加载中...' : '开始学习'}
          </StyledButton>
        </StyledSection>
        <StyledSection>
          <StyledTitle>知识竞猜</StyledTitle>
          <StyledButton onClick={() => router.push('/learn/quiz')}>
            开始竞猜
          </StyledButton>
        </StyledSection>
      </StyledContainer>
    </Layout>
  );
}

export default LearnPage