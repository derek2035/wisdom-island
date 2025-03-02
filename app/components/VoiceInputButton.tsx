'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'

type VoiceInputButtonProps = {
  onTranscript: (text: string) => void
  disabled?: boolean
  className?: string
}

export default function VoiceInputButton({
  onTranscript,
  disabled = false,
  className = '',
}: VoiceInputButtonProps) {
  const { t } = useTranslation()
  const [animationClass, setAnimationClass] = useState('')
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    onResult: (text) => {
      if (text.trim())
        onTranscript(text.trim())
    },
    onError: (errorMsg) => {
      console.error('语音识别错误:', errorMsg)
    },
  })

  // 处理动画效果
  useEffect(() => {
    if (isListening)
      setAnimationClass('animate-pulse ring-2 ring-red-500')
    else
      setAnimationClass('')
  }, [isListening])

  // 如果浏览器不支持语音识别，不渲染按钮
  if (!browserSupportsSpeechRecognition)
    return null

  const handleVoiceInput = () => {
    if (isListening)
      stopListening()
    else
      startListening()
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleVoiceInput}
        disabled={disabled}
        className={`p-2 rounded-full transition-all duration-200 ${animationClass} 
          ${isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
          ${className}`}
        title={isListening ? t('common.voiceInput.stopListening') : t('common.voiceInput.startListening')}
      >
        {isListening
          ? (
            <StopIcon className="h-5 w-5" />
          )
          : (
            <MicrophoneIcon className="h-5 w-5" />
          )}
      </button>

      {isListening && (
        <div className="absolute bottom-full mb-2 p-2 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap">
          {t('common.voiceInput.listening')}
        </div>
      )}

      {error && (
        <div className="absolute bottom-full mb-2 p-2 bg-red-500 text-white text-xs rounded-md max-w-xs">
          {error}
        </div>
      )}
    </div>
  )
}
