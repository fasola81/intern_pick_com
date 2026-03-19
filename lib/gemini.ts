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
        maxOutputTokens: 20480,
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

  const prompt = `You are a copywriter for InternPick, a platform connecting HIGH SCHOOL STUDENTS with local businesses for internships.

A business called "${companyName}" in the "${industry}" industry has written a rough internship role description. Your job is to polish it into a clear, engaging description that would excite a high school student.

Rules:
- Focus on LEARNING, GROWTH, and SKILL DEVELOPMENT — this is an internship, not a full-time job
- Keep it simple and approachable — write at a high school reading level
- Highlight what the student will learn and how this experience helps their future
- Keep it concise (3-5 sentences max)
- Sound warm and encouraging, not corporate
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
  industry: string
  email: string
  tagline: string
  linkedin: string
  instagram: string
  facebook: string
  twitter: string
  prompt: string
  rawResponse: string
}

const emptyResult: Omit<CompanyLookupResult, 'prompt' | 'rawResponse'> = {
  about: '', zipCode: '', employeeCount: '', phone: '', industry: '',
  email: '', tagline: '', linkedin: '', instagram: '', facebook: '', twitter: '',
}

export async function lookupCompany(
  companyName: string,
  zipCode: string,
  website: string
): Promise<CompanyLookupResult> {
  const prompt = `You are an AI assistant for InternPick, a platform connecting high school students with local businesses.

A business is setting up their profile. Based on the information below, try to find or infer additional details about this company. If you cannot confidently determine a field, leave it as an empty string.

Company Name: "${companyName}"
Zip Code: "${zipCode}"
Website: ${website || 'Not provided'}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "about": "A warm, professional 2-3 sentence description of the company suitable for high school students looking for internships. If you can find real info about this company from the website, use it. Otherwise write a plausible description based on the name.",
  "tagline": "A short one-line tagline or motto for the company, if known. Otherwise empty string.",
  "industry": "One of: retail, food, tech, health, construction, finance, education, legal, marketing, other — your best guess based on the company name and website, otherwise empty string",
  "employeeCount": "One of: 1-5, 6-20, 21-50, 51-200, 200+ — your best estimate based on what you know, otherwise empty string",
  "phone": "Business phone number if publicly available, otherwise empty string",
  "email": "General contact email if publicly available, otherwise empty string",
  "linkedin": "Full LinkedIn company page URL if known, otherwise empty string",
  "instagram": "Full Instagram profile URL if known, otherwise empty string",
  "facebook": "Full Facebook page URL if known, otherwise empty string",
  "twitter": "Full X/Twitter profile URL if known, otherwise empty string"
}

JSON response:`

  if (!GEMINI_API_KEY) {
    return { ...emptyResult, prompt, rawResponse: 'No API key configured' }
  }

  try {
    const response = await callGemini(prompt)
    
    let jsonStr = response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) jsonStr = jsonMatch[0]
    
    // Repair truncated JSON — close unterminated strings and objects
    const quoteCount = (jsonStr.match(/(?<!\\)"/g) || []).length
    if (quoteCount % 2 !== 0) jsonStr += '"'
    if (!jsonStr.trimEnd().endsWith('}')) jsonStr += '}'
    
    const result = JSON.parse(jsonStr)
    return {
      about: result.about || '',
      zipCode: '',
      employeeCount: result.employeeCount || '',
      phone: result.phone || '',
      industry: result.industry || '',
      email: result.email || '',
      tagline: result.tagline || '',
      linkedin: result.linkedin || '',
      instagram: result.instagram || '',
      facebook: result.facebook || '',
      twitter: result.twitter || '',
      prompt,
      rawResponse: response,
    }
  } catch (err) {
    console.error('[Gemini] Company lookup error:', err)
    return { ...emptyResult, prompt, rawResponse: `Error: ${err}` }
  }
}

// ============================================
// AI Opportunity Listing Moderation
// ============================================
export async function moderateOpportunityListing(listing: {
  title: string
  description: string
  category: string
  compensation: string
  perks: string[]
  workSetting: string
}): Promise<ModerationResult> {
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] No API key, skipping listing moderation')
    return { safe: true }
  }

  const perksStr = listing.perks.length > 0 ? listing.perks.join(', ') : 'None selected'

  const prompt = `You are a safety moderator for InternPick, a platform connecting HIGH SCHOOL STUDENTS (minors, ages 14-18) with local businesses for internships.

Your job is to review a job listing BEFORE it is published. Because this platform involves MINORS, safety standards are extremely high.

FLAG the listing if it contains ANY of the following:
- **Inappropriate content**: Sexual, violent, drug-related, or any content unsuitable for minors
- **Discriminatory language**: Race, gender, religion, disability, or any protected-class discrimination
- **Scam indicators**: Requests for money, MLM/pyramid scheme language, "investment opportunities", unpaid work disguised as training fees, or anything "too good to be true"
- **Illegal/unsafe labor**: Dangerous working conditions for minors, requests to work illegal hours, serving alcohol, operating heavy machinery, or anything violating child labor laws
- **Personal contact info in description**: Phone numbers, personal emails, addresses, social media handles (should go through the platform)
- **Predatory behavior**: Requests for photos, personal meetings outside work, grooming language, or anything suggesting exploitation
- **Profanity or hostile language**: Any unprofessional language unsuitable for a job posting
${listing.compensation === 'unpaid' ? `
- **DOL COMPLIANCE (CRITICAL — this is an UNPAID listing)**: Under the Department of Labor's Primary Beneficiary Test (FLSA), flag the listing if:
  • The description indicates the intern will perform productive work that primarily benefits the employer (e.g., "handle customer orders", "manage our social media", "run the register")
  • The role describes tasks that a regular paid employee would typically perform, with no educational/mentorship component
  • There is no mention of training, learning, mentorship, skill development, or educational benefit to the intern
  • The description reads more like a regular job posting than an educational internship opportunity
  • The intern appears to be displacing or substituting for a paid employee
  If the listing fails DOL compliance, include specific guidance in your reason about what the employer should change to make the internship legally compliant (e.g., "Add a training/mentorship component", "Describe what the intern will learn", "Ensure the description focuses on the educational benefit to the intern")
` : ''}
If the listing is professional, appropriate, and safe for high school students, mark it as safe.

Listing to review:
- Title: "${listing.title.replace(/"/g, '\\"')}"
- Category: ${listing.category || 'Not specified'}
- Compensation: ${listing.compensation}
- Work Setting: ${listing.workSetting}
- Description: "${listing.description.replace(/"/g, '\\"')}"
- Perks: ${perksStr}

Respond ONLY in this exact JSON format:
{"safe": true}
OR
{"safe": false, "reason": "Brief, user-friendly explanation of what needs to be fixed", "category": "one_of: harassment, pii_request, inappropriate, scam, predatory, labor_compliance, other"}

JSON response:`

  try {
    const response = await callGemini(prompt)

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
    console.error('[Gemini] Listing moderation error:', err)
    return { safe: true }
  }
}

// ============================================
// Generate Role Avatar SVG
// ============================================
export async function generateRoleAvatar(data: {
  title: string
  category: string
  description: string
}): Promise<{ svg: string | null; error?: string }> {
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] No API key — skipping avatar generation')
    return { svg: null, error: 'API key not configured' }
  }

  const prompt = `You are a world-class SVG illustrator. Create a single, beautiful, animated SVG illustration that visually represents this internship role:

**Role Title:** ${data.title}
**Category:** ${data.category || 'General'}
**Description:** ${data.description.slice(0, 300)}

STRICT RULES:
1. Output ONLY the raw SVG code — no markdown, no code fences, no explanation
2. Use viewBox="0 0 200 200" with width="200" height="200"
3. Use a modern, flat illustration style with clean geometric shapes
4. Include 2-3 subtle CSS animations (e.g. floating, pulsing, rotating elements) using <style> inside the SVG
5. Use a harmonious color palette of 3-5 colors. Avoid pure black/white — use deep navy (#1e293b) and off-white (#f8fafc) instead
6. Add a soft circular or rounded-square background shape as the base
7. The illustration should be immediately recognizable as related to the role's category/type
8. Keep the SVG under 3000 characters for performance
9. Do NOT use any external resources, fonts, or images
10. Do NOT use JavaScript or inline event handlers
11. Make it visually delightful — this is the "profile picture" of the internship role

Example categories and their visual themes:
- Tech/Software: screens, code brackets, circuit patterns
- Food/Beverage: utensils, coffee cups, chef elements
- Marketing: megaphones, charts, social icons
- Retail: shopping bags, storefronts, tags
- Education: books, graduation caps, pencils
- Healthcare: hearts, medical crosses, stethoscopes
- Arts/Creative: palettes, brushes, cameras

Generate the SVG now:`

  try {
    const response = await callGemini(prompt)
    
    // Extract SVG from response
    let svg = response.trim()
    
    // Remove markdown code fences if present
    svg = svg.replace(/^```(?:svg|xml|html)?\s*\n?/i, '').replace(/\n?```\s*$/i, '')
    
    // Extract just the <svg>...</svg> content
    const svgMatch = svg.match(/<svg[\s\S]*?<\/svg>/i)
    if (!svgMatch) {
      console.error('[Gemini] No valid SVG found in response')
      return { svg: null, error: 'Failed to generate valid SVG' }
    }
    
    svg = svgMatch[0]
    
    // Basic sanitization — remove any script tags or event handlers
    svg = svg.replace(/<script[\s\S]*?<\/script>/gi, '')
    svg = svg.replace(/\bon\w+\s*=/gi, '')
    
    console.log(`[Gemini] ✅ Role avatar generated (${svg.length} chars)`)
    return { svg }
  } catch (err) {
    console.error('[Gemini] Role avatar generation error:', err)
    return { svg: null, error: 'Failed to generate avatar' }
  }
}

// ============================================
// Generate Role Avatar Image (Imagen 3)
// ============================================
export async function generateRoleImage(data: {
  title: string
  category: string
  description: string
}): Promise<{ base64: string | null; error?: string }> {
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] No API key — skipping image generation')
    return { base64: null, error: 'API key not configured' }
  }

  const prompt = `A highly realistic, professional photograph of a young intern working in the following role: ${data.title}. Category: ${data.category || 'General'}. Context: ${data.description.slice(0, 300)}. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          outputOptions: { mimeType: "image/jpeg" }
        }
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[Gemini] Imagen API error:', res.status, errText)
      return { base64: null, error: `API Error: ${res.status}` }
    }

    const json = await res.json()
    const base64 = json.predictions?.[0]?.bytesBase64Encoded
    if (!base64) {
      console.error('[Gemini] No image data in response')
      return { base64: null, error: 'Failed to generate valid image' }
    }

    console.log('[Gemini] ✅ Role image generated via Imagen 3')
    return { base64 }
  } catch (err: any) {
    console.error('[Gemini] Role image generation error:', err)
    return { base64: null, error: err.message || 'Failed to generate image' }
  }
}
