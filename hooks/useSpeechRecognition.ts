import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  language?: string;
}

interface SpeechRecognitionResult {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
  browserSupportsSpeechRecognition: boolean;
}

// 定义不在TypeScript类型中的SpeechRecognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useSpeechRecognition({
  onResult,
  onError,
  language = 'zh-CN', // 默认中文识别
}: UseSpeechRecognitionProps = {}): SpeechRecognitionResult {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);
  const [browserSupport, setBrowserSupport] = useState(false);

  // 检查浏览器支持
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setBrowserSupport(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;
      setRecognitionInstance(recognition);
    } else {
      setError(t('common.voiceInput.browserNotSupport'));
      setBrowserSupport(false);
    }

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [language, t]);

  // 设置识别事件处理
  useEffect(() => {
    if (!recognitionInstance) return;

    const handleResult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);
      
      if (finalTranscript && onResult) {
        onResult(finalTranscript);
      }
    };

    const handleError = (event: any) => {
      const errorMessage = event.error === 'not-allowed'
        ? t('common.voiceInput.errorPermission')
        : `${t('common.voiceInput.errorGeneral')}: ${event.error}`;
      
      setError(errorMessage);
      if (onError) onError(errorMessage);
      setIsListening(false);
    };

    const handleEnd = () => {
      setIsListening(false);
    };

    recognitionInstance.onresult = handleResult;
    recognitionInstance.onerror = handleError;
    recognitionInstance.onend = handleEnd;

    return () => {
      if (recognitionInstance) {
        recognitionInstance.onresult = null;
        recognitionInstance.onerror = null;
        recognitionInstance.onend = null;
      }
    };
  }, [recognitionInstance, onResult, onError, t]);

  // 开始监听
  const startListening = useCallback(() => {
    if (!recognitionInstance) return;
    
    setError(null);
    setTranscript('');
    try {
      recognitionInstance.start();
      setIsListening(true);
    } catch (err) {
      console.error('启动语音识别失败:', err);
      setError(t('common.voiceInput.errorGeneral'));
    }
  }, [recognitionInstance, t]);

  // 停止监听
  const stopListening = useCallback(() => {
    if (!recognitionInstance) return;
    
    try {
      recognitionInstance.stop();
      setIsListening(false);
    } catch (err) {
      console.error('停止语音识别失败:', err);
    }
  }, [recognitionInstance]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
    browserSupportsSpeechRecognition: browserSupport
  };
} 