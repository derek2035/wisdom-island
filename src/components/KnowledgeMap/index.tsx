import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { KnowledgePoint, Category, UserKnowledgeProgress } from '@/types'
import { learningAPI } from '@/services/api'
import { ArrowLeft } from 'lucide-react'
import { DefaultTheme } from 'styled-components'

// 颜色值定义
const COMPLETION_COLORS = {
  0: '#FFFFFF', // 默认背景色
  1: '#E9FFE9',
  2: '#C6FFC6',
  3: '#90EE90',
  4: '#50C878'
} as const;

// 计算RGB颜色值
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// RGB转Hex
const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// 计算平均颜色
const calculateAverageColor = (completionCounts: number[]) => {
  if (completionCounts.length === 0) return COMPLETION_COLORS[0];

  const colors = completionCounts.map(count => {
    const colorKey = Math.min(4, count) as keyof typeof COMPLETION_COLORS;
    return hexToRgb(COMPLETION_COLORS[colorKey])!;
  });

  const avgColor = {
    r: colors.reduce((sum, c) => sum + c.r, 0) / colors.length,
    g: colors.reduce((sum, c) => sum + c.g, 0) / colors.length,
    b: colors.reduce((sum, c) => sum + c.b, 0) / colors.length
  };

  return rgbToHex(avgColor.r, avgColor.g, avgColor.b);
};

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
    opacity: 0.8;
  }
`

const CategoryName = styled.h2<{ isMain?: boolean; avgColor?: string }>`
  margin: 0;
  padding: 8px 12px;
  color: #3B82F6;
  font-size: 14px;
  font-weight: 500;
  background: ${({ avgColor }) => avgColor || '#FFFFFF'};
  border-bottom: ${({ isMain }) => isMain ? 'none' : '1px solid #3B82F6'};
  text-align: center;
  flex: 1;
`

const ParentPointsGrid = styled.div`
  display: flex;
  flex: 1;
  background: #93C5FD;
  gap: 1px;
  height: 80px;
`

const ParentPointCell = styled.div<{ isClickable?: boolean }>`
  flex: 1;
  display: grid;
  gap: 1px;
  background: #DBEAFE;
  min-height: 80px;
  ${({ isClickable }) => isClickable && `
    cursor: pointer;
  `}
`

const ParentPointName = styled.h3`
  margin: 0;
  padding: 0;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid #93c5fd;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
`;

const ExpandedParentPointsGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(2, auto);
  background: #93c5fd;
  gap: 1px;
  flex: 1;
  min-height: 80px;
`;

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
  min-height: 80px;
`

const KnowledgePointGrid = styled.div<{ count: number }>`
  display: grid;
  width: 100%;
  gap: 1px;
  background: #dbeafe;
  min-height: 80px;
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
      const colSpan = Math.floor((cols * cols) / lastRowItems);
      let extraCols = cols - colSpan * lastRowItems;

      let gridAreas = '';
      for (let i = 1; i < lastRowStart; i++) {
        gridAreas += `& > *:nth-child(${i}) { grid-area: ${
          Math.floor((i - 1) / cols) + 1
        } / ${((i - 1) % cols) + 1} / ${Math.floor((i - 1) / cols) + 2} / ${
          ((i - 1) % cols) + 2
        }; }\n`;
      }

      let currentCol = 1;
      for (let i = lastRowStart; i <= count; i++) {
        const span = colSpan + (extraCols > 0 ? 1 : 0);
        gridAreas += `& > *:nth-child(${i}) { grid-area: ${rows} / ${currentCol} / ${
          rows + 1
        } / ${currentCol + span}; }\n`;
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
`;

const KnowledgePointCell = styled.div<{ hasTitle?: boolean; completedTimes?: number }>`
  background: ${({ completedTimes }) => {
    if (completedTimes === undefined) return COMPLETION_COLORS[0];
    return COMPLETION_COLORS[Math.min(4, completedTimes) as keyof typeof COMPLETION_COLORS];
  }};
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ hasTitle, theme }) =>
    hasTitle &&
    `
    font-size: 12px;
    color: ${theme.colors.text.primary};
    padding: 16px 8px;
    text-align: center;
  `}
`;

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

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  text-align: center;
`

const ProgressContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
`

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
`

const ProgressBar = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background: #3B82F6;
  border-radius: 4px;
  transition: width 0.3s ease;
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
  const [userProgress, setUserProgress] = useState<Record<number, UserKnowledgeProgress>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<ViewState>({ type: 'all' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pointsResponse, categoriesResponse, progressResponse] = await Promise.all([
        learningAPI.getKnowledgePoints(),
        learningAPI.getCategories(),
        learningAPI.getUserProgress("1") // 获取用户ID 1的学习记录
      ])
      
      if (Array.isArray(pointsResponse) && Array.isArray(categoriesResponse)) {
        setKnowledgePoints(pointsResponse)
        setCategories(categoriesResponse)
        
        // 将学习记录转换为以知识点ID为键的对象
        if (Array.isArray(progressResponse)) {
          const progressMap: Record<number, UserKnowledgeProgress> = {}
          progressResponse.forEach((progress: UserKnowledgeProgress) => {
            progressMap[progress.knowledge_point_id] = progress
          })
          setUserProgress(progressMap)
        }
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

  const calculateProgress = (points: KnowledgePoint[]) => {
    if (points.length === 0) return 0;
    
    const totalPossibleCompletions = points.length * 4; // 每个知识点最多完成4次
    const totalCompletions = points.reduce((sum, point) => {
      const completedTimes = userProgress[point.id]?.completed_times || 0;
      return sum + Math.min(completedTimes, 4); // 限制最大完成次数为4
    }, 0);
    
    return Math.round((totalCompletions / totalPossibleCompletions) * 100);
  }

  const calculateOverallProgress = () => {
    return calculateProgress(knowledgePoints);
  }

  const calculateCategoryProgress = (categoryId: number) => {
    const categoryParentPoints = pointsByCategory[categoryId] || [];
    const allChildPoints = categoryParentPoints.flatMap(parent => getChildPoints(parent.id));
    return calculateProgress(allChildPoints);
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

  const renderProgress = () => {
    let progress = calculateOverallProgress();
    let label = '总体完成进度';

    if (view.type === 'category' && view.category) {
      progress = calculateCategoryProgress(view.category.id);
      label = `${view.category.name}完成进度`;
    } else if (view.type === 'parent' && view.parent) {
      const childPoints = getChildPoints(view.parent.id);
      progress = calculateProgress(childPoints);
      label = `${view.parent.title}完成进度`;
    }

    return (
      <ProgressContainer>
        <ProgressLabel>
          <span>{label}</span>
          <span>{progress}%</span>
        </ProgressLabel>
        <ProgressBarContainer>
          <ProgressBar progress={progress} />
        </ProgressBarContainer>
      </ProgressContainer>
    );
  };

  if (view.type === 'parent' && view.parent) {
    const childPoints = getChildPoints(view.parent.id)
    const completionCounts = childPoints.map(point => userProgress[point.id]?.completed_times || 0);
    const avgColor = calculateAverageColor(completionCounts);
    
    return (
      <StyledContainer>
        <Title>知识图谱</Title>
        <MainWrapper>
          <CategoryContainer>
            <Header>
              <BackButton onClick={handleBack}>
                <ArrowLeft size={20} />
              </BackButton>
              <CategoryName isMain avgColor={avgColor}>{view.parent.title}</CategoryName>
            </Header>
            <ParentPointsGrid>
              <ParentPointCell>
                <KnowledgePointGrid count={childPoints.length}>
                  {childPoints.map(point => (
                    <KnowledgePointCell
                      key={point.id}
                      onClick={(e) => handlePointClick(point, e)}
                      hasTitle
                      completedTimes={userProgress[point.id]?.completed_times || 0}
                    >
                      {point.title}
                    </KnowledgePointCell>
                  ))}
                </KnowledgePointGrid>
              </ParentPointCell>
            </ParentPointsGrid>
          </CategoryContainer>
        </MainWrapper>
        {renderProgress()}
      </StyledContainer>
    )
  }

  if (view.type === 'category' && view.category) {
    const categoryPoints = pointsByCategory[view.category.id] || []
    const midPoint = Math.ceil(categoryPoints.length / 2)
    const firstRow = categoryPoints.slice(0, midPoint)
    const secondRow = categoryPoints.slice(midPoint)
    
    const allChildPoints = categoryPoints.flatMap(parent => getChildPoints(parent.id));
    const completionCounts = allChildPoints.map(point => userProgress[point.id]?.completed_times || 0);
    const avgColor = calculateAverageColor(completionCounts);
    
    return (
      <StyledContainer>
        <Title>知识图谱</Title>
        <MainWrapper>
          <CategoryContainer>
            <Header>
              <BackButton onClick={handleBack}>
                <ArrowLeft size={20} />
              </BackButton>
              <CategoryName isMain avgColor={avgColor}>{view.category.name}</CategoryName>
            </Header>
            <ExpandedParentPointsGrid>
              <ExpandedParentPointRow>
                {firstRow.map(parent => {
                  const childPoints = getChildPoints(parent.id)
                  if (childPoints.length === 0) return null
                  
                  const parentCompletionCounts = childPoints.map(point => userProgress[point.id]?.completed_times || 0);
                  const parentAvgColor = calculateAverageColor(parentCompletionCounts);
                  
                  return (
                    <ExpandedParentPointCell
                      key={parent.id}
                      onClick={(e) => handleParentClick(parent, e)}
                    >
                      <ParentPointName style={{ background: parentAvgColor }}>{parent.title}</ParentPointName>
                      <KnowledgePointGrid count={childPoints.length}>
                        {childPoints.map(point => (
                          <KnowledgePointCell
                            key={point.id}
                            onClick={(e) => handleParentClick(parent, e)}
                            completedTimes={userProgress[point.id]?.completed_times || 0}
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
                  
                  const parentCompletionCounts = childPoints.map(point => userProgress[point.id]?.completed_times || 0);
                  const parentAvgColor = calculateAverageColor(parentCompletionCounts);
                  
                  return (
                    <ExpandedParentPointCell
                      key={parent.id}
                      onClick={(e) => handleParentClick(parent, e)}
                    >
                      <ParentPointName style={{ background: parentAvgColor }}>{parent.title}</ParentPointName>
                      <KnowledgePointGrid count={childPoints.length}>
                        {childPoints.map(point => (
                          <KnowledgePointCell
                            key={point.id}
                            onClick={(e) => handleParentClick(parent, e)}
                            completedTimes={userProgress[point.id]?.completed_times || 0}
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
        {renderProgress()}
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <Title>知识图谱</Title>
      <MainWrapper>
        <CategoryGrid>
          {categories.map(category => {
            const categoryPoints = pointsByCategory[category.id] || []
            if (categoryPoints.length === 0) return null

            // 计算分类下所有知识点的平均完成度颜色
            const allChildPoints = categoryPoints.flatMap(parent => getChildPoints(parent.id));
            const completionCounts = allChildPoints.map(point => userProgress[point.id]?.completed_times || 0);
            const avgColor = calculateAverageColor(completionCounts);

            return (
              <CategoryContainer
                key={category.id}
                isClickable
                onClick={(e) => handleCategoryClick(category, e)}
              >
                <CategoryName avgColor={avgColor}>{category.name}</CategoryName>
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
                              completedTimes={userProgress[point.id]?.completed_times || 0}
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
      {renderProgress()}
    </StyledContainer>
  )
}

export default KnowledgeMap 