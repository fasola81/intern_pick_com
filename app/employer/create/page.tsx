"use client"

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createOpportunity, polishCompanyAbout, moderateOpportunityContent, generateAndUploadRoleImageAction, suggestSkillTagsAction, reviewDOLComplianceAction } from '@/app/actions'
import { STATE_MINIMUM_WAGES, FEDERAL_MINIMUM_WAGE, getMinimumWageByAbbr } from '@/lib/minimumWages'
import { PREBUILT_AVATARS } from '@/lib/prebuilt-avatars'

type QuestionType = 'open_ended' | 'multiple_choice' | 'multiple_selection'

interface PrescreenQuestion {
  text: string;
  type: QuestionType;
  options: string[];
}

export default function CreateRolePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [moderationError, setModerationError] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [showFullPreviewModal, setShowFullPreviewModal] = useState<string | null>(null)
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false)
  const [step, setStep] = useState(1)
  const STEPS = [
    { num: 1, title: 'Role Details', icon: '📋' },
    { num: 2, title: 'Description', icon: '✍️' },
    { num: 3, title: 'Skills & Perks', icon: '🎁' },
    { num: 4, title: 'Avatar', icon: '🖼️' },
    { num: 5, title: 'Requirements', icon: '📝' },
  ]
  const [description, setDescription] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [compensation, setCompensation] = useState<'paid' | 'unpaid' | 'credit'>('paid')
  const [selectedState, setSelectedState] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState("10")
  const [duration, setDuration] = useState("")
  const [questions, setQuestions] = useState<PrescreenQuestion[]>([{ text: 'Why are you interested in this role?', type: 'open_ended', options: ['', ''] }])
  const [requireVideo, setRequireVideo] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [minAge, setMinAge] = useState('')
  const [showDOLModal, setShowDOLModal] = useState(false)
  const [dolChecks, setDolChecks] = useState<boolean[]>([false, false, false, false, false, false, false])

  const [requireTeacherRef, setRequireTeacherRef] = useState(false)
  const [selectedPerks, setSelectedPerks] = useState<string[]>([])
  const [perksSearch, setPerksSearch] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0)
  const [customPerkInput, setCustomPerkInput] = useState('')
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [isSuggestingTags, setIsSuggestingTags] = useState(false)
  const [hasRequestedSuggestions, setHasRequestedSuggestions] = useState(false)
  const [dolReview, setDolReview] = useState<{ compliant: boolean; score: number; issues: string[]; suggestions: string[] } | null>(null)
  const [isReviewingDOL, setIsReviewingDOL] = useState(false)
  const [dolReviewedDescription, setDolReviewedDescription] = useState('')
  const [showValidation, setShowValidation] = useState(false)

  // Auto-suggest skills when entering step 3 (Skills & Perks)
  useEffect(() => {
    if (step === 3 && title && !hasRequestedSuggestions) {
      setHasRequestedSuggestions(true)
      setIsSuggestingTags(true)
      suggestSkillTagsAction({ title, category, description }).then(res => {
        if (res.success && res.tags.length > 0) {
          setSuggestedTags(res.tags)
        }
        setIsSuggestingTags(false)
      }).catch(() => setIsSuggestingTags(false))
    }
  }, [step, title, category, description, hasRequestedSuggestions])

  const PERKS_CATEGORIES = [
    {
      name: '🚀 Career Boost',
      short: 'Career',
      items: ['Letter of Recommendation','1-on-1 Mentorship','Portfolio / Capstone Project','Resume & LinkedIn Help','Mock Interview Practice','College Application Support','Job Shadowing Executives','Industry Networking Events','Future Job Opportunity','Career Coaching Sessions']
    },
    {
      name: '💻 Skills You\'ll Learn',
      short: 'Skills',
      items: ['Social Media Marketing','Graphic Design (Canva)','Video Editing & Production','AI & Prompt Engineering','Web Development Basics','Photography & Visual Arts','Data Analysis & Excel','Content Writing & Blogging','SEO & Digital Marketing','CRM & Business Software']
    },
    {
      name: '🏠 Work-Life Fit',
      short: 'Flexibility',
      items: ['Flexible After-School Hours','Remote Work Option','Hybrid Schedule','Casual Dress Code','Small Friendly Team','Creative Freedom','Hands-On Real Projects','Collaborative Environment','Outdoor & Active Work','Community-Focused Role']
    },
    {
      name: '🎁 Perks & Rewards',
      short: 'Perks',
      items: ['Paid Position','End-of-Program Stipend','School Credit Eligible','Free Meals & Snacks','Company Swag & Apparel','Laptop or Equipment Provided','Team Outings & Events','Performance Bonus','Transportation Allowance','Employee Discounts']
    }
  ]
  
  const CATEGORY_SKILLS: Record<string, string[]> = {
    marketing: ['Social Media Marketing', 'Content Creation', 'Canva', 'Copywriting', 'SEO Basics', 'Email Marketing', 'Brand Awareness', 'Analytics'],
    tech: ['HTML & CSS', 'JavaScript Basics', 'Git & GitHub', 'Problem Solving', 'Debugging', 'Data Analysis', 'AI & Prompt Engineering', 'Web Development'],
    hospitality: ['Customer Service', 'POS Systems', 'Food Safety', 'Teamwork', 'Time Management', 'Cash Handling', 'Inventory Basics', 'Hospitality Skills'],
    admin: ['Microsoft Office', 'Data Entry', 'Filing & Organization', 'Phone Etiquette', 'Scheduling', 'Email Communication', 'CRM Software', 'Detail Oriented'],
    health: ['Patient Interaction', 'HIPAA Basics', 'Medical Terminology', 'Empathy', 'Record Keeping', 'First Aid Awareness', 'Hygiene Protocols', 'Communication'],
    finance: ['Excel Spreadsheets', 'Data Entry', 'Basic Accounting', 'Attention to Detail', 'Financial Literacy', 'Invoicing', 'Math Skills', 'Organization'],
    education: ['Tutoring', 'Lesson Planning', 'Public Speaking', 'Patience', 'Classroom Management', 'Student Engagement', 'Curriculum Basics', 'Mentoring'],
    construction: ['Blueprint Reading', 'Tool Safety', 'Measurements', 'Physical Stamina', 'Teamwork', 'Problem Solving', 'Attention to Detail', 'Manual Dexterity'],
    arts: ['Graphic Design', 'Photography', 'Video Editing', 'Color Theory', 'Adobe Creative Suite', 'Illustration', 'Visual Storytelling', 'Creative Thinking'],
    other: ['Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Organization', 'Adaptability', 'Critical Thinking', 'Work Ethic'],
  }

  const categorySkills = useMemo(() => {
    return CATEGORY_SKILLS[category] || CATEGORY_SKILLS['other']
  }, [category])

  const availableTags = [
    "Social Media", "Communication", "Canva", "Excel", "Data Entry", 
    "Customer Service", "Writing", "SEO", "Project Management", "Detail Oriented",
    "G-Suite", "Public Speaking", "Problem Solving"
  ]

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, { text: "", type: "open_ended", options: ["", ""] }])
    }
  }

  const handleRemoveQuestion = (indexToRemove: number) => {
    setQuestions(questions.filter((_, index) => index !== indexToRemove))
  }

  const handleUpdateQuestionText = (index: number, text: string) => {
    const newQuestions = [...questions]
    newQuestions[index].text = text
    setQuestions(newQuestions)
  }

  const handleUpdateQuestionType = (index: number, type: QuestionType) => {
    const newQuestions = [...questions]
    newQuestions[index].type = type
    setQuestions(newQuestions)
  }

  const handleAddOption = (qIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options.push("")
    setQuestions(newQuestions)
  }

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== optIndex)
    setQuestions(newQuestions)
  }

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options[optIndex] = text
    setQuestions(newQuestions)
  }

  const handleAIGenerate = async () => {
    if (!description.trim()) return
    setIsGenerating(true)
    try {
      const dolContext = compensation === 'unpaid'
        ? '\n\n[IMPORTANT: This is an UNPAID internship. Under DOL Primary Beneficiary Test, the description MUST emphasize: what the intern will LEARN (skills, training, mentorship), how the experience ties to their education or career development, that the intern does NOT replace a paid employee, and the supervision/mentorship structure. Rewrite to ensure compliance.]'
        : ''
      const result = await polishCompanyAbout({ text: description + dolContext, companyName: title || 'Internship', industry: category || 'internship' })
      if (result.polished) {
        setDescription(result.polished)
      }
    } catch (err) {
      console.error('[AI] Polish failed:', err)
    }
    setIsGenerating(false)
  }

  const [workSetting, setWorkSetting] = useState<'onsite' | 'hybrid' | 'remote'>('onsite')

  const handleStateChange = (abbr: string) => {
    setSelectedState(abbr)
    if (abbr && compensation === 'paid') {
      const stateData = getMinimumWageByAbbr(abbr)
      if (stateData) {
        setHourlyRate(stateData.rate.toFixed(2))
      }
    }
  }

  const handleCompensationChange = (val: 'paid' | 'unpaid' | 'credit') => {
    setCompensation(val)
    // Clear DOL review when switching compensation type
    setDolReview(null)
    setDolReviewedDescription('')
    if (val === 'paid' && selectedState) {
      const stateData = getMinimumWageByAbbr(selectedState)
      if (stateData) {
        setHourlyRate(stateData.rate.toFixed(2))
      }
    }
  }

  const handleReviewClick = async () => {
    // If unpaid, show DOL acknowledgment first
    if (compensation === 'unpaid') {
      setDolChecks([false, false, false, false, false, false, false])
      setShowDOLModal(true)
      return
    }
    await proceedToReview()
  }

  const proceedToReview = async () => {
    setIsChecking(true)
    setModerationError(null)
    try {
      const modResult = await moderateOpportunityContent({
        title,
        description,
        category,
        compensation,
        perks: selectedPerks,
        workSetting,
      })
      if (modResult.safe) {
        setShowReview(true)
      } else {
        setModerationError(modResult.reason || 'Your listing was flagged by our safety system. Please review and update your content.')
      }
    } catch (err) {
      console.error('[Moderation] Error:', err)
      // If moderation fails, allow through to review
      setShowReview(true)
    }
    setIsChecking(false)
  }

  const DOL_FACTORS = [
    { title: 'No Expectation of Compensation', desc: 'Both I and the intern understand there is no expectation of payment.' },
    { title: 'Educational Benefit', desc: 'The training is similar to what would be given in an educational environment.' },
    { title: 'Tied to Formal Education', desc: 'The internship is connected to the intern\'s coursework or academic credit.' },
    { title: 'Accommodates Academic Calendar', desc: 'The schedule accommodates the intern\'s school commitments.' },
    { title: 'Limited Duration', desc: 'The internship has a clear start and end date.' },
    { title: 'Does Not Displace Employees', desc: 'The intern complements — not replaces — paid staff.' },
    { title: 'No Job Guarantee', desc: 'Both parties understand the internship does not guarantee a paid job.' },
  ]

  const handleConfirmPublish = async () => {
    setIsPublishing(true)
    setPublishError(null)
    try {
      const result = await createOpportunity({
        title,
        category,
        compensation,
        hourlyRate: compensation === 'paid' ? parseFloat(hourlyRate) || undefined : undefined,
        hoursPerWeek: parseInt(hoursPerWeek) || undefined,
        startDate: undefined,
        endDate: undefined,
        workSetting,
        requiredSkills: selectedTags,
        description,
        avatarUrl,
      })
      if (!result.success) {
        throw new Error(result.error || 'Failed to create opportunity. Please try again.')
      }
      console.log('[Create Role] Result:', result)
      router.push('/employer')
    } catch (err: any) {
      console.error('[Create Role] Error:', err)
      setPublishError(err.message || 'An unexpected error occurred while publishing.')
    } finally {
      setIsPublishing(false)
    }
  }

  const stateMinWage = selectedState ? getMinimumWageByAbbr(selectedState) : null

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          {/* Header */}
          <section className="flex flex-col gap-2 animate-fade-in-up">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              <Link href="/employer" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Employer Portal</Link>
              <span>/</span>
              <span className="text-slate-900 dark:text-white">Post New Role</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create an Internship Opportunity</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Match with the brightest high school talent in your community.</p>
          </section>

          {/* Wizard Progress Bar */}
          <section id="wizard-steps" className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center justify-between relative">
              {/* Connector line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 z-0 mx-10" />
              <div className="absolute top-5 left-0 h-0.5 bg-brand-500 z-0 mx-10 transition-all duration-500" style={{ width: `${((step - 1) / (STEPS.length - 1)) * (100 - 10)}%` }} />
              {STEPS.map((s) => (
                <button
                  key={s.num}
                  onClick={() => s.num < step && setStep(s.num)}
                  className={`relative z-10 flex flex-col items-center gap-1.5 group ${s.num < step ? 'cursor-pointer' : s.num === step ? '' : 'cursor-default'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${
                    s.num < step
                      ? 'bg-brand-600 border-brand-600 text-white shadow-md shadow-brand-500/30'
                      : s.num === step
                        ? 'bg-white dark:bg-slate-900 border-brand-500 text-brand-600 dark:text-brand-400 shadow-md shadow-brand-500/20 scale-110'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                  }`}>
                    {s.num < step ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : s.icon}
                  </div>
                  <span className={`text-[11px] font-bold transition-colors hidden sm:block ${
                    s.num <= step ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'
                  }`}>{s.title}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Form Area */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            
            <div className="p-8 md:p-12 flex flex-col gap-10">
              
              {/* ===== STEP 1: Role Details ===== */}
              {step === 1 && (<div className="space-y-6 animate-fade-in-up">
              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Role Details</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">The basics that students will see when browsing.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Role Title *</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Marketing Assistant, Barista Trainee" 
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${showValidation && !title.trim() ? 'border-red-400 dark:border-red-500 ring-1 ring-red-300' : 'border-slate-200 dark:border-slate-700'}`}
                    />
                    {showValidation && !title.trim() && <p className="text-xs text-red-500 font-medium mt-1">Please enter a role title</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category *</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none text-slate-900 dark:text-white ${showValidation && !category ? 'border-red-400 dark:border-red-500 ring-1 ring-red-300' : 'border-slate-200 dark:border-slate-700'}`}>
                      <option value="">Select a category</option>
                      <option value="marketing">Marketing & Social Media</option>
                      <option value="tech">Technology & IT</option>
                      <option value="hospitality">Hospitality & Retail</option>
                      <option value="admin">Administration & Operations</option>
                      <option value="health">Healthcare & Medical</option>
                      <option value="finance">Finance & Accounting</option>
                      <option value="education">Education & Tutoring</option>
                      <option value="construction">Construction & Trades</option>
                      <option value="arts">Arts & Design</option>
                      <option value="other">Other</option>
                    </select>
                    {showValidation && !category && <p className="text-xs text-red-500 font-medium mt-1">Please select a category</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Role Type *</label>
                    <select value={compensation} onChange={(e) => handleCompensationChange(e.target.value as 'paid' | 'unpaid' | 'credit')} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none text-slate-900 dark:text-white">
                      <option value="paid">💰 Paid (Hourly)</option>
                      <option value="unpaid">🎓 Unpaid (Experience)</option>
                      <option value="credit">📚 School Credit</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">State *</label>
                    <select
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none text-slate-900 dark:text-white ${showValidation && !selectedState ? 'border-red-400 dark:border-red-500 ring-1 ring-red-300' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      <option value="">Select your state</option>
                      {STATE_MINIMUM_WAGES.map(s => (
                        <option key={s.abbr} value={s.abbr}>{s.state}</option>
                      ))}
                    </select>
                    {showValidation && !selectedState && <p className="text-xs text-red-500 font-medium mt-1">Please select a state</p>}
                  </div>
                </div>

                {/* Hourly Rate (visible for paid) */}
                {compensation === 'paid' && (
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hourly Rate ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min={stateMinWage?.rate || FEDERAL_MINIMUM_WAGE}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder={`e.g. ${stateMinWage?.rate.toFixed(2) || FEDERAL_MINIMUM_WAGE.toFixed(2)}`}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 dark:text-white ${showValidation && !hourlyRate ? 'border-red-400 dark:border-red-500 ring-1 ring-red-300' : 'border-slate-200 dark:border-slate-700'}`}
                      />
                      {showValidation && !hourlyRate && <p className="text-xs text-red-500 font-medium mt-1">Please enter an hourly rate</p>}
                      {stateMinWage && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {stateMinWage.state} minimum wage: <strong className="text-slate-700 dark:text-slate-300">${stateMinWage.rate.toFixed(2)}/hr</strong>
                          {stateMinWage.note && <span className="text-slate-400 dark:text-slate-500"> ({stateMinWage.note})</span>}
                        </p>
                      )}
                      {!selectedState && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">Select a state above to auto-fill the minimum wage.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hours/Week</label>
                      <input 
                        type="number" 
                        value={hoursPerWeek}
                        onChange={(e) => setHoursPerWeek(e.target.value)}
                        placeholder="e.g. 10" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Duration</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none text-slate-900 dark:text-white"
                      >
                        <option value="">Select Duration</option>
                        <option value="1">1 Month</option>
                        <option value="2">2 Months</option>
                        <option value="3">3 Months</option>
                        <option value="4">4 Months</option>
                        <option value="6">6 Months</option>
                        <option value="9">9 Months</option>
                        <option value="12">12 Months</option>
                        <option value="ongoing">Ongoing</option>
                      </select>
                      {hourlyRate && hoursPerWeek && duration && duration !== 'ongoing' && (
                        <p className="text-xs font-bold text-brand-700 dark:text-brand-300 text-right">
                          💰 Est. Budget: ${(parseFloat(hourlyRate) * parseFloat(hoursPerWeek) * 4.33 * parseFloat(duration)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Hours/Duration for non-paid */}
                {compensation !== 'paid' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hours/Week</label>
                      <input 
                        type="number" 
                        value={hoursPerWeek}
                        onChange={(e) => setHoursPerWeek(e.target.value)}
                        placeholder="e.g. 10" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Duration</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none text-slate-900 dark:text-white"
                      >
                        <option value="">Select Duration</option>
                        <option value="1">1 Month</option>
                        <option value="2">2 Months</option>
                        <option value="3">3 Months</option>
                        <option value="4">4 Months</option>
                        <option value="6">6 Months</option>
                        <option value="9">9 Months</option>
                        <option value="12">12 Months</option>
                        <option value="ongoing">Ongoing</option>
                      </select>
                    </div>
                  </div>
                )}




                <div className="space-y-2 pt-2">
                   <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Work Setting *</label>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                     <button
                       onClick={() => setWorkSetting('onsite')}
                       className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${
                         workSetting === 'onsite' 
                           ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-900/40 dark:border-brand-500/50 dark:text-brand-300 shadow-sm' 
                           : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
                       }`}
                     >
                        🏢 On-site
                     </button>
                     <button
                       onClick={() => setWorkSetting('hybrid')}
                       className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${
                         workSetting === 'hybrid' 
                           ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-900/40 dark:border-brand-500/50 dark:text-brand-300 shadow-sm' 
                           : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
                       }`}
                     >
                        🔄 Hybrid
                     </button>
                     <button
                       onClick={() => setWorkSetting('remote')}
                       className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${
                         workSetting === 'remote' 
                           ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-900/40 dark:border-brand-500/50 dark:text-brand-300 shadow-sm' 
                           : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
                       }`}
                     >
                        💻 Remote
                     </button>
                   </div>
                </div>

              </div>
              </div>)}

              {/* ===== STEP 4: Role Avatar ===== */}
              {step === 4 && (<div className="animate-fade-in-up">
              {/* Role Avatar */}
              <div className="space-y-6 relative">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Role Avatar</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Choose an image to represent this role, or generate a custom one.</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {previewAvatarUrl && (
                      <div className="flex flex-col items-end animate-fade-in-up">
                        <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">✨ Preview Ready! Click to select</span>
                        <button 
                          type="button"
                          onClick={() => { setAvatarUrl(previewAvatarUrl); setPreviewAvatarUrl(null) }}
                          className="w-24 h-24 rounded-xl overflow-hidden border-2 border-brand-500 shadow-lg hover:scale-105 transition-transform group relative cursor-pointer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={previewAvatarUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-brand-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold text-xs">Select</span>
                          </div>
                        </button>
                      </div>
                    )}
                    {generationError && (
                      <div className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 animate-fade-in">
                        {generationError}
                      </div>
                    )}
                    <button 
                      onClick={async () => {
                        if (!title || !description) return alert('Please enter a Title and Description first.')
                        setIsGeneratingAvatar(true)
                        setGenerationError(null)
                        try {
                          const res = await generateAndUploadRoleImageAction({ title, category, description })
                          if (res.url) {
                            setPreviewAvatarUrl(res.url)
                          } else {
                            setGenerationError(res.error || 'Failed to generate.')
                          }
                        } catch (err) { 
                          console.error(err)
                          setGenerationError('Failed to generate avatar.')
                        }
                        setIsGeneratingAvatar(false)
                      }}
                      disabled={isGeneratingAvatar || !title}
                      className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-xl text-sm font-bold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors border border-brand-200 dark:border-brand-800/50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isGeneratingAvatar ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></span>
                          Generating...
                        </span>
                      ) : (
                        <>
                          <span>✨</span> Generate Unique Avatar with AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Prebuilt Grid & Selection Preview */}
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {PREBUILT_AVATARS.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-visible group">
                      <button
                        onClick={() => setAvatarUrl(url)}
                        className={`w-full h-full rounded-xl overflow-hidden border-2 transition-all block ${
                          avatarUrl === url
                            ? 'border-brand-500 shadow-md transform scale-105 z-10'
                            : 'border-transparent hover:border-brand-300 dark:hover:border-brand-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Avatar option ${i + 1}`} className="w-full h-full object-cover" />
                        {avatarUrl === url && (
                          <div className="absolute top-1 right-1 bg-brand-500 text-white rounded-full p-0.5 shadow-sm">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        )}
                      </button>
                      
                      {/* Enlarge Modal Button — always visible */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowFullPreviewModal(url) }}
                        className="absolute bottom-1 right-1 w-7 h-7 bg-slate-900/70 hover:bg-brand-600 backdrop-blur text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20"
                        title="View Full Size"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Mobile Generative Button */}
                <button 
                  onClick={async () => {
                    if (!title || !description) return alert('Please enter a Title and Description first.')
                    setIsGeneratingAvatar(true)
                    try {
                      const res = await generateAndUploadRoleImageAction({ title, category, description })
                      if (res.url) setAvatarUrl(res.url)
                    } catch (err) { console.error(err) }
                    setIsGeneratingAvatar(false)
                  }}
                  disabled={isGeneratingAvatar || !title}
                  className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-xl text-sm font-bold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors border border-brand-200 dark:border-brand-800/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isGeneratingAvatar ? "Generating..." : "✨ Generate with AI"}
                </button>
              </div>
              </div>)}

              {/* ===== STEP 2: Description ===== */}
              {step === 2 && (<div className="animate-fade-in-up">
              {/* Description & AI */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Role Description</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Describe the daily tasks and what the student will learn.</p>
                  </div>
                  <button 
                    onClick={handleAIGenerate}
                    disabled={isGenerating || !description.trim()}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-xl text-sm font-bold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors border border-brand-200 dark:border-brand-800/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></span>
                        Polishing...
                      </span>
                    ) : (
                      <>
                        <span>✨</span> Polish with AI
                      </>
                    )}
                  </button>
                </div>
                
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will the intern do? What skills will they develop?" 
                  rows={6}
                  className={`w-full px-4 py-3 rounded-2xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-y ${showValidation && !description.trim() ? 'border-red-400 dark:border-red-500 ring-1 ring-red-300' : 'border-slate-200 dark:border-slate-700'}`}
                ></textarea>
                {showValidation && !description.trim() && <p className="text-xs text-red-500 font-medium -mt-4">Please enter a role description to continue</p>}
                
                {/* Mobile only AI button */}
                <button 
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !description.trim()}
                  className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-xl text-sm font-bold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors border border-brand-200 dark:border-brand-800/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isGenerating ? "Polishing..." : "✨ Polish with AI"}
                </button>

                {/* DOL Compliance Notice (unpaid only) */}
                {compensation === 'unpaid' && (
                  <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm">DOL Compliance Required for Unpaid Internships</h3>
                    </div>
                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                      Under the Department of Labor&apos;s Primary Beneficiary Test, unpaid internships at for-profit businesses must primarily benefit the intern. Your role description should emphasize:
                    </p>
                    <ul className="space-y-1.5 text-xs text-amber-800/80 dark:text-amber-300/80">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>What the intern will <strong className="text-amber-900 dark:text-amber-200">learn</strong> (skills, training, mentorship)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>How the experience ties to their <strong className="text-amber-900 dark:text-amber-200">education or career development</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>That the intern <strong className="text-amber-900 dark:text-amber-200">does not replace</strong> a paid employee&apos;s duties</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>Supervision and <strong className="text-amber-900 dark:text-amber-200">mentorship structure</strong></span>
                      </li>
                    </ul>
                    <p className="text-[11px] text-amber-700/70 dark:text-amber-400/60 flex items-center gap-1.5">
                      🤖 Our AI will review your description for compliance when you press Next.
                      <a href="/internship-rules" target="_blank" className="underline hover:text-amber-900 dark:hover:text-amber-300 transition-colors">Learn more →</a>
                    </p>
                  </div>
                )}

                {/* DOL Compliance Review Results */}
                {compensation === 'unpaid' && dolReview && !dolReview.compliant && (
                  <div className="p-5 rounded-2xl bg-red-50/80 dark:bg-red-900/10 border border-red-200 dark:border-red-800/40 space-y-4 animate-fade-in-up">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚫</span>
                      <h3 className="font-bold text-red-900 dark:text-red-200 text-sm">DOL Compliance Review — Changes Needed</h3>
                    </div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex-grow h-2 rounded-full bg-red-200 dark:bg-red-900/30 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${dolReview.score}%`, backgroundColor: dolReview.score >= 60 ? '#22c55e' : dolReview.score >= 35 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span className="text-xs font-bold text-red-700 dark:text-red-300 whitespace-nowrap">{dolReview.score}/100</span>
                    </div>
                    {dolReview.issues.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-red-800 dark:text-red-300 mb-1.5">Issues found:</p>
                        <ul className="space-y-1">
                          {dolReview.issues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-red-700 dark:text-red-400">
                              <span className="flex-shrink-0 mt-0.5">✕</span>
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {dolReview.suggestions.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-green-800 dark:text-green-300 mb-1.5">How to fix it:</p>
                        <ul className="space-y-1">
                          {dolReview.suggestions.map((sug, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-green-700 dark:text-green-400">
                              <span className="flex-shrink-0 mt-0.5">💡</span>
                              <span>{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="text-[11px] text-red-600/70 dark:text-red-400/60">
                      Please update your description to address the issues above, then press Next again to re-check.
                    </p>
                  </div>
                )}
              </div>
              </div>)}

              {/* ===== STEP 3: Skills & Perks ===== */}
              {step === 3 && (<div className="animate-fade-in-up">

              {/* Skills You'll Learn */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Skills You&apos;ll Learn</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Select or add skills the intern will develop during this role.</p>
                  </div>
                  {isSuggestingTags && (
                    <span className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></span>
                      AI suggesting skills…
                    </span>
                  )}
                </div>

                {/* Selected skills */}
                {selectedTags.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">✓ Selected ({selectedTags.length})</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-brand-50 border border-brand-200 text-brand-700 dark:bg-brand-900/30 dark:border-brand-700/50 dark:text-brand-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700/50 dark:hover:text-red-400 transition-all group"
                        >
                          {tag}
                          <svg className="w-3 h-3 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Suggested Tags */}
                {suggestedTags.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">✨ AI Suggestions based on your role</span>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.filter(t => !selectedTags.includes(t)).map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTags(prev => [...prev, tag])}
                          className="px-3.5 py-2 rounded-xl text-sm font-bold border transition-all bg-brand-50/50 border-brand-200 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/20 dark:border-brand-700/40 dark:text-brand-300 dark:hover:bg-brand-900/40"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category-based default skills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">🎯 Suggested for {category || 'this role'}</span>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.filter(t => !selectedTags.includes(t) && !suggestedTags.includes(t)).map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTags(prev => [...prev, tag])}
                        className="px-3.5 py-2 rounded-xl text-sm font-bold border transition-all bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other preset skill tags */}
                {availableTags.filter(t => !suggestedTags.includes(t) && !categorySkills.includes(t) && !selectedTags.includes(t)).length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">More Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.filter(t => !suggestedTags.includes(t) && !categorySkills.includes(t) && !selectedTags.includes(t)).map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className="px-3.5 py-2 rounded-xl text-sm font-bold border transition-all bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 hover:border-slate-300"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Custom skill tags */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a custom skill and press Enter"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const val = (e.target as HTMLInputElement).value.trim()
                        if (val && !selectedTags.includes(val)) {
                          setSelectedTags(prev => [...prev, val])
                        }
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                </div>
                {/* Selected custom tags (those not in availableTags) */}
                {selectedTags.filter(t => !availableTags.includes(t)).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.filter(t => !availableTags.includes(t)).map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-brand-50 border border-brand-200 text-brand-700 dark:bg-brand-900/30 dark:border-brand-700/50 dark:text-brand-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700/50 dark:hover:text-red-400 transition-all group"
                      >
                        {tag}
                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800 w-full my-6"></div>

              {/* Perks to Intern */}
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Perks to Intern</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Search or browse to select what this internship offers.</p>
                  </div>
                  {selectedPerks.length > 0 && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-bold rounded-full">
                        {selectedPerks.length} selected
                      </span>
                      <button
                        onClick={() => setSelectedPerks([])}
                        className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-bold transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    value={perksSearch}
                    onChange={(e) => setPerksSearch(e.target.value)}
                    placeholder="Search perks… e.g. mentorship, remote, resume"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  {perksSearch && (
                    <button
                      onClick={() => setPerksSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  )}
                </div>

                {/* Selected Perks Strip */}
                {selectedPerks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedPerks.map(perk => (
                      <button
                        key={perk}
                        onClick={() => setSelectedPerks(prev => prev.filter(p => p !== perk))}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-700/50 dark:text-green-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700/50 dark:hover:text-red-400 transition-all group"
                      >
                        <span>{perk}</span>
                        <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    ))}
                  </div>
                )}

                {/* Accordion Categories */}
                <div className="space-y-2">
                  {PERKS_CATEGORIES.map((cat, catIndex) => {
                    const searchLower = perksSearch.toLowerCase()
                    const filteredItems = searchLower
                      ? cat.items.filter(item => item.toLowerCase().includes(searchLower))
                      : cat.items
                    const selectedCount = cat.items.filter(item => selectedPerks.includes(item)).length
                    const isExpanded = perksSearch ? filteredItems.length > 0 : expandedCategory === catIndex

                    if (perksSearch && filteredItems.length === 0) return null

                    return (
                      <div key={catIndex} className="rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden transition-all">
                        {/* Category Header */}
                        <button
                          onClick={() => {
                            if (!perksSearch) {
                              setExpandedCategory(prev => prev === catIndex ? null : catIndex)
                            }
                          }}
                          className="w-full flex items-center justify-between px-5 py-4 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{cat.name}</span>
                            {selectedCount > 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-black bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                                {selectedCount}
                              </span>
                            )}
                          </div>
                          {!perksSearch && (
                            <svg
                              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>

                        {/* Category Items */}
                        {isExpanded && (
                          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white dark:bg-slate-900/50">
                            {filteredItems.map(perk => {
                              const isSelected = selectedPerks.includes(perk)
                              return (
                                <button
                                  key={perk}
                                  onClick={() => setSelectedPerks(prev => isSelected ? prev.filter(p => p !== perk) : [...prev, perk])}
                                  className={`px-3.5 py-2.5 rounded-xl text-sm font-bold border transition-all text-left ${
                                    isSelected
                                      ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-500/50 dark:text-green-300 shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 hover:border-slate-300'
                                  }`}
                                >
                                  {isSelected ? '✓ ' : '+ '}{perk}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* No results */}
                  {perksSearch && PERKS_CATEGORIES.every(cat => !cat.items.some(item => item.toLowerCase().includes(perksSearch.toLowerCase()))) && (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                      <p className="text-sm font-medium">No perks match &ldquo;{perksSearch}&rdquo;</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>

                {/* Custom Perks Input */}
                <div className="space-y-2 pt-1">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Add Your Own</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customPerkInput}
                      onChange={(e) => setCustomPerkInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customPerkInput.trim()) {
                          e.preventDefault()
                          const newPerks = customPerkInput
                            .split(',')
                            .map(p => p.trim())
                            .filter(p => p.length > 0 && !selectedPerks.includes(p))
                          if (newPerks.length > 0) {
                            setSelectedPerks(prev => [...prev, ...newPerks])
                          }
                          setCustomPerkInput('')
                        }
                      }}
                      placeholder="e.g. First Aid Training, Spanish Fluency"
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customPerkInput.trim()) {
                          const newPerks = customPerkInput
                            .split(',')
                            .map(p => p.trim())
                            .filter(p => p.length > 0 && !selectedPerks.includes(p))
                          if (newPerks.length > 0) {
                            setSelectedPerks(prev => [...prev, ...newPerks])
                          }
                          setCustomPerkInput('')
                        }
                      }}
                      disabled={!customPerkInput.trim()}
                      className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Separate multiple items with commas, then press Enter or click Add.</p>
                </div>
              </div>
              </div>)}

              {/* ===== STEP 5: Requirements ===== */}
              {step === 5 && (<div className="animate-fade-in-up">
              {/* Pre-Screening Questions */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Application Requirements</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Set eligibility criteria, request a video, or add screening questions for applicants.</p>
                </div>

                {/* Eligibility Criteria */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Minimum Age <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input
                    type="number"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    placeholder="e.g. 16"
                    min={14}
                    max={21}
                    className="w-full md:w-48 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                {/* Video Requirement Toggle */}
                <div 
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    requireVideo 
                      ? 'bg-brand-50/50 dark:bg-brand-900/20 border-brand-300 dark:border-brand-700/50 shadow-sm' 
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setRequireVideo(!requireVideo)}
                >
                  <div className="pt-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      requireVideo 
                        ? 'bg-brand-600 dark:bg-brand-500 text-white' 
                        : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-transparent'
                    }`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  </div>
                  <div className="flex-grow space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-900 dark:text-white">Require 1-Minute Introductory Video</h3>
                      <div className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">New</div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Ask candidates to submit a short video message. This is a great way to learn more about a person's communication style and personality before an interview.
                    </p>
                  </div>
                </div>

                {/* Ask for References Toggle */}
                <div 
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    requireTeacherRef 
                      ? 'bg-brand-50/50 dark:bg-brand-900/20 border-brand-300 dark:border-brand-700/50 shadow-sm' 
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setRequireTeacherRef(!requireTeacherRef)}
                >
                  <div className="pt-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      requireTeacherRef 
                        ? 'bg-brand-600 dark:bg-brand-500 text-white' 
                        : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-transparent'
                    }`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  </div>
                  <div className="flex-grow space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">Ask for References</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Students will be asked to provide 1&ndash;3 personal or teacher references. You can reach out to these references to learn more about the student&apos;s character and work ethic.
                    </p>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="mb-2">
                     <h3 className="font-bold text-slate-900 dark:text-white">Written Questions</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Each applicant will be asked to answer these questions when applying for this role.</p>
                  </div>

                  {questions.map((question, index) => (
                    <div key={index} className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                      <div className="flex gap-3">
                        <div className="flex-grow space-y-3">
                          <input 
                            type="text" 
                            value={question.text}
                            onChange={(e) => handleUpdateQuestionText(index, e.target.value)}
                            placeholder={`Question ${index + 1}`} 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                          />
                          <select
                            value={question.type}
                            onChange={(e) => handleUpdateQuestionType(index, e.target.value as QuestionType)}
                            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none"
                          >
                            <option value="open_ended">Open Ended Text</option>
                            <option value="multiple_choice">Multiple Choice (Single Answer)</option>
                            <option value="multiple_selection">Multiple Selection (Checkboxes)</option>
                          </select>
                        </div>
                        <button 
                          onClick={() => handleRemoveQuestion(index)}
                          className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors border border-slate-200 dark:border-slate-700"
                          title="Remove question"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>

                      {/* Options for Multiple Choice/Selection */}
                      {(question.type === 'multiple_choice' || question.type === 'multiple_selection') && (
                        <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-2 mt-2">
                          {question.options.map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <div className={`w-4 h-4 ${question.type === 'multiple_choice' ? 'rounded-full' : 'rounded-sm'} border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 flex-shrink-0`}></div>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleUpdateOption(index, optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                                className="flex-grow px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                              />
                              <button
                                onClick={() => handleRemoveOption(index, optIndex)}
                                disabled={question.options.length <= 2}
                                className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => handleAddOption(index)}
                            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 mt-2"
                          >
                            <span className="text-lg leading-none">+</span> Add Option
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {questions.length < 5 && (
                    <button 
                      onClick={handleAddQuestion}
                      className="flex items-center gap-2 px-4 py-3 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-bold text-sm transition-colors border border-dashed border-brand-300 dark:border-brand-800/50 rounded-xl hover:bg-brand-50 w-full sm:w-auto mt-2"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      Add Question {questions.length > 0 ? `(${questions.length}/5)` : ''}
                    </button>
                  )}
                  {questions.length === 5 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">Maximum of 5 questions reached.</p>
                  )}
                </div>
              </div>
              </div>)}

            </div>

            {/* Wizard Navigation Footer */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                {step === 1 ? (
                  <Link href="/employer" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full rounded-xl bg-white dark:bg-slate-900 border-slate-200 hover:border-slate-300 dark:border-slate-700">Cancel</Button>
                  </Link>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => { setStep(step - 1); document.getElementById('wizard-steps')?.scrollIntoView({ behavior: 'smooth' }) }}
                    className="w-full sm:w-auto rounded-xl bg-white dark:bg-slate-900 border-slate-200 hover:border-slate-300 dark:border-slate-700"
                  >
                    ← Back
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 hidden sm:block">Step {step} of {STEPS.length}</span>
                {step < 5 ? (
                  <Button 
                    onClick={async () => {
                      // Validate required fields per step
                      if (step === 1) {
                        const missing = !title.trim() || !category || !selectedState || (compensation === 'paid' && !hourlyRate)
                        if (missing) {
                          setShowValidation(true)
                          return
                        }
                      }
                      if (step === 2) {
                        if (!description.trim()) {
                          setShowValidation(true)
                          return
                        }
                        // DOL compliance gate for unpaid roles
                        if (compensation === 'unpaid') {
                          if (dolReviewedDescription !== description.trim()) {
                            setIsReviewingDOL(true)
                            setDolReview(null)
                            try {
                              const result = await reviewDOLComplianceAction({ title, category, description: description.trim() })
                              setDolReview(result)
                              setDolReviewedDescription(description.trim())
                              if (!result.compliant) {
                                setIsReviewingDOL(false)
                                return
                              }
                            } catch {
                              // Fail open if AI is down
                            }
                            setIsReviewingDOL(false)
                          } else if (dolReview && !dolReview.compliant) {
                            return
                          }
                        }
                      }
                      setShowValidation(false)
                      setStep(step + 1)
                      document.getElementById('wizard-steps')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    disabled={isReviewingDOL}
                    className="w-full sm:w-auto rounded-xl shadow-brand-500/20 px-8 disabled:opacity-70"
                  >
                    {isReviewingDOL ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        Reviewing Compliance...
                      </span>
                    ) : (
                      'Next →'
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleReviewClick}
                    disabled={isChecking || isPublishing || !title}
                    className="w-full sm:w-auto rounded-xl shadow-brand-500/20 px-8 disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isChecking ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        Checking…
                      </span>
                    ) : 'Review & Publish →'}
                  </Button>
                )}
              </div>
            </div>
            
          </section>

        </div>
      </main>
      {/* ======== Full Preview Modal ======== */}
      {showFullPreviewModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in" 
          onClick={() => setShowFullPreviewModal(null)}
        >
          <div 
            className="relative max-w-lg w-full animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={showFullPreviewModal} 
              alt="Avatar Preview" 
              className="w-full rounded-2xl shadow-2xl border border-white/10"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl flex items-center justify-between">
              <button
                onClick={() => { setAvatarUrl(showFullPreviewModal); setShowFullPreviewModal(null) }}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg"
              >
                ✓ Select This Avatar
              </button>
              <button
                onClick={() => setShowFullPreviewModal(null)}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======== Safety Flagged Modal ======== */}
      {moderationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md animate-fade-in-up">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600 dark:text-red-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Content Flagged</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Our AI safety review found an issue with your listing:
              </p>
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
                <p className="text-sm text-red-800 dark:text-red-300 font-medium">{moderationError}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Please update your listing to comply with our community guidelines. InternPick is designed to keep high school students safe.
              </p>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-end">
              <button
                onClick={() => setModerationError(null)}
                className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Go Back & Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======== Review Preview Overlay ======== */}
      {showReview && (
        <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Review Your Listing</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Everything look good? Confirm to publish.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold">✓ AI Approved</span>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              
              {/* Role Header */}
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                {/* Avatar */}
                {avatarUrl && (
                  <div className="flex flex-col items-center mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl}
                      alt="Selected Avatar"
                      className="w-40 h-40 rounded-2xl object-cover bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                    />
                  </div>
                )}
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title || 'Untitled Role'}</h2>
                <div className="flex flex-wrap gap-2 text-sm">
                  {category && <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium">{category}</span>}
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {compensation === 'paid' ? '💰 Paid' : compensation === 'credit' ? '📚 School Credit' : '🎓 Experience'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {workSetting === 'remote' ? '💻 Remote' : workSetting === 'hybrid' ? '🔄 Hybrid' : '🏢 On-site'}
                  </span>
                  {hoursPerWeek && <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">⏰ {hoursPerWeek} hrs/week</span>}
                  {duration && <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">📅 {duration} {duration === 'ongoing' ? '' : 'months'}</span>}
                </div>
              </div>

              {/* Description */}
              {description && (
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Description</h3>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{description}</p>
                </div>
              )}

              {/* Skills */}
              {selectedTags.length > 0 && (
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Skills You&apos;ll Learn</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-sm font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Perks */}
              {selectedPerks.length > 0 && (
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Perks to Intern ({selectedPerks.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPerks.map(perk => (
                      <span key={perk} className="px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm font-medium border border-green-200 dark:border-green-800/30">✓ {perk}</span>
                    ))}
                  </div>
                </div>
              )}



              {/* Application Requirements */}
              <div className="p-6 md:p-8">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Application Requirements</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  {minAge && <li>• Minimum age: <span className="font-medium text-slate-800 dark:text-slate-200">{minAge}</span></li>}
                  {requireTeacherRef && <li>• Teacher reference required</li>}
                  {requireVideo && <li>• 60-second video introduction required</li>}
                  {questions.length > 0 && <li>• {questions.length} screening question{questions.length > 1 ? 's' : ''}</li>}
                  {!minAge && !requireTeacherRef && !requireVideo && questions.length === 0 && <li className="text-slate-400 dark:text-slate-500 italic">No special requirements</li>}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              {publishError && (
                <div className="flex-1 px-4 py-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm font-medium rounded-xl flex items-center justify-start gap-2">
                  <span>⚠️</span> {publishError}
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => setShowReview(false)}
                className="w-full sm:w-auto rounded-xl bg-white dark:bg-slate-900 border-slate-200 hover:border-slate-300 dark:border-slate-700"
              >
                ← Go Back & Edit
              </Button>
              <Button
                onClick={handleConfirmPublish}
                disabled={isPublishing}
                className="w-full sm:w-auto rounded-xl shadow-brand-500/20 px-8 disabled:opacity-70 disabled:cursor-wait"
              >
                {isPublishing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Publishing…
                  </span>
                ) : '🚀 Confirm & Publish'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======== DOL Acknowledgment Modal ======== */}
      {showDOLModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg animate-fade-in-up my-8">
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⚖️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">DOL Primary Beneficiary Test</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Required acknowledgment for unpaid internships</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Under the Department of Labor&apos;s guidelines, unpaid internships at for-profit businesses must pass the <strong className="text-slate-900 dark:text-white">7-factor Primary Beneficiary Test</strong>. Please confirm each factor applies to this role:
              </p>

              <div className="space-y-2">
                {DOL_FACTORS.map((factor, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const next = [...dolChecks]
                      next[i] = !next[i]
                      setDolChecks(next)
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      dolChecks[i]
                        ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700/50'
                        : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      dolChecks[i]
                        ? 'bg-green-600 dark:bg-green-500 text-white'
                        : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600'
                    }`}>
                      {dolChecks[i] && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${dolChecks[i] ? 'text-green-800 dark:text-green-300' : 'text-slate-900 dark:text-white'}`}>
                        {i + 1}. {factor.title}
                      </p>
                      <p className={`text-xs mt-0.5 ${dolChecks[i] ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {factor.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{dolChecks.filter(Boolean).length}/7 acknowledged</span>
                <div className="flex-grow h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${(dolChecks.filter(Boolean).length / 7) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between gap-3">
              <button
                onClick={() => setShowDOLModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                ← Go Back
              </button>
              <button
                onClick={async () => {
                  setShowDOLModal(false)
                  await proceedToReview()
                }}
                disabled={dolChecks.some(c => !c)}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                {dolChecks.every(Boolean) ? '✓ Proceed to Review' : `Acknowledge All 7 Factors`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
