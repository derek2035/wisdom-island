import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from '@/components/Layout'
import { RootState } from '@/store'
import { fetchKnowledgePoint, completeKnowledgePoint } from '@/store/slices/learningSlice'
import { AppDispatch } from '@/store'
import { Clock, Book, Award, BookOpen, CheckCircle, Target, Lightbulb, AlertCircle, ListTree, ChevronRight } from 'lucide-react'

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

const ProgressSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`

const ProgressTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`

const ProgressCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 16px;
  border-radius: 8px;
  text-align: center;
`

const ProgressValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`

const ProgressLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const RelatedSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`

const RelatedTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`

const RelatedCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`

const RelatedCardTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`

const RelatedCardMeta = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const ContentSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`

const ContentTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const KeyPointsList = styled.ul`
  margin: 0;
  padding-left: 20px;
  
  li {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 8px;
    line-height: 1.6;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const ExampleBox = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`

const ExampleTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`

const ExampleContent = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`

const TipsBox = styled.div`
  background: #FFF8E5;
  border-left: 4px solid #FFB800;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 0 8px 8px 0;
`

const ApplicationBox = styled.div`
  background: #F0F9FF;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`

const ChildPoints = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ChildPoint = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`

const ExpirationInfo = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 24px;
  background: ${({ theme }) => theme.colors.background};
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

const ExpirationTime = styled.span<{ isExpired: boolean }>`
  color: ${({ theme, isExpired }) => isExpired ? theme.colors.error : theme.colors.success};
  font-weight: 500;
`

export default function KnowledgePointDetail() {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch<AppDispatch>()
  const { currentKnowledgePoint, loading, error } = useSelector(
    (state: RootState) => state.learning
  )
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchKnowledgePoint(id as string))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (!currentKnowledgePoint?.lastCompletedAt) {
      setIsExpired(true)
      return
    }

    const completionCount = currentKnowledgePoint.completionCount || 0
    
    const getExpirationDays = (count: number) => {
      switch (count) {
        case 1: return 3  // 第一次完成：3天
        case 2: return 10 // 第二次完成：10天
        case 3: return 30 // 第三次完成：30天
        case 4: return 36500 // 第四次完成：约100年，相当于永不过期
        default: return 3 // 默认3天
      }
    }

    const lastCompletedAt = new Date(currentKnowledgePoint.lastCompletedAt)
    const expirationDays = getExpirationDays(completionCount)
    const expirationTime = new Date(lastCompletedAt.getTime() + expirationDays * 24 * 60 * 60 * 1000)

    const formatTimeSpan = (timeDiff: number) => {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (days > 0) {
        return `${days}天${hours}小时`
      }
      if (hours > 0) {
        return `${hours}小时${minutes}分钟`
      }
      return `${minutes}分钟`
    }

    const updateTimeLeft = () => {
      const now = new Date()
      const timeDiff = expirationTime.getTime() - now.getTime()
      const timeSinceCompletion = now.getTime() - lastCompletedAt.getTime()
      
      if (timeDiff <= 0) {
        setIsExpired(true)
        setTimeLeft(`距离上一次考核通过已经过去${formatTimeSpan(timeSinceCompletion)}`)
        return
      }

      setIsExpired(false)
      if (completionCount === 4) {
        setTimeLeft('恭喜你，已经完全掌握了这个知识点')
      } else {
        setTimeLeft(`${formatTimeSpan(timeDiff)}后需要重新复习并考核`)
      }
    }

    updateTimeLeft()
    const timer = setInterval(updateTimeLeft, 60000) // 每分钟更新一次

    return () => clearInterval(timer)
  }, [currentKnowledgePoint?.lastCompletedAt, currentKnowledgePoint?.completionCount])

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

  const getButtonText = () => {
    if (!currentKnowledgePoint) {
      return {
        studyButton: '开始学习',
        completeButton: '我要考试'
      }
    }

    // 从未通过考核的情况：completionCount 为 0 或 null，且 lastCompletedAt 为 null
    const hasNeverCompleted = !currentKnowledgePoint.completionCount && !currentKnowledgePoint.lastCompletedAt
    if (hasNeverCompleted) {
      return {
        studyButton: '开始学习',
        completeButton: '我要考试'
      }
    }

    const completionCount = currentKnowledgePoint.completionCount || 0
    if (completionCount >= 1 && completionCount < 4) {
      return {
        studyButton: '开始复习',
        completeButton: '我要考试'
      }
    } else if (completionCount >= 4) {
      return {
        studyButton: '开始复习',
        completeButton: null
      }
    }

    // 默认情况
    return {
      studyButton: '开始学习',
      completeButton: '我要考试'
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

  const buttonTexts = getButtonText()

  return (
    <Layout>
      <StyledContainer>
        <Title>{currentKnowledgePoint.title}</Title>
        <MetaInfo>
          <Tag>第 {currentKnowledgePoint.grade} 年级</Tag>
          <Tag>难度 {currentKnowledgePoint.level}</Tag>
          {(!currentKnowledgePoint.completionCount || isExpired) ? (
            <Tag>未完成</Tag>
          ) : (
            <Tag>已完成</Tag>
          )}
        </MetaInfo>

        {currentKnowledgePoint.lastCompletedAt && (
          <ExpirationInfo>
            <Clock size={16} />
            {isExpired ? (
              <ExpirationTime isExpired={true}>{timeLeft}</ExpirationTime>
            ) : (
              <ExpirationTime isExpired={false}>{timeLeft}</ExpirationTime>
            )}
          </ExpirationInfo>
        )}

        <Content>
          <ContentSection>
            <ContentTitle>
              <Target size={18} />
              学习目标
            </ContentTitle>
            <Description>
              {currentKnowledgePoint.objective || '暂无学习目标'}
            </Description>
          </ContentSection>

          <ContentSection>
            <ContentTitle>
              <CheckCircle size={18} />
              知识要点
            </ContentTitle>
            <KeyPointsList>
              {(currentKnowledgePoint.keyPoints || []).map((point, index) => (
                <li key={index}>{point}</li>
              ))}
              {(!currentKnowledgePoint.keyPoints || currentKnowledgePoint.keyPoints.length === 0) && (
                <li>暂无知识要点</li>
              )}
            </KeyPointsList>
          </ContentSection>

          <ContentSection>
            <ContentTitle>
              <Book size={18} />
              知识内容
            </ContentTitle>
            <Description>
              {currentKnowledgePoint.content}
            </Description>
          </ContentSection>

          {currentKnowledgePoint.children && currentKnowledgePoint.children.length > 0 && (
            <ContentSection>
              <ContentTitle>
                <ListTree size={18} />
                子知识点
              </ContentTitle>
              <ChildPoints>
                {currentKnowledgePoint.children.map((point) => (
                  <ChildPoint key={point.id} onClick={() => router.push(`/learn/${point.id}`)}>
                    <div>
                      <h4>{point.title}</h4>
                      <p>{point.content}</p>
                    </div>
                    <ChevronRight size={20} />
                  </ChildPoint>
                ))}
              </ChildPoints>
            </ContentSection>
          )}
        </Content>

        <ProgressSection>
          <ProgressTitle>
            <Award size={20} />
            学习进度
          </ProgressTitle>
          <ProgressGrid>
            <ProgressCard>
              <ProgressValue>{currentKnowledgePoint.completionCount || 0}</ProgressValue>
              <ProgressLabel>通过考核次数</ProgressLabel>
            </ProgressCard>
            <ProgressCard>
              <ProgressValue>25%</ProgressValue>
              <ProgressLabel>当前进度</ProgressLabel>
            </ProgressCard>
            <ProgressCard>
              <ProgressValue>120</ProgressValue>
              <ProgressLabel>累计学习时长(分钟)</ProgressLabel>
            </ProgressCard>
            <ProgressCard>
              <ProgressValue>85%</ProgressValue>
              <ProgressLabel>练习正确率</ProgressLabel>
            </ProgressCard>
          </ProgressGrid>
        </ProgressSection>

        <ButtonGroup>
          <Button onClick={handleStartLearning}>
            {buttonTexts.studyButton}
          </Button>
          {buttonTexts.completeButton && (
            <Button 
              onClick={handleComplete} 
              disabled={!isExpired && currentKnowledgePoint.isCompleted}
            >
              {buttonTexts.completeButton}
            </Button>
          )}
        </ButtonGroup>
      </StyledContainer>
    </Layout>
  )
}