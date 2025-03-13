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
  border: 1px solid #3B82F6;
  border-radius: 12px;
  overflow: hidden;
`

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: #3B82F6;
`

const CategoryContainer = styled.div`
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
`

const CategoryName = styled.h2`
  margin: 0;
  padding: 8px 12px;
  color: #3B82F6;
  font-size: 14px;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid #3B82F6;
  text-align: center;
`

const ParentPointsGrid = styled.div`
  display: flex;
  flex: 1;
  background: #93C5FD;
  gap: 1px;
`

const ParentPointCell = styled.div`
  flex: 1;
  height: 120px;
  display: grid;
  gap: 1px;
  background: #DBEAFE;
`

const KnowledgePointGrid = styled.div<{ count: number }>`
  display: grid;
  width: 100%;
  height: 100%;
  gap: 1px;
  ${({ count }) => {
    if (count <= 3) {
      return `grid-template-columns: repeat(${count}, 1fr);`;
    }
    if (count === 4) {
      return `grid-template-columns: repeat(4, 1fr);`;
    }
    if (count === 5) {
      return `
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: 1fr 1fr;
        & > *:nth-child(1) { grid-area: 1 / 1 / 2 / 3; }
        & > *:nth-child(2) { grid-area: 1 / 3 / 2 / 5; }
        & > *:nth-child(3) { grid-area: 1 / 5 / 2 / 7; }
        & > *:nth-child(4) { grid-area: 2 / 1 / 3 / 4; }
        & > *:nth-child(5) { grid-area: 2 / 4 / 3 / 7; }
      `;
    }
    if (count === 6) {
      return `
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
      `;
    }
    if (count === 7) {
      return `
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: 1fr 1fr;
        & > *:nth-child(1) { grid-area: 1 / 1 / 2 / 4; }
        & > *:nth-child(2) { grid-area: 1 / 4 / 2 / 7; }
        & > *:nth-child(3) { grid-area: 1 / 7 / 2 / 10; }
        & > *:nth-child(4) { grid-area: 1 / 10 / 2 / 13; }
        & > *:nth-child(5) { grid-area: 2 / 1 / 3 / 5; }
        & > *:nth-child(6) { grid-area: 2 / 5 / 3 / 9; }
        & > *:nth-child(7) { grid-area: 2 / 9 / 3 / 13; }
      `;
    }
    if (count === 8) {
      return `
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(2, 1fr);
      `;
    }
    if (count === 9) {
      return `
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
      `;
    }
    // 其他情况
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const lastRowItems = count % cols || cols;
    const lastRowStart = count - lastRowItems + 1;
    
    if (lastRowItems < cols) {
      const colSpan = Math.floor(cols * cols / lastRowItems);
      let extraCols = cols - (colSpan * lastRowItems);
      
      let gridAreas = '';
      for (let i = 1; i < lastRowStart; i++) {
        gridAreas += `& > *:nth-child(${i}) { grid-area: ${Math.floor((i-1)/cols) + 1} / ${((i-1)%cols) + 1} / ${Math.floor((i-1)/cols) + 2} / ${((i-1)%cols) + 2}; }\n`;
      }
      
      let currentCol = 1;
      for (let i = lastRowStart; i <= count; i++) {
        const span = colSpan + (extraCols > 0 ? 1 : 0);
        gridAreas += `& > *:nth-child(${i}) { grid-area: ${rows} / ${currentCol} / ${rows + 1} / ${currentCol + span}; }\n`;
        currentCol += span;
        extraCols--;
      }
      
      return `
        grid-template-columns: repeat(${cols}, 1fr);
        grid-template-rows: repeat(${rows}, 1fr);
        ${gridAreas}
      `;
    }
    
    return `
      grid-template-columns: repeat(${cols}, 1fr);
      grid-template-rows: repeat(${rows}, 1fr);
    `;
  }}
`

const KnowledgePointCell = styled.div`
  background: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #EFF6FF;
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
        <CategoryGrid>
          {categories.map(category => {
            const categoryParentPoints = pointsByCategory[category.id] || []
            if (categoryParentPoints.length === 0) return null

            return (
              <CategoryContainer key={category.id}>
                <CategoryName>{category.name}</CategoryName>
                <ParentPointsGrid>
                  {categoryParentPoints.map(parent => {
                    const childPoints = groupedPoints[parent.id] || []
                    return (
                      <ParentPointCell key={parent.id}>
                        <KnowledgePointGrid count={childPoints.length}>
                          {childPoints.map(point => (
                            <KnowledgePointCell
                              key={point.id}
                              onClick={() => handleCardClick(point)}
                            />
                          ))}
                        </KnowledgePointGrid>
                      </ParentPointCell>
                    )
                  })}
                </ParentPointsGrid>
              </CategoryContainer>
            )
          })}
        </CategoryGrid>
      </MainWrapper>
    </StyledContainer>
  )
}

export default KnowledgeMap 