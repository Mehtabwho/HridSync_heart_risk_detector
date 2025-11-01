import fetch from 'node-fetch'
import dotenv from 'dotenv'

// Ensure dotenv is loaded
dotenv.config()

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const DISCLAIMER = '\n\n⚠️ AI-generated advice. Consult a real doctor before following.'

// Get API key at runtime (not at module load time)
function getOpenRouterApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) {
    console.error('[OpenRouter] OPENROUTER_API_KEY is not set in environment variables')
    console.error('[OpenRouter] Check your .env file in the backend directory')
    throw new Error('OPENROUTER_API_KEY is not configured')
  }
  return key
}

interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

async function callOpenRouter(messages: OpenRouterMessage[]): Promise<string> {
  const apiKey = getOpenRouterApiKey()

  try {
    console.log('[OpenRouter] Making API call...')
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://hridsync.com',
        'X-Title': 'HridSync - AI Heart Health Assistant'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages
      })
    })

    console.log(`[OpenRouter] Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[OpenRouter] API Error:', errorText)
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`)
    }

    const data = await response.json() as OpenRouterResponse
    console.log('[OpenRouter] Success - response received')
    
    if (!data.choices || data.choices.length === 0) {
      console.error('[OpenRouter] No choices in response:', data)
      throw new Error('No response choices from OpenRouter API')
    }

    const content = data.choices[0]?.message?.content
    if (!content) {
      console.error('[OpenRouter] No content in response:', data)
      throw new Error('No message content in OpenRouter response')
    }

    return content
  } catch (error: any) {
    console.error('[OpenRouter] Fetch error:', error.message)
    throw error
  }
}

export async function generateRiskSummary(assessmentData: {
  age: number
  gender: string
  systolicBP: number
  diastolicBP: number
  cholesterol: number
  diabetes: boolean
}): Promise<{ riskScore: 'Low' | 'Medium' | 'High', summary: string }> {
  const prompt = `You are a medical AI assistant. Analyze the following patient data and:
1. Determine heart disease risk level (Low, Medium, or High)
2. Provide a brief 2-3 sentence summary explaining the risk assessment
3. Give practical, concise health advice

Patient Data:
- Age: ${assessmentData.age}
- Gender: ${assessmentData.gender}
- Blood Pressure: ${assessmentData.systolicBP}/${assessmentData.diastolicBP} mmHg
- Cholesterol: ${assessmentData.cholesterol} mg/dL
- Diabetes: ${assessmentData.diabetes ? 'Yes' : 'No'}

Format your response as:
RISK_LEVEL: [Low/Medium/High]
SUMMARY: [your assessment summary and advice]

Be concise and professional.`

  try {
    const response = await callOpenRouter([
      { role: 'user', content: prompt }
    ])
    
    // Parse the response
    const riskMatch = response.match(/RISK_LEVEL:\s*(Low|Medium|High)/i)
    const summaryMatch = response.match(/SUMMARY:\s*(.+)/is)
    
    const riskScore = (riskMatch?.[1] || 'Medium') as 'Low' | 'Medium' | 'High'
    const summary = (summaryMatch?.[1]?.trim() || response) + DISCLAIMER

    return { riskScore, summary }
  } catch (error) {
    console.error('Error generating risk summary:', error)
    // Fallback response
    return {
      riskScore: 'Medium',
      summary: `Based on your health metrics, you should monitor your heart health regularly and consult with a healthcare provider.${DISCLAIMER}`
    }
  }
}

export async function generateDietPlan(
  riskCategory: 'Low' | 'Medium' | 'High',
  assessmentData: {
    age: number
    gender: string
    diabetes: boolean
  },
  durationMonths: number = 3
): Promise<string> {
  const prompt = `Create a comprehensive ${durationMonths}-month healthy heart diet plan for a ${assessmentData.age}-year-old ${assessmentData.gender.toLowerCase()} with ${riskCategory.toLowerCase()} heart disease risk${assessmentData.diabetes ? ' and diabetes' : ''}.

Provide:
1. Weekly meal plans (breakfast, lunch, dinner, snacks) for the entire ${durationMonths} months
2. Progressive diet phases (Month 1: Foundation, Month 2: Optimization, Month 3: Maintenance)
3. Focus on heart-healthy foods, low sodium, and ${assessmentData.diabetes ? 'diabetes-friendly' : 'nutritious'} options
4. Specific food suggestions with portion guidance
5. Seasonal variations and meal rotation
6. Keep it practical and culturally appropriate for South Asian cuisine
7. Include shopping lists and preparation tips

Format as a clear, detailed, and actionable ${durationMonths}-month meal plan.`

  try {
    const response = await callOpenRouter([
      { role: 'user', content: prompt }
    ])
    return response + DISCLAIMER
  } catch (error) {
    console.error('Error generating diet plan:', error)
    return `A 7-day heart-healthy diet plan would include lean proteins, whole grains, fresh vegetables, and fruits. Consult a nutritionist for a personalized plan.${DISCLAIMER}`
  }
}

export async function chatWithAI(
  message: string,
  context?: { previousMessages?: Array<{ role: string, content: string }> }
): Promise<string> {
  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful medical AI assistant for heart health. Provide general health information, but always remind users to consult real doctors for medical advice. Be friendly, concise, and professional.'
    }
  ]

  // Add previous messages if available
  if (context?.previousMessages) {
    context.previousMessages.forEach(msg => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })
    })
  }

  messages.push({ role: 'user', content: message })

  try {
    const response = await callOpenRouter(messages)
    return response + DISCLAIMER
  } catch (error) {
    console.error('Error in AI chat:', error)
    return `I apologize, but I'm experiencing technical difficulties. Please try again later or consult a healthcare professional for immediate concerns.${DISCLAIMER}`
  }
}

