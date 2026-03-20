'use server'

import { createClient } from '@/utils/supabase/server'
import { unstable_noStore as noStore } from 'next/cache'
import { generateRolePrep, moderateMessage, moderateOpportunityListing, polishAboutUs, lookupCompany, generateRoleAvatar, generateRoleImage, suggestSkillTags as aiSuggestSkillTags, reviewDOLCompliance as aiReviewDOLCompliance, moderatePracticumProgram as aiModeratePracticum, isEducatorEmailDomain, generatePracticumDraft as aiGeneratePracticumDraft, generateStudentResume as aiGenerateStudentResume, generateEmployerMessageDraft as aiGenerateEmployerMessageDraft, generateJournalQuestion as aiGenerateJournalQuestion, synthesizeJournalEntry as aiSynthesizeJournalEntry, suggestPlacements as aiSuggestPlacements, polishStudentMessage as aiPolishStudentMessage } from '@/lib/gemini'

// Helper: require authenticated user or throw
async function requireAuth(supabase: any) {
  const { data: authData } = await supabase.auth.getUser()
  const userId = authData?.user?.id
  if (!userId) throw new Error('Not authenticated')
  return { userId, email: authData.user.email || '' }
}

// ============================================
// AI Moderate Opportunity Content
// ============================================
export async function moderateOpportunityContent(data: {
  title: string
  description: string
  category: string
  compensation: string
  perks: string[]
  workSetting: string
}) {
  const supabase = await createClient()
  let userId: string
  try {
    const auth = await requireAuth(supabase)
    userId = auth.userId
  } catch {
    return { safe: true } // allow if not authenticated (will fail at publish anyway)
  }

  const result = await moderateOpportunityListing(data)

  if (!result.safe) {
    // Log the issue for platform owners
    await supabase
      .from('ai_moderation_logs')
      .insert({
        sender_id: userId,
        sender_role: 'company',
        message_text: `[LISTING] Title: ${data.title} | Description: ${data.description} | Perks: ${data.perks.join(', ')}`,
        flagged_reason: result.reason || 'Content flagged by AI',
        category: result.category || 'other',
      })

    console.log('[AI] 🚫 Listing blocked:', result.reason)
  } else {
    console.log('[AI] ✅ Listing approved')
  }

  return result
}

// ============================================
// AI Suggest Skill Tags
// ============================================
export async function suggestSkillTagsAction(data: {
  title: string
  category: string
  description: string
}) {
  const tags = await aiSuggestSkillTags(data)
  return { success: true, tags }
}

// ============================================
// AI DOL Compliance Review (Unpaid Roles)
// ============================================
export async function reviewDOLComplianceAction(data: {
  title: string
  category: string
  description: string
}) {
  return await aiReviewDOLCompliance(data)
}

// ============================================
// Student Onboarding
// ============================================
export async function createStudentProfile(data: {
  highSchool: string
  zipCode: string
  interests: string[]
}) {
  const supabase = await createClient()
  let userId: string, email: string
  try {
    const auth = await requireAuth(supabase)
    userId = auth.userId
    email = auth.email
  } catch {
    return { success: false, error: 'You must be logged in to create a profile' }
  }

  // Upsert into users table
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: userId,
      role: 'student',
      full_name: email.split('@')[0] || 'Student',
    }, { onConflict: 'id' })

  if (userError) {
    console.error('[DB] users insert error:', userError)
    return { success: false, error: userError.message }
  }

  // Upsert into students table
  const { error: studentError } = await supabase
    .from('students')
    .upsert({
      id: userId,
      high_school_name: data.highSchool,
      zip_code: data.zipCode,
      interests_array: data.interests,
    }, { onConflict: 'id' })

  if (studentError) {
    console.error('[DB] students insert error:', studentError)
    return { success: false, error: studentError.message }
  }

  console.log('[DB] ✅ Student profile created successfully for user:', userId)
  return { success: true, userId }
}

// ============================================
// Check Company Availability (name + zip + website)
// ============================================
export async function checkCompanyAvailability(data: {
  companyName: string
  zipCode: string
  website?: string
}, excludeUserId?: string) {
  const supabase = await createClient()

  // Start with name + zip match
  let query = supabase
    .from('companies')
    .select('id, company_name, zip_code, website')
    .ilike('company_name', data.companyName.trim())
    .eq('zip_code', data.zipCode.trim())

  const { data: rows, error } = await query

  if (error) {
    console.error('[DB] company availability check error:', error)
    return { available: true } // fail open
  }

  // Filter out current user's own record (for edit mode)
  let matches = excludeUserId
    ? rows?.filter((c: { id: string }) => c.id !== excludeUserId) || []
    : rows || []

  // If the registrant provided a website, also require website match
  if (data.website && data.website.trim()) {
    const normalizedUrl = data.website.trim().toLowerCase().replace(/\/+$/, '')
    matches = matches.filter((c: { website: string | null }) => {
      if (!c.website) return false
      return c.website.toLowerCase().replace(/\/+$/, '') === normalizedUrl
    })
  }

  if (matches.length > 0) {
    return { available: false, existingCompany: matches[0].company_name }
  }

  return { available: true }
}

// ============================================
// Validate URL (ping check)
// ============================================
export async function validateUrl(url: string): Promise<{ valid: boolean; url: string }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    })
    clearTimeout(timeout)
    return { valid: res.status >= 200 && res.status < 400, url }
  } catch {
    return { valid: false, url }
  }
}

// ============================================
// Employer Onboarding
// ============================================
export async function createEmployerProfile(data: {
  companyName: string
  industry: string
  zipCode: string
  addressLine?: string
  city?: string
  state?: string
  about?: string
  website?: string
  phone?: string
  contactEmail?: string
  employeeCount?: string
  logoUrl?: string
  socialLinks?: Array<{ label: string; url: string }>
  status?: string
}) {
  const supabase = await createClient()
  let userId: string
  try {
    const auth = await requireAuth(supabase)
    userId = auth.userId
  } catch {
    return { success: false, error: 'You must be logged in to create a profile' }
  }

  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: userId,
      role: 'company',
      full_name: data.companyName,
    }, { onConflict: 'id' })

  if (userError) {
    console.error('[DB] users insert error:', userError)
    return { success: false, error: userError.message }
  }

  const companyData: Record<string, unknown> = {
    id: userId,
    company_name: data.companyName,
    industry: data.industry,
    zip_code: data.zipCode,
  }
  if (data.addressLine) companyData.address_line = data.addressLine
  if (data.city) companyData.city = data.city
  if (data.state) companyData.state = data.state
  if (data.about) companyData.about = data.about
  if (data.website) companyData.website = data.website
  if (data.phone) companyData.phone = data.phone
  if (data.contactEmail) companyData.contact_email = data.contactEmail
  if (data.employeeCount) companyData.employee_count = data.employeeCount
  if (data.logoUrl) companyData.logo_url = data.logoUrl
  if (data.socialLinks && data.socialLinks.length > 0) companyData.social_links = JSON.stringify(data.socialLinks)
  if (data.status) companyData.status = data.status

  const { error: companyError } = await supabase
    .from('companies')
    .upsert(companyData, { onConflict: 'id' })

  if (companyError) {
    console.error('[DB] companies insert error:', companyError)
    return { success: false, error: companyError.message }
  }

  console.log('[DB] ✅ Employer profile created successfully for user:', userId)
  return { success: true, userId }
}

// ============================================
// Generate Role Avatar SVG (Server Action)
// ============================================
export async function generateRoleAvatarAction(data: {
  title: string
  category: string
  description: string
}): Promise<{ svg: string | null; error?: string }> {
  const supabase = await createClient()
  try {
    await requireAuth(supabase)
  } catch {
    return { svg: null, error: 'Not authenticated' }
  }

  const result = await generateRoleAvatar(data)
  return result
}

// ============================================
// Generate and Upload Role Image (Server Action)
// ============================================
export async function generateAndUploadRoleImageAction(data: {
  title: string
  category: string
  description: string
}): Promise<{ url: string | null; error?: string }> {
  const supabase = await createClient()
  let userId: string
  try {
    const auth = await requireAuth(supabase)
    userId = auth.userId
  } catch {
    return { url: null, error: 'Not authenticated' }
  }

  const { base64, error: genError } = await generateRoleImage(data)
  if (genError || !base64) return { url: null, error: genError || 'Failed to generate image' }

  const buffer = Buffer.from(base64, 'base64')
  const fileName = `${userId}/${Date.now()}_role.jpg`

  const { error: uploadError } = await supabase.storage
    .from('role-avatars')
    .upload(fileName, buffer, {
      contentType: 'image/jpeg',
      upsert: false,
    })

  if (uploadError) {
    console.error('[DB] Storage upload error:', uploadError)
    return { url: null, error: uploadError.message }
  }

  const { data: urlData } = supabase.storage
    .from('role-avatars')
    .getPublicUrl(fileName)

  console.log('[DB] ✅ Role image uploaded:', urlData.publicUrl)
  return { url: urlData.publicUrl }
}

// ============================================
// Post a Role (Employer)
// ============================================
export async function createOpportunity(data: {
  title: string
  category: string
  compensation: 'paid' | 'unpaid' | 'credit'
  hourlyRate?: number
  hoursPerWeek?: number
  startDate?: string
  endDate?: string
  workSetting: 'onsite' | 'hybrid' | 'remote'
  requiredSkills: string[]
  description: string
  avatarSvg?: string | null
  avatarUrl?: string | null
}) {
  const supabase = await createClient()
  let companyId: string
  try {
    const auth = await requireAuth(supabase)
    companyId = auth.userId
  } catch {
    return { success: false, error: 'You must be logged in to post a role' }
  }

  const { data: opp, error } = await supabase
    .from('opportunities')
    .insert({
      company_id: companyId,
      title: data.title,
      description: data.description,
      category: data.category,
      compensation: data.compensation,
      hourly_rate: data.hourlyRate || null,
      work_setting: data.workSetting,
      required_skills: data.requiredSkills,
      hours_per_week: data.hoursPerWeek || null,
      start_date: data.startDate || null,
      end_date: data.endDate || null,
      is_active: true,
      avatar_svg: data.avatarSvg || null,
      avatar_url: data.avatarUrl || null,
    })
    .select()
    .single()

  if (error) {
    console.error('[DB] opportunities insert error:', error)
    return { success: false, error: error.message }
  }

  console.log('[DB] ✅ Opportunity created:', opp?.id)
  return { success: true, id: opp?.id }
}

// ============================================
// Fetch Active Opportunities (Student Feed)
// ============================================
export async function getActiveOpportunities() {
  noStore() // Prevent Next.js from caching this response
  const supabase = await createClient()

  // Fetch opportunities without join (FK dropped, PostgREST can't infer relationship)
  const { data: opportunities, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[DB] fetch opportunities error:', error)
    return { success: false, data: [], error: error.message }
  }

  if (!opportunities || opportunities.length === 0) {
    console.log('[DB] No active opportunities found')
    return { success: true, data: [] }
  }

  // Fetch company info separately
  const companyIds = [...new Set(opportunities.map(o => o.company_id))]
  const { data: companies } = await supabase
    .from('companies')
    .select('id, company_name, industry, zip_code')
    .in('id', companyIds)

  // Merge company data into opportunities
  const companyMap = new Map((companies || []).map(c => [c.id, c]))
  const enriched = opportunities.map(opp => ({
    ...opp,
    companies: companyMap.get(opp.company_id) || null,
  }))

  console.log(`[DB] ✅ Fetched ${enriched.length} active opportunities`)
  return { success: true, data: enriched }
}

// ============================================
// Quick Apply (Student → Interest)
// ============================================
export async function applyForOpportunity(data: {
  opportunityId: string
  note?: string
  videoId?: string
}) {
  const supabase = await createClient()
  let studentId: string
  try {
    const auth = await requireAuth(supabase)
    studentId = auth.userId
  } catch {
    return { success: false, error: 'You must be logged in to apply' }
  }

  const { error } = await supabase
    .from('interests')
    .insert({
      student_id: studentId,
      opportunity_id: data.opportunityId,
      note: data.note || null,
      video_id: data.videoId || null,
      status: 'pending',
    })

  if (error) {
    console.error('[DB] interests insert error:', error)
    return { success: false, error: error.message }
  }

  console.log('[DB] ✅ Application submitted for opportunity:', data.opportunityId, data.videoId ? `with video ${data.videoId}` : 'without video')
  return { success: true }
}

// ============================================
// Upload Student Video to Supabase Storage
// ============================================
export async function uploadStudentVideo(formData: FormData) {
  const supabase = await createClient()
  let studentId: string
  try {
    const auth = await requireAuth(supabase)
    studentId = auth.userId
  } catch {
    return { success: false, error: 'You must be logged in to upload a video' }
  }

  const videoFile = formData.get('video') as File
  const title = (formData.get('title') as string) || 'My Introduction'
  const durationSeconds = parseInt(formData.get('duration') as string) || 0

  if (!videoFile) {
    return { success: false, error: 'No video file provided' }
  }

  // Upload to storage
  const fileName = `${studentId}/${Date.now()}_intro.webm`
  const { error: uploadError } = await supabase.storage
    .from('student-videos')
    .upload(fileName, videoFile, {
      contentType: 'video/webm',
      upsert: false,
    })

  if (uploadError) {
    console.error('[DB] storage upload error:', uploadError)
    return { success: false, error: uploadError.message }
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('student-videos')
    .getPublicUrl(fileName)

  // Insert metadata
  const { data: videoRecord, error: dbError } = await supabase
    .from('student_videos')
    .insert({
      student_id: studentId,
      title,
      storage_path: fileName,
      duration_seconds: durationSeconds,
    })
    .select()
    .single()

  if (dbError) {
    console.error('[DB] student_videos insert error:', dbError)
    return { success: false, error: dbError.message }
  }

  console.log('[DB] ✅ Video uploaded:', videoRecord?.id)
  return {
    success: true,
    videoId: videoRecord?.id,
    url: urlData?.publicUrl,
  }
}

// ============================================
// Fetch Student's Video Library
// ============================================
export async function getStudentVideos() {
  noStore()
  const supabase = await createClient()
  let studentId: string
  try {
    const auth = await requireAuth(supabase)
    studentId = auth.userId
  } catch {
    return { success: false, data: [], error: 'You must be logged in' }
  }

  const { data, error } = await supabase
    .from('student_videos')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[DB] fetch student_videos error:', error)
    return { success: false, data: [], error: error.message }
  }

  console.log(`[DB] ✅ Fetched ${data?.length || 0} student videos`)
  return { success: true, data: data || [] }
}

// ============================================
// AI Role Prep (Gemini)
// ============================================
export async function getRolePrep(opportunityId: string) {
  const supabase = await createClient()

  // Fetch the opportunity
  const { data: opp, error: oppErr } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', opportunityId)
    .single()

  if (oppErr || !opp) {
    console.error('[RolePrep] DB error fetching opportunity:', oppErr?.message)
    return { success: false, error: 'Opportunity not found' }
  }

  console.log('[RolePrep] Got opportunity:', opp.title)

  // Fetch student profile
  const { data: authData } = await supabase.auth.getUser()
  const studentId = authData?.user?.id
  const { data: student } = studentId ? await supabase
    .from('students')
    .select('interests_array, high_school_name')
    .eq('id', studentId)
    .single() : { data: null }
  console.log('[RolePrep] Student profile:', student ? 'found' : 'not found')

  // Build prompt
  const studentCtx = student
    ? `\nStudent: Interests: ${student.interests_array?.join(', ') || 'N/A'}, School: ${student.high_school_name || 'N/A'}`
    : '\nNo student profile — provide general advice.'

  const prompt = `You are an AI career coach helping high school students prepare for internships. Given this role, respond ONLY in valid JSON (no code fences, no markdown):

Role: ${opp.title}
Description: ${opp.description || 'N/A'}
Category: ${opp.category || 'General'}
Skills: ${opp.required_skills?.join(', ') || 'None'}${studentCtx}

Required JSON format:
{"summary":"2-3 sentences about this role","expectations":["exp1","exp2","exp3"],"profileFit":"how student fits","prepTips":["tip1","tip2","tip3"],"videoTips":["vtip1","vtip2","vtip3"]}`

  // Call Gemini API directly
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('[RolePrep] GEMINI_API_KEY is missing!')
    return { success: false, error: 'API key not configured' }
  }

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
    
    console.log('[RolePrep] Calling Gemini API...')
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[RolePrep] API HTTP error:', res.status, errText.substring(0, 200))
      return { success: false, error: `API error: ${res.status}` }
    }

    const apiData = await res.json()
    const rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text || ''
    console.log('[RolePrep] Raw response length:', rawText.length)

    // Robust JSON extraction with brace-depth tracking
    let jsonStr = rawText.trim()
    // Strip markdown code fences
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '')
    
    // Find the outermost JSON object using brace depth counting
    const startIdx = jsonStr.indexOf('{')
    if (startIdx === -1) throw new Error('No JSON object found in response')
    
    let depth = 0
    let endIdx = -1
    let inString = false
    let escape = false
    for (let i = startIdx; i < jsonStr.length; i++) {
      const ch = jsonStr[i]
      if (escape) { escape = false; continue }
      if (ch === '\\' && inString) { escape = true; continue }
      if (ch === '"') { inString = !inString; continue }
      if (inString) continue
      if (ch === '{' || ch === '[') depth++
      if (ch === '}' || ch === ']') depth--
      if (depth === 0) { endIdx = i; break }
    }
    
    if (endIdx === -1) {
      // Truncated response — try to repair by closing open brackets
      console.warn('[RolePrep] JSON appears truncated, attempting repair...')
      jsonStr = jsonStr.substring(startIdx)
      // Close any unclosed strings
      const quoteCount = (jsonStr.match(/(?<!\\)"/g) || []).length
      if (quoteCount % 2 !== 0) jsonStr += '"'
      // Close any unclosed brackets
      while (depth > 0) {
        const lastOpen = jsonStr.lastIndexOf('[') > jsonStr.lastIndexOf('{') ? ']' : '}'
        jsonStr += lastOpen
        depth--
      }
    } else {
      jsonStr = jsonStr.substring(startIdx, endIdx + 1)
    }

    const parsed = JSON.parse(jsonStr)
    console.log('[RolePrep] ✅ Parsed successfully! Summary:', parsed.summary?.substring(0, 60))

    return {
      success: true,
      data: {
        summary: parsed.summary || '',
        expectations: Array.isArray(parsed.expectations) ? parsed.expectations : [],
        profileFit: parsed.profileFit || '',
        prepTips: Array.isArray(parsed.prepTips) ? parsed.prepTips : [],
        videoTips: Array.isArray(parsed.videoTips) ? parsed.videoTips : [],
      },
    }
  } catch (err: any) {
    console.error('[RolePrep] ❌ Error:', err.message)
    return { success: false, error: err.message || 'AI service error' }
  }
}

// ============================================
// AI-Moderated Messaging
// ============================================
export async function sendMessage(data: {
  text: string
  recipientId?: string
  senderRole: 'student' | 'company'
}) {
  const supabase = await createClient()
  let senderId: string
  try {
    const auth = await requireAuth(supabase)
    senderId = auth.userId
  } catch {
    return { success: false, blocked: false, error: 'You must be logged in to send messages' }
  }

  // AI Moderation Check
  const modResult = await moderateMessage(data.text, data.senderRole)

  if (!modResult.safe) {
    // Log the violation
    await supabase
      .from('ai_moderation_logs')
      .insert({
        sender_id: senderId,
        sender_role: data.senderRole,
        message_text: data.text,
        flagged_reason: modResult.reason || 'Content flagged by AI',
        category: modResult.category || 'other',
      })

    console.log('[AI] 🚫 Message blocked:', modResult.reason)
    return {
      success: false,
      blocked: true,
      reason: modResult.reason || 'This message was flagged by our AI safety system.',
      category: modResult.category,
    }
  }

  // Message is safe — in production this would insert into a messages table
  console.log('[AI] ✅ Message approved and sent')
  return { success: true, blocked: false }
}

// ============================================
// Polish Company About (AI)
// ============================================
export async function polishCompanyAbout(data: {
  text: string
  companyName: string
  industry: string
}) {
  const polished = await polishAboutUs(data.text, data.companyName, data.industry)
  return { success: true, polished }
}

// ============================================
// Lookup Company Info (AI)
// ============================================
export async function lookupCompanyInfo(data: {
  companyName: string
  zipCode: string
  website: string
}) {
  const result = await lookupCompany(data.companyName, data.zipCode, data.website)
  return { success: true, ...result }
}

// ============================================
// Upload Company Logo
// ============================================
export async function uploadCompanyLogo(formData: FormData) {
  const supabase = await createClient()
  let userId: string
  try {
    const auth = await requireAuth(supabase)
    userId = auth.userId
  } catch {
    return { success: false, error: 'You must be logged in to upload a logo' }
  }

  const logoFile = formData.get('logo') as File
  if (!logoFile) {
    return { success: false, error: 'No file provided' }
  }

  // Upload to storage
  const ext = logoFile.name.split('.').pop() || 'png'
  const fileName = `${userId}/logo.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('company-logos')
    .upload(fileName, logoFile, {
      contentType: logoFile.type,
      upsert: true,
    })

  if (uploadError) {
    console.error('[DB] logo upload error:', uploadError)
    return { success: false, error: uploadError.message }
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('company-logos')
    .getPublicUrl(fileName)

  const logoUrl = urlData.publicUrl

  // Save to companies table (only if row already exists — during onboarding it won't exist yet,
  // and logo_url will be saved when createEmployerProfile is called)
  const { error: dbError } = await supabase
    .from('companies')
    .update({ logo_url: logoUrl })
    .eq('id', userId)

  if (dbError) {
    console.error('[DB] logo_url update error:', dbError)
    // Don't fail — the logo was uploaded to storage successfully
    // It will be linked when the profile is created/updated
  }

  console.log('[DB] ✅ Logo uploaded:', logoUrl)
  return { success: true, logoUrl }
}

// ============================================
// Comments on Opportunities
// ============================================
export async function getComments(opportunityId: string) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id || null
  
  // Get the opportunity to know who the employer is
  const { data: opp } = await supabase
    .from('opportunities')
    .select('company_id')
    .eq('id', opportunityId)
    .single()
  
  const employerId = opp?.company_id || null
  const isEmployer = currentUserId === employerId
  
  // Get the company name for employer comments
  let companyName = 'Business'
  if (employerId) {
    const { data: company } = await supabase
      .from('companies')
      .select('company_name')
      .eq('id', employerId)
      .single()
    if (company) companyName = company.company_name
  }

  // Fetch comments
  const { data: comments, error } = await supabase
    .from('comments')
    .select('id, opportunity_id, user_id, parent_id, content, created_at')
    .eq('opportunity_id', opportunityId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[DB] fetch comments error:', error)
    return { success: false, error: error.message, data: [] }
  }

  // Get user names for all comment authors
  const userIds = [...new Set((comments || []).map(c => c.user_id))]
  const { data: users } = await supabase
    .from('users')
    .select('id, full_name')
    .in('id', userIds.length > 0 ? userIds : ['none'])

  const userMap = new Map((users || []).map(u => [u.id, u.full_name]))

  // Apply name masking
  const masked = (comments || []).map(c => {
    const isAuthor = currentUserId === c.user_id
    const isEmployerComment = c.user_id === employerId
    let displayName = 'Anonymous Student'
    let isOwn = false

    if (isEmployerComment) {
      displayName = companyName
    } else if (isAuthor) {
      displayName = userMap.get(c.user_id) || 'You'
      isOwn = true
    } else if (isEmployer) {
      // Employer sees all student names
      displayName = userMap.get(c.user_id) || 'Student'
    }

    return {
      id: c.id,
      parentId: c.parent_id,
      content: c.content,
      createdAt: c.created_at,
      displayName,
      isOwn,
      isEmployerComment,
    }
  })

  return { success: true, data: masked }
}

export async function addComment(data: {
  opportunityId: string
  content: string
  parentId?: string
}) {
  const supabase = await createClient()
  let userId: string
  try {
    const auth = await requireAuth(supabase)
    userId = auth.userId
  } catch {
    return { success: false, error: 'You must be logged in to comment' }
  }

  const { error } = await supabase
    .from('comments')
    .insert({
      opportunity_id: data.opportunityId,
      user_id: userId,
      parent_id: data.parentId || null,
      content: data.content,
    })

  if (error) {
    console.error('[DB] insert comment error:', error)
    return { success: false, error: error.message }
  }

  console.log('[DB] ✅ Comment added to opportunity:', data.opportunityId)
  return { success: true }
}

export async function deleteComment(commentId: string, opportunityId: string) {
  const supabase = await createClient()
  let userId: string
  try {
    const auth = await requireAuth(supabase)
    userId = auth.userId
  } catch {
    return { success: false, error: 'You must be logged in to delete a comment' }
  }

  // Check if user owns the comment OR is the employer who owns the opportunity
  const { data: comment } = await supabase
    .from('comments')
    .select('user_id, opportunity_id')
    .eq('id', commentId)
    .single()

  if (!comment) {
    return { success: false, error: 'Comment not found' }
  }

  const { data: opp } = await supabase
    .from('opportunities')
    .select('company_id')
    .eq('id', opportunityId)
    .single()

  const isOwner = comment.user_id === userId
  const isEmployer = opp?.company_id === userId

  if (!isOwner && !isEmployer) {
    return { success: false, error: 'You do not have permission to delete this comment' }
  }

  // Delete the comment and its replies (cascade)
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    console.error('[DB] delete comment error:', error)
    return { success: false, error: error.message }
  }

  console.log('[DB] ✅ Comment deleted:', commentId)
  return { success: true }
}

// ============================================
// Shared Benefit Tags (Site-Wide)
// ============================================
export async function getBenefitTags() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('benefit_tags')
    .select('name')
    .order('name', { ascending: true })

  if (error) {
    console.error('[DB] fetch benefit_tags error:', error)
    return { success: false, tags: [] }
  }

  const dbTags = (data || []).map(t => t.name)
  return { success: true, tags: dbTags }
}

export async function addBenefitTag(name: string) {
  const supabase = await createClient()
  // Upsert so duplicates are ignored
  const { error } = await supabase
    .from('benefit_tags')
    .upsert({ name: name.trim() }, { onConflict: 'name' })

  if (error) {
    console.error('[DB] insert benefit_tag error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// ============================================
// Candidate Search (for employers)
// ============================================
export async function searchCandidates(query?: string) {
  noStore()
  const supabase = await createClient()

  const { data: students, error } = await supabase
    .from('students')
    .select('id, high_school_name, interests_array, skills_array, zip_code')

  if (error) {
    console.error('[DB] search candidates error:', error)
    return { success: false, data: [] }
  }

  const ids = (students || []).map(s => s.id)
  const { data: users } = ids.length > 0
    ? await supabase.from('users').select('id, full_name').in('id', ids)
    : { data: [] }

  const nameMap = new Map((users || []).map(u => [u.id, u.full_name]))

  let results = (students || []).map(s => ({
    id: s.id,
    name: nameMap.get(s.id) || 'Student',
    highSchool: s.high_school_name || '',
    interests: s.interests_array || [],
    skills: s.skills_array || [],
    zipCode: s.zip_code || '',
  }))

  if (query && query.trim()) {
    const q = query.toLowerCase()
    results = results.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.highSchool.toLowerCase().includes(q) ||
      s.interests.some((i: string) => i.toLowerCase().includes(q)) ||
      s.skills.some((sk: string) => sk.toLowerCase().includes(q))
    )
  }

  console.log(`[DB] ✅ Found ${results.length} candidate(s)`)
  return { success: true, data: results }
}

// ============================================
// Get Employer's Roles (for invite dropdown)
// ============================================
export async function getEmployerRoles() {
  noStore()
  const supabase = await createClient()
  let userId: string
  try {
    const auth = await requireAuth(supabase)
    userId = auth.userId
  } catch {
    return { success: false, data: [] }
  }

  const { data, error } = await supabase
    .from('opportunities')
    .select('id, title, is_active')
    .eq('company_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[DB] fetch employer roles error:', error)
    return { success: false, data: [] }
  }

  return { success: true, data: data || [] }
}

// ============================================
// Invite Student to Role
// ============================================
export async function inviteStudentToRole(data: {
  studentId: string
  opportunityId: string
  message?: string
}) {
  const supabase = await createClient()
  let companyId: string
  try {
    const auth = await requireAuth(supabase)
    companyId = auth.userId
  } catch {
    return { success: false, error: 'You must be logged in to invite candidates' }
  }

  const { error } = await supabase
    .from('invitations')
    .insert({
      company_id: companyId,
      student_id: data.studentId,
      opportunity_id: data.opportunityId,
      message: data.message || null,
      status: 'pending',
    })

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'This student has already been invited to this role.' }
    }
    console.error('[DB] invitation insert error:', error)
    return { success: false, error: error.message }
  }

  console.log('[DB] ✅ Invitation sent:', data.studentId, '→', data.opportunityId)
  return { success: true }
}

// ============================================
// Candidates Pipeline (applicants per role)
// ============================================
export async function getCandidatesByRole() {
  noStore()
  const supabase = await createClient()
  let userId: string
  try {
    const auth = await requireAuth(supabase)
    userId = auth.userId
  } catch {
    return { success: false, data: [] }
  }

  // Get employer's roles
  const { data: roles } = await supabase
    .from('opportunities')
    .select('id, title, category, is_active, required_skills')
    .eq('company_id', userId)
    .order('created_at', { ascending: false })

  if (!roles || roles.length === 0) return { success: true, data: [] }

  // Get all interests (applications) for those roles
  const roleIds = roles.map(r => r.id)
  const { data: interests } = await supabase
    .from('interests')
    .select('id, student_id, opportunity_id, status, note, created_at')
    .in('opportunity_id', roleIds)
    .order('created_at', { ascending: false })

  if (!interests || interests.length === 0) {
    return { success: true, data: roles.map(r => ({ ...r, candidates: [] })) }
  }

  // Get student details
  const studentIds = [...new Set(interests.map(i => i.student_id))]
  const { data: students } = await supabase
    .from('students')
    .select('id, high_school_name, skills_array, interests_array')
    .in('id', studentIds)

  const { data: users } = await supabase
    .from('users')
    .select('id, full_name')
    .in('id', studentIds)

  const studentMap = new Map((students || []).map(s => [s.id, s]))
  const nameMap = new Map((users || []).map(u => [u.id, u.full_name]))

  // Group by role
  const result = roles.map(role => ({
    ...role,
    candidates: interests
      .filter(i => i.opportunity_id === role.id)
      .map(i => {
        const s = studentMap.get(i.student_id)
        const candidateSkills = s?.skills_array || []
        
        let matchScore = 85
        const roleSkills = role.required_skills || []
        if (roleSkills.length > 0) {
          const matchCount = candidateSkills.filter((cs: string) => 
            roleSkills.some((rs: string) => rs.toLowerCase() === cs.toLowerCase())
          ).length
          matchScore = Math.min(100, Math.round((matchCount / roleSkills.length) * 100))
        }

        return {
          interestId: i.id,
          studentId: i.student_id,
          name: nameMap.get(i.student_id) || 'Student',
          highSchool: s?.high_school_name || '',
          skills: candidateSkills,
          interests: s?.interests_array || [],
          status: i.status,
          note: i.note,
          appliedAt: i.created_at,
          matchScore,
        }
      }),
  }))

  return { success: true, data: result }
}

// ============================================
// Update Candidate Status (reject / propose / accept)
// ============================================
export async function updateCandidateStatus(interestId: string, newStatus: string) {
  const supabase = await createClient()
  try { await requireAuth(supabase) } catch {
    return { success: false, error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('interests')
    .update({ status: newStatus })
    .eq('id', interestId)

  if (error) {
    console.error('[DB] update candidate status error:', error)
    return { success: false, error: error.message }
  }

  console.log('[DB] ✅ Candidate status updated:', interestId, '→', newStatus)
  return { success: true }
}

// ============================================
// Send Candidate Message (with AI moderation)
// ============================================
export async function sendCandidateMessage(data: {
  interestId: string
  senderRole: 'employer' | 'student'
  text: string
}) {
  const supabase = await createClient()
  let userId: string
  try {
    const auth = await requireAuth(supabase)
    userId = auth.userId
  } catch {
    return { success: false, error: 'Not authenticated' }
  }

  // AI moderate the message
  const modResult = await moderateMessage(data.text, data.senderRole === 'employer' ? 'company' : 'student')
  if (!modResult.safe) {
    // Log the moderation hit
    await supabase.from('ai_moderation_logs').insert({
      sender_id: userId,
      sender_role: data.senderRole,
      message_text: data.text,
      flagged_reason: modResult.reason || 'Flagged',
      flagged_category: modResult.category || 'content',
    })
    return { success: false, error: modResult.reason || 'Your message was flagged by our safety system.' }
  }

  // Insert into candidate_messages
  const { error } = await supabase
    .from('candidate_messages')
    .insert({
      interest_id: data.interestId,
      sender_id: userId,
      sender_role: data.senderRole,
      text: data.text,
    })

  if (error) {
    console.error('[DB] insert candidate message error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// ============================================
// Get Candidate Messages
// ============================================
export async function getCandidateMessages(interestId: string) {
  noStore()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('candidate_messages')
    .select('id, sender_id, sender_role, text, created_at')
    .eq('interest_id', interestId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[DB] fetch candidate messages error:', error)
    return { success: false, data: [] }
  }

  return { success: true, data: data || [] }
}

// ============================================
// WBL PLATFORM — Educator, Employer & Student Actions
// ============================================

// Register as Educator
export async function registerEducator(data: {
  fullName: string
  schoolName: string
  district?: string
  state?: string
  title?: string
}) {
  const supabase = await createClient()
  const { userId, email } = await requireAuth(supabase)

  const emailDomain = email.split('@')[1]?.toLowerCase() || ''
  const isVerified = isEducatorEmailDomain(email)

  const { error: userError } = await supabase
    .from('users')
    .upsert({ id: userId, role: 'educator', full_name: data.fullName }, { onConflict: 'id' })

  if (userError) {
    console.error('[DB] upsert educator user error:', userError)
    return { success: false, error: userError.message }
  }

  const { error } = await supabase
    .from('educators')
    .upsert({
      id: userId,
      full_name: data.fullName,
      school_name: data.schoolName,
      district: data.district || null,
      state: data.state || null,
      email_domain: emailDomain,
      title: data.title || null,
      is_verified: isVerified,
    }, { onConflict: 'id' })

  if (error) {
    console.error('[DB] upsert educator profile error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, isVerified }
}

// Create Practicum Program (WBL)
export async function createPracticumProgram(data: {
  title: string
  description: string
  learningObjectives?: string
  schoolName: string
  district?: string
  category?: string
  termStartDate?: string
  termEndDate?: string
  hoursPerWeek?: number
  requiredTotalHours?: number
  schoolProvidesInsurance?: boolean
}) {
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  const { error, data: program } = await supabase
    .from('practicum_programs')
    .insert({
      educator_id: userId,
      title: data.title,
      description: data.description,
      learning_objectives: data.learningObjectives || null,
      school_name: data.schoolName,
      district: data.district || null,
      category: data.category || null,
      start_date: data.termStartDate || null,
      end_date: data.termEndDate || null,
      hours_per_week: data.hoursPerWeek || 10,
      required_total_hours: data.requiredTotalHours || 120,
      school_provides_insurance: data.schoolProvidesInsurance ?? false,
      status: 'draft',
    })
    .select()
    .single()

  if (error) {
    console.error('[DB] insert practicum program error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, program }
}

// Moderate & Publish Practicum Program (AI Review → seeking_hosts)
export async function moderateAndPublishPracticumAction(programId: string) {
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  const { data: program, error: fetchError } = await supabase
    .from('practicum_programs')
    .select('*')
    .eq('id', programId)
    .eq('educator_id', userId)
    .single()

  if (fetchError || !program) {
    return { success: false, error: 'Program not found or access denied' }
  }

  // Run AI moderation
  const review = await aiModeratePracticum({
    title: program.title,
    description: program.description,
    schoolName: program.school_name,
    category: program.category,
  })

  if (review.approved) {
    await supabase
      .from('practicum_programs')
      .update({ status: 'seeking_hosts', ai_review_notes: null })
      .eq('id', programId)

    return { success: true, approved: true, review }
  } else {
    const notes = [
      ...review.ferpaViolations.map(v => `[FERPA] ${v}`),
      ...review.safetyIssues.map(s => `[SAFETY] ${s}`),
      ...review.clarityIssues.map(c => `[CLARITY] ${c}`),
    ].join('\n')

    await supabase
      .from('practicum_programs')
      .update({ status: 'draft', ai_review_notes: notes })
      .eq('id', programId)

    return { success: true, approved: false, review }
  }
}

// Get Educator's Own Programs
export async function getMyPracticumPrograms() {
  noStore()
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  const { data, error } = await supabase
    .from('practicum_programs')
    .select('*')
    .eq('educator_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[DB] fetch educator programs error:', error)
    return { success: false, data: [] }
  }

  return { success: true, data: data || [] }
}

// Get Programs Seeking Hosts (Employer browsing feed)
export async function getProgramsSeekingHosts() {
  noStore()
  const supabase = await createClient()
  await requireAuth(supabase)

  const { data, error } = await supabase
    .from('practicum_programs')
    .select('*, educators(full_name, school_name, is_verified)')
    .eq('status', 'seeking_hosts')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[DB] fetch seeking-hosts programs error:', error)
    return { success: false, data: [] }
  }

  return { success: true, data: data || [] }
}

// Submit Host Application (Employer applies to a Program)
export async function submitHostApplication(data: {
  practicumProgramId: string
  proposedMentorName: string
  proposedMentorEmail?: string
  capacity?: number
  mentorshipPlan: string
}) {
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  const { error } = await supabase
    .from('host_applications')
    .insert({
      practicum_program_id: data.practicumProgramId,
      employer_id: userId,
      proposed_mentor_name: data.proposedMentorName,
      proposed_mentor_email: data.proposedMentorEmail || null,
      capacity: data.capacity || 1,
      mentorship_plan: data.mentorshipPlan,
      message_to_educator: data.mentorshipPlan, // Also used as message
      status: 'pending',
    })

  if (error) {
    console.error('[DB] insert host application error:', error)
    if (error.code === '23505') {
      return { success: false, error: 'You have already applied to this program.' }
    }
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Get Host Applications for a Program (Educator view)
export async function getHostApplicationsForProgram(programId: string) {
  noStore()
  const supabase = await createClient()
  await requireAuth(supabase)

  const { data, error } = await supabase
    .from('host_applications')
    .select('*, companies(company_name, industry, website, city, state)')
    .eq('practicum_program_id', programId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[DB] fetch host applications error:', error)
    return { success: false, data: [] }
  }

  return { success: true, data: data || [] }
}

// Update Host Application Status (Educator approves/rejects)
export async function updateHostApplicationStatus(applicationId: string, status: 'approved_by_school' | 'rejected', notes?: string) {
  const supabase = await createClient()
  await requireAuth(supabase)

  const { error } = await supabase
    .from('host_applications')
    .update({ status, educator_notes: notes || null })
    .eq('id', applicationId)

  if (error) {
    console.error('[DB] update host application status error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Get Employer's Own Host Applications
export async function getMyHostApplications() {
  noStore()
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  const { data, error } = await supabase
    .from('host_applications')
    .select('*, practicum_programs(title, school_name, status, start_date, end_date)')
    .eq('employer_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[DB] fetch my host applications error:', error)
    return { success: false, data: [] }
  }

  return { success: true, data: data || [] }
}

// ============================================
// PLACEMENTS — Educator assigns Student to Host
// ============================================

export async function createPlacement(data: {
  studentId: string
  hostApplicationId: string
  practicumProgramId: string
}) {
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  // Verify educator owns the program
  const { data: program } = await supabase
    .from('practicum_programs')
    .select('id')
    .eq('id', data.practicumProgramId)
    .eq('educator_id', userId)
    .single()

  if (!program) {
    return { success: false, error: 'Access denied — you do not own this program.' }
  }

  const { error, data: placement } = await supabase
    .from('placements')
    .insert({
      student_id: data.studentId,
      host_application_id: data.hostApplicationId,
      practicum_program_id: data.practicumProgramId,
      educator_signed_at: new Date().toISOString(), // Auto-sign by educator
      status: 'pending_signatures',
    })
    .select()
    .single()

  if (error) {
    console.error('[DB] insert placement error:', error)
    if (error.code === '23505') {
      return { success: false, error: 'This student is already placed in this program.' }
    }
    return { success: false, error: error.message }
  }

  return { success: true, placement }
}

// Sign a Placement (Employer or Student)
export async function signPlacement(placementId: string) {
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  // Determine which role is signing
  const { data: userRow } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  if (!userRow) return { success: false, error: 'User not found' }

  const now = new Date().toISOString()
  const updateField = userRow.role === 'company' 
    ? { employer_signed_at: now }
    : userRow.role === 'student'
    ? { student_signed_at: now }
    : null

  if (!updateField) return { success: false, error: 'Only employers and students can sign.' }

  const { error } = await supabase
    .from('placements')
    .update(updateField)
    .eq('id', placementId)

  if (error) {
    console.error('[DB] sign placement error:', error)
    return { success: false, error: error.message }
  }

  // Check if all three have signed → activate
  const { data: placement } = await supabase
    .from('placements')
    .select('educator_signed_at, employer_signed_at, student_signed_at')
    .eq('id', placementId)
    .single()

  if (placement?.educator_signed_at && placement?.employer_signed_at && placement?.student_signed_at) {
    await supabase
      .from('placements')
      .update({ status: 'active' })
      .eq('id', placementId)
  }

  return { success: true }
}

// Get Placements for a Program (Educator view)
export async function getPlacementsForProgram(programId: string) {
  noStore()
  const supabase = await createClient()
  await requireAuth(supabase)

  const { data, error } = await supabase
    .from('placements')
    .select('*, students(full_name:users(full_name)), host_applications(proposed_mentor_name, companies(company_name))')
    .eq('practicum_program_id', programId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[DB] fetch placements error:', error)
    return { success: false, data: [] }
  }

  return { success: true, data: data || [] }
}

// ============================================
// TIME LOGS — Student Timesheets
// ============================================

export async function submitTimeLog(data: {
  placementId: string
  logDate: string
  hoursWorked: number
  journalEntry?: string
}) {
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  const { error } = await supabase
    .from('time_logs')
    .insert({
      placement_id: data.placementId,
      student_id: userId,
      log_date: data.logDate,
      hours_worked: data.hoursWorked,
      journal_entry: data.journalEntry || null,
      status: 'pending_employer_approval',
    })

  if (error) {
    console.error('[DB] insert time log error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getMyTimeLogs(placementId: string) {
  noStore()
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  const { data, error } = await supabase
    .from('time_logs')
    .select('*')
    .eq('placement_id', placementId)
    .eq('student_id', userId)
    .order('log_date', { ascending: false })

  if (error) {
    console.error('[DB] fetch my time logs error:', error)
    return { success: false, data: [] }
  }

  return { success: true, data: data || [] }
}

// Employer approves/rejects a timesheet entry
export async function approveRejectTimeLog(timeLogId: string, status: 'approved' | 'rejected', notes?: string) {
  const supabase = await createClient()
  await requireAuth(supabase)

  const { error } = await supabase
    .from('time_logs')
    .update({ status, employer_notes: notes || null })
    .eq('id', timeLogId)

  if (error) {
    console.error('[DB] update time log status error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Get pending timesheets for employer's placements
export async function getPendingTimesheetsForEmployer() {
  noStore()
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  // Get all placements linked to this employer's approved host applications
  const { data: placements } = await supabase
    .from('placements')
    .select('id, host_applications!inner(employer_id)')
    .eq('host_applications.employer_id', userId)
    .eq('status', 'active')

  if (!placements || placements.length === 0) {
    return { success: true, data: [] }
  }

  const placementIds = placements.map(p => p.id)

  const { data, error } = await supabase
    .from('time_logs')
    .select('*, placements(student_id, students:student_id(id)), users:student_id(full_name)')
    .in('placement_id', placementIds)
    .eq('status', 'pending_employer_approval')
    .order('log_date', { ascending: false })

  if (error) {
    console.error('[DB] fetch pending timesheets error:', error)
    return { success: false, data: [] }
  }

  return { success: true, data: data || [] }
}

// ============================================
// EVALUATIONS — End-of-Term Grading
// ============================================

export async function submitEvaluation(data: {
  placementId: string
  rubricScores: Record<string, number>
  comments?: string
}) {
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  const { error } = await supabase
    .from('evaluations')
    .upsert({
      placement_id: data.placementId,
      employer_id: userId,
      rubric_scores: data.rubricScores,
      comments: data.comments || null,
      submitted_at: new Date().toISOString(),
    }, { onConflict: 'placement_id' })

  if (error) {
    console.error('[DB] upsert evaluation error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// ============================================
// STUDENT INVITES — Walled Garden Entry
// ============================================

export async function generateStudentInvite(programId: string) {
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  // Verify educator owns program
  const { data: program } = await supabase
    .from('practicum_programs')
    .select('id, school_name')
    .eq('id', programId)
    .eq('educator_id', userId)
    .single()

  if (!program) return { success: false, error: 'Access denied' }

  // Generate a unique invite code
  const code = `${programId.slice(0, 4).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now().toString(36).slice(-3).toUpperCase()}`

  return { success: true, inviteCode: code, inviteLink: `/join/${code}` }
}

export async function redeemStudentInvite(inviteCode: string, fullName: string) {
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  // Create/update user as student
  const { error: userError } = await supabase
    .from('users')
    .upsert({ id: userId, role: 'student', full_name: fullName }, { onConflict: 'id' })

  if (userError) {
    console.error('[DB] upsert student user error:', userError)
    return { success: false, error: userError.message }
  }

  // Create student profile with invite code
  const { error } = await supabase
    .from('students')
    .upsert({
      id: userId,
      high_school_name: 'Pending', // Will be updated from program context
      invite_code: inviteCode,
    }, { onConflict: 'id' })

  if (error) {
    console.error('[DB] upsert student profile error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// ============================================
// DASHBOARD DATA — Aggregated Views
// ============================================

// Educator: see all students' progress across a program
export async function getEducatorDashboardData(programId: string) {
  noStore()
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  // Verify access
  const { data: program } = await supabase
    .from('practicum_programs')
    .select('*, required_total_hours')
    .eq('id', programId)
    .eq('educator_id', userId)
    .single()

  if (!program) return { success: false, error: 'Access denied' }

  // Get all placements with time log aggregation
  const { data: placements, error } = await supabase
    .from('placements')
    .select(`
      id, status, student_id, 
      educator_signed_at, employer_signed_at, student_signed_at,
      host_applications(proposed_mentor_name, companies(company_name)),
      time_logs(id, hours_worked, status, log_date)
    `)
    .eq('practicum_program_id', programId)

  if (error) {
    console.error('[DB] fetch educator dashboard error:', error)
    return { success: false, error: error.message }
  }

  // Get student names
  const studentIds = (placements || []).map(p => p.student_id)
  const { data: students } = await supabase
    .from('users')
    .select('id, full_name')
    .in('id', studentIds)

  const studentMap = new Map((students || []).map(s => [s.id, s.full_name]))

  // Build dashboard rows
  const rows = (placements || []).map(p => {
    const logs = (p as any).time_logs || []
    const approvedHours = logs
      .filter((l: any) => l.status === 'approved')
      .reduce((sum: number, l: any) => sum + parseFloat(l.hours_worked), 0)
    const pendingLogs = logs.filter((l: any) => l.status === 'pending_employer_approval').length

    return {
      placementId: p.id,
      studentId: p.student_id,
      studentName: studentMap.get(p.student_id) || 'Unknown',
      status: p.status,
      companyName: (p as any).host_applications?.companies?.company_name || 'N/A',
      mentorName: (p as any).host_applications?.proposed_mentor_name || 'N/A',
      approvedHours,
      requiredHours: program.required_total_hours || 120,
      pendingTimesheets: pendingLogs,
      allSigned: !!(p.educator_signed_at && p.employer_signed_at && p.student_signed_at),
    }
  })

  return { success: true, program, rows }
}

// Student: get own progress
export async function getStudentProgress() {
  noStore()
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  const { data: placements, error } = await supabase
    .from('placements')
    .select(`
      id, status,
      practicum_programs(title, school_name, required_total_hours, start_date, end_date),
      host_applications(proposed_mentor_name, companies(company_name)),
      time_logs(id, hours_worked, status, log_date, journal_entry)
    `)
    .eq('student_id', userId)

  if (error) {
    console.error('[DB] fetch student progress error:', error)
    return { success: false, data: [] }
  }

  const progressData = (placements || []).map(p => {
    const logs = (p as any).time_logs || []
    const approvedHours = logs
      .filter((l: any) => l.status === 'approved')
      .reduce((sum: number, l: any) => sum + parseFloat(l.hours_worked), 0)
    const requiredHours = (p as any).practicum_programs?.required_total_hours || 120

    return {
      placementId: p.id,
      status: p.status,
      programTitle: (p as any).practicum_programs?.title || 'Practicum',
      schoolName: (p as any).practicum_programs?.school_name || '',
      companyName: (p as any).host_applications?.companies?.company_name || '',
      mentorName: (p as any).host_applications?.proposed_mentor_name || '',
      approvedHours,
      requiredHours,
      progressPercent: Math.min(100, Math.round((approvedHours / requiredHours) * 100)),
      recentLogs: logs.slice(0, 5),
    }
  })

  return { success: true, data: progressData }
}


// ============================================
// Student Profile Update
// ============================================
export async function updateStudentProfile(data: {
  bio?: string
  gradeLevel?: string
  graduationYear?: number
  careerInterests?: string[]
}) {
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  const { error } = await supabase
    .from('students')
    .update({
      bio: data.bio || null,
      grade_level: data.gradeLevel || null,
      graduation_year: data.graduationYear || null,
      career_interests: data.careerInterests || [],
      profile_complete: !!(data.bio && data.gradeLevel),
    })
    .eq('id', userId)

  if (error) {
    console.error('[DB] update student profile error:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

// ============================================
// Create Time Log Entry
// ============================================
export async function createTimeLog(data: {
  placementId: string
  logDate: string
  hours: number
  notes?: string
}) {
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  const { error, data: log } = await supabase
    .from('time_logs')
    .insert({
      placement_id: data.placementId,
      student_id: userId,
      log_date: data.logDate,
      hours: data.hours,
      notes: data.notes || null,
    })
    .select()
    .single()

  if (error) {
    console.error('[DB] create time log error:', error)
    return { success: false, error: error.message }
  }
  return { success: true, log }
}

// ============================================
// Create Journal Entry
// ============================================
export async function createJournalEntry(data: {
  placementId?: string
  reflection: string
  skillsLearned?: string
}) {
  const supabase = await createClient()
  const { userId } = await requireAuth(supabase)

  const { error, data: entry } = await supabase
    .from('journal_entries')
    .insert({
      placement_id: data.placementId || null,
      student_id: userId,
      reflection: data.reflection,
      skills_learned: data.skillsLearned || null,
    })
    .select()
    .single()

  if (error) {
    console.error('[DB] create journal entry error:', error)
    return { success: false, error: error.message }
  }
  return { success: true, entry }
}

// ============================================
// Educator: Generate Practicum Draft
// ============================================
export async function draftPracticumProgramAction(data: {
  title: string
  category: string
  schoolName: string
}) {
  const supabase = await createClient()
  try {
    await requireAuth(supabase)
  } catch {
    return { success: false, error: 'You must be logged in to use this feature' }
  }

  const result = await aiGeneratePracticumDraft(data)
  return { success: true, ...result }
}

// ============================================
// Student: Generate Resume via AI
// ============================================
export async function generateStudentResumeAction(inputText: string) {
  const supabase = await createClient()
  try {
    await requireAuth(supabase)
  } catch {
    return { success: false, error: 'You must be logged in to use this feature' }
  }

  try {
    const result = await aiGenerateStudentResume(inputText)
    return { success: true, data: result }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to generate resume' }
  }
}

// ============================================
// Employer: AI Message Drafter
// ============================================
export async function draftEmployerMessageAction(intent: string, roleTitle: string) {
  const supabase = await createClient()
  try {
    await requireAuth(supabase)
  } catch {
    return { success: false, error: 'You must be logged in to use this feature' }
  }

  if (!roleTitle || !intent) {
    return { success: false, error: 'Missing required parameters' }
  }

  let aiIntent: 'offer' | 'interview' | 'rejection' = 'interview'
  if (intent === 'offer') aiIntent = 'offer'
  if (intent === 'reject') aiIntent = 'rejection'

  try {
    const draft = await aiGenerateEmployerMessageDraft('The candidate', roleTitle, aiIntent)
    return { success: true, data: draft }
  } catch (error: any) {
    console.error('[DraftMessage] Error:', error)
    return { success: false, error: 'Failed to draft message.' }
  }
}

// ============================================
// Student: Guided Conversational Journaling
// ============================================
export async function generateJournalQuestionAction(chatHistory: Array<{role: 'user' | 'assistant', content: string}>) {
  const supabase = await createClient()
  try {
    await requireAuth(supabase)
  } catch {
    return { success: false, error: 'You must be logged in' }
  }

  try {
    const question = await aiGenerateJournalQuestion(chatHistory)
    return { success: true, data: question }
  } catch (error: any) {
    console.error('[JournalQuestion] Error:', error)
    return { success: false, error: 'Failed to generate question.' }
  }
}

export async function synthesizeJournalEntryAction(chatHistory: Array<{role: 'user' | 'assistant', content: string}>) {
  const supabase = await createClient()
  try {
    await requireAuth(supabase)
  } catch {
    return { success: false, error: 'You must be logged in' }
  }

  try {
    const synthesized = await aiSynthesizeJournalEntry(chatHistory)
    return { success: true, data: synthesized }
  } catch (error: any) {
    console.error('[JournalSynthesize] Error:', error)
    return { success: false, error: 'Failed to synthesize journal entry.' }
  }
}

// ============================================
// Educator: Smart Matching Copilot
// ============================================
export async function generateMatchesAction(studentId: string) {
  const supabase = await createClient()
  try {
    await requireAuth(supabase)
  } catch {
    return { success: false, error: 'You must be logged in' }
  }

  const { data: student } = await supabase.from('students').select('*').eq('id', studentId).single()
  if (!student) return { success: false, error: 'Student not found' }

  const { data: resume } = await supabase.from('resumes').select('*').eq('student_id', studentId).single()

  const studentProfile = {
    firstName: student.first_name,
    lastName: student.last_name,
    gradeLevel: student.grade_level,
    careerInterests: student.career_interests,
    bio: student.bio,
    resume: resume ? JSON.stringify(resume) : 'No resume data'
  }

  const { data: opportunities } = await supabase.from('opportunities').select('id, title, description, benefits, companies(company_name)').eq('status', 'active')
  if (!opportunities || opportunities.length === 0) return { success: false, error: 'No active opportunities available' }

  const formattedOpps = opportunities.map((o: any) => ({
    id: o.id,
    title: o.title,
    company: o.companies?.company_name || 'Unknown',
    description: o.description
  }))

  try {
    const matches = await aiSuggestPlacements(studentProfile, formattedOpps)
    const detailedMatches = matches.map((m: any) => {
      const opp = formattedOpps.find((o: any) => o.id === m.opportunityId)
      return {
        ...m,
        title: opp?.title,
        company: opp?.company,
      }
    })
    return { success: true, data: detailedMatches, studentName: student.first_name }
  } catch (error: any) {
    console.error('[Matches] Error:', error)
    return { success: false, error: 'Failed to generate matches' }
  }
}

// ============================================
// Student: Professional Communication Coach
// ============================================
export async function polishStudentMessageAction(rawText: string) {
  const supabase = await createClient()
  try {
    await requireAuth(supabase)
  } catch {
    return { success: false, error: 'You must be logged in' }
  }

  try {
    const polished = await aiPolishStudentMessage(rawText)
    return { success: true, data: polished }
  } catch (error: any) {
    console.error('[Coach] Error:', error)
    return { success: false, error: 'Failed to polish message' }
  }
}

export async function demoModerateMessageAction(text: string) {
  // Exposes moderateMessage specifically for the Student UI Demo to trigger the PII Shield
  try {
    const res = await moderateMessage(text, 'student')
    return { success: true, isSafe: res.safe, reason: res.reason, category: res.category }
  } catch (err: any) {
    return { success: false, error: 'Moderation failed' }
  }
}

