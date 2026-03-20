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

// ============================================
// AI Skill Tag Suggestions
// ============================================
export async function suggestSkillTags(data: {
  title: string
  category: string
  description: string
}): Promise<string[]> {
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] No API key — skipping skill suggestions')
    return []
  }

  const prompt = `You are a career advisor for InternPick, a platform connecting high school students with local businesses for internships.

Based on the internship role below, suggest 8-12 specific, practical skills that a high school student would learn or develop in this role. Mix both hard skills (tools, software, techniques) and soft skills (communication, teamwork, etc.).

Role:
- Title: "${data.title}"
- Category: ${data.category || 'General'}
- Description: ${data.description ? `"${data.description.slice(0, 500)}"` : 'Not provided yet'}

Rules:
- Each skill should be 1-4 words (e.g. "Social Media", "Customer Service", "Excel", "Public Speaking")
- Be specific and relevant to this particular role — not generic
- Focus on skills that are practical and recognizable to a high school student
- Return ONLY a JSON array of strings, no explanation

JSON response:`

  try {
    const response = await callGemini(prompt)
    
    let jsonStr = response.trim()
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '')
    const arrMatch = jsonStr.match(/\[[\s\S]*\]/)
    if (arrMatch) jsonStr = arrMatch[0]
    
    const result = JSON.parse(jsonStr)
    if (Array.isArray(result)) {
      return result.filter((s: unknown) => typeof s === 'string' && s.length > 0).slice(0, 12)
    }
    return []
  } catch (err) {
    console.error('[Gemini] Skill suggestion error:', err)
    return []
  }
}

// ============================================
// DOL Compliance Review for Unpaid Roles
// ============================================
export async function reviewDOLCompliance(data: {
  title: string
  category: string
  description: string
}): Promise<{
  compliant: boolean
  score: number
  issues: string[]
  suggestions: string[]
}> {
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] No API key — skipping DOL review')
    return { compliant: true, score: 100, issues: [], suggestions: [] }
  }

  const prompt = `You are a Department of Labor (DOL) compliance expert reviewing an UNPAID internship listing for a high school student internship platform.

Review this role description against the DOL's 7-Factor Primary Beneficiary Test for unpaid internships:

Role Title: "${data.title}"
Category: ${data.category || 'General'}
Description: """
${data.description.slice(0, 1500)}
"""

The 7 factors are:
1. Both parties understand there is no expectation of compensation
2. Training is similar to an educational environment
3. Tied to formal education (coursework or academic credit)
4. Accommodates academic calendar/schedule
5. Limited duration tied to beneficial learning
6. Does NOT displace regular employees — intern works under close supervision
7. No entitlement to a paid position afterward

Score the description from 0-100 on DOL compliance. A description PASSES (score >= 60) if it clearly emphasizes:
- What the intern will LEARN (skills, training, mentorship)
- Educational/career development benefit to the intern
- That the intern does NOT replace paid employees
- Supervision and mentorship structure

A description FAILS if it:
- Reads like a job posting asking for free labor
- Lists only tasks/duties without educational framing
- Implies the intern will do regular employee work
- Lacks any mention of learning, mentorship, or educational benefit

Respond ONLY in valid JSON (no code fences):
{
  "compliant": true/false,
  "score": 0-100,
  "issues": ["specific issue 1", "specific issue 2"],
  "suggestions": ["actionable suggestion to fix issue 1", "actionable suggestion 2"]
}

If compliant, issues and suggestions can be empty arrays. Be strict but fair.`

  try {
    const response = await callGemini(prompt)

    let jsonStr = response.trim()
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '')
    const objMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (objMatch) jsonStr = objMatch[0]

    const result = JSON.parse(jsonStr)
    console.log(`[Gemini] DOL Review: score=${result.score}, compliant=${result.compliant}`)
    return {
      compliant: !!result.compliant,
      score: typeof result.score === 'number' ? result.score : 0,
      issues: Array.isArray(result.issues) ? result.issues : [],
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
    }
  } catch (err) {
    console.error('[Gemini] DOL review error:', err)
    // Fail open — don't block if AI is unavailable
    return { compliant: true, score: 100, issues: [], suggestions: [] }
  }
}

// ============================================
// Moderate Practicum Programs (Educator Posts)
// FERPA + Safety + Clarity checks
// ============================================
export async function moderatePracticumProgram(data: {
  title: string
  description: string
  schoolName: string
  category?: string
}): Promise<{
  approved: boolean
  ferpaViolations: string[]
  safetyIssues: string[]
  clarityIssues: string[]
  suggestions: string[]
}> {
  const prompt = `You are a compliance moderator for InternPick.com, a platform where school Educators post "Practicum Programs" (Calls for Hosts) seeking local businesses to host student interns for academic credit.

Your job is to review the following Practicum Program BEFORE it goes live. You must enforce three checks:

--- CHECK 1: FERPA COMPLIANCE (CRITICAL — BLOCK if violated) ---
The Family Educational Rights and Privacy Act (FERPA) forbids sharing personally identifiable information (PII) about students without consent.
BLOCK the post if it contains:
- Individual student names (first, last, or full names)
- Specific ages or birthdates of individual students
- Student ID numbers, addresses, or phone numbers
- Any identifiable markers that refer to a specific minor
NOTE: Generic references are FINE, such as: "Our senior class," "students ages 16-18," "5 students in our graphic design program." These are programmatic descriptions, not PII.

--- CHECK 2: SAFETY (Hazardous Duties for Minors) ---
Flag if the program description requests that the host employer have students perform:
- Operating heavy machinery or power tools
- Working with hazardous chemicals, radiation, or biohazards
- Driving commercial vehicles
- Working in construction zones, roofing, or at heights
- Serving alcohol, working in bars, or operating in adult entertainment
- Any tasks prohibited for minors under federal/state child labor laws

--- CHECK 3: CLARITY (Host Requirements) ---
Flag if the description does NOT clearly state:
- What the host employer is expected to provide (e.g., desk space, mentorship, project work)
- What learning outcomes or skills the student will gain
- The general structure of the program (shadowing vs. project-based)

--- POST TO REVIEW ---
School: ${data.schoolName}
Program Title: ${data.title}
Category: ${data.category || 'Not specified'}
Description: ${data.description}

Respond ONLY in valid JSON (no code fences):
{
  "approved": true/false,
  "ferpaViolations": ["specific violation 1"],
  "safetyIssues": ["specific safety concern 1"],
  "clarityIssues": ["what is missing or unclear"],
  "suggestions": ["actionable improvement suggestion 1"]
}

If approved, all issue arrays should be empty. A post must be BLOCKED (approved: false) if there are ANY ferpaViolations. Safety and clarity issues are advisory but should also cause a block if severe.`

  try {
    const response = await callGemini(prompt)
    let jsonStr = response.trim()
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '')
    const objMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (objMatch) jsonStr = objMatch[0]

    const result = JSON.parse(jsonStr)
    console.log(`[Gemini] Practicum moderation: approved=${result.approved}`)
    return {
      approved: !!result.approved,
      ferpaViolations: Array.isArray(result.ferpaViolations) ? result.ferpaViolations : [],
      safetyIssues: Array.isArray(result.safetyIssues) ? result.safetyIssues : [],
      clarityIssues: Array.isArray(result.clarityIssues) ? result.clarityIssues : [],
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
    }
  } catch (err) {
    console.error('[Gemini] Practicum moderation error:', err)
    // Fail open — don't block if AI is unavailable, but flag for manual review
    return { approved: true, ferpaViolations: [], safetyIssues: [], clarityIssues: ['AI moderation temporarily unavailable — flagged for manual review'], suggestions: [] }
  }
}

// ============================================
// Educator: Generate Practicum Draft (AI)
// ============================================
export interface PracticumDraftResult {
  description: string
  learningObjectives: string
}

export async function generatePracticumDraft(data: {
  title: string
  category: string
  schoolName: string
}): Promise<PracticumDraftResult> {
  if (!GEMINI_API_KEY) {
    return {
      description: 'AI drafting unavailable — API key not configured.',
      learningObjectives: 'AI drafting unavailable — API key not configured.',
    }
  }

  const prompt = `You are an educational curriculum assistant helping a high school teacher draft a Practicum Program description and learning objectives.

Program Context:
- School: ${data.schoolName}
- Title: "${data.title}"
- Subject Area/Category: ${data.category || 'General'}

Write:
1. "description": A warm, professional 3-4 sentence paragraph describing the program. Explain what the students will experience, what type of workplace environments they are looking for, and what general skills they will develop. Keep it focused on the value to the employer while highlighting student growth.
2. "learningObjectives": 3-4 bullet points specifically listing what students will learn. Start each bullet with an action verb (e.g. "Apply", "Develop", "Understand", "Complete"). Output as a single string with newlines and bullet points (•).

Respond ONLY in this exact JSON format (no markdown, no code blocks):
{
  "description": "paragraph...",
  "learningObjectives": "• Obj 1\\n• Obj 2"
}

JSON response:`

  try {
    const response = await callGemini(prompt)
    let jsonStr = response.trim()
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '')
    const objMatch = jsonStr.match(/\\{[\\s\\S]*\\}/)
    if (objMatch) jsonStr = objMatch[0]

    const result = JSON.parse(jsonStr)
    return {
      description: result.description || '',
      learningObjectives: result.learningObjectives || '',
    }
  } catch (err) {
    console.error('[Gemini] Practicum draft error:', err)
    return {
      description: 'Could not generate draft description. Please try again.',
      learningObjectives: 'Could not generate learning objectives. Please try again.',
    }
  }
}

// ============================================
// Student: Generate Resume via AI
// ============================================
export interface ResumeExperience {
  title: string
  entity: string
  bullets: string[]
}

export interface StudentResumeResult {
  experiences: ResumeExperience[]
  skills: string[]
}

export async function generateStudentResume(input: string): Promise<StudentResumeResult> {
  if (!GEMINI_API_KEY) {
    return {
      experiences: [],
      skills: [],
    }
  }

  const prompt = `You are a professional resume writer helping a high school student translate their informal experiences (hobbies, clubs, part-time jobs) into professional resume bullets.

Input: "${input}"

Your task is to identify distinct roles/experiences in the input and return them as a JSON object with:
1. "experiences": An array where each object has:
   - "title": Professional title (e.g. "Customer Service Associate")
   - "entity": The organization, club, or business (e.g. "Starbucks")
   - "bullets": An array of 2-3 strong, action-oriented bullet points starting with strong verbs, highlighting achievements and responsibilities.
2. "skills": An array of 3-5 professional skills extracted from the input (e.g. "Communication", "Social Media Marketing").

Respond ONLY in this exact JSON format (no markdown, no code blocks):
{
  "experiences": [
    {
      "title": "...",
      "entity": "...",
      "bullets": ["...", "..."]
    }
  ],
  "skills": ["...", "..."]
}

JSON response:`

  try {
    const response = await callGemini(prompt)
    let jsonStr = response.trim()
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '')
    const objMatch = jsonStr.match(/\\{[\\s\\S]*\\}/)
    if (objMatch) jsonStr = objMatch[0]

    const result = JSON.parse(jsonStr)
    return {
      experiences: Array.isArray(result.experiences) ? result.experiences : [],
      skills: Array.isArray(result.skills) ? result.skills : [],
    }
  } catch (err) {
    console.error('[Gemini] Student resume draft error:', err)
    return {
      experiences: [],
      skills: [],
    }
  }
}

// ============================================
// Educator Email Domain Validation
// ============================================
export function isEducatorEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false

  // .edu domains (colleges/universities)
  if (domain.endsWith('.edu')) return true

  // .k12.[state].us domains (K-12 public schools)
  if (/\.k12\.[a-z]{2}\.us$/.test(domain)) return true

  // .org domains (non-profits, charter schools)
  if (domain.endsWith('.org')) return true

  return false
}

// ============================================
// Employer AI: Candidate Communications Drafter
// ============================================
export async function generateEmployerMessageDraft(
  studentName: string,
  roleTitle: string,
  intent: 'interview' | 'rejection' | 'offer'
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing')
  }

  const instructions: Record<string, string> = {
    interview: "Write a short, friendly, and highly encouraging message inviting the high-school student to a brief interview (either online or in-person). Suggest they provide a few times they are free next week.",
    rejection: "Write a gentle, highly encouraging rejection message. Thank them specifically for applying, state that you've moved forward with other candidates at this time, but encourage them to keep building their skills.",
    offer: "Write a celebratory, exciting offer message! Congratulate them on being selected, mention what the next steps will be (onboarding, parent signatures, etc.), and welcome them to the team."
  }

  const prompt = `You are an HR professional or Business Manager hiring a high-school student on the InternPick platform.
  
Student Name: ${studentName}
Role Applied For: ${roleTitle}
Intent: ${intent}

Instructions:
${instructions[intent]}

Keep the message to 1-2 short paragraphs max. Maintain a highly professional, polite, and warmly encouraging tone suitable for a high-schooler taking their first professional steps. Do not include signature blocks or bracketed placeholders like "[Your Name]" or "[Company Name]". Return ONLY the text of the message.
`

  try {
    const response = await callGemini(prompt)
    const rawText = response.replace(/^["']|["']$/g, '').trim()
    return rawText
  } catch (err: any) {
    console.error('[Gemini] generateEmployerMessageDraft error:', err)
    throw new Error(err.message || 'Failed to generate employer message')
  }
}

// ============================================
// Student AI: Guided Journaling Copilot
// ============================================
export async function generateJournalQuestion(
  chatHistory: Array<{ role: 'user' | 'assistant', content: string }>
): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is missing');

  const formattedHistory = chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

  const prompt = `You are a friendly, encouraging AI journal copilot for high-school students doing an internship.
Your goal is to ask 1 simple, engaging follow-up question to help them reflect on their week.

Chat History:
${formattedHistory}

Instructions:
Ask ONE highly engaging, brief follow-up question (1-2 sentences). Do not answer for the student. Do not use quotes around your response. Keep a casual, warm tone.`;

  try {
    const response = await callGemini(prompt);
    return response.replace(/^["']|["']$/g, '').trim();
  } catch (err: any) {
    console.error('[Gemini] generateJournalQuestion error:', err);
    throw new Error('Failed to generate journal question');
  }
}

export async function synthesizeJournalEntry(
  chatHistory: Array<{ role: 'user' | 'assistant', content: string }>
): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is missing');

  const formattedHistory = chatHistory.filter(m => m.role === 'user').map(m => m.content).join('\n---\n');

  const prompt = `You are a professional editor. A high-school student has been chatting about their internship week. 
Take their informal thoughts and synthesize them into a SINGLE, beautifully written, cohesive, formal paragraph (reflection) written in the first-person ("I").

Student's thoughts:
${formattedHistory}

Instructions:
Write ONE cohesive, professional reflection paragraph. Do not use markdown quotes. Make it sound mature but still authentic to a high schooler. Fix spelling but do not invent new facts.`;

  try {
    const response = await callGemini(prompt);
    return response.replace(/^["']|["']$/g, '').trim();
  } catch (err: any) {
    console.error('[Gemini] synthesizeJournalEntry error:', err);
    throw new Error('Failed to synthesize journal entry');
  }
}

// ============================================
// Educator AI: Smart Matching Copilot
// ============================================
export async function suggestPlacements(
  studentProfile: { firstName: string, lastName: string, gradeLevel: string, careerInterests: string[], bio: string, resume: string },
  opportunities: Array<{ id: string, title: string, company: string, description: string }>
): Promise<Array<{ opportunityId: string, reason: string }>> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is missing');

  const prompt = `You are an expert career counselor AI. Your job is to match a high school student with the best local internship opportunities.
You will be provided with the student's profile and a list of available opportunities.

STUDENT PROFILE:
Name: ${studentProfile.firstName} ${studentProfile.lastName}
Grade: ${studentProfile.gradeLevel}
Interests: ${studentProfile.careerInterests?.join(', ')}
Bio: ${studentProfile.bio}
Resume/Skills: ${studentProfile.resume}

AVAILABLE OPPORTUNITIES:
${JSON.stringify(opportunities, null, 2)}

INSTRUCTIONS:
Select the TOP 3 best internship matches for this student based on their profile and the available opportunities. 
Return your answer ONLY as a valid JSON array of objects. Do not include markdown codeblocks (\`\`\`json) or any other text.
Each object must have exactly two keys:
1. "opportunityId": the exact 'id' string of the matched opportunity.
2. "reason": a 1-sentence very encouraging explanation of why this is a great fit for the student.

Make sure the reason uses the student's name in a supportive way. Return exactly 3 matches (or fewer if less than 3 are available).`;

  try {
    const response = await callGemini(prompt);
    const jsonStr = response.replace(/^```json|```$/gi, '').trim()
    return JSON.parse(jsonStr);
  } catch (err: any) {
    console.error('[Gemini] suggestPlacements error:', err);
    throw new Error('Failed to suggest placements');
  }
}

// ============================================
// Student AI: Professional Communication Coach
// ============================================
export async function polishStudentMessage(rawText: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is missing');

  const prompt = `You are a professional communication coach for a high school student chatting with a potential employer.
The student has drafted a message. 
Rewrite the message to be highly polite, professional, and grammatically correct.
DO NOT change the core meaning or invent new facts. Remove heavy slang. Keep it concise.
Return ONLY the rewritten professional text, no quotes or additional commentary.

Original message:
"${rawText}"`;

  try {
    const response = await callGemini(prompt);
    return response.replace(/^["']|["']$/g, '').trim();
  } catch (err: any) {
    console.error('[Gemini] polishStudentMessage error:', err);
    throw new Error('Failed to polish student message');
  }
}

