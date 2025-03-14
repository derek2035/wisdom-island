import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Layout } from '@/components/Layout'
import { Send, ArrowLeft } from 'lucide-react'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  max-width: 800px;
  margin: 0 auto;
  background: white;
  position: relative;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #E5E7EB;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
`

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  color: #666;
  
  &:hover {
    background: #F3F4F6;
  }
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Message = styled.div<{ isUser: boolean }>`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: ${({ isUser }) => isUser ? 'flex-end' : 'flex-start'};
`

const Avatar = styled.div<{ isUser: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background: ${({ isUser }) => isUser ? '#4F46E5' : '#10B981'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  order: ${({ isUser }) => isUser ? 2 : 0};
`

const MessageContent = styled.div<{ isUser: boolean }>`
  background: ${({ isUser }) => isUser ? '#4F46E5' : '#F3F4F6'};
  color: ${({ isUser }) => isUser ? 'white' : '#111827'};
  padding: 12px 16px;
  border-radius: 12px;
  border-bottom-left-radius: ${({ isUser }) => isUser ? '12px' : '4px'};
  border-bottom-right-radius: ${({ isUser }) => isUser ? '4px' : '12px'};
  max-width: 80%;
  line-height: 1.5;
  font-size: 15px;
`

const InputContainer = styled.div`
  padding: 20px;
  background: white;
  border-top: 1px solid #E5E7EB;
`

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  padding: 8px 16px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #4F46E5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`

const Input = styled.input`
  flex: 1;
  border: none;
  padding: 8px 0;
  font-size: 15px;
  color: #111827;
  outline: none;

  &::placeholder {
    color: #9CA3AF;
  }
`

const SendButton = styled.button<{ disabled: boolean }>`
  background: none;
  border: none;
  padding: 8px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  color: ${({ disabled }) => disabled ? '#9CA3AF' : '#4F46E5'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ disabled }) => disabled ? 'none' : '#F3F4F6'};
  }
`

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  pending?: boolean;
}

interface ChatResponse {
  conversation_id?: string;
  message?: string;
  answer?: string;
  event?: string;
}

// 生成UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export default function StudyPage() {
  const router = useRouter()
  const { id: knowledgePointId } = router.query
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController>(new AbortController())
  const conversationIdRef = useRef<string>('')

  // 定义固定的输入参数
  const currInputs = {
    a: '主动型',
    b: '苏格拉底式',
    c: '鼓励',
    d: '归纳',
    e: '1/6 入门'
  }

  // 初始化欢迎消息
  useEffect(() => {
    setMessages([
      {
        id: '1',
        content: '你好！我是你的AI学习助手。让我们开始学习吧！有什么问题都可以问我。',
        isUser: false
      }
    ])
  }, [])

  // 自动滚动到最新消息
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true
    }

    const pendingMessage = {
      id: (Date.now() + 1).toString(),
      content: '',
      isUser: false,
      pending: true
    }

    setMessages(prev => [...prev, userMessage, pendingMessage])
    setInput('')
    setIsLoading(true)

    try {
      const requestBody: any = {
        inputs: currInputs,
        query: input.trim(),
        user: 'user',
        response_mode: "streaming"
      }

      // 只有在有会话 ID 时才添加到请求中
      if (conversationIdRef.current) {
        requestBody.conversation_id = conversationIdRef.current
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_DIFY_API_URL}/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'API request failed')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      let accumulatedContent = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // 将 Uint8Array 转换为文本
        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.trim() === '') continue
          if (line.startsWith('data: ')) {
            try {
              const data: ChatResponse = JSON.parse(line.slice(6))
              
              // 保存第一次返回的 conversation_id
              if (data.conversation_id && !conversationIdRef.current) {
                conversationIdRef.current = data.conversation_id
              }

              if (data.event === 'message' || data.event === 'answer') {
                const answer = data.answer || data.message || ''
                accumulatedContent += answer
                setMessages(prev => prev.map(msg => 
                  msg.pending ? { ...msg, content: accumulatedContent } : msg
                ))
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }

      // 完成后更新消息状态
      setMessages(prev => prev.map(msg => 
        msg.pending ? { ...msg, pending: false } : msg
      ))

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted')
        return
      }
      
      console.error('发送消息失败:', error)
      setMessages(prev => prev.map(msg => 
        msg.pending 
          ? { id: msg.id, content: '抱歉，发送消息失败，请稍后重试。', isUser: false }
          : msg
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Layout>
      <StyledContainer>
        <Header>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>AI学习助手</Title>
        </Header>

        <ChatContainer ref={chatContainerRef}>
          <MessageList>
            {messages.map(message => (
              <Message key={message.id} isUser={message.isUser}>
                <Avatar isUser={message.isUser}>
                  {message.isUser ? '我' : 'AI'}
                </Avatar>
                <MessageContent isUser={message.isUser}>
                  {message.content}
                </MessageContent>
              </Message>
            ))}
          </MessageList>
        </ChatContainer>

        <InputContainer>
          <InputWrapper>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的问题..."
              disabled={isLoading}
            />
            <SendButton
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send size={20} />
            </SendButton>
          </InputWrapper>
        </InputContainer>
      </StyledContainer>
    </Layout>
  )
} 