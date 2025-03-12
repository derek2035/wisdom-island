import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from '@/components/Layout'
import { RootState } from '@/store'
import { AppDispatch } from '@/store'
import { fetchKnowledgePoint } from '@/store/slices/learningSlice'

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

const Section = styled.div`
  margin-bottom: 32px;
`

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const Description = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
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

export default function StudyPage() {
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

  if (!currentKnowledgePoint.isUnlocked) {
    router.push(`/learn/${id}`)
    return null
  }

  return (
    <Layout>
      <StyledContainer>
        <Title>{currentKnowledgePoint.title}</Title>
        <Content>
          <Section>
            <SectionTitle>知识点介绍</SectionTitle>
            <Description>{currentKnowledgePoint.content}</Description>
          </Section>
          
          <Section>
            <SectionTitle>学习内容</SectionTitle>
            {/* 这里可以添加具体的学习内容，如视频、图片、文本等 */}
            <Description>
              学习内容将在这里展示...
            </Description>
          </Section>

          <Section>
            <SectionTitle>练习题</SectionTitle>
            {/* 这里可以添加练习题组件 */}
            <Description>
              练习题将在这里展示...
            </Description>
          </Section>
        </Content>
      </StyledContainer>
    </Layout>
  )
} 