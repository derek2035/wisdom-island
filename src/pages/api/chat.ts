import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { messages, apiKey } = req.body

    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages,
        response_mode: 'streaming',
        conversation_id: '',
        user: 'user'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from Dify API')
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('Error in chat API:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
} 