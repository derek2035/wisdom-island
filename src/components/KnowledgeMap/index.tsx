import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { KnowledgePoint, Category } from '@/types'
import { learningAPI } from '@/services/api'

const StyledContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`

const CategoryContainer = styled.div`
  margin-bottom: 32px;
`

const CategoryName = styled.h2`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 18px;
  font-weight: 500;
`

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const CategoryRow = styled.div`
  display: flex;
  gap: 2px;
`

const ParentCell = styled.div<{ level: number }>`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`

const ChildrenContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  flex: 1;
`

const KnowledgeCell = styled.div<{ level: number }>`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
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

  // 获取所有父级知识点
  const parentPoints = knowledgePoints.filter(point => !point.parent_id)
  console.log('Parent points:', parentPoints)

  // 按照分类分组父级知识点
  const pointsByCategory = parentPoints.reduce((acc, point) => {
    const categoryId = point.category_id
    if (!acc[categoryId]) {
      acc[categoryId] = []
    }
    acc[categoryId].push(point)
    return acc
  }, {} as Record<number, KnowledgePoint[]>)
  console.log('Points by category:', pointsByCategory)
  console.log('Categories:', categories)

  return (
    <StyledContainer>
      {categories.map(category => {
        const categoryParentPoints = pointsByCategory[category.id] || []
        if (categoryParentPoints.length === 0) return null

        return (
          <CategoryContainer key={category.id}>
            <CategoryName>{category.name}</CategoryName>
            <GridContainer>
              {categoryParentPoints.map(parent => {
                const childPoints = groupedPoints[parent.id] || []
                if (childPoints.length === 0) return null

                return (
                  <CategoryRow key={parent.id}>
                    <ParentCell
                      level={parent.level}
                      onClick={() => handleCardClick(parent)}
                    />
                    <ChildrenContainer>
                      {childPoints.map(point => (
                        <KnowledgeCell
                          key={point.id}
                          level={point.level}
                          onClick={() => handleCardClick(point)}
                        />
                      ))}
                    </ChildrenContainer>
                  </CategoryRow>
                )
              })}
            </GridContainer>
          </CategoryContainer>
        )
      })}
    </StyledContainer>
  )
}

export default KnowledgeMap 