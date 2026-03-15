// ============================================
// Gemini AI Client — REST API
// ============================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

function getGeminiUrl() {
  return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY || ''}`
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

async function callGemini(prompt: string): Promise<string> {
  const url = getGeminiUrl()
  console.log('[Gemini] Calling model: gemini-2.5-flash')
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    console.error('[Gemini] API error:', res.status, errBody)
    throw new Error(`Gemini API error: ${res.status}`)
  }

  const data: GeminiResponse = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  console.log('[Gemini] Response received, length:', text.length)
  return text.trim()
}

// ============================================
// AI Message Moderation
// ============================================
export interface ModerationResult {
  safe: boolean
  reason?: string
  category?: 'harassment' | 'pii_request' | 'inappropriate' | 'scam' | 'predatory' | 'other'
}

export async function moderateMessage(
  messageText: string,
  senderRole: 'student' | 'company'
): Promise<ModerationResult> {
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] No API key, skipping moderation')
    return { safe: true }
  }

  const prompt = `You are a safety moderator for InternPick, a platform connecting high school students with local businesses for internships.

Your job is to analyze messages exchanged between students and businesses for safety concerns. This platform involves MINORS (high school students), so safety is paramount.

FLAG a message if it contains ANY of the following:
- **PII requests**: Asking for home address, phone number, social security number, bank details, passwords, or any personal information that should not be shared in a professional setting
- **Harassment**: Insults, threats, bullying, discriminatory language, or hostile behavior
- **Inappropriate content**: Sexual content, suggestive language, drug references, or content inappropriate for minors
- **Scam indicators**: Requests for money, cryptocurrency, gift cards, suspicious links, or "too good to be true" offers
- **Predatory behavior**: Asking to meet privately outside of professional context, asking for photos unrelated to work, attempts to move communication off-platform, grooming behavior
- **Other safety concerns**: Any content that could put a minor at risk

The sender is a ${senderRole === 'company' ? 'BUSINESS/EMPLOYER' : 'STUDENT'}.

Respond ONLY in this exact JSON format:
{"safe": true}
OR
{"safe": false, "reason": "Brief explanation of why this was flagged", "category": "one_of: harassment, pii_request, inappropriate, scam, predatory, other"}

Message to analyze:
"${messageText.replace(/"/g, '\\"')}"

JSON response:`

  try {
    const response = await callGemini(prompt)
    
    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = response.trim()
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '')
    const jsonMatch = jsonStr.match(/\{[\s\S]*?\}/)
    if (jsonMatch) jsonStr = jsonMatch[0]
    
    const result = JSON.parse(jsonStr)
    return {
      safe: result.safe === true,
      reason: result.reason,
      category: result.category,
    }
  } catch (err) {
    console.error('[Gemini] Moderation error:', err)
    // Fail open for now — in production, you might want to fail closed
    return { safe: true }
  }
}

// ============================================
// AI Role Prep for Students
// ============================================
export interface RolePrepResult {
  summary: string
  expectations: string[]
  profileFit: string
  prepTips: string[]
  videoTips: string[]
}

export async function generateRolePrep(opportunity: {
  title: string
  description?: string
  category?: string
  compensation?: string
  work_setting?: string
  required_skills?: string[]
  hours_per_week?: number
}, studentProfile?: {
  interests?: string[]
  high_school?: string
}): Promise<RolePrepResult> {
  if (!GEMINI_API_KEY) {
    return {
      summary: 'AI insights unavailable — API key not configured.',
      expectations: [],
      profileFit: '',
      prepTips: [],
      videoTips: [],
    }
  }

  const studentContext = studentProfile 
    ? `\nStudent Profile:
- Interests: ${studentProfile.interests?.join(', ') || 'Not specified'}
- School: ${studentProfile.high_school || 'Not specified'}`
    : '\nNo student profile available — provide general advice.'

  const prompt = `You are an AI career coach for InternPick, helping high school students prepare for internship applications.

Role Details:
- Title: ${opportunity.title}
- Description: ${opportunity.description || 'No description provided'}
- Category: ${opportunity.category || 'General'}
- Compensation: ${opportunity.compensation || 'Not specified'}
- Setting: ${opportunity.work_setting || 'Not specified'}
- Required Skills: ${opportunity.required_skills?.join(', ') || 'None listed'}
- Hours/week: ${opportunity.hours_per_week || 'Not specified'}
${studentContext}

Respond ONLY in this exact JSON format (no markdown, no code blocks):
{
  "summary": "2-3 sentence summary of what this role involves and why it's a great opportunity for a high school student",
  "expectations": ["expectation 1", "expectation 2", "expectation 3"],
  "profileFit": "1-2 sentences on how the student's interests/background align with this role (be encouraging)",
  "prepTips": ["specific tip 1", "specific tip 2", "specific tip 3"],
  "videoTips": ["what to mention in video intro tip 1", "tip 2", "tip 3"]
}

JSON response:`

  try {
    const response = await callGemini(prompt)
    
    let jsonStr = response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) jsonStr = jsonMatch[0]
    
    const result = JSON.parse(jsonStr)
    return {
      summary: result.summary || '',
      expectations: result.expectations || [],
      profileFit: result.profileFit || '',
      prepTips: result.prepTips || [],
      videoTips: result.videoTips || [],
    }
  } catch (err) {
    console.error('[Gemini] Role prep error:', err)
    return {
      summary: 'Unable to generate AI insights at this time. Please try again.',
      expectations: [],
      profileFit: '',
      prepTips: [],
      videoTips: [],
    }
  }
}

// ============================================
// AI About Us Polish
// ============================================
export async function polishAboutUs(
  rawText: string,
  companyName: string,
  industry: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return rawText
  }

  const prompt = `You are a professional copywriter for InternPick, a platform connecting high school students with local businesses for internships.

A business called "${companyName}" in the "${industry}" industry has written a rough "About Us" description. Your job is to polish it into a professional, warm, and engaging paragraph that would appeal to high school students looking for internships.

Rules:
- Keep it concise (2-4 sentences max)
- Make it sound professional but friendly and approachable
- Highlight what makes the company a great place for students
- Do NOT invent facts — only polish what's given
- Do NOT use quotation marks around the output
- Return ONLY the polished text, nothing else

Raw text from the business:
"${rawText.replace(/"/g, '\\"')}"

Polished version:`

  try {
    const response = await callGemini(prompt)
    return response.replace(/^["']|["']$/g, '').trim()
  } catch (err) {
    console.error('[Gemini] Polish about error:', err)
    return rawText
  }
}

// ============================================
// AI Company Lookup
// ============================================
export interface CompanyLookupResult {
  about: string
  zipCode: string
  employeeCount: string
  phone: string
}

export async function lookupCompany(
  companyName: string,
  industry: string,
  website: string
): Promise<CompanyLookupResult> {
  if (!GEMINI_API_KEY) {
    return { about: '', zipCode: '', employeeCount: '', phone: '' }
  }

  const prompt = `You are an AI assistant for InternPick, a platform connecting high school students with local businesses.

A business is setting up their profile. Based on the information below, try to find or infer additional details about this company. If you cannot confidently determine a field, leave it as an empty string.

Company Name: "${companyName}"
Industry: "${industry}"
Website: ${website || 'Not provided'}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "about": "A warm, professional 2-3 sentence description of the company suitable for high school students looking for internships. If you can find real info about this company from the website, use it. Otherwise write a plausible description based on the name and industry.",
  "zipCode": "5-digit US zip code if you can determine the company's location, otherwise empty string",
  "employeeCount": "One of: 1-5, 6-20, 21-50, 51-200, 200+ — your best estimate based on what you know, otherwise empty string",
  "phone": "Business phone number if publicly available, otherwise empty string"
}

JSON response:`

  try {
    const response = await callGemini(prompt)
    
    let jsonStr = response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) jsonStr = jsonMatch[0]
    
    const result = JSON.parse(jsonStr)
    return {
      about: result.about || '',
      zipCode: (result.zipCode || '').replace(/\D/g, '').slice(0, 5),
      employeeCount: result.employeeCount || '',
      phone: result.phone || '',
    }
  } catch (err) {
    console.error('[Gemini] Company lookup error:', err)
    return { about: '', zipCode: '', employeeCount: '', phone: '' }
  }
}
