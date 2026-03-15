"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createEmployerProfile, polishCompanyAbout, lookupCompanyInfo, uploadCompanyLogo, checkCompanyAvailability } from '@/app/actions'
import { createBrowserClient } from '@supabase/ssr'

function OnboardingWizard() {
  const logoInputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('edit') === 'true'

  const [step, setStep] = useState(1)
  const [isFinishing, setIsFinishing] = useState(false)
  const [isPolishing, setIsPolishing] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [aiPrefilled, setAiPrefilled] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(isEditMode)
  const [logoUrl, setLogoUrl] = useState('')
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [duplicateError, setDuplicateError] = useState('')
  const [companyStatus, setCompanyStatus] = useState<'active' | 'pending_review'>('active')
  
  // Form State
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [employeeCount, setEmployeeCount] = useState('')
  const [about, setAbout] = useState('')
  const [phone, setPhone] = useState('')

  // Track which fields were AI-filled
  const [aiFields, setAiFields] = useState<Record<string, boolean>>({})

  // Pre-fill when in edit mode
  useEffect(() => {
    if (!isEditMode) return
    async function loadProfile() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('companies')
          .select('*')
          .eq('id', user.id)
          .single()
        if (data) {
          setCompanyName(data.company_name || '')
          setIndustry(data.industry || '')
          setWebsite(data.website || '')
          setZipCode(data.zip_code || '')
          setEmployeeCount(data.employee_count || '')
          setAbout(data.about || '')
          setPhone(data.phone || '')
          setLogoUrl(data.logo_url || '')
        }
      }
      setIsLoadingProfile(false)
    }
    loadProfile()
  }, [isEditMode])

  const totalSteps = 4

  const handleNext = async () => {
    if (step === 1) {
      setDuplicateError('')
      setIsLookingUp(true)

      // 1. Duplicate company check (name + zip + website)
      if (!isEditMode) {
        try {
          const dupCheck = await checkCompanyAvailability({
            companyName,
            zipCode,
            website: website || undefined,
          })
          if (!dupCheck.available) {
            setDuplicateError(`A company called "${dupCheck.existingCompany}" with the same zip code${website ? ' and website' : ''} is already registered on InternPick.`)
            setIsLookingUp(false)
            return
          }
        } catch (err) {
          console.error('Duplicate check error:', err)
        }
      }

      // 2. AI company lookup
      setStep(2)
      if (!isEditMode) {
        try {
          const result = await lookupCompanyInfo({
            companyName,
            industry,
            website,
          })
          if (result.success) {
            const filled: Record<string, boolean> = {}
            if (result.zipCode && !zipCode) {
              setZipCode(result.zipCode)
              filled.zipCode = true
            }
            if (result.employeeCount && !employeeCount) {
              setEmployeeCount(result.employeeCount)
              filled.employeeCount = true
            }
            if (result.about && !about) {
              setAbout(result.about)
              filled.about = true
            }
            if (result.phone && !phone) {
              setPhone(result.phone)
              filled.phone = true
            }
            if (Object.keys(filled).length > 0) {
              setAiFields(filled)
              setAiPrefilled(true)
            }

            // 3. Determine review status — if AI found nothing useful, flag for review
            const hasUsefulData = result.about || result.zipCode
            if (!hasUsefulData) {
              setCompanyStatus('pending_review')
            } else {
              setCompanyStatus('active')
            }
          } else {
            setCompanyStatus('pending_review')
          }
        } catch (err) {
          console.error('Company lookup error:', err)
          setCompanyStatus('pending_review')
        }
      }
      setIsLookingUp(false)
    } else if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleFinish = async () => {
    setIsFinishing(true)
    
    const result = await createEmployerProfile({
      companyName,
      industry,
      zipCode,
      about: about || undefined,
      website: website || undefined,
      phone: phone || undefined,
      employeeCount: employeeCount || undefined,
      status: isEditMode ? undefined : companyStatus,
    })
    
    console.log('[Onboarding] Employer profile result:', result)
    router.push('/employer')
  }

  const canProceed = () => {
    switch (step) {
      case 1: return companyName.trim() && zipCode.length >= 5
      case 2: return !!industry
      case 3: return true
      case 4: return true
      default: return false
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const industryLabels: Record<string, string> = {
    retail: 'Retail & E-commerce', food: 'Food & Beverage', tech: 'Technology & Software',
    health: 'Healthcare Services', construction: 'Construction & Trades', 
    finance: 'Finance & Accounting', education: 'Education', legal: 'Legal Services',
    marketing: 'Marketing & Media', other: 'Other',
  }

  const stepIcons = ['🏢', '🏷️', '📝', '🚀']
  const stepTitles = [
    'Set up your business',
    'What do you do?',
    'Tell students about you',
    'Review & Launch',
  ]
  const stepSubtitles = [
    'Enter your company name and location so local students can find you.',
    'Help us match you with the right student talent.',
    'A great description helps attract the right candidates.',
    'Everything looks good? Let\'s get you started!',
  ]

  // AI badge component
  const AiBadge = () => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-md uppercase tracking-wider">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L4 7l8 5 8-5-8-5zM4 12l8 5 8-5M4 17l8 5 8-5"/></svg>
      AI Suggested
    </span>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      
      <div className="w-full max-w-lg">
        
        {/* Header */}
        {isEditMode && (
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded-full text-sm font-bold border border-brand-200 dark:border-brand-800/50">
              ✏️ Editing Business Profile
            </span>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mb-8 flex justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step 
                  ? 'w-10 bg-brand-600 dark:bg-brand-400' 
                  : i < step 
                    ? 'w-2 bg-brand-300 dark:bg-brand-600' 
                    : 'w-2 bg-slate-200 dark:bg-slate-800'
              }`}
            ></div>
          ))}
        </div>

        {/* Step counter */}
        <p className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider">
          Step {step} of {totalSteps}
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
          
          {/* Step Icon & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-brand-200 dark:border-brand-800/50">
              {stepIcons[step - 1]}
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{stepTitles[step - 1]}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">{stepSubtitles[step - 1]}</p>
          </div>

          {/* AI Loading Overlay */}
          {isLookingUp && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-[2.5rem]">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">🤖 Looking up your company...</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">AI is finding details to save you time</p>
            </div>
          )}

          {/* AI Prefilled Banner */}
          {aiPrefilled && step >= 2 && step <= 3 && (
            <div className="mb-6 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-xl flex gap-3 items-start animate-fade-in">
              <span className="text-lg mt-0.5">🤖</span>
              <div>
                <p className="text-sm font-bold text-purple-800 dark:text-purple-200">AI pre-filled some fields</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">Please review and correct anything that doesn&apos;t look right before continuing.</p>
              </div>
            </div>
          )}

          {/* Step 1: Company Name + Zip Code + Website */}
          {step === 1 && (
            <div className="animate-fade-in space-y-4">
              {/* Duplicate company error */}
              {duplicateError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex gap-3 animate-fade-in">
                  <span className="text-red-500 text-xl">🚫</span>
                  <div>
                    <p className="text-sm font-bold text-red-800 dark:text-red-200">{duplicateError}</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">If this is your company, please contact <a href="mailto:help@internpick.com" className="underline font-bold">help@internpick.com</a> for help.</p>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Company Name *</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => { setCompanyName(e.target.value); setDuplicateError('') }}
                  placeholder="e.g. Springfield Coffee Co." 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">HQ Zip Code *</label>
                <input 
                  type="text" 
                  value={zipCode}
                  onChange={(e) => { setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5)); setDuplicateError('') }}
                  placeholder="e.g. 07081" 
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Website URL <span className="text-slate-400 font-normal">(optional)</span></label>
                <input 
                  type="url" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourcompany.com" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white"
                />
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span>🤖</span> We&apos;ll use this to auto-fill your profile with AI — saves you time!
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Industry & Size */}
          {step === 2 && (
            <div className="animate-fade-in space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Industry *</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none text-slate-900 dark:text-white"
                >
                  <option value="">Select Industry</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="food">Food & Beverage</option>
                  <option value="tech">Technology & Software</option>
                  <option value="health">Healthcare Services</option>
                  <option value="construction">Construction & Trades</option>
                  <option value="finance">Finance & Accounting</option>
                  <option value="education">Education</option>
                  <option value="legal">Legal Services</option>
                  <option value="marketing">Marketing & Media</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Number of Employees</label>
                  {aiFields.employeeCount && <AiBadge />}
                </div>
                <select
                  value={employeeCount}
                  onChange={(e) => { setEmployeeCount(e.target.value); if (aiFields.employeeCount) setAiFields(f => ({...f, employeeCount: false})) }}
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none text-slate-900 dark:text-white ${aiFields.employeeCount ? 'border-purple-300 dark:border-purple-700' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <option value="">Select Size</option>
                  <option value="1-5">1–5 (Solo / Micro)</option>
                  <option value="6-20">6–20 (Small)</option>
                  <option value="21-50">21–50 (Growing)</option>
                  <option value="51-200">51–200 (Mid-size)</option>
                  <option value="200+">200+ (Large)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: About & Online */}
          {step === 3 && (
            <div className="animate-fade-in space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">About Your Company</label>
                    {aiFields.about && <AiBadge />}
                  </div>
                  {about.trim().length > 10 && (
                    <button
                      type="button"
                      onClick={async () => {
                        setIsPolishing(true)
                        try {
                          const result = await polishCompanyAbout({ text: about, companyName, industry })
                          if (result.success && result.polished) {
                            setAbout(result.polished)
                            setAiFields(f => ({...f, about: false}))
                          }
                        } catch (err) {
                          console.error('Polish error:', err)
                        }
                        setIsPolishing(false)
                      }}
                      disabled={isPolishing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors disabled:opacity-60 disabled:cursor-wait"
                    >
                      {isPolishing ? (
                        <>
                          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Polishing...
                        </>
                      ) : (
                        <>✨ Polish it</>
                      )}
                    </button>
                  )}
                </div>
                <textarea 
                  value={about}
                  onChange={(e) => { setAbout(e.target.value); if (aiFields.about) setAiFields(f => ({...f, about: false})) }}
                  placeholder="Tell students what your company does, your mission, and why they'd love working with you..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white resize-none ${aiFields.about ? 'border-purple-300 dark:border-purple-700' : 'border-slate-200 dark:border-slate-700'}`}
                />
                <p className="text-xs text-slate-400">This will appear on your profile and all role listings.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Business Phone</label>
                  {aiFields.phone && <AiBadge />}
                </div>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); if (aiFields.phone) setAiFields(f => ({...f, phone: false})) }}
                  placeholder="(555) 000-0000" 
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white ${aiFields.phone ? 'border-purple-300 dark:border-purple-700' : 'border-slate-200 dark:border-slate-700'}`}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review & Launch */}
          {step === 4 && (
            <div className="animate-fade-in space-y-4">
              {/* Hidden file input */}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setIsUploadingLogo(true)
                  try {
                    const fd = new FormData()
                    fd.append('logo', file)
                    const result = await uploadCompanyLogo(fd)
                    if (result.success && result.logoUrl) {
                      setLogoUrl(result.logoUrl)
                    } else {
                      console.error('Logo upload failed:', result.error)
                    }
                  } catch (err) {
                    console.error('Logo upload error:', err)
                  }
                  setIsUploadingLogo(false)
                  e.target.value = ''
                }}
              />

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                {/* Company header preview */}
                <div className="p-5 flex items-center gap-4 border-b border-slate-200 dark:border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="group relative w-16 h-16 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-2xl border-2 border-dashed border-brand-300 dark:border-brand-700 hover:border-brand-500 dark:hover:border-brand-400 transition-all cursor-pointer overflow-hidden flex-shrink-0"
                    title="Click to upload logo"
                  >
                    {isUploadingLogo ? (
                      <div className="w-6 h-6 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin"></div>
                    ) : logoUrl ? (
                      <img src={logoUrl} alt="Company logo" className="w-full h-full object-cover" />
                    ) : (
                      <span>{industry === 'food' ? '☕' : industry === 'tech' ? '💻' : industry === 'retail' ? '🛍️' : industry === 'health' ? '🏥' : '🏢'}</span>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                  </button>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{companyName || 'Your Company'}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{industryLabels[industry] || industry} • ZIP {zipCode}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Click logo to upload your company image</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  {website && (
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 dark:text-slate-500 text-sm w-28 flex-shrink-0 font-medium">Website</span>
                      <span className="text-sm font-semibold text-brand-600 dark:text-brand-400 truncate">{website}</span>
                    </div>
                  )}
                  {employeeCount && (
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 dark:text-slate-500 text-sm w-28 flex-shrink-0 font-medium">Employees</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{employeeCount}</span>
                    </div>
                  )}
                  {about && (
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 dark:text-slate-500 text-sm w-28 flex-shrink-0 font-medium pt-0.5">About</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">{about}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 dark:text-slate-500 text-sm w-28 flex-shrink-0 font-medium">Phone</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{phone}</span>
                    </div>
                  )}
                  {!employeeCount && !about && !website && !phone && (
                    <p className="text-sm text-slate-400 italic">No additional details added — you can always edit later.</p>
                  )}
                </div>
              </div>

              {companyStatus === 'pending_review' ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50 flex gap-3">
                  <span className="text-amber-600 text-xl">⏳</span>
                  <div>
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Profile under review</p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">We couldn&apos;t automatically verify your company. Your profile will be reviewed by the InternPick team before going live. This usually takes 1-2 business days.</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Questions? Email <a href="mailto:help@internpick.com" className="underline font-bold">help@internpick.com</a></p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800/50 flex gap-3">
                  <span className="text-green-600 text-xl">✅</span>
                  <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                    Your profile is ready! You can always update it later from Settings or by clicking &quot;Edit Profile&quot; on your dashboard.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-10 flex gap-3">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="rounded-xl px-6 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                disabled={isFinishing || isLookingUp}
              >
                Back
              </Button>
            )}
            
            {step < totalSteps ? (
              <Button 
                onClick={handleNext} 
                className="flex-1 rounded-xl font-bold py-6 text-md shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canProceed() || isLookingUp}
              >
                {isLookingUp ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Looking up...
                  </span>
                ) : 'Continue'}
              </Button>
            ) : (
              <Button 
                onClick={handleFinish} 
                className="flex-1 rounded-xl font-bold py-6 text-md shadow-brand-500/20 disabled:opacity-70 disabled:cursor-wait"
                disabled={isFinishing}
              >
                {isFinishing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    {isEditMode ? 'Saving...' : 'Creating Profile...'}
                  </span>
                ) : isEditMode ? 'Save Changes' : 'Go to Dashboard 🚀'}
              </Button>
            )}
          </div>
          
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            {isEditMode ? (
              <Link href="/employer" className="hover:underline">← Back to dashboard</Link>
            ) : (
              <Link href="/login" className="hover:underline">Cancel and return to login</Link>
            )}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Need help? Email <a href="mailto:help@internpick.com" className="text-brand-600 dark:text-brand-400 hover:underline font-semibold">help@internpick.com</a>
          </p>
        </div>

      </div>
    </div>
  )
}

export default function EmployerOnboarding() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    }>
      <OnboardingWizard />
    </Suspense>
  )
}
