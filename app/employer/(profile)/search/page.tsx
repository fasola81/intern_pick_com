"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { searchCandidates, getEmployerRoles, inviteStudentToRole } from '@/app/actions'

type Candidate = {
  id: string
  name: string
  highSchool: string
  interests: string[]
  skills: string[]
  zipCode: string
}

type Role = {
  id: string
  title: string
  is_active: boolean
}

export default function EmployerSearchPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    const [cRes, rRes] = await Promise.all([
      searchCandidates(query || undefined),
      getEmployerRoles(),
    ])
    setCandidates(cRes.data || [])
    setRoles((rRes.data || []) as Role[])
    setIsLoading(false)
  }, [query])

  useEffect(() => { fetchData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => { fetchData() }, 400)
    return () => clearTimeout(timeout)
  }, [query, fetchData])

  const handleInvite = async () => {
    if (!selectedCandidate || !selectedRoleId) return
    setIsSending(true)
    setInviteStatus(null)
    const result = await inviteStudentToRole({
      studentId: selectedCandidate.id,
      opportunityId: selectedRoleId,
      message: inviteMessage || undefined,
    })
    if (result.success) {
      setInviteStatus({ type: 'success', text: 'Invitation sent!' })
      setSelectedRoleId('')
      setInviteMessage('')
    } else {
      setInviteStatus({ type: 'error', text: result.error || 'Failed to send invitation.' })
    }
    setIsSending(false)
  }

  const getAvatarUrl = (name: string) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`

  const interestColors: Record<string, string> = {
    technology: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    marketing: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
    arts: 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300',
    finance: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    health: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
  }

  const getTagColor = (tag: string) => {
    const lower = tag.toLowerCase()
    for (const [key, cls] of Object.entries(interestColors)) {
      if (lower.includes(key)) return cls
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">

      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, school, skills, or interests…"
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
          />
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {isLoading ? 'Searching…' : `${candidates.length} candidate${candidates.length !== 1 ? 's' : ''} found`}
        </div>
      </div>

      {/* Master-Detail Layout */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        </div>
      ) : candidates.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No candidates found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            {query ? `No students match "${query}". Try broadening your search.` : 'No student profiles available yet.'}
          </p>
        </div>
      ) : (
        <div className={`flex gap-6 ${selectedCandidate ? '' : ''}`}>

          {/* Left: Candidate List */}
          <div className={`${selectedCandidate ? 'w-full lg:w-[380px] flex-shrink-0' : 'w-full'} transition-all`}>
            <div className={`${selectedCandidate ? 'flex flex-col gap-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
              {candidates.map((c) => {
                const isSelected = selectedCandidate?.id === c.id
                return (
                  <div
                    key={c.id}
                    onClick={() => { setSelectedCandidate(c); setInviteStatus(null); setSelectedRoleId(''); setInviteMessage('') }}
                    className={`bg-white dark:bg-slate-900 border shadow-sm transition-all group cursor-pointer ${
                      selectedCandidate
                        ? `rounded-xl p-4 flex items-center gap-3 ${isSelected ? 'border-brand-400 dark:border-brand-500 bg-brand-50/50 dark:bg-brand-900/10 ring-2 ring-brand-400/30' : 'border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700'}`
                        : 'rounded-[2rem] p-6 flex flex-col gap-4 hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`${selectedCandidate ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0`}>
                      <img src={getAvatarUrl(c.name)} alt={c.name} className="w-full h-full object-cover" />
                    </div>

                    {selectedCandidate ? (
                      /* Compact list view */
                      <div className="min-w-0">
                        <h3 className={`font-bold leading-tight truncate text-sm ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400'} transition-colors`}>{c.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.highSchool || 'High School Student'}</p>
                      </div>
                    ) : (
                      /* Grid card view */
                      <>
                        <div className="flex items-center gap-3 -mt-1">
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 dark:text-white leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">{c.name}</h3>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                              {c.highSchool || 'High School Student'}
                              {c.zipCode && <span className="ml-1">• {c.zipCode}</span>}
                            </p>
                          </div>
                        </div>

                        {c.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {c.interests.slice(0, 4).map((interest) => (
                              <span key={interest} className={`px-2.5 py-1 text-xs font-bold rounded-md ${getTagColor(interest)}`}>{interest}</span>
                            ))}
                            {c.interests.length > 4 && (
                              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">+{c.interests.length - 4}</span>
                            )}
                          </div>
                        )}

                        {c.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {c.skills.slice(0, 3).map((skill) => (
                              <span key={skill} className="px-2.5 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-xs font-bold rounded-md">{skill}</span>
                            ))}
                            {c.skills.length > 3 && (
                              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">+{c.skills.length - 3}</span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Detail Panel (inline, not overlay) */}
          {selectedCandidate && (
            <div className="hidden lg:block flex-1 min-w-0 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-24">

                {/* Panel Header */}
                <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Candidate Profile</h2>
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">

                  {/* Avatar + Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                      <img src={getAvatarUrl(selectedCandidate.name)} alt={selectedCandidate.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedCandidate.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{selectedCandidate.highSchool || 'High School Student'}</p>
                      {selectedCandidate.zipCode && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">📍 {selectedCandidate.zipCode}</p>
                      )}
                    </div>
                  </div>

                  {/* Interests */}
                  {selectedCandidate.interests.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.interests.map((interest) => (
                          <span key={interest} className={`px-3 py-1.5 text-sm font-medium rounded-full ${getTagColor(interest)}`}>{interest}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {selectedCandidate.skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map((skill) => (
                          <span key={skill} className="px-3 py-1.5 text-sm font-medium rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="h-px bg-slate-200 dark:bg-slate-800"></div>

                  {/* ======= Invite to Role ======= */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-lg">✉️</span> Invite to Apply
                    </h4>

                    {roles.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">You haven't posted any roles yet.</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Create a role first to invite candidates.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Select Role</label>
                          <select
                            value={selectedRoleId}
                            onChange={(e) => setSelectedRoleId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none text-slate-900 dark:text-white"
                          >
                            <option value="">Choose a role…</option>
                            {roles.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.title}{r.is_active ? '' : ' (Paused)'}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                            Personal Note <span className="text-slate-400 font-normal">(optional)</span>
                          </label>
                          <textarea
                            value={inviteMessage}
                            onChange={(e) => setInviteMessage(e.target.value)}
                            rows={3}
                            placeholder="Hi! We think you'd be a great fit for our team…"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white resize-none"
                          />
                        </div>

                        {inviteStatus && (
                          <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
                            inviteStatus.type === 'success'
                              ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/30'
                              : 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/30'
                          }`}>
                            {inviteStatus.text}
                          </div>
                        )}

                        <button
                          onClick={handleInvite}
                          disabled={isSending || !selectedRoleId}
                          className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSending ? (
                            <>
                              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                              Sending…
                            </>
                          ) : (
                            <>🚀 Send Invitation</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============ Mobile Side Panel (for smaller screens) ============ */}
      {selectedCandidate && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedCandidate(null)}
          ></div>

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Candidate Profile</h2>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                  <img src={getAvatarUrl(selectedCandidate.name)} alt={selectedCandidate.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedCandidate.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedCandidate.highSchool || 'High School Student'}</p>
                  {selectedCandidate.zipCode && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">📍 {selectedCandidate.zipCode}</p>}
                </div>
              </div>
              {selectedCandidate.interests.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.interests.map((interest) => (
                      <span key={interest} className={`px-3 py-1.5 text-sm font-medium rounded-full ${getTagColor(interest)}`}>{interest}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedCandidate.skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 text-sm font-medium rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">✉️</span> Invite to Apply
                </h4>
                {roles.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">No roles yet. Create one first.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <select value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none text-slate-900 dark:text-white">
                      <option value="">Choose a role…</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>{r.title}{r.is_active ? '' : ' (Paused)'}</option>
                      ))}
                    </select>
                    <textarea value={inviteMessage} onChange={(e) => setInviteMessage(e.target.value)} rows={2}
                      placeholder="Add a personal note…"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white resize-none" />
                    {inviteStatus && (
                      <div className={`px-4 py-3 rounded-xl text-sm font-medium ${inviteStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {inviteStatus.text}
                      </div>
                    )}
                    <button onClick={handleInvite} disabled={isSending || !selectedRoleId}
                      className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isSending ? 'Sending…' : '🚀 Send Invitation'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
