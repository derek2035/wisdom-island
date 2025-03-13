import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { KnowledgePoint, Category } from '@/types'
import { learningAPI } from '@/services/api'

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`

const MainWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`

const CategoryContainer = styled.div`
  background: ${({ theme }) => theme.colors.background};

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`

const CategoryWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
`

const CategoryName = styled.h2`
  margin: 0;
  padding: 12px 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 18px;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`

const ParentPointsGrid = styled.div<{ count: number }>`
  display: grid;
  gap: 1px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 0;

  ${({ count }) => {
    if (count <= 3) {
      return `grid-template-columns: repeat(${count}, 1fr);`
    }
    if (count === 4) {
      return 'grid-template-columns: repeat(4, 1fr);'
    }
    if (count === 5) {
      return `
        grid-template-columns: repeat(6, 1fr);
        grid-template-areas:
          "a a b b c c"
          "d d d e e e";
        & > *:nth-child(1) { grid-area: a; }
        & > *:nth-child(2) { grid-area: b; }
        & > *:nth-child(3) { grid-area: c; }
        & > *:nth-child(4) { grid-area: d; }
        & > *:nth-child(5) { grid-area: e; }
      `
    }
    if (count === 6) {
      return 'grid-template-columns: repeat(3, 1fr);'
    }
    if (count === 7) {
      return `
        grid-template-columns: repeat(12, 1fr);
        grid-template-areas:
          "a a a b b b c c c d d d"
          "e e e e f f f f g g g g";
        & > *:nth-child(1) { grid-area: a; }
        & > *:nth-child(2) { grid-area: b; }
        & > *:nth-child(3) { grid-area: c; }
        & > *:nth-child(4) { grid-area: d; }
        & > *:nth-child(5) { grid-area: e; }
        & > *:nth-child(6) { grid-area: f; }
        & > *:nth-child(7) { grid-area: g; }
      `
    }
    if (count === 8) {
      return 'grid-template-columns: repeat(4, 1fr);'
    }
    if (count === 9) {
      return 'grid-template-columns: repeat(3, 1fr);'
    }
    return 'grid-template-columns: repeat(4, 1fr);'
  }}
`

const ParentPointCell = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
`

const ParentPointHeader = styled.div`
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`

const ParentPointName = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`

const ChildrenGrid = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.background};
`

const KnowledgeCell = styled.div<{ level: number }>`
  height: 40px;
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    transform: scale(1.05);
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const KnowledgeMap = () => {
  const router = useRouter()
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log('开始获取数据...')
      const [pointsResponse, categoriesResponse] = await Promise.all([
        learningAPI.getKnowledgePoints(),
        learningAPI.getCategories()
      ])
      
      console.log('知识点响应:', pointsResponse)
      console.log('分类响应:', categoriesResponse)
      
      if (Array.isArray(pointsResponse) && Array.isArray(categoriesResponse)) {
        console.log('设置知识点数据:', pointsResponse.length, '条记录')
        console.log('设置分类数据:', categoriesResponse.length, '条记录')
        setKnowledgePoints(pointsResponse)
        setCategories(categoriesResponse)
      } else {
        console.error('响应格式错误:', pointsResponse, categoriesResponse)
        setError('获取数据失败')
      }
    } catch (error) {
      console.error('获取数据出错:', error)
      setError('获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 在渲染前打印状态
  console.log('当前状态:', {
    knowledgePoints: knowledgePoints.length,
    categories: categories.length,
    loading,
    error
  })

  // 打印分组数据
  const groupedPoints = knowledgePoints.reduce((acc, point) => {
    const parentId = point.parent_id || 'root'
    if (!acc[parentId]) {
      acc[parentId] = []
    }
    acc[parentId].push(point)
    return acc
  }, {} as Record<string | number, KnowledgePoint[]>)

  console.log('分组后的知识点:', {
    总知识点数: knowledgePoints.length,
    分组数: Object.keys(groupedPoints).length,
    各组数据: Object.keys(groupedPoints).map(key => ({
      parentId: key,
      count: groupedPoints[key].length
    }))
  })

  const handleCardClick = (point: KnowledgePoint) => {
    router.push(`/learn/${point.id}`)
  }

  if (loading) {
    return (
      <LoadingSpinner>加载中...</LoadingSpinner>
    )
  }

  if (knowledgePoints.length === 0) {
    return (
      <EmptyState>暂无知识点数据</EmptyState>
    )
  }

  // 获取所有父级知识点，并过滤掉没有子知识点的
  const parentPoints = knowledgePoints
    .filter(point => !point.parent_id)
    .filter(point => {
      // 检查是否有子知识点
      const hasChildren = knowledgePoints.some(p => p.parent_id === point.id)
      return hasChildren
    })

  console.log('Parent points with children:', parentPoints)

  // 按照分类分组父级知识点
  const pointsByCategory = parentPoints.reduce((acc, point) => {
    const categoryId = point.category_id
    console.log('Processing point:', point.title, 'with category:', categoryId)
    if (!acc[categoryId]) {
      acc[categoryId] = []
    }
    acc[categoryId].push(point)
    return acc
  }, {} as Record<number, KnowledgePoint[]>)
  
  console.log('Points by category (detailed):', Object.entries(pointsByCategory).map(([categoryId, points]) => ({
    categoryId,
    pointCount: points.length,
    points: points.map(p => ({ id: p.id, title: p.title }))
  })))
  console.log('Categories:', categories.map(c => ({ id: c.id, name: c.name })))

  return (
    <StyledContainer>
      <MainWrapper>
        {categories.map(category => {
          const categoryParentPoints = pointsByCategory[category.id] || []
          if (categoryParentPoints.length === 0) return null

          return (
            <CategoryContainer key={category.id}>
              <CategoryWrapper>
                <CategoryName>{category.name}</CategoryName>
                <ParentPointsGrid count={categoryParentPoints.length}>
                  {categoryParentPoints.map(parent => {
                    const childPoints = groupedPoints[parent.id] || []
                    return (
                      <ParentPointCell key={parent.id}>
                        <ParentPointHeader>
                          <ParentPointName>{parent.title}</ParentPointName>
                        </ParentPointHeader>
                        <ChildrenGrid>
                          {childPoints.map(point => (
                            <KnowledgeCell
                              key={point.id}
                              level={point.level}
                              onClick={() => handleCardClick(point)}
                            />
                          ))}
                        </ChildrenGrid>
                      </ParentPointCell>
                    )
                  })}
                </ParentPointsGrid>
              </CategoryWrapper>
            </CategoryContainer>
          )
        })}
      </MainWrapper>
    </StyledContainer>
  )
}

export default KnowledgeMap 