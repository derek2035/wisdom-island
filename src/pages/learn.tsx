import React from 'react'
import styled from 'styled-components'
import { Layout } from '@/components/Layout'
import KnowledgeMap from '@/components/KnowledgeMap'

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
  return (
    <Layout>
      <StyledContainer>
        <KnowledgeMap />
        <StyledSection>
          <StyledTitle>自由学习</StyledTitle>
          <StyledButton>开始学习</StyledButton>
        </StyledSection>
      </StyledContainer>
    </Layout>
  )
}

export default LearnPage