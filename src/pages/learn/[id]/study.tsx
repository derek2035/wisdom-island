import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';
import { Layout } from '@/components/Layout';
import { Send, ArrowLeft, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { prisma } from '@/lib/prisma';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  max-width: 800px;
  margin: 0 auto;
  background: white;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 0 12px 0;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  border-radius: 8px;
  color: #666;

  &:hover {
    background: #f3f4f6;
  }
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Message = styled.div<{ isUser: boolean }>`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
`;

const Avatar = styled.div<{ isUser: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background: ${({ isUser }) => (isUser ? '#4F46E5' : '#10B981')};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  order: ${({ isUser }) => (isUser ? 2 : 0)};
`;

const loadingDots = keyframes`
  0%, 20% {
    content: ".";
  }
  40% {
    content: "..";
  }
  60%, 100% {
    content: "...";
  }
`;

const LoadingDots = styled.span`
  &::after {
    content: '.';
    animation: ${loadingDots} 1.5s infinite;
  }
`;

const MessageContent = styled.div<{ isUser: boolean }>`
  background: ${({ isUser }) => (isUser ? '#4F46E5' : '#F3F4F6')};
  color: ${({ isUser }) => (isUser ? 'white' : '#111827')};
  padding: 12px 12px;
  border-radius: 12px;
  border-bottom-left-radius: ${({ isUser }) => (isUser ? '12px' : '4px')};
  border-bottom-right-radius: ${({ isUser }) => (isUser ? '4px' : '12px')};
  max-width: 85%;
  line-height: 1.8;
  font-size: 15px;
  min-height: 24px;

  & svg {
    width: 100%;
    height: auto;
    margin: 12px 0;
  }

  // Markdown 样式
  & h1 {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 1em 0;
    padding-bottom: 0.5em;
    border-bottom: 1px solid
      ${({ isUser }) =>
        isUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  }

  & h2 {
    font-size: 1em;
    font-weight: 600;
    margin: 1.5em 0 1em 0;
    color: ${({ isUser }) => (isUser ? 'white' : '#374151')};
  }
  & h2:first-of-type {
    margin-top: 0;
  }

  & p {
    margin: 0 0 1em 0;
    padding: 0;
  }

  & strong {
    font-weight: 600;
    color: ${({ isUser }) => (isUser ? 'white' : '#111827')};
  }

  & ol {
    counter-reset: item;
    list-style-type: none;
    padding-left: 0;
    margin: 0 0 1em 0;
  }

  & ol li {
    counter-increment: item;
    margin: 0 0 0.8em 0;
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  & ol li::before {
    content: counter(item) '.';
    font-weight: 600;
    min-width: 1.5em;
    margin-right: 4px;
  }

  & ul {
    list-style-type: disc;
    padding-left: 1.5em;
    margin: 0 0 1em 0;
  }

  & ul li {
    margin: 0 0 0.5em 0;
  }

  & ul li:last-child,
  & ol li:last-child {
    margin-bottom: 0;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const InputContainer = styled.div`
  padding: 20px 0;
  background: white;
  border-top: 1px solid #e5e7eb;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px 16px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

const Input = styled.input`
  flex: 1;
  border: none;
  padding: 8px 0;
  font-size: 15px;
  color: #111827;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button<{ disabled: boolean }>`
  background: none;
  border: none;
  padding: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled }) => (disabled ? '#9CA3AF' : '#4F46E5')};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ disabled }) => (disabled ? 'none' : '#F3F4F6')};
  }
`;

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  pending?: boolean;
  error?: boolean;
  instructions?: { text: string; action: string }[];
  originalQuery?: string;
}

interface ChatResponse {
  conversation_id?: string;
  message_id?: string;
  event?: 'message_end' | 'agent_message' | 'agent_thought' | string;
  answer?: string;
  thought?: string;
  observation?: string;
  tool?: string;
  tool_input?: string;
  message_files?: any[];
}

// 清理消息内容，移除 XML 标签
function cleanMessageContent(content: string) {
  return content//.replace(/<\/?课程>/g, '').trim();
}

// 生成UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 处理消息内容，提取指令
function processMessageContent(content: string): { 
  displayContent: string; 
  instructions: { text: string; action: string }[] 
} {
  const regex = /\[((?:请继续|没看懂|我不会)(?:,(?:请继续|没看懂|我不会))*)\]/g;
  const instructions: { text: string; action: string }[] = [];
  let match;
  
  // 提取所有指令
  while ((match = regex.exec(content)) !== null) {
    // 分割多个指令
    const actions = match[1].split(',');
    actions.forEach(action => {
      if (action.trim()) {
        instructions.push({
          text: action.trim(),
          action: action.trim()
        });
      }
    });
  }
  
  // 移除指令文本
  const displayContent = content.replace(regex, '');
  
  return { displayContent, instructions };
}

// 添加指令按钮组件
const InstructionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const InstructionButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 6px 24px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const RetryButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  margin-top: 8px;
  cursor: pointer;
  color: #EF4444;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  & svg {
    width: 16px;
    height: 16px;
  }
`;

export default function StudyPage() {
  const router = useRouter();
  const { id: knowledgePointId } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController>(new AbortController());
  const conversationIdRef = useRef<string>('');
  const hasIntroducedRef = useRef(false);

  // 初始化欢迎消息
  useEffect(() => {
    if (title) {
      setMessages([
        {
          id: '1',
          content: `你好！我是你的数学老师。我们下面学习${title}。`,
          isUser: false,
        },
      ]);
    }
  }, [title]);

  // 获取知识点标题并自动发送介绍消息
  useEffect(() => {
    async function fetchKnowledgePoint() {
      if (!knowledgePointId) return;

      try {
        const response = await fetch(
          `/api/knowledge-points/${knowledgePointId}`
        );
        if (!response.ok) throw new Error('Failed to fetch knowledge point');

        const data = await response.json();
        setTitle(data.title);

        // 延迟发送知识点介绍，等待欢迎消息显示
        if (!hasIntroducedRef.current) {
          hasIntroducedRef.current = true;
          setTimeout(() => {
            handleAIMessage(`作为一名小学数学老师，请详细介绍一下${data.title}这个知识点。请按照以下格式进行回复：
## 1. 这个知识点是什么？

[这里详细说明概念，每句话都要换行]

## 2. 为什么要学习它？

[分点列举理由，每点都要换行]

## 3. 关键概念和重点

[分点列举，确保每个概念都独立成行]

## 4. 学习注意事项

[分点说明，每点都要换行]

注意：
- 确保每个标题独立成行！每个标题和它的内容之间要换行！
- 每个段落之间要空一行
- 每个要点都要独立成行
- 重要概念要加粗显示
- 数学公式使用普通文本格式，不要使用 LaTeX
- 保持清晰的层级结构
`);
          }, 1000);
        }
      } catch (error) {
        console.error('Error fetching knowledge point:', error);
      }
    }

    fetchKnowledgePoint();
  }, [knowledgePointId]);

  // 调试路由参数
  useEffect(() => {
    console.log('Router query:', router.query);
  }, [router.query]);

  // 定义固定的输入参数
  const currInputs = {
    a: '主动型',
    b: '苏格拉底式',
    c: '鼓励',
    d: '归纳',
    e: '1/6 入门',
  };

  // 自动滚动到最新消息
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 处理 AI 消息
  const handleAIMessage = async (query: string | undefined) => {
    if (isLoading || !query) return;

    const pendingMessage = {
      id: Date.now().toString(),
      content: '',
      isUser: false,
      pending: true,
      originalQuery: query,
    };

    setMessages((prev) => [...prev, pendingMessage]);
    setIsLoading(true);

    try {
      const requestBody: any = {
        inputs: currInputs,
        query,
        user: 'user',
        response_mode: 'streaming',
      };

      if (conversationIdRef.current) {
        requestBody.conversation_id = conversationIdRef.current;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DIFY_API_URL}/chat-messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
          },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.startsWith('data: ')) {
            try {
              const data: ChatResponse = JSON.parse(line.slice(6));

              if (data.conversation_id && !conversationIdRef.current) {
                conversationIdRef.current = data.conversation_id;
              }

              if (data.event === 'agent_message') {
                if (data.answer) {
                  const cleanedMessage = cleanMessageContent(data.answer);
                  accumulatedContent = cleanMessageContent(accumulatedContent + data.answer);
                  console.log('accumulatedContent:', accumulatedContent);
                  const { displayContent, instructions } = processMessageContent(accumulatedContent);
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === pendingMessage.id
                        ? { ...msg, pending: false, content: displayContent, instructions }
                        : msg
                    )
                  );
                }
              } else if (data.event === 'agent_thought') {
                if (data.thought) {
                  console.log('Agent thought:', data.thought);
                }
              } else if (data.event === 'message_end') {
                setIsLoading(false);
                break;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }

      console.error('发送消息失败:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.pending
            ? {
                id: msg.id,
                content: '抱歉，发送消息失败，请稍后重试。',
                isUser: false,
                error: true,
                originalQuery: msg.originalQuery,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
    };

    const pendingMessage = {
      id: (Date.now() + 1).toString(),
      content: '',
      isUser: false,
      pending: true,
    };

    setMessages((prev) => [...prev, userMessage, pendingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const requestBody: any = {
        inputs: currInputs,
        query: input.trim(),
        user: 'user',
        response_mode: 'streaming',
      };

      if (conversationIdRef.current) {
        requestBody.conversation_id = conversationIdRef.current;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DIFY_API_URL}/chat-messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
          },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.startsWith('data: ')) {
            try {
              const data: ChatResponse = JSON.parse(line.slice(6));

              if (data.conversation_id && !conversationIdRef.current) {
                conversationIdRef.current = data.conversation_id;
              }

              if (data.event === 'agent_message') {
                if (data.answer) {
                  const cleanedMessage = cleanMessageContent(data.answer);
                  accumulatedContent = cleanMessageContent(accumulatedContent + data.answer);
                  const { displayContent, instructions } = processMessageContent(accumulatedContent);
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === pendingMessage.id
                        ? { ...msg, pending: false, content: displayContent, instructions }
                        : msg
                    )
                  );
                }
              } else if (data.event === 'agent_thought') {
                if (data.thought) {
                  console.log('Agent thought:', data.thought);
                }
              } else if (data.event === 'message_end') {
                setIsLoading(false);
                break;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }

      console.error('发送消息失败:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.pending
            ? {
                id: msg.id,
                content: '抱歉，发送消息失败，请稍后重试。',
                isUser: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <StyledContainer>
        <Header>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </BackButton>
          <Title>{title || 'AI学习助手'}</Title>
        </Header>

        <ChatContainer ref={chatContainerRef}>
          <MessageList>
            {messages.map((message) => (
              <Message key={message.id} isUser={message.isUser}>
                <Avatar isUser={message.isUser}>
                  {message.isUser ? '我' : '老师'}
                </Avatar>
                <MessageContent isUser={message.isUser}>
                  {message.pending ? (
                    <LoadingDots>正在思考</LoadingDots>
                  ) : (
                    <>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          pre: ({ node, children, ...props }) => {
                            const codeElement = (node as any)?.children?.[0];
                            if (codeElement?.type === 'element' && codeElement?.tagName === 'code') {
                              const codeContent = codeElement?.children?.[0];
                              if (codeContent?.type === 'text') {
                                let content = String(codeContent.value || '').trim();
                                // 检查是否是 SVG 内容
                                const svgStartIndex = content.indexOf('<svg');
                                const svgEndIndex = content.lastIndexOf('</svg>') + 6;
                                
                                if (svgStartIndex !== -1 && svgEndIndex !== -1) {
                                  // 提取完整的 SVG 内容
                                  const svgContent = content.substring(svgStartIndex, svgEndIndex);
                                  
                                  // 处理 SVG 属性
                                  const processedContent = svgContent.replace(/<svg([^>]*)>/, (match, attributes) => {
                                    let newAttributes = attributes;
                                    
                                    // 添加 viewBox 属性
                                    if (!attributes.includes('viewBox')) {
                                      const widthMatch = attributes.match(/width="([^"]*)"/) || attributes.match(/width='([^']*)'/) || ['', '500'];
                                      const heightMatch = attributes.match(/height="([^"]*)"/) || attributes.match(/height='([^']*)'/) || ['', '500'];
                                      const width = parseFloat(widthMatch[1]) || 500;
                                      const height = parseFloat(heightMatch[1]) || 500;
                                      newAttributes += ` viewBox="0 0 ${width} ${height}"`;
                                    }
                                    
                                    // 添加 preserveAspectRatio 属性
                                    if (!attributes.includes('preserveAspectRatio')) {
                                      newAttributes += ` preserveAspectRatio="xMidYMid meet"`;
                                    }
                                    
                                    return `<svg${newAttributes}>`;
                                  });
                                  
                                  return (
                                    <div style={{ width: '100%', maxWidth: '100%', margin: '12px 0' }}>
                                      <div style={{ width: '100%', height: 'auto' }} dangerouslySetInnerHTML={{ __html: processedContent }} />
                                    </div>
                                  );
                                }
                              }
                            }
                            return <pre {...props}>{children}</pre>;
                          },
                          code: ({ className, children, ...props }) => {
                            const content = String(children).trim();
                            if (content.startsWith('<svg') && content.endsWith('</svg>')) {
                              return null;
                            }
                            return <code className={className} {...props}>{children}</code>;
                          }
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                      {message.error && message.originalQuery && (
                        <RetryButton 
                          onClick={() => {
                            if (message.originalQuery) {
                              setMessages(prev => prev.filter(msg => msg.id !== message.id));
                              handleAIMessage(message.originalQuery);
                            }
                          }}
                        >
                          <RefreshCw /> 重新发送
                        </RetryButton>
                      )}
                      {message.instructions && message.instructions.length > 0 && (
                        <InstructionButtons>
                          {message.instructions.map((instruction, index) => (
                            <InstructionButton
                              key={index}
                              onClick={() => handleAIMessage(instruction.action)}
                            >
                              {instruction.text}
                            </InstructionButton>
                          ))}
                        </InstructionButtons>
                      )}
                    </>
                  )}
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
              placeholder='输入提问或回答...'
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
  );
}
