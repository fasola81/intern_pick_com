"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getActiveOpportunities, applyForOpportunity, uploadStudentVideo } from '@/app/actions'
import VideoRecorder from '@/components/VideoRecorder'
import VideoLibrary from '@/components/VideoLibrary'
import RolePrep from '@/components/RolePrep'

export default function StudentDashboard() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [applyNote, setApplyNote] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [appliedRoles, setAppliedRoles] = useState<Record<string, boolean>>({})
  const [dbOpportunities, setDbOpportunities] = useState<any[]>([])
  const [showVideoSection, setShowVideoSection] = useState(false)
  const [videoTab, setVideoTab] = useState<'library' | 'record'>('library')
  const [selectedVideoId, setSelectedVideoId2] = useState<string | null>(null)
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedRoleRequiresVideo, setSelectedRoleRequiresVideo] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [savedRoles, setSavedRoles] = useState<Record<string, boolean>>({})
  const [readMoreRole, setReadMoreRole] = useState<any | null>(null)

  // Fallback demo data when DB returns nothing
  const fallbackOpportunities = [
    {
      id: 'demo-1', title: 'Social Media Intern', category: 'marketing',
      description: 'Looking for a creative student to help manage our social media presence (Instagram, TikTok) and design local promotional campaigns.',
      compensation: 'paid', hourly_rate: 15, work_setting: 'onsite', hours_per_week: 15,
      companies: { company_name: 'Springfield Coffee Co.', industry: 'food' },
    },
    {
      id: 'demo-2', title: 'Digital Marketing Trainee', category: 'marketing',
      description: 'Learn SEO, content strategy, and paid ads by shadowing our senior marketing managers. Great opportunity to build a portfolio.',
      compensation: 'credit', hourly_rate: null, work_setting: 'remote', hours_per_week: 10,
      companies: { company_name: 'TechFlow Agency', industry: 'tech' },
    },
  ]

  useEffect(() => {
    async function fetchOpportunities() {
      const result = await getActiveOpportunities()
      if (result.success && result.data.length > 0) {
        console.log('[Feed] Loaded', result.data.length, 'opportunities from DB')
        setDbOpportunities(result.data)
      } else {
        console.log('[Feed] No DB results, using demo data')
      }
    }
    fetchOpportunities()
  }, [])

  const handleApply = async () => {
    setIsApplying(true)
    
    let dbSuccess = false
    if (selectedRoleId) {
      const result = await applyForOpportunity({
        opportunityId: selectedRoleId,
        note: applyNote || undefined,
        videoId: selectedVideoId || undefined,
      })
      console.log('[Apply] Result:', result)
      dbSuccess = result.success
    }

    if (selectedRole && dbSuccess) {
      setAppliedRoles(prev => ({ ...prev, [selectedRole]: true }))
    } else if (!dbSuccess) {
      console.warn('[Apply] DB insert failed — not marking as applied')
    }

    setIsApplying(false)
    setSelectedRole(null)
    setSelectedRoleId(null)
    setApplyNote('')
    setShowVideoSection(false)
    setVideoTab('library')
    setSelectedVideoId2(null)
    setSelectedVideoTitle(null)
    setSelectedRoleRequiresVideo(false)
  }

  const handleVideoReady = async (blob: Blob, durationSeconds: number) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('video', new File([blob], 'intro.webm', { type: 'video/webm' }))
      formData.append('title', `Intro for ${selectedRole || 'role'}`)
      formData.append('duration', String(durationSeconds))

      const result = await uploadStudentVideo(formData)
      console.log('[Video] Upload result:', result)

      if (result.success && result.videoId) {
        setSelectedVideoId2(result.videoId)
        setSelectedVideoTitle(`Intro for ${selectedRole || 'role'}`)
        setVideoTab('library')
      }
    } catch (err) {
      console.error('[Video] Upload failed:', err)
    }
    setIsUploading(false)
  }
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* 1. LEFT SIDEBAR (Identity & Navigation) */}
          <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6 order-2 lg:order-1">
            
            {/* Identity Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-brand-100 to-brand-50 dark:from-brand-900/50 dark:to-slate-800 rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-white dark:border-slate-900 shadow-md">
                👨‍🎓
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Alex Chen</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">Senior • Marketing Major<br/>Springfield University</p>
              
              <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-slate-500">
                  <span>Profile Strength</span>
                  <span className="text-brand-600 dark:text-brand-400">85%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 w-[85%] rounded-full"></div>
                </div>
              </div>

              <Button variant="outline" className="w-full rounded-xl text-sm h-9 hover:bg-slate-50 dark:hover:bg-slate-800">
                Edit Profile
              </Button>
            </div>

            {/* Navigation Menu (Social Style) */}
            <nav className="bg-white dark:bg-slate-900 rounded-[2rem] p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <Link href="/student" className="flex items-center gap-3 px-4 py-3 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 rounded-xl font-bold transition-colors">
                <span className="text-xl">🏠</span>
                Home Feed
              </Link>
              <Link href="/student/messages" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold transition-colors group">
                <span className="text-xl group-hover:scale-110 transition-transform">💬</span>
                Messages
                <span className="ml-auto bg-brand-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">2</span>
              </Link>
              <Link href="/student/applications" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold transition-colors group">
                <span className="text-xl group-hover:scale-110 transition-transform">📄</span>
                Applications
              </Link>
              <Link href="/student/saved" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold transition-colors group">
                <span className="text-xl group-hover:scale-110 transition-transform">🔖</span>
                Saved Roles
              </Link>
            </nav>

          </aside>

          {/* 2. CENTER FEED (Discovery) */}
          <div className="flex-grow flex flex-col gap-6 order-1 lg:order-2 overflow-hidden">
            
            {/* Friendly Welcome Header */}
            <section className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2rem] p-6 md:p-8 text-white shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">🚀</div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
                Good morning, Alex! 
              </h1>
              <p className="text-brand-100 max-w-md">
                You have <span className="font-bold text-white">{dbOpportunities.length || 2} highly rated matches</span> waiting for you today based on your profile.
              </p>
            </section>

            {/* Intuitive Browsing Categories / Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar snap-x">
              {[
                { key: 'all', label: 'For You' },
                { key: 'marketing', label: 'Marketing' },
                { key: 'local', label: 'Local (Under 5mi)' },
                { key: 'remote', label: 'Remote Only' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`snap-start px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                    activeFilter === f.key
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            
            {/* The Match Engine Feed */}
            <section className="flex flex-col gap-6 pb-10">
              
              {(dbOpportunities.length > 0 ? dbOpportunities : fallbackOpportunities)
                .filter((opp: any) => {
                  if (activeFilter === 'all') return true
                  if (activeFilter === 'marketing') return opp.category === 'marketing'
                  if (activeFilter === 'local') return opp.work_setting === 'onsite'
                  if (activeFilter === 'remote') return opp.work_setting === 'remote'
                  return true
                })
                .map((opp: any, index: number) => {
                const title = opp.title || 'Untitled Role'
                const companyName = opp.companies?.company_name || 'Local Business'
                const desc = opp.description || 'No description available.'
                const compType = opp.compensation || 'unpaid'
                const rate = opp.hourly_rate
                const setting = opp.work_setting || 'onsite'
                const oppId = opp.id || `demo-${index}`
                const matchScore = Math.max(70, Math.min(99, 98 - index * 2))
                
                const compLabel = compType === 'paid' && rate ? `Paid ($${rate}/hr)` : compType === 'credit' ? 'School Credit' : compType === 'paid' ? 'Paid' : 'Unpaid'
                const settingLabel = setting === 'onsite' ? 'On-site' : setting === 'hybrid' ? 'Hybrid' : 'Remote'
                
                const categoryEmojis: Record<string, string> = {
                  marketing: '📱', tech: '💻', admin: '📋', arts: '🎨',
                  finance: '💰', education: '📚', health: '🏥', other: '🌟',
                }
                const emoji = categoryEmojis[opp.category] || '🚀'
                const bgColors: Record<string, string> = {
                  marketing: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800/50',
                  tech: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50',
                  admin: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/50',
                  arts: 'bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800/50',
                  finance: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50',
                  education: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800/50',
                }
                const iconBg = bgColors[opp.category] || 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'

                return (
                  <div key={oppId} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 hover:shadow-lg transition-all duration-300 group" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center text-2xl border`}>{emoji}</div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{title}</h3>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{companyName} • {settingLabel}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          setSavedRoles(prev => ({ ...prev, [oppId]: !prev[oppId] }))
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${savedRoles[oppId] ? 'text-brand-500 bg-brand-50 dark:bg-brand-900/30 scale-110' : 'text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/30'}`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={savedRoles[oppId] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                      </button>
                    </div>
                    
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 border ${
                        matchScore >= 90 ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800/30'
                        : 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 border-brand-200 dark:border-brand-800/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${matchScore >= 90 ? 'bg-green-500' : 'bg-brand-500'}`}></span> {matchScore}% Match
                      </span>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-md text-xs font-semibold">{compLabel}</span>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-md text-xs font-semibold">{settingLabel}</span>
                      {opp.hours_per_week && (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-md text-xs font-semibold">{opp.hours_per_week} hrs/wk</span>
                      )}
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3">
                      {desc}
                    </p>

                    <div className="flex gap-3">
                      <Button 
                        onClick={() => {
                          setSelectedRole(title)
                          setSelectedRoleId(oppId)
                          const requiresVid = opp.requires_video === true
                          setSelectedRoleRequiresVideo(requiresVid)
                          if (requiresVid) setShowVideoSection(true)
                        }}
                        disabled={appliedRoles[title]}
                        className="flex-1 rounded-xl shadow-md shadow-brand-500/20 group-hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {appliedRoles[title] ? "✅ Applied" : "⚡ Quick Apply"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setReadMoreRole(readMoreRole?.id === oppId ? null : { id: oppId, title, companyName, desc, compLabel, settingLabel, matchScore, category: opp.category, skills: opp.required_skills, hoursPerWeek: opp.hours_per_week })}
                        className="rounded-xl px-4 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {readMoreRole?.id === oppId ? 'Show Less' : 'Read More'}
                      </Button>
                    </div>
                    {/* Read More Expanded Detail */}
                    {readMoreRole?.id === oppId && (
                      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                            <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">📋 Category</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{readMoreRole.category || 'General'}</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                            <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">⏰ Hours</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{readMoreRole.hoursPerWeek ? `${readMoreRole.hoursPerWeek} hrs/week` : 'Flexible'}</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 mb-4">
                          <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-2">📝 Full Description</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{readMoreRole.desc}</p>
                        </div>
                        {readMoreRole.skills && readMoreRole.skills.length > 0 && (
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                            <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-2">🛠 Required Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {readMoreRole.skills.map((skill: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded-full text-xs font-semibold border border-brand-200 dark:border-brand-800/30">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

            </section>
          </div>

          {/* 3. RIGHT SIDEBAR (Action & Status) */}
          <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6 order-3">
            
            {/* AI Resume Builder Prompt */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden group border border-indigo-800 cursor-pointer hover:border-brand-400 transition-colors">
               <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl pointer-events-none group-hover:scale-110 transition-transform duration-500">✨</div>
               <h3 className="text-lg font-bold mb-2">Build your AI Resume</h3>
               <p className="text-sm text-indigo-200 mb-4 leading-relaxed">
                 Paste in your school projects and hobbies, and we'll format it into a professional summary instantly.
               </p>
               <Link href="/student/resume">
                 <Button className="w-full bg-white text-indigo-900 hover:bg-brand-50 rounded-xl font-bold shadow-sm">
                   Try it now &rarr;
                 </Button>
               </Link>
            </div>

            {/* Incoming Chats Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                  </span>
                  New Messages
                </h3>
              </div>
              <div className="p-2">
                <Link href="/student/messages" className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                   <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-lg flex-shrink-0">
                     🦷
                   </div>
                   <div className="min-w-0">
                     <p className="font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-brand-600 transition-colors">Springfield Dental</p>
                     <p className="text-xs text-slate-500 truncate mt-0.5">"Hi Alex! We loved your profile. Are you..."</p>
                   </div>
                </Link>
              </div>
            </div>

            {/* Active Applications Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-slate-900 dark:text-white">Active Applications</h3>
                <span className="text-xs font-bold text-slate-400">2</span>
              </div>
              <div className="p-2 flex flex-col gap-1">
                
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                   <div className="flex items-center gap-3 min-w-0">
                     <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-sm border border-orange-200 dark:border-orange-800/50">🥐</div>
                     <div className="min-w-0">
                       <p className="font-bold text-slate-900 dark:text-white text-sm truncate">Sweet Bites Bakery</p>
                       <p className="text-[10px] text-slate-500 truncate uppercase tracking-wide font-bold mt-0.5">Under Review</p>
                     </div>
                   </div>
                </div>

              </div>
            </div>

          </aside>

          {/* Apply Modal */}
          {selectedRole && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Apply for Role</h3>
                  <button 
                    onClick={() => {
                        setSelectedRole(null)
                        setApplyNote('')
                        setShowVideoSection(false)
                        setSelectedVideoId2(null)
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow">
                  <div className="mb-5 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-800/30">
                    <p className="text-sm font-medium text-brand-800 dark:text-brand-300">
                      You are applying for <span className="font-bold">{selectedRole}</span>. Your InternPick profile will be shared with the employer.
                    </p>
                  </div>

                  {/* AI Role Prep */}
                  {selectedRoleId && (
                    <RolePrep
                      opportunityId={selectedRoleId}
                      opportunityTitle={selectedRole || ''}
                    />
                  )}

                  {/* Note section */}
                  <div className="space-y-3 mb-5">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Add a quick note <span className="text-slate-400 font-medium normal-case">(Optional)</span>
                    </label>
                    <textarea 
                      className="w-full h-20 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none transition-all shadow-inner"
                      placeholder="e.g. I live just down the street and would love to help out!"
                      value={applyNote}
                      onChange={(e) => setApplyNote(e.target.value)}
                    />
                  </div>

                  {/* Video section */}
                  <div className="mb-6">
                    {/* Toggle button */}
                    <button
                      onClick={() => setShowVideoSection(!showVideoSection)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                        showVideoSection || selectedVideoId
                          ? 'border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📹</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {selectedVideoId ? 'Video attached' : selectedRoleRequiresVideo ? '📹 Video introduction' : 'Add a video intro'}
                        </span>
                        {selectedRoleRequiresVideo ? (
                          <span className="text-[11px] text-red-500 font-bold">(Required)</span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">(Optional)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedVideoId && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Attached
                          </span>
                        )}
                        <svg className={`w-4 h-4 text-slate-400 transition-transform ${showVideoSection ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded video section */}
                    {showVideoSection && (
                      <div className="mt-3 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => setVideoTab('library')}
                            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                              videoTab === 'library'
                                ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 bg-brand-50/50 dark:bg-brand-900/20'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                          >
                            📁 My Videos
                          </button>
                          <button
                            onClick={() => setVideoTab('record')}
                            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                              videoTab === 'record'
                                ? 'text-red-600 dark:text-red-400 border-b-2 border-red-500 bg-red-50/50 dark:bg-red-900/20'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                          >
                            🔴 Record New
                          </button>
                        </div>

                        {/* Tab content */}
                        <div className="p-3">
                          {videoTab === 'library' ? (
                            <VideoLibrary
                              selectedVideoId={selectedVideoId}
                              onSelect={(video) => {
                                setSelectedVideoId2(video.id)
                                setSelectedVideoTitle(video.title)
                              }}
                              onRecordNew={() => setVideoTab('record')}
                            />
                          ) : (
                            <div>
                              {isUploading ? (
                                <div className="flex flex-col items-center justify-center py-8 gap-3">
                                  <svg className="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  <p className="text-sm font-medium text-slate-500">Uploading your video…</p>
                                </div>
                              ) : (
                                <VideoRecorder
                                  onVideoReady={handleVideoReady}
                                  onCancel={() => setVideoTab('library')}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Selected video preview */}
                    {selectedVideoId && selectedVideoTitle && !showVideoSection && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
                        <span className="text-lg">🎥</span>
                        <span className="text-xs font-bold text-green-700 dark:text-green-300 flex-grow truncate">{selectedVideoTitle}</span>
                        <button
                          onClick={() => { setSelectedVideoId2(null); setSelectedVideoTitle(null) }}
                          className="text-xs text-red-500 hover:text-red-700 font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                          setSelectedRole(null)
                          setApplyNote('')
                          setShowVideoSection(false)
                          setSelectedVideoId2(null)
                      }} 
                      className="flex-1 rounded-xl py-6 font-bold border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleApply} 
                      disabled={isApplying || isUploading || (selectedRoleRequiresVideo && !selectedVideoId)}
                      className="flex-1 rounded-xl py-6 font-bold bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25 transition-all text-white disabled:opacity-70 disabled:cursor-wait"
                    >
                      {isApplying ? (
                        <span className="flex items-center gap-2 justify-center">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Sending…
                        </span>
                      ) : (
                        selectedVideoId ? '🎬 Submit with Video' : 'Submit Application'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
