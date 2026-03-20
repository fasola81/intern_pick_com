"use client"

import React, { useState, useEffect } from 'react'
import { getCandidatesByRole, updateCandidateStatus, sendCandidateMessage, getCandidateMessages, draftEmployerMessageAction } from '@/app/actions'

type CandidateMsg = { id: string; sender_id: string; sender_role: string; text: string; created_at: string }
type Candidate = {
  interestId: string; studentId: string; name: string; highSchool: string; roleTitle?: string;
  skills: string[]; interests: string[]; status: string; note: string | null; appliedAt: string
}
type RoleGroup = { id: string; title: string; category: string; is_active: boolean; candidates: Candidate[] }

function KanbanGridColumn({ title, items, color, faded, handleReject, openDm, setProposeCandidate, getAvatarUrl }: any) {
  const colorConfig: Record<string, { bg: string, border: string, text: string, badgeBg: string }> = {
    slate: { bg: 'bg-slate-50/50 dark:bg-slate-900/20', border: 'border-slate-200/50 dark:border-slate-800', text: 'text-slate-700 dark:text-slate-300', badgeBg: 'bg-slate-200/60 dark:bg-slate-800' },
    blue: { bg: 'bg-blue-50/30 dark:bg-blue-900/10', border: 'border-blue-100/50 dark:border-blue-900/30', text: 'text-blue-700 dark:text-blue-400', badgeBg: 'bg-blue-100 dark:bg-blue-900/50' },
    purple: { bg: 'bg-purple-50/30 dark:bg-purple-900/10', border: 'border-purple-100/50 dark:border-purple-900/30', text: 'text-purple-700 dark:text-purple-400', badgeBg: 'bg-purple-100 dark:bg-purple-900/50' },
    green: { bg: 'bg-green-50/30 dark:bg-green-900/10', border: 'border-green-100/50 dark:border-green-900/30', text: 'text-green-700 dark:text-green-400', badgeBg: 'bg-green-100 dark:bg-green-900/50' },
    amber: { bg: 'bg-amber-50/30 dark:bg-amber-900/10', border: 'border-amber-100/50 dark:border-amber-900/30', text: 'text-amber-700 dark:text-amber-400', badgeBg: 'bg-amber-100 dark:bg-amber-900/50' },
    teal: { bg: 'bg-teal-50/30 dark:bg-teal-900/10', border: 'border-teal-100/50 dark:border-teal-900/30', text: 'text-teal-700 dark:text-teal-500', badgeBg: 'bg-teal-100 dark:bg-teal-900/50' },
  }
  const colors = colorConfig[color] || colorConfig.slate;

  return (
    <div className={`flex flex-col h-full rounded-2xl border ${colors.bg} ${colors.border} ${faded ? 'opacity-60 hover:opacity-100' : ''}`}>
      <div className={`px-2 py-3 flex flex-col items-center justify-between h-[4.5rem] lg:h-20 border-b ${colors.border} gap-1`}>
        <h4 className={`font-bold text-[11px] lg:text-xs uppercase tracking-wider text-center line-clamp-2 leading-tight ${colors.text}`}>{title}</h4>
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${colors.badgeBg} ${colors.text}`}>{items.length}</span>
      </div>
      <div className="flex-1 p-1.5 lg:p-2 overflow-y-auto overflow-x-hidden hide-scrollbar flex flex-col gap-2 relative">
        {items.length === 0 ? (
          <div className="py-4 text-center text-[10px] text-slate-400 border border-dashed border-slate-200/50 dark:border-slate-800 rounded-xl">Empty</div>
        ) : (
          items.map((c: any) => (
            <MiniCandidateCard key={c.interestId} c={c} handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} currentStage={title} />
          ))
        )}
      </div>
    </div>
  )
}

function MiniCandidateCard({ c, handleReject, openDm, setProposeCandidate, getAvatarUrl, currentStage }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 flex flex-col gap-2 hover:shadow-md transition-shadow relative group">
      <div className="flex flex-col xl:flex-row items-center xl:items-start gap-2 text-center xl:text-left">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700 mx-auto xl:mx-0">
          <img src={getAvatarUrl(c.name)} alt={c.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1 w-full">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate" title={c.name}>{c.name.split(' ')[0]}</h4>
          {c.matchScore !== undefined && (
            <div className={`mt-0.5 text-[9px] font-black inline-block px-1 rounded-sm border ${
              c.matchScore >= 80 ? 'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800' : 'text-slate-500 border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700'
            }`}>
              {c.matchScore}% 
            </div>
          )}
        </div>
      </div>
      
      {currentStage !== 'Declined' && (
        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute inset-x-2 bottom-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm pt-1 pb-1">
          <button onClick={() => openDm(c)} className="flex-1 py-1 text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 rounded" title="Message">💬</button>
          <button onClick={() => setProposeCandidate(c)} className="flex-1 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded" title="Change Status">⚙️</button>
          <button onClick={() => handleReject(c)} className="flex-1 py-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 rounded" title="Decline">✕</button>
        </div>
      )}
    </div>
  )
}

export default function CandidatesPage() {
  const [roleGroups, setRoleGroups] = useState<RoleGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedRole, setExpandedRole] = useState<string | null>(null)
  const [mobileActiveTab, setMobileActiveTab] = useState<string>('Applied')

  // DM state
  const [dmCandidate, setDmCandidate] = useState<Candidate | null>(null)
  const [dmMessages, setDmMessages] = useState<CandidateMsg[]>([])
  const [dmText, setDmText] = useState('')
  const [dmError, setDmError] = useState('')
  const [isSendingDm, setIsSendingDm] = useState(false)
  const [isLoadingDm, setIsLoadingDm] = useState(false)
  const [isDrafting, setIsDrafting] = useState(false)

  const draftMessage = async (intent: string) => {
    if (!dmCandidate || !dmCandidate.roleTitle) {
      setDmError('Cannot draft without role context.')
      return
    }
    setIsDrafting(true)
    setDmError('')
    const res = await draftEmployerMessageAction(dmCandidate.name, dmCandidate.roleTitle, intent)
    if (res.success && res.data) {
      setDmText(res.data)
    } else {
      setDmError(res.error || 'Failed to draft AI message.')
    }
    setIsDrafting(false)
  }

  // Propose modal
  const [proposeCandidate, setProposeCandidate] = useState<Candidate | null>(null)
  const [isProposing, setIsProposing] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    const res = await getCandidatesByRole()
    setRoleGroups((res.data || []) as RoleGroup[])
    setIsLoading(false)

    // Auto-expand first role with candidates
    const first = (res.data || []).find((r: any) => r.candidates.length > 0)
    if (first) setExpandedRole((first as any).id)
  }

  useEffect(() => { fetchData() }, [])

  const getAvatarUrl = (name: string) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`

  const handleReject = async (c: Candidate) => {
    await updateCandidateStatus(c.interestId, 'declined')
    fetchData()
  }

  const handlePropose = async (c: Candidate) => {
    setIsProposing(true)
    await updateCandidateStatus(c.interestId, 'accepted')
    setIsProposing(false)
    setProposeCandidate(null)
    fetchData()
  }

  const openDm = async (c: Candidate) => {
    setDmCandidate(c)
    setDmText('')
    setDmError('')
    setIsLoadingDm(true)
    const res = await getCandidateMessages(c.interestId)
    setDmMessages((res.data || []) as CandidateMsg[])
    setIsLoadingDm(false)
  }

  const sendDm = async () => {
    if (!dmCandidate || !dmText.trim()) return
    setIsSendingDm(true)
    setDmError('')
    const res = await sendCandidateMessage({
      interestId: dmCandidate.interestId,
      senderRole: 'employer',
      text: dmText.trim(),
    })
    if (res.success) {
      setDmText('')
      const msgs = await getCandidateMessages(dmCandidate.interestId)
      setDmMessages((msgs.data || []) as CandidateMsg[])
    } else {
      setDmError(res.error || 'Message blocked by safety filter.')
    }
    setIsSendingDm(false)
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
      reviewed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
      accepted: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      declined: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300',
    }
    return styles[status] || styles.pending
  }

  const categoryEmojis: Record<string, string> = {
    marketing: '💡', tech: '💻', admin: '📋', arts: '🎨',
    finance: '💰', education: '📚', health: '🏥', food: '☕',
    hospitality: '🛎️', construction: '🔨', other: '📦',
  }

  const totalCandidates = roleGroups.reduce((sum, r) => sum + r.candidates.length, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in-up">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white pl-1">Candidates</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 pl-1 mt-1">
            {totalCandidates} applicant{totalCandidates !== 1 ? 's' : ''} across {roleGroups.length} role{roleGroups.length !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>

      {roleGroups.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No roles posted yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">Post a role first, and candidates who apply will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {roleGroups.map((role) => {
            const enrichedCandidates = role.candidates.map(c => ({ ...c, roleTitle: role.title }))
            const appliedCandidates = enrichedCandidates.filter(c => c.status === 'pending');
            const shortListedCandidates = enrichedCandidates.filter(c => c.status === 'short_listed');
            const offeredCandidates = enrichedCandidates.filter(c => c.status === 'offered');
            const acceptedCandidates = enrichedCandidates.filter(c => c.status === 'accepted');
            const onboardingCandidates = enrichedCandidates.filter(c => c.status === 'onboarding');
            const readyCandidates = enrichedCandidates.filter(c => c.status === 'ready_to_start');
            const declinedCandidates = enrichedCandidates.filter(c => c.status === 'declined');

            return (
              <div key={role.id} className="flex flex-col">
                <div className="flex items-center gap-3 mb-4 px-2">
                  <span className="text-2xl">{categoryEmojis[role.category] || '🚀'}</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{role.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">{role.category}</span>
                      {!role.is_active && <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Paused</span>}
                    </div>
                  </div>
                </div>

                {/* Mobile Dropdown View (hidden on md and up) */}
                <div className="md:hidden flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Stage:</label>
                    <select
                      value={mobileActiveTab}
                      onChange={(e) => setMobileActiveTab(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                      <option value="Declined">Declined ({declinedCandidates.length})</option>
                      <option value="Applied">Applied ({appliedCandidates.length})</option>
                      <option value="Short Listed">Short Listed ({shortListedCandidates.length})</option>
                      <option value="Offered">Offered ({offeredCandidates.length})</option>
                      <option value="Accepted">Accepted ({acceptedCandidates.length})</option>
                      <option value="Onboarding">Onboarding ({onboardingCandidates.length})</option>
                      <option value="Ready to Start">Ready to Start ({readyCandidates.length})</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {(() => {
                      const activeCandidates = 
                        mobileActiveTab === 'Applied' ? appliedCandidates :
                        mobileActiveTab === 'Short Listed' ? shortListedCandidates :
                        mobileActiveTab === 'Offered' ? offeredCandidates :
                        mobileActiveTab === 'Accepted' ? acceptedCandidates :
                        mobileActiveTab === 'Onboarding' ? onboardingCandidates :
                        mobileActiveTab === 'Ready to Start' ? readyCandidates :
                        declinedCandidates;
                        
                      if (activeCandidates.length === 0) {
                        return (
                          <div className="py-12 text-center text-sm text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                            No candidates in {mobileActiveTab}
                          </div>
                        )
                      }
                      
                      return activeCandidates.map((c: any) => (
                        <CandidateCard key={c.interestId} c={c} handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} currentStage={mobileActiveTab} />
                      ))
                    })()}
                  </div>
                </div>

                {/* Desktop Grid View (hidden below md, 7 columns) */}
                <div className="hidden md:grid grid-cols-7 gap-1 lg:gap-2 xl:gap-3 overflow-x-hidden min-h-[60vh] pb-8">
                  <KanbanGridColumn title="Declined" items={declinedCandidates} color="slate" faded handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} />
                  <KanbanGridColumn title="Applied" items={appliedCandidates} color="slate" handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} />
                  <KanbanGridColumn title="Short Listed" items={shortListedCandidates} color="blue" handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} />
                  <KanbanGridColumn title="Offered" items={offeredCandidates} color="purple" handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} />
                  <KanbanGridColumn title="Accepted" items={acceptedCandidates} color="green" handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} />
                  <KanbanGridColumn title="Onboarding" items={onboardingCandidates} color="amber" handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} />
                  <KanbanGridColumn title="Ready to Start" items={readyCandidates} color="teal" handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} />
                </div>
              </div>
            )
          })}
        </div>
      )}


      {/* =========== DM Modal =========== */}
      {dmCandidate && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setDmCandidate(null)}></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-fade-in">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img src={getAvatarUrl(dmCandidate.name)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{dmCandidate.name}</h3>
                    <p className="text-xs text-slate-500">Messages are monitored by AI for safety</p>
                  </div>
                </div>
                <button onClick={() => setDmCandidate(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 min-h-[200px]">
                {isLoadingDm ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                  </div>
                ) : dmMessages.length === 0 ? (
                  <div className="text-center py-8 text-sm text-slate-400 dark:text-slate-500">
                    <p className="text-2xl mb-2">💬</p>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  dmMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_role === 'employer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.sender_role === 'employer'
                          ? 'bg-brand-600 text-white rounded-br-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-md'
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender_role === 'employer' ? 'text-brand-200' : 'text-slate-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3">
                <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar">
                  <button onClick={() => draftMessage('interview')} disabled={isDrafting} className="whitespace-nowrap px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 dark:text-brand-400 text-xs font-bold rounded-lg transition-colors border border-brand-200 dark:border-brand-800/50 disabled:opacity-50">
                    {isDrafting ? '✨ drafting...' : '✨ Interview Invite'}
                  </button>
                  <button onClick={() => draftMessage('offer')} disabled={isDrafting} className="whitespace-nowrap px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 text-xs font-bold rounded-lg transition-colors border border-green-200 dark:border-green-800/50 disabled:opacity-50">
                    {isDrafting ? '✨ drafting...' : '✨ Offer'}
                  </button>
                  <button onClick={() => draftMessage('rejection')} disabled={isDrafting} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-50">
                    {isDrafting ? '✨ drafting...' : '✨ Gentle Decline'}
                  </button>
                </div>
                {dmError && (
                  <div className="mb-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 text-xs font-medium text-red-700 dark:text-red-300">
                    ⚠️ {dmError}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={dmText}
                    onChange={(e) => setDmText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendDm()}
                    placeholder="Type a message…"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={sendDm}
                    disabled={isSendingDm || !dmText.trim()}
                    className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors disabled:opacity-40"
                  >
                    {isSendingDm ? '…' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========== Propose / Offer Modal =========== */}
      {proposeCandidate && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setProposeCandidate(null)}></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 animate-fade-in text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl mx-auto mb-4">🎉</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Offer Position to {proposeCandidate.name}?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                This will move them to your <strong>Hired</strong> section. They will be notified of the offer.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setProposeCandidate(null)}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePropose(proposeCandidate)}
                  disabled={isProposing}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isProposing ? 'Processing…' : '✅ Confirm Offer'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function CandidateCard({ c, handleReject, openDm, setProposeCandidate, getAvatarUrl, currentStage }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] rounded-xl p-4 flex flex-col gap-3 transition-shadow relative group">
      <div className="flex gap-3 relative">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
          <img src={getAvatarUrl(c.name)} alt={c.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 pr-12">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{c.name}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {c.highSchool || 'High School Student'}
          </p>
        </div>
        
        {/* Match Score Badge */}
        {c.matchScore !== undefined && (
          <div className="absolute top-0 right-0 flex flex-col items-end">
            <span className={`px-1.5 py-0.5 text-[10px] font-black rounded-md border ${
              c.matchScore >= 80 ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800/50' : 
              c.matchScore >= 50 ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800/50' : 
              'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}>
              {c.matchScore >= 80 ? '🔥 ' : ''}{c.matchScore}% Fit
            </span>
          </div>
        )}
      </div>
      
      {c.skills && c.skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {c.skills.slice(0, 3).map((skill: string, i: number) => (
            <span key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase rounded-md truncate max-w-[80px]">
              {skill}
            </span>
          ))}
          {c.skills.length > 3 && (
            <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase rounded-md">+{c.skills.length - 3}</span>
          )}
        </div>
      )}

      {/* Note excerpt if exists */}
      {c.note && (
        <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg line-clamp-2 border border-slate-100 dark:border-slate-800">
          "{c.note}"
        </div>
      )}

      <div className="text-[10px] font-medium text-slate-400 mt-1">
        Applied {new Date(c.appliedAt).toLocaleDateString()}
      </div>

      {/* Dynamic Actions Based on Stage  */}
      {currentStage !== 'Declined' && (
        <div className="flex flex-col gap-1.5 mt-2">
          {/* Quick Actions */}
          <div className="flex gap-1.5">
            <button
              onClick={() => openDm(c)}
              className="flex-1 py-1.5 text-xs font-bold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/40 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
            >
              💬 Message
            </button>
            <button
              onClick={() => handleReject(c)}
              className="w-8 flex items-center justify-center py-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Decline"
            >
              ✕
            </button>
          </div>

          {/* Move to Next Stage Menu */}
          <div className="mt-1 flex text-xs flex-col gap-1 w-full relative">
            <select
              defaultValue={c.status}
              onChange={(e) => {
                const map: Record<string, string> = {
                  'short_listed': 'short_listed',
                  'offered': 'offered',
                  'accepted': 'accepted',
                  'onboarding': 'onboarding',
                  'ready_to_start': 'ready_to_start'
                };
                if (map[e.target.value]) {
                   // In a real implementation this calls an async update action
                   // updateCandidateStatus(c.interestId, map[e.target.value])
                   console.log("Move to", map[e.target.value]);
                }
              }}
              className="w-full appearance-none bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-300 py-1.5 px-3 rounded-lg flex-1 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="pending" disabled={c.status !== 'pending'}>New Applicant</option>
              <option value="short_listed">⏳ Short Listed</option>
              <option value="offered">💌 Offered</option>
              <option value="accepted">✅ Accepted</option>
              <option value="onboarding">💼 Onboarding</option>
              <option value="ready_to_start">🚀 Ready to Start</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}


