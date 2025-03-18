import { useEffect, useState, useRef, useMemo, memo } from 'react';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';
import { Layout } from '@/components/Layout';
import { Send, ArrowLeft, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    animation: ${loadingDots} 1.5s infinite linear;
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

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #4F46E5;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 8px;

  &:hover {
    background: rgba(79, 70, 229, 0.1);
  }
`;

const InstructionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const InstructionButton = styled.button`
  background: rgba(79, 70, 229, 0.1);
  border: none;
  color: #4F46E5;
  padding: 4px 12px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: rgba(79, 70, 229, 0.2);
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
  event?: 'message_end' | 'message' | 'thought' | string;
  answer?: string;
  thought?: string;
  observation?: string;
  tool?: string;
  tool_input?: string;
  message_files?: any[];
}

// 清理消息内容，移除 XML 标签
function cleanMessageContent(content: string) {
  return content;
}

// 处理消息内容，提取指令
function processMessageContent(content: string): { 
  displayContent: string; 
  instructions: { text: string; action: string }[] 
} {
  const regex = /[\[【]((?:请继续|没看懂|我不会)(?:,(?:请继续|没看懂|我不会))*)[\]】]/g;
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

// 添加新的 memo 组件来处理消息内容
const MessageRenderer = memo(({ content, isUser, message }: { 
  content: string; 
  isUser: boolean;
  message: Message;
}) => {
  const [displayContent, setDisplayContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const contentRef = useRef(content);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (content !== contentRef.current) {
      contentRef.current = content;
      if (content.startsWith(displayContent)) {
        // 如果新内容是在原有内容基础上追加的，继续从当前位置打字
        setIsComplete(false);
      } else {
        // 如果是完全不同的内容，重置打字效果
        setDisplayContent('');
        setIsComplete(false);
      }
    }
  }, [content, displayContent]);

  useEffect(() => {
    if (!isComplete && displayContent.length < content.length) {
      timerRef.current = setTimeout(() => {
        setDisplayContent(content.slice(0, displayContent.length + 1));
      }, 30);
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else if (displayContent.length === content.length && !isComplete) {
      setIsComplete(true);
    }
  }, [content, displayContent, isComplete]);

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ node, children, ...props }) => {
            return <pre {...props}>{children}</pre>;
          },
          code: ({ className, children, ...props }) => {
            return <code className={className} {...props}>{children}</code>;
          },
        }}
      >
        {displayContent}
      </ReactMarkdown>
     
    </>
  );
});

const QuizPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController>(new AbortController());
  const conversationIdRef = useRef<string>('');
  const initialMessageSentRef = useRef(false);

  // 初始化欢迎消息
  useEffect(() => {
    if (messages.length === 0 && !initialMessageSentRef.current) {
      // setMessages([
      //   {
      //     id: '1',
      //     content: '你好！我是你的数学老师。让我们开始知识竞猜吧！',
      //     isUser: false,
      //   },
      // ]);
      initialMessageSentRef.current = true;
      
      // 发送初始消息给 AI
      handleAIMessage('请开始出题');
    }
  }, []);

  // 自动滚动到最新消息
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  console.log('messages', messages);

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
      const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY_QUIZ
      if (!apiKey) {
        throw new Error('Quiz API key is not defined')
      }

      const requestBody: any = {
        inputs: {},
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
            Authorization: `Bearer ${apiKey}`,
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
              // 忽略 ping 事件
              if (line.includes('"event":"ping"')) continue;
              
              // 使用更安全的方式解析 JSON
              const jsonStr = decodeURIComponent(escape(line.slice(6)));
              const data: ChatResponse = JSON.parse(jsonStr);

              // 处理错误事件
              if (data.event === 'error') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === pendingMessage.id
                      ? {
                          ...msg,
                          content: '抱歉，消息处理失败，请重试。',
                          isUser: false,
                          error: true,
                          originalQuery: query,
                          pending: false
                        }
                      : msg
                  )
                );
                setIsLoading(false);
                break;
              }

              if (data.conversation_id && !conversationIdRef.current) {
                conversationIdRef.current = data.conversation_id;
              }

              if (data.event === 'message') {
                if (data.answer) {
                  accumulatedContent += data.answer;
                  const { displayContent, instructions } =
                    processMessageContent(accumulatedContent);
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === pendingMessage.id
                        ? {
                            ...msg,
                            content: displayContent,
                            instructions,
                            pending: false,
                          }
                        : msg
                    )
                  );
                }
              } else if (data.event === 'thought') {
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
          msg.id === pendingMessage.id
            ? {
                ...msg,
                content: '抱歉，发送消息失败，请稍后重试。',
                isUser: false,
                error: true,
                originalQuery: query,
                pending: false
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
      originalQuery: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage, pendingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY_QUIZ
      if (!apiKey) {
        throw new Error('Quiz API key is not defined')
      }

      const requestBody: any = {
        inputs: {},
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
            Authorization: `Bearer ${apiKey}`,
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
              // 忽略 ping 事件
              if (line.includes('"event":"ping"')) continue;
              
              // 使用更安全的方式解析 JSON
              const jsonStr = decodeURIComponent(escape(line.slice(6)));
              const data: ChatResponse = JSON.parse(jsonStr);

              // 处理错误事件
              if (data.event === 'error') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === pendingMessage.id
                      ? {
                          ...msg,
                          content: '抱歉，消息处理失败，请重试。',
                          isUser: false,
                          error: true,
                          originalQuery: input.trim(),
                          pending: false
                        }
                      : msg
                  )
                );
                setIsLoading(false);
                break;
              }

              if (data.conversation_id && !conversationIdRef.current) {
                conversationIdRef.current = data.conversation_id;
              }

              if (data.event === 'message') {
                if (data.answer) {
                  accumulatedContent += data.answer;
                  const { displayContent, instructions } =
                    processMessageContent(accumulatedContent);
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === pendingMessage.id
                        ? {
                            ...msg,
                            content: displayContent,
                            instructions,
                            pending: false,
                          }
                        : msg
                    )
                  );
                }
              } else if (data.event === 'thought') {
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
          msg.id === pendingMessage.id
            ? {
                ...msg,
                content: '抱歉，发送消息失败，请稍后重试。',
                isUser: false,
                error: true,
                originalQuery: input.trim(),
                pending: false
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
          <Title>知识竞猜</Title>
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
                      <MessageRenderer 
                        content={message.content} 
                        isUser={message.isUser}
                        message={message}
                      />
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
                      {message.instructions && (
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

export default QuizPage; 