import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from '@/components/Layout'
import { RootState } from '@/store'
import { fetchKnowledgePoint, completeKnowledgePoint } from '@/store/slices/learningSlice'
import { AppDispatch } from '@/store'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Content = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`

const Description = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
`

const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`

const Tag = styled.span`
  background: ${({ theme }) => theme.colors.background};
  padding: 4px 12px;
  border-radius: 16px;
`

const Button = styled.button<{ isDisabled?: boolean }>`
  background: ${({ theme, isDisabled }) => isDisabled ? theme.colors.border : theme.colors.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: ${({ isDisabled }) => isDisabled ? 'not-allowed' : 'pointer'};
  font-size: 16px;
  margin-top: 24px;
  opacity: ${({ isDisabled }) => isDisabled ? 0.7 : 1};

  &:hover {
    opacity: ${({ isDisabled }) => isDisabled ? 0.7 : 0.9};
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  padding: 24px;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`

const PrimaryButton = styled(Button)`
  background: ${({ theme, isDisabled }) => isDisabled ? theme.colors.border : theme.colors.primary};
`

const SecondaryButton = styled(Button)`
  background: ${({ theme, isDisabled }) => isDisabled ? theme.colors.border : theme.colors.secondary};
`

export default function KnowledgePointDetail() {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch<AppDispatch>()
  const { currentKnowledgePoint, loading, error } = useSelector(
    (state: RootState) => state.learning
  )

  useEffect(() => {
    if (id) {
      dispatch(fetchKnowledgePoint(id as string))
    }
  }, [id, dispatch])

  const handleStartLearning = () => {
    router.push(`/learn/${id}/study`)
  }

  const handleComplete = async () => {
    if (id) {
      try {
        await dispatch(completeKnowledgePoint(id as string))
        router.push('/learn')
      } catch (error) {
        console.error('完成知识点失败:', error)
      }
    }
  }

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner>加载中...</LoadingSpinner>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage>{error}</ErrorMessage>
      </Layout>
    )
  }

  if (!currentKnowledgePoint) {
    return (
      <Layout>
        <ErrorMessage>未找到知识点</ErrorMessage>
      </Layout>
    )
  }

  return (
    <Layout>
      <StyledContainer>
        <Title>{currentKnowledgePoint.title}</Title>
        <MetaInfo>
          <Tag>第 {currentKnowledgePoint.grade} 年级</Tag>
          <Tag>难度 {currentKnowledgePoint.level}</Tag>
          {currentKnowledgePoint.isCompleted && <Tag>已完成</Tag>}
          {currentKnowledgePoint.completionCount > 0 && (
            <Tag>完成次数: {currentKnowledgePoint.completionCount}</Tag>
          )}
        </MetaInfo>
        <Content>
          <Description>{currentKnowledgePoint.content}</Description>
        </Content>
        <ButtonGroup>
          <PrimaryButton 
            onClick={handleStartLearning} 
            disabled={loading || !currentKnowledgePoint.isUnlocked} 
            isDisabled={loading || !currentKnowledgePoint.isUnlocked}
          >
            {currentKnowledgePoint.isUnlocked ? '开始学习' : '未解锁'}
          </PrimaryButton>
          {currentKnowledgePoint.isUnlocked && (
            <SecondaryButton 
              onClick={handleComplete} 
              disabled={loading} 
              isDisabled={loading}
            >
              {loading ? '提交中...' : '标记完成'}
            </SecondaryButton>
          )}
        </ButtonGroup>
      </StyledContainer>
    </Layout>
  )
}