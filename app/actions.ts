'use server'

import { createClient } from '@/utils/supabase/server'
import { unstable_noStore as noStore } from 'next/cache'
import { generateRolePrep, moderateMessage, polishAboutUs, lookupCompany } from '@/lib/gemini'

// Helper: require authenticated user or throw
async function requireAuth(supabase: any) {
  const { data: authData } = await supabase.auth.getUser()
  const userId = authData?.user?.id
  if (!userId) throw new Error('Not authenticated')
  return { userId, email: authData.user.email || '' }
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
// Employer Onboarding
// ============================================
export async function createEmployerProfile(data: {
  companyName: string
  industry: string
  zipCode: string
  about?: string
  website?: string
  phone?: string
  employeeCount?: string
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

  const companyData: Record<string, string> = {
    id: userId,
    company_name: data.companyName,
    industry: data.industry,
    zip_code: data.zipCode,
  }
  if (data.about) companyData.about = data.about
  if (data.website) companyData.website = data.website
  if (data.phone) companyData.phone = data.phone
  if (data.employeeCount) companyData.employee_count = data.employeeCount
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
  industry: string
  website: string
}) {
  const result = await lookupCompany(data.companyName, data.industry, data.website)
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

  // Save to companies table
  const { error: dbError } = await supabase
    .from('companies')
    .upsert({ id: userId, logo_url: logoUrl }, { onConflict: 'id' })

  if (dbError) {
    console.error('[DB] logo_url update error:', dbError)
    return { success: false, error: dbError.message }
  }

  console.log('[DB] ✅ Logo uploaded:', logoUrl)
  return { success: true, logoUrl }
}
