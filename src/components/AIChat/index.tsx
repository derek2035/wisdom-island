import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { aiAPI } from '@/services/api'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  height: calc(100vh - 200px);
`

const StyledHeader = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const StyledTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const StyledDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  max-width: 600px;
  margin: 0 auto;
`

const StyledChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`

const StyledMessages = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const StyledMessage = styled.div<{ isUser?: boolean }>`
  display: flex;
  flex-direction: ${({ isUser }) => (isUser ? 'row-reverse' : 'row')};
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
`

const StyledAvatar = styled.div<{ isUser?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme, isUser }) =>
    isUser ? theme.colors.primary + '20' : theme.colors.success + '20'};
  color: ${({ theme, isUser }) =>
    isUser ? theme.colors.primary : theme.colors.success};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`

const StyledBubble = styled.div<{ isUser?: boolean }>`
  max-width: 70%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, isUser }) =>
    isUser ? theme.colors.primary + '10' : theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.5;
`

const StyledInputContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.white};
`

const StyledForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`

const StyledInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  outline: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary + '20'};
  }
`

const StyledButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary + 'dd'};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
  }
`

interface Message {
  id: string
  content: string
  isUser: boolean
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await aiAPI.chat(userMessage.content)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.reply,
        isUser: false,
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('AI回复失败:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，我现在无法回答你的问题。请稍后再试。',
        isUser: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>AI助手</StyledTitle>
        <StyledDescription>
          我是你的智慧伙伴，可以帮助你解答问题、提供学习建议。
          我们一起探索知识的海洋吧！
        </StyledDescription>
      </StyledHeader>

      <StyledChatContainer>
        <StyledMessages>
          {messages.map((message) => (
            <StyledMessage key={message.id} isUser={message.isUser}>
              <StyledAvatar isUser={message.isUser}>
                {message.isUser ? 'U' : 'AI'}
              </StyledAvatar>
              <StyledBubble isUser={message.isUser}>
                {message.content}
              </StyledBubble>
            </StyledMessage>
          ))}
          <div ref={messagesEndRef} />
        </StyledMessages>

        <StyledInputContainer>
          <StyledForm onSubmit={handleSubmit}>
            <StyledInput
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的问题..."
              disabled={loading}
            />
            <StyledButton type="submit" disabled={loading}>
              {loading ? '思考中...' : '发送'}
            </StyledButton>
          </StyledForm>
        </StyledInputContainer>
      </StyledChatContainer>
    </StyledContainer>
  )
}