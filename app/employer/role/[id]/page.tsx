"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { generateAndUploadRoleImageAction } from '@/app/actions'
import { PREBUILT_AVATARS } from '@/lib/prebuilt-avatars'

export default function RoleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const roleId = params.id as string

  const [role, setRole] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Editable fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [compensation, setCompensation] = useState('')
  const [workSetting, setWorkSetting] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarSvg, setAvatarSvg] = useState<string | null>(null)
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [showFullPreviewModal, setShowFullPreviewModal] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRole() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', roleId)
        .single()

      if (data) {
        setRole(data)
        setTitle(data.title || '')
        setDescription(data.description || '')
        setCategory(data.category || '')
        setCompensation(data.compensation || '')
        setWorkSetting(data.work_setting || '')
        setHoursPerWeek(data.hours_per_week?.toString() || '')
        setIsActive(data.is_active ?? true)
        setAvatarUrl(data.avatar_url || null)
        setAvatarSvg(data.avatar_svg || null)
      }
      setIsLoading(false)
    }
    if (roleId) fetchRole()
  }, [roleId])

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { error } = await supabase
      .from('opportunities')
      .update({
        title,
        description,
        category,
        compensation,
        work_setting: workSetting,
        hours_per_week: parseInt(hoursPerWeek) || null,
        is_active: isActive,
        avatar_svg: avatarSvg,
        avatar_url: avatarUrl,
      })
      .eq('id', roleId)

    if (!error) {
      setRole({ ...role, title, description, category, compensation, work_setting: workSetting, hours_per_week: parseInt(hoursPerWeek) || null, is_active: isActive })
      setIsEditing(false)
    }
    setIsSaving(false)
  }

  const compensationLabel = (c: string) => {
    if (c === 'paid') return '💰 Paid'
    if (c === 'credit') return '📚 School Credit'
    return '🎓 Unpaid (Experience)'
  }

  const settingLabel = (s: string) => {
    if (s === 'remote') return '💻 Remote'
    if (s === 'hybrid') return '🔄 Hybrid'
    return '🏢 On-site'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <p className="text-xl font-bold text-slate-900 dark:text-white">Role not found</p>
          <Link href="/employer"><Button>Back to Dashboard</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
            <Link href="/employer" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Dashboard</Link>
            <span>/</span>
            <Link href="/employer" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Roles</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white">{role.title}</span>
          </div>

          {/* Profile-style Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] overflow-hidden mb-6 relative">
            
            {/* Status badge moved to top-right or bottom-right as requested */}
            <div className="absolute bottom-6 right-6 hidden sm:block">
              <span className={`px-3 py-1.5 text-xs font-black rounded-lg uppercase tracking-wider shadow-sm border ${
                isActive
                  ? 'bg-green-100 border-green-200 text-green-700 dark:bg-green-900/40 dark:border-green-800/60 dark:text-green-400'
                  : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
              }`}>
                {isActive ? '● Active' : '⏸ Paused'}
              </span>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="flex-shrink-0 relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:ring-2 hover:ring-brand-400 transition-all"
                      onClick={() => isEditing && setShowAvatarPicker(true)}
                      title={isEditing ? 'Click to change avatar' : ''}
                    />
                  ) : avatarSvg ? (
                    <div
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:ring-2 hover:ring-brand-400 transition-all"
                      dangerouslySetInnerHTML={{ __html: avatarSvg }}
                      onClick={() => isEditing && setShowAvatarPicker(true)}
                      title={isEditing ? 'Click to change avatar' : ''}
                    />
                  ) : (
                    <div
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-brand-100 dark:bg-brand-900/20 border-2 ${isEditing ? 'border-dashed border-brand-300 dark:border-brand-700 cursor-pointer hover:border-brand-500' : 'border-brand-200 dark:border-brand-800/30'} flex items-center justify-center transition-all`}
                      onClick={() => isEditing && setShowAvatarPicker(true)}
                    >
                      <span className="text-3xl">💼</span>
                    </div>
                  )}
                </div>

                {/* Title & meta */}
                <div className="flex-grow min-w-0">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{role.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
                    <span className="capitalize">{category || 'General'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span>{workSetting === 'remote' ? '💻 Remote' : workSetting === 'hybrid' ? '🔄 Hybrid' : '🏢 On-site'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span>{compensation === 'paid' ? '💰 Paid' : compensation === 'credit' ? '📚 Credit' : '🎓 Unpaid'}</span>
                    {hoursPerWeek && <><span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span><span>⏰ {hoursPerWeek} hrs/wk</span></>}
                  </div>
                  {description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 max-w-xl leading-relaxed">{description}</p>
                  )}
                  
                  {/* Status badge - Mobile Only */}
                  <div className="mt-3 sm:hidden">
                    <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider border ${
                      isActive
                        ? 'bg-green-100 border-green-200 text-green-700 dark:bg-green-900/40 dark:border-green-800/60 dark:text-green-400'
                        : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                    }`}>
                      {isActive ? '● Active' : '⏸ Paused'}
                    </span>
                  </div>
                </div>

                {/* Edit actions */}
                <div className="flex gap-2 flex-shrink-0 self-start z-10 w-full sm:w-auto mt-4 sm:mt-0">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full sm:w-auto rounded-xl shadow-sm">
                      ✏️ Edit Role Info
                    </Button>
                  ) : (
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <Button onClick={() => { setIsEditing(false); setShowAvatarPicker(false) }} variant="outline" className="rounded-xl">Cancel</Button>
                      <Button onClick={handleSave} disabled={isSaving} className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md">
                        {isSaving ? 'Saving…' : '💾 Save Changes'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Avatar Picker (shown in edit mode) */}
          {showAvatarPicker && isEditing && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] overflow-hidden mb-6 animate-fade-in-up">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Choose Avatar</h3>
                  <button onClick={() => setShowAvatarPicker(false)} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕ Close</button>
                </div>

                {/* AI Generate option */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">✨ AI Generated</p>
                  
                  {previewAvatarUrl && (
                    <div className="mb-4">
                      <p className="text-[11px] font-bold text-slate-500 mb-2">Preview (Click to select)</p>
                      <button 
                        onClick={() => { 
                          setAvatarUrl(previewAvatarUrl)
                          setAvatarSvg(null)
                          setPreviewAvatarUrl(null)
                          setShowAvatarPicker(false) 
                        }}
                        className="w-32 h-32 rounded-xl overflow-hidden border-2 border-brand-500 shadow-md hover:scale-105 transition-transform relative cursor-pointer group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewAvatarUrl} alt="Generated Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white font-bold text-xs bg-black/50 px-2 py-1 rounded">Select</span>
                        </div>
                      </button>
                    </div>
                  )}

                  {generationError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-xs rounded-xl font-semibold border border-red-200 dark:border-red-800">
                      ⚠️ {generationError}
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      setIsGeneratingAvatar(true)
                      setGenerationError(null)
                      try {
                        const result = await generateAndUploadRoleImageAction({ title, category, description })
                        if (result.url) { 
                          setPreviewAvatarUrl(result.url)
                        } else {
                          setGenerationError(result.error || 'Failed to generate image.')
                        }
                      } catch (err) { 
                        console.error('[Avatar] Generate failed:', err)
                        setGenerationError('An unexpected error occurred.')
                      }
                      setIsGeneratingAvatar(false)
                    }}
                    disabled={isGeneratingAvatar}
                    className="px-4 py-3 rounded-xl border-2 border-dashed border-brand-300 dark:border-brand-700 text-sm font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors disabled:opacity-50 w-full"
                  >
                    {isGeneratingAvatar ? '✨ Generating custom avatar with AI…' : '🎨 Generate Unique Avatar with AI'}
                  </button>
                </div>

                {/* Prebuilt gallery */}
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">📦 Prebuilt Avatars</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 max-h-60 overflow-y-auto p-4 custom-scrollbar">
                  {PREBUILT_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setShowFullPreviewModal(url)}
                      className="group flex flex-col items-center p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all aspect-square relative"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Avatar option ${i + 1}`} className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm transition-opacity">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                          Preview
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Full Preview Modal */}
          {showFullPreviewModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in" onClick={() => setShowFullPreviewModal(null)}>
              <div 
                className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 max-w-sm w-full shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-800"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">Avatar Preview</h3>
                  <button onClick={() => setShowFullPreviewModal(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    ✕
                  </button>
                </div>
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={showFullPreviewModal} alt="Full Preview" className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => {
                    setAvatarUrl(showFullPreviewModal)
                    setAvatarSvg(null)
                    setShowFullPreviewModal(null)
                    setShowAvatarPicker(false)
                  }}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all"
                >
                  Select This Avatar
                </button>
              </div>
            </div>
          )}

          {/* Content Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] overflow-hidden">

            {/* Basic Info */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-brand-50/30 dark:bg-transparent">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Role Details</h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none text-slate-900 dark:text-white">
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
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Compensation</label>
                      <select value={compensation} onChange={(e) => setCompensation(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none text-slate-900 dark:text-white">
                        <option value="paid">Paid (Hourly)</option>
                        <option value="unpaid">Unpaid (Experience)</option>
                        <option value="credit">School Credit</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Work Setting</label>
                      <select value={workSetting} onChange={(e) => setWorkSetting(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none text-slate-900 dark:text-white">
                        <option value="onsite">On-site</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="remote">Remote</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Hours/Week</label>
                      <input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white" />
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Listing Status</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{isActive ? 'Visible to students' : 'Hidden from students'}</p>
                    </div>
                    <button
                      onClick={() => setIsActive(!isActive)}
                      className={`relative w-12 h-7 rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${isActive ? 'translate-x-5' : ''}`}></span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium capitalize">{category || 'General'}</span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">{compensationLabel(compensation)}</span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">{settingLabel(workSetting)}</span>
                  {hoursPerWeek && <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">⏰ {hoursPerWeek} hrs/week</span>}
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">📅 Posted {new Date(role.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Description</h3>
              {isEditing ? (
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white resize-y" />
              ) : (
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {role.description || 'No description provided.'}
                </p>
              )}
            </div>

            {/* Skills */}
            {role.required_skills && role.required_skills.length > 0 && (
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {role.required_skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-sm font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="p-6 md:p-8">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{role.hours_per_week || '—'}</span>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Hrs/Week</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{role.hourly_rate ? `$${role.hourly_rate}` : role.compensation === 'paid' ? '—' : 'N/A'}</span>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Hourly Rate</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{settingLabel(role.work_setting).replace(/^.+\s/, '')}</span>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Setting</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center mt-6">
            <Link href="/employer">
              <Button variant="outline" className="rounded-xl">← Back to Dashboard</Button>
            </Link>
            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(false)} variant="outline" className="rounded-xl">Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving} className="rounded-xl">
                  {isSaving ? 'Saving…' : '💾 Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
