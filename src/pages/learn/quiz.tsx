import { useEffect, useState, useRef, useMemo, memo, useCallback } from 'react';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';
import { Layout } from '@/components/Layout';
import { Send, ArrowLeft, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

// 主容器样式
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px); // 设置高度为视口高度减去100px
  max-width: 800px;
  margin: 0 auto;
  background: white;
  position: relative;
`;

// 头部样式
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 0 12px 0;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  position: sticky; // 固定在顶部
  top: 0;
  z-index: 10;
`;

// 返回按钮样式
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

// 标题样式
const Title = styled.h1`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

// 聊天容器样式
const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto; // 允许垂直滚动
  padding: 16px 0;
`;

// 消息列表样式
const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 单条消息样式
const Message = styled.div<{ isUser: boolean }>`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: ${({ isUser }) =>
    isUser ? 'flex-end' : 'flex-start'}; // 用户消息靠右，AI消息靠左
`;

// 头像样式
const Avatar = styled.div<{ isUser: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background: ${({ isUser }) =>
    isUser ? '#4F46E5' : '#10B981'}; // 用户和AI不同的头像背景色
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  overflow: hidden;
`;

// 加载动画关键帧
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

// 加载动画样式
const LoadingDots = styled.span`
  &::after {
    content: '.';
    animation: ${loadingDots} 1.5s infinite linear;
  }
`;

// 消息内容样式
const MessageContent = styled.div<{ isUser: boolean }>`
  background: ${({ isUser }) =>
    isUser ? '#4F46E5' : '#F3F4F6'}; // 用户和AI不同的消息背景色
  color: ${({ isUser }) => (isUser ? 'white' : '#111827')};
  padding: 12px 16px;
  border-radius: 12px;
  border-bottom-left-radius: ${({ isUser }) => (isUser ? '12px' : '4px')};
  border-bottom-right-radius: ${({ isUser }) => (isUser ? '4px' : '12px')};
  max-width: 85%;
  line-height: 1.8;
  font-size: 15px;
  min-height: 24px;

  // SVG 图片样式
  & svg {
    width: 100%;
    height: auto;
    margin: 12px 0;
  }

  // Markdown 样式定制
  & h1 {
    font-size: 16px;
    font-weight: 500;
    margin: 1em 0;
    padding-bottom: 0.5em;
    border-bottom: 1px solid
      ${({ isUser }) =>
        isUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  }

  & h2 {
    font-size: 1em;
    font-weight: 600;
    margin: 1em 0;
    color: ${({ isUser }) => (isUser ? 'white' : '#374151')};
  }

  & p {
    margin: 0.5em 0;
    padding: 0;
  }

  & strong {
    font-weight: 600;
    color: ${({ isUser }) => (isUser ? 'white' : '#111827')};
  }

  // 有序列表样式
  & ol {
    list-style-type: none;
    margin: 0.5em 0;
  }

  & ol li {
    margin: 0.3em 0;
  }

  // 无序列表样式
  & ul {
    list-style-type: none;
    padding-left: 1.5em;
    margin: 0.5em 0;
  }

  & ul li {
    margin: 0.3em 0;
    position: relative;
  }

  & ul li::before {
    content: "•";
    position: absolute;
    left: -1em;
    color: ${({ isUser }) => (isUser ? 'white' : '#111827')};
  }

  & > *:first-child {
    margin-top: 0;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  // 表格样式
  & table {
    width: 100%;
    margin: 1em 0;
    border-collapse: collapse;
    color: ${({ isUser }) => (isUser ? 'white' : '#111827')};
  }

  & th,
  & td {
    border: 1px solid ${({ isUser }) =>
      isUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    padding: 8px;
    text-align: left;
  }

  & th {
    background: ${({ isUser }) =>
      isUser ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    font-weight: 600;
  }
`;

// 输入框容器样式
const InputContainer = styled.div`
  padding: 12px 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

// 统计信息容器样式
const StatsContainer = styled.div`
  display: flex;
  gap: 12px;
`;

// 统计项样式
const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #374151;
  font-size: 16px;
  font-weight: 500;
  &:before {
    font-size: 12px;
  }
`;

// 正确答题统计样式
const CorrectStat = styled(StatItem)`
  color: #059669;
  &:before {
    content: '✅';
  }
`;

// 错误答题统计样式
const IncorrectStat = styled(StatItem)`
  color: #dc2626;
  &:before {
    content: '❌';
  }
`;

// 输入区域容器
const InputArea = styled.div<{ expanded: boolean }>`
  flex: 1;
  transition: all 0.3s ease;

  ${({ expanded }) =>
    !expanded &&
    `
    flex: 0;
  `}
`;

// 提问按钮样式
const AskButton = styled.button`
  background: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: max-content;
  &:hover {
    background: #4338ca;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 输入框包装器样式
const InputWrapper = styled.div<{ $expanded: boolean }>`
  display: flex;
  gap: 12px;
  align-items: center;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  opacity: ${({ $expanded }) => ($expanded ? 1 : 0)};
  max-height: ${({ $expanded }) => ($expanded ? '200px' : '0')};
  overflow: hidden;

  &:focus-within {
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

// 输入框样式
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

// 发送按钮样式
const SendButton = styled.button<{ $disabled: boolean }>`
  background: none;
  border: none;
  padding: 8px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  color: ${({ $disabled }) => ($disabled ? '#9CA3AF' : '#4F46E5')};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ $disabled }) => ($disabled ? 'none' : '#F3F4F6')};
  }
`;

// 重试按钮样式
const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #4f46e5;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 8px;

  &:hover {
    background: rgba(79, 70, 229, 0.1);
  }
`;

// 指令按钮容器样式
const InstructionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

// 指令按钮样式
const InstructionButton = styled.button`
  background: rgba(79, 70, 229, 0.1);
  border: none;
  color: #4f46e5;
  padding: 4px 12px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: rgba(79, 70, 229, 0.2);
  }
`;

// 选项按钮容器样式
const OptionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

// 选项按钮样式
const OptionButton = styled.button<{ selected?: boolean; disabled?: boolean }>`
  background: ${({ selected }) =>
    selected ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)'};
  border: none;
  color: #4f46e5;
  padding: 6px 16px;
  border-radius: 16px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 14px;
  font-weight: 500;
  opacity: ${({ disabled, selected }) => (!disabled || selected ? 1 : 0.5)};
  position: relative;

  &:hover {
    background: ${({ disabled, selected }) =>
      disabled
        ? selected
          ? 'rgba(79, 70, 229, 0.2)'
          : 'rgba(79, 70, 229, 0.1)'
        : 'rgba(79, 70, 229, 0.2)'};
  }
`;

// 结果容器样式
const ResultContainer = styled.div`
  display: flex;
  align-items: stretch;
  gap: 12px;
  margin-top: 12px;
`;

// 结果消息样式
const ResultMessage = styled.div<{ isCorrect: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${({ isCorrect }) =>
    isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ isCorrect }) => (isCorrect ? '#059669' : '#DC2626')};
  font-weight: 500;
  font-size: 14px;

  &::before {
    content: '${({ isCorrect }) => (isCorrect ? '✓' : '✕')}';
    font-weight: bold;
  }
`;

// 下一题按钮样式
const NextButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(16, 185, 129, 0.1);
  border: none;
  color: #059669;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(16, 185, 129, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 消息接口定义
interface Message {
  id: string; // 消息唯一标识
  content: string; // 消息内容
  isUser: boolean; // 是否为用户消息
  pending?: boolean; // 是否为等待中的消息
  error?: boolean; // 是否存在错误
  instructions?: { text: string; action: string }[]; // 指令按钮配置
  options?: string[] | null; // 选项按钮配置
  selectedOption?: string; // 已选择的选项
  originalQuery?: string; // 原始查询内容
  result?: 'correct' | 'incorrect'; // 答题结果
}

// 聊天响应接口定义
interface ChatResponse {
  conversation_id?: string; // 对话ID
  message_id?: string; // 消息ID
  event?: 'message_end' | 'message' | 'thought' | string; // 事件类型
  answer?: string; // 回答内容
  thought?: string; // 思考过程
  observation?: string; // 观察结果
  tool?: string; // 使用的工具
  tool_input?: string; // 工具输入
  message_files?: any[]; // 消息附件
}

// 清理消息内容，移除 XML 标签
function cleanMessageContent(content: string) {
  return content;
}

function extractToArray(inputString: string) {
  // 使用正则表达式匹配中文括号内连续的大写字母和斜杠
  const match = inputString.match(/（([A-Z/]+)）/);
  if (match) {
    // 将匹配到的内容以斜杠拆分为数组
    return match[1].split('/');
  }
  // 如果未匹配到，则返回空数组
  return [];
}

// 处理消息内容，提取指令和选项
function processMessageContent(content: string): {
  displayContent: string;
  options: string[] | null;
  result?: 'correct' | 'incorrect';
} {
  // 检查是否包含选择题选项提示
  const optionsRegex = /请选择.*?[（(](A(\/[BCD]){0,3})[)）]：\s*/;
  const optionsMatch = content.match(optionsRegex);
  let options = null;
  let displayContent = content;

  if (optionsMatch) {
    options = extractToArray(content);
    // 移除选项提示文本
    displayContent = content.replace(optionsRegex, '');
  }

  // 检查是否包含回答结果
  let result: 'correct' | 'incorrect' | undefined;
  const resultRegex = /\[(回答(?:正确|部分正确|错误)).*?\]\s*/;
  const resultMatch = displayContent.match(resultRegex);

  if (resultMatch) {
    result = resultMatch[1].includes('错误') ? 'incorrect': 'correct';
    // 移除结果文本
    displayContent = displayContent.replace(resultRegex, '');
  }

  return { displayContent, options, result };
}

// 消息渲染组件（使用 memo 优化性能）
const MessageRenderer = memo(
  ({
    content,
    isUser,
    message,
  }: {
    content: string;
    isUser: boolean;
    message: Message;
  }) => {
    // 渲染 Markdown 内容
    return (
      <>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => {
              return <p style={{ margin: '0.5em 0' }}>{children}</p>;
            },
            hr: () => <hr style={{ margin: '1em 0', border: 'none', borderTop: '1px solid #ddd' }} />,
            pre: ({ node, children, ...props }) => {
              return (
                <p style={{ margin: '0.5em 0' }}>
                  {children}
                </p>
              );
            },
            code: ({ className, children, ...props }) => {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            ol: ({ children }) => {
              return <ol style={{ margin: '0.5em 0' }}>{children}</ol>;
            },
            ul: ({ children }) => {
              return <ul style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>{children}</ul>;
            },
            li: ({ children }) => {
              // 处理列表项内容
              const content = String(children);
              // 检查是否是有序列表项（以数字开头）
              const match = content.match(/^(\d+)\.\s*(.*)/);
              if (match) {
                const [_, number, text] = match;
                return (
                  <li style={{ margin: '0.3em 0' }}>
                    <span style={{ marginRight: '0.5em', fontWeight: 500 }}>{number}.</span>
                    {text}
                  </li>
                );
              }
              return <li style={{ margin: '0.3em 0' }}>{children}</li>;
            }
          }}
        >
          {content.split('\n').join('\n\n')}
        </ReactMarkdown>
      </>
    );
  }
);

// 知识竞猜页面组件
const QuizPage = () => {
  const router = useRouter(); // Next.js 路由
  const [messages, setMessages] = useState<Message[]>([]); // 消息列表状态
  const [input, setInput] = useState(''); // 输入框状态
  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const [user, setUser] = useState<{ id: string } | null>(null); // 当前登录的用户信息
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const chatContainerRef = useRef<HTMLDivElement>(null); // 聊天容器引用
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController>(new AbortController()); // 请求中断控制器
  const conversationIdRef = useRef<string>(''); // 对话ID引用
  const initialMessageSentRef = useRef(false); // 初始消息发送标记

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(window.localStorage.getItem('user') || '{}');
      setUser(user);
      const conversationId = window.localStorage.getItem('conversationId');
      if (conversationId) {
        conversationIdRef.current = conversationId;
      }
    }
  }, []);

  // 初始化欢迎消息和第一个问题
  useEffect(() => {
    if (user && messages.length === 0 && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true;
      handleAIMessage('请开始出题');
    }
  }, [user]);

  useEffect(() => {
    if (conversationIdRef.current) {
      window.localStorage.setItem('conversationId', conversationIdRef.current);
    }
  }, [conversationIdRef.current]);

  // 自动滚动到最新消息
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 更新答题统计
  useEffect(() => {
    const correct = messages.filter((msg) => msg.result === 'correct').length;
    const incorrect = messages.filter(
      (msg) => msg.result === 'incorrect'
    ).length;
    setStats({ correct, incorrect });
  }, [messages]);

  // 处理 AI 消息
  const handleAIMessage = useCallback(
    async (query: string | undefined) => {
      if (isLoading || !query) return;
      console.log('user666', user);
      // 创建待处理消息
      const pendingMessage = {
        id: Date.now().toString(),
        content: '',
        isUser: false,
        pending: true,
        originalQuery: query,
      };

      // 添加消息到列表
      setMessages((prev) => [...prev, pendingMessage]);
      setIsLoading(true);

      try {
        // 获取 API 密钥
        const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY_QUIZ;
        if (!apiKey) {
          throw new Error('Quiz API key is not defined');
        }

        // 准备请求体
        const requestBody: any = {
          inputs: {
            timestamp: new Date().toISOString(),
            random_number: Math.floor(Math.random() * 1000000),
          },
          query,
          user: user?.id as string,
          response_mode: 'streaming',
        };
        console.log('requestBody', requestBody);
        // 如果存在对话ID，添加到请求中
        if (conversationIdRef.current) {
          requestBody.conversation_id = conversationIdRef.current;
        }

        // 发送请求
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

        // 获取响应流
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader available');

        let accumulatedContent = ''; // 累积的消息内容

        // 处理流式响应
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

                // 解析 JSON 数据
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
                            pending: false,
                          }
                        : msg
                    )
                  );
                  setIsLoading(false);
                  break;
                }

                // 保存对话ID
                if (data.conversation_id && !conversationIdRef.current) {
                  conversationIdRef.current = data.conversation_id;
                }

                // 处理消息事件
                if (data.event === 'message') {
                  if (data.answer) {
                    accumulatedContent += data.answer;
                    console.log('accumulatedContent', accumulatedContent);
                    const { displayContent, options, result } =
                      processMessageContent(accumulatedContent);
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === pendingMessage.id
                          ? {
                              ...msg,
                              content: displayContent,
                              options,
                              result,
                              pending: false,
                            }
                          : msg
                      )
                    );
                  }
                } else if (data.event === 'thought') {
                  // 记录 AI 思考过程
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
        // 处理请求中断
        if (error.name === 'AbortError') {
          console.log('Request aborted');
          return;
        }

        // 处理其他错误
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
                  pending: false,
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  // 处理用户发送消息
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // 创建用户消息和待处理的 AI 消息
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

    // 添加消息到列表并清空输入框
    setMessages((prev) => [...prev, userMessage, pendingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 获取 API 密钥
      const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY_QUIZ;
      if (!apiKey) {
        throw new Error('Quiz API key is not defined');
      }

      // 准备请求体
      const requestBody: any = {
        inputs: {
          timestamp: new Date().toISOString(),
          random_number: Math.floor(Math.random() * 1000000),
        },
        query: input.trim(),
        user: user?.id as string,
        response_mode: 'streaming',
      };

      if (conversationIdRef.current) {
        requestBody.conversation_id = conversationIdRef.current;
      }

      // 发送请求
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

      // 获取响应流
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let accumulatedContent = '';

      // 处理流式响应
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

              // 解析 JSON 数据
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
                          pending: false,
                        }
                      : msg
                  )
                );
                setIsLoading(false);
                break;
              }

              // 保存对话ID
              if (data.conversation_id && !conversationIdRef.current) {
                conversationIdRef.current = data.conversation_id;
              }

              // 处理消息事件
              if (data.event === 'message') {
                if (data.answer) {
                  accumulatedContent += data.answer;
                  const { displayContent, options, result } =
                    processMessageContent(accumulatedContent);
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === pendingMessage.id
                        ? {
                            ...msg,
                            content: displayContent,
                            options,
                            result,
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
                pending: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 处理按键事件（Enter 发送消息）
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      setIsInputExpanded(false);
    }
  };

  // 处理输入框展开
  const handleExpandInput = () => {
    setIsInputExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  // 处理输入框失焦
  const handleInputBlur = () => {
    if (!input.trim()) {
      setIsInputExpanded(false);
    }
  };

  // 渲染页面
  return (
    <Layout>
      <StyledContainer>
        {/* 页面头部 */}
        <Header>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </BackButton>
          <Title>知识竞猜</Title>
        </Header>

        {/* 聊天内容区域 */}
        <ChatContainer ref={chatContainerRef}>
          <MessageList>
            {messages.map((message) => (
              <Message key={message.id} isUser={message.isUser}>
                {/* <Avatar isUser={message.isUser}>
                  {message.isUser ? '我' : <Image src={'/logo.webp'} alt='logo' width={36} height={36} />}
                </Avatar> */}
                <MessageContent isUser={message.isUser}>
                  {message.pending ? (
                    <LoadingDots>正在思考</LoadingDots>
                  ) : (
                    <>
                      {/* 消息内容渲染器 */}
                      <MessageRenderer
                        content={message.content}
                        isUser={message.isUser}
                        message={message}
                      />
                      {/* 错误重试按钮 */}
                      {message.error && message.originalQuery && (
                        <RetryButton
                          onClick={() => {
                            if (message.originalQuery) {
                              setMessages((prev) =>
                                prev.filter((msg) => msg.id !== message.id)
                              );
                              handleAIMessage(message.originalQuery);
                            }
                          }}
                        >
                          <RefreshCw /> 重新发送
                        </RetryButton>
                      )}
                      {/* 答题结果和下一题按钮 */}
                      {message.result ? (
                        <ResultContainer>
                          <ResultMessage
                            isCorrect={message.result === 'correct'}
                          >
                            {message.result === 'correct'
                              ? '回答正确'
                              : '回答错误'}
                          </ResultMessage>
                          <NextButton
                            onClick={() => handleAIMessage('请出下一题')}
                          >
                            下一题
                          </NextButton>
                        </ResultContainer>
                      ) : message.options ? (
                        // 选项按钮组
                        <OptionButtons>
                          {message.options.map((option) => (
                            <OptionButton
                              key={option}
                              onClick={() => {
                                if (!message.selectedOption) {
                                  handleAIMessage(option);
                                  setMessages((prev) =>
                                    prev.map((msg) =>
                                      msg.id === message.id
                                        ? { ...msg, selectedOption: option }
                                        : msg
                                    )
                                  );
                                }
                              }}
                              selected={message.selectedOption === option}
                              disabled={!!message.selectedOption}
                            >
                              {option}
                            </OptionButton>
                          ))}
                        </OptionButtons>
                      ) : (
                        // 非用户消息显示下一题按钮
                        !isLoading &&
                        !message.isUser && (
                          <ResultContainer>
                            <NextButton
                              onClick={() => handleAIMessage('请出下一题')}
                            >
                              下一题
                            </NextButton>
                          </ResultContainer>
                        )
                      )}
                    </>
                  )}
                </MessageContent>
              </Message>
            ))}
          </MessageList>
        </ChatContainer>

        {/* 输入框区域 */}
        <InputContainer>
          {isInputExpanded || (
            <StatsContainer>
              {stats.correct > 0 && <CorrectStat>{stats.correct}</CorrectStat>}
              {stats.incorrect > 0 && (
                <IncorrectStat>{stats.incorrect}</IncorrectStat>
              )}
            </StatsContainer>
          )}
          <InputArea expanded={isInputExpanded}>
            {isInputExpanded ? (
              <InputWrapper $expanded={isInputExpanded}>
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onBlur={handleInputBlur}
                  placeholder='自由提问...'
                  disabled={isLoading}
                />
                <SendButton
                  onClick={handleSendMessage}
                  $disabled={!input.trim() || isLoading}
                >
                  <Send size={20} />
                </SendButton>
              </InputWrapper>
            ) : (
              <AskButton onClick={handleExpandInput}>自由提问</AskButton>
            )}
          </InputArea>
        </InputContainer>
      </StyledContainer>
    </Layout>
  );
};

export default QuizPage;
