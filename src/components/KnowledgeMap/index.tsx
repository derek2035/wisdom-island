import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { KnowledgePoint, Category } from '@/types'
import { learningAPI } from '@/services/api'
import { ArrowLeft } from 'lucide-react'

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

const CategoryContainer = styled.div<{ isClickable?: boolean }>`
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  ${({ isClickable }) => isClickable && `
    cursor: pointer;
    &:hover {
      background: #F8FAFC;
    }
  `}
`

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  border-bottom: 1px solid #3B82F6;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
`

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  margin-left: 12px;
  cursor: pointer;
  color: #3B82F6;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  
  &:hover {
    background: #EFF6FF;
    border-radius: 4px;
  }
`

const CategoryName = styled.h2<{ isMain?: boolean }>`
  margin: 0;
  padding: 8px 12px;
  color: #3B82F6;
  font-size: 14px;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: ${({ isMain }) => isMain ? 'none' : '1px solid #3B82F6'};
  text-align: center;
  flex: 1;
`

const ParentPointsGrid = styled.div`
  display: flex;
  flex: 1;
  background: #93C5FD;
  gap: 1px;
`

const ParentPointCell = styled.div<{ isClickable?: boolean }>`
  flex: 1;
  display: grid;
  gap: 1px;
  background: #DBEAFE;
  ${({ isClickable }) => isClickable && `
    cursor: pointer;
    &:hover {
      background: #F8FAFC;
    }
  `}
`

const ParentPointName = styled.h3`
  margin: 0;
  padding: 8px 12px;
  color: #3B82F6;
  font-size: 14px;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid #93C5FD;
  text-align: center;
`

const ExpandedParentPointsGrid = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  background: #93C5FD;
  gap: 1px;
  flex: 1;
`

const ExpandedParentPointRow = styled.div`
  display: flex;
  gap: 1px;
  background: #93C5FD;
`

const ExpandedParentPointCell = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #DBEAFE;
  min-height: 120px;
`

const KnowledgePointGrid = styled.div<{ count: number }>`
  display: grid;
  width: 100%;
  gap: 1px;
  background: #DBEAFE;
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
        grid-template-rows: repeat(2, 1fr);
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
        grid-template-rows: repeat(2, 1fr);
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

const KnowledgePointCell = styled.div<{ hasTitle?: boolean }>`
  background: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ hasTitle }) => hasTitle && `
    font-size: 12px;
    color: ${({ theme }) => theme.colors.text.primary};
    padding: 0 8px;
    text-align: center;
  `}

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

interface ViewState {
  type: 'all' | 'category' | 'parent';
  category?: Category;
  parent?: KnowledgePoint;
}

const KnowledgeMap = () => {
  const router = useRouter()
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<ViewState>({ type: 'all' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pointsResponse, categoriesResponse] = await Promise.all([
        learningAPI.getKnowledgePoints(),
        learningAPI.getCategories()
      ])
      
      if (Array.isArray(pointsResponse) && Array.isArray(categoriesResponse)) {
        setKnowledgePoints(pointsResponse)
        setCategories(categoriesResponse)
      } else {
        setError('获取数据失败')
      }
    } catch (error) {
      setError('获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation()
    setView({ type: 'category', category })
  }

  const handleParentClick = (parent: KnowledgePoint, e: React.MouseEvent) => {
    e.stopPropagation()
    setView({ type: 'parent', category: view.category, parent })
  }

  const handleBack = () => {
    if (view.type === 'parent') {
      setView({ type: 'category', category: view.category })
    } else {
      setView({ type: 'all' })
    }
  }

  const handlePointClick = (point: KnowledgePoint, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/learn/${point.id}`)
  }

  if (loading) {
    return <LoadingSpinner>加载中...</LoadingSpinner>
  }

  if (error || knowledgePoints.length === 0) {
    return <EmptyState>暂无知识点数据</EmptyState>
  }

  const parentPoints = knowledgePoints.filter(point => !point.parent_id)
  const pointsByCategory = parentPoints.reduce((acc, point) => {
    const categoryId = point.category_id
    if (!acc[categoryId]) {
      acc[categoryId] = []
    }
    acc[categoryId].push(point)
    return acc
  }, {} as Record<number, KnowledgePoint[]>)

  const getChildPoints = (parentId: number) => {
    return knowledgePoints
      .filter(point => point.parent_id === parentId)
      .sort((a, b) => a.title.length - b.title.length)
  }

  if (view.type === 'parent' && view.parent) {
    const childPoints = getChildPoints(view.parent.id)
    
    return (
      <StyledContainer>
        <MainWrapper>
          <CategoryContainer>
            <Header>
              <BackButton onClick={handleBack}>
                <ArrowLeft size={20} />
              </BackButton>
              <CategoryName isMain>{view.parent.title}</CategoryName>
            </Header>
            <ParentPointsGrid>
              <ParentPointCell>
                <KnowledgePointGrid count={childPoints.length}>
                  {childPoints.map(point => (
                    <KnowledgePointCell
                      key={point.id}
                      onClick={(e) => handlePointClick(point, e)}
                      hasTitle
                    >
                      {point.title}
                    </KnowledgePointCell>
                  ))}
                </KnowledgePointGrid>
              </ParentPointCell>
            </ParentPointsGrid>
          </CategoryContainer>
        </MainWrapper>
      </StyledContainer>
    )
  }

  if (view.type === 'category' && view.category) {
    const categoryPoints = pointsByCategory[view.category.id] || []
    const midPoint = Math.ceil(categoryPoints.length / 2)
    const firstRow = categoryPoints.slice(0, midPoint)
    const secondRow = categoryPoints.slice(midPoint)
    
    return (
      <StyledContainer>
        <MainWrapper>
          <CategoryContainer>
            <Header>
              <BackButton onClick={handleBack}>
                <ArrowLeft size={20} />
              </BackButton>
              <CategoryName isMain>{view.category.name}</CategoryName>
            </Header>
            <ExpandedParentPointsGrid>
              <ExpandedParentPointRow>
                {firstRow.map(parent => {
                  const childPoints = getChildPoints(parent.id)
                  if (childPoints.length === 0) return null
                  
                  return (
                    <ExpandedParentPointCell
                      key={parent.id}
                      onClick={(e) => handleParentClick(parent, e)}
                    >
                      <ParentPointName>{parent.title}</ParentPointName>
                      <KnowledgePointGrid count={childPoints.length}>
                        {childPoints.map(point => (
                          <KnowledgePointCell
                            key={point.id}
                            onClick={(e) => handleParentClick(parent, e)}
                          />
                        ))}
                      </KnowledgePointGrid>
                    </ExpandedParentPointCell>
                  )
                })}
              </ExpandedParentPointRow>
              <ExpandedParentPointRow>
                {secondRow.map(parent => {
                  const childPoints = getChildPoints(parent.id)
                  if (childPoints.length === 0) return null
                  
                  return (
                    <ExpandedParentPointCell
                      key={parent.id}
                      onClick={(e) => handleParentClick(parent, e)}
                    >
                      <ParentPointName>{parent.title}</ParentPointName>
                      <KnowledgePointGrid count={childPoints.length}>
                        {childPoints.map(point => (
                          <KnowledgePointCell
                            key={point.id}
                            onClick={(e) => handleParentClick(parent, e)}
                          />
                        ))}
                      </KnowledgePointGrid>
                    </ExpandedParentPointCell>
                  )
                })}
              </ExpandedParentPointRow>
            </ExpandedParentPointsGrid>
          </CategoryContainer>
        </MainWrapper>
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <MainWrapper>
        <CategoryGrid>
          {categories.map(category => {
            const categoryPoints = pointsByCategory[category.id] || []
            if (categoryPoints.length === 0) return null

            return (
              <CategoryContainer
                key={category.id}
                isClickable
                onClick={(e) => handleCategoryClick(category, e)}
              >
                <CategoryName>{category.name}</CategoryName>
                <ParentPointsGrid>
                  {categoryPoints.map(parent => {
                    const childPoints = getChildPoints(parent.id)
                    if (childPoints.length === 0) return null
                    
                    return (
                      <ParentPointCell
                        key={parent.id}
                        isClickable
                        onClick={(e) => handleParentClick(parent, e)}
                      >
                        <KnowledgePointGrid count={childPoints.length}>
                          {childPoints.map(point => (
                            <KnowledgePointCell
                              key={point.id}
                              onClick={(e) => handleCategoryClick(category, e)}
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