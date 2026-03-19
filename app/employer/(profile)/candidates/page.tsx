"use client"

import React, { useState, useEffect } from 'react'
import { getCandidatesByRole, updateCandidateStatus, sendCandidateMessage, getCandidateMessages } from '@/app/actions'

type CandidateMsg = { id: string; sender_id: string; sender_role: string; text: string; created_at: string }
type Candidate = {
  interestId: string; studentId: string; name: string; highSchool: string
  skills: string[]; interests: string[]; status: string; note: string | null; appliedAt: string
}
type RoleGroup = { id: string; title: string; category: string; is_active: boolean; candidates: Candidate[] }

export default function CandidatesPage() {
  const [roleGroups, setRoleGroups] = useState<RoleGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedRole, setExpandedRole] = useState<string | null>(null)

  // DM state
  const [dmCandidate, setDmCandidate] = useState<Candidate | null>(null)
  const [dmMessages, setDmMessages] = useState<CandidateMsg[]>([])
  const [dmText, setDmText] = useState('')
  const [dmError, setDmError] = useState('')
  const [isSendingDm, setIsSendingDm] = useState(false)
  const [isLoadingDm, setIsLoadingDm] = useState(false)

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
            const appliedCandidates = role.candidates.filter(c => c.status === 'pending');
            const shortListedCandidates = role.candidates.filter(c => c.status === 'short_listed');
            const offeredCandidates = role.candidates.filter(c => c.status === 'offered');
            const acceptedCandidates = role.candidates.filter(c => c.status === 'accepted');
            const onboardingCandidates = role.candidates.filter(c => c.status === 'onboarding');
            const readyCandidates = role.candidates.filter(c => c.status === 'ready_to_start');
            const declinedCandidates = role.candidates.filter(c => c.status === 'declined');

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

                <div className="flex gap-4 overflow-x-auto pb-6 snap-x hide-scrollbar">
                  {/* Column 1: Applied */}
                  <div className="flex-none w-[300px] snap-start bg-slate-50/80 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1 px-1">
                      <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Applied</h4>
                      <span className="px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full">{appliedCandidates.length}</span>
                    </div>
                    {appliedCandidates.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-700/50 rounded-xl">No new applicants</div>
                    ) : (
                      appliedCandidates.map(c => <CandidateCard key={c.interestId} c={c} handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} currentStage="Applied" />)
                    )}
                  </div>

                  {/* Column 2: Short Listed */}
                  <div className="flex-none w-[300px] snap-start bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100/60 dark:border-blue-900/30 flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1 px-1">
                      <h4 className="font-bold text-sm text-blue-700 dark:text-blue-400">Short Listed</h4>
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">{shortListedCandidates.length}</span>
                    </div>
                    {shortListedCandidates.length === 0 ? (
                      <div className="py-6 text-center text-xs text-blue-600/50 dark:text-blue-500/30 border border-dashed border-blue-200 dark:border-blue-900/50 rounded-xl">None short listed</div>
                    ) : (
                      shortListedCandidates.map(c => <CandidateCard key={c.interestId} c={c} handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} currentStage="Short Listed" />)
                    )}
                  </div>

                  {/* Column 3: Offered */}
                  <div className="flex-none w-[300px] snap-start bg-purple-50/50 dark:bg-purple-900/10 rounded-2xl p-4 border border-purple-100/60 dark:border-purple-900/30 flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1 px-1">
                      <h4 className="font-bold text-sm text-purple-700 dark:text-purple-400">Offered</h4>
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-full">{offeredCandidates.length}</span>
                    </div>
                    {offeredCandidates.length === 0 ? (
                      <div className="py-6 text-center text-xs text-purple-600/50 dark:text-purple-500/30 border border-dashed border-purple-200 dark:border-purple-900/50 rounded-xl">No offers extended</div>
                    ) : (
                      offeredCandidates.map(c => <CandidateCard key={c.interestId} c={c} handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} currentStage="Offered" />)
                    )}
                  </div>

                  {/* Column 4: Accepted (Hired) */}
                  <div className="flex-none w-[300px] snap-start bg-green-50/50 dark:bg-green-900/10 rounded-2xl p-4 border border-green-100/60 dark:border-green-900/30 flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1 px-1">
                      <h4 className="font-bold text-sm text-green-700 dark:text-green-400">Accepted</h4>
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">{acceptedCandidates.length}</span>
                    </div>
                    {acceptedCandidates.length === 0 ? (
                      <div className="py-6 text-center text-xs text-green-600/50 dark:text-green-500/30 border border-dashed border-green-200 dark:border-green-900/50 rounded-xl">Waiting for acceptance</div>
                    ) : (
                      acceptedCandidates.map(c => <CandidateCard key={c.interestId} c={c} handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} currentStage="Accepted" />)
                    )}
                  </div>

                  {/* Column 5: Onboarding */}
                  <div className="flex-none w-[300px] snap-start bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl p-4 border border-amber-100/60 dark:border-amber-900/30 flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1 px-1">
                      <h4 className="font-bold text-sm text-amber-700 dark:text-amber-400">Onboarding</h4>
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full">{onboardingCandidates.length}</span>
                    </div>
                    {onboardingCandidates.length === 0 ? (
                      <div className="py-6 text-center text-xs text-amber-600/50 dark:text-amber-500/30 border border-dashed border-amber-200 dark:border-amber-900/50 rounded-xl">No one onboarding</div>
                    ) : (
                      onboardingCandidates.map(c => <CandidateCard key={c.interestId} c={c} handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} currentStage="Onboarding" />)
                    )}
                  </div>

                  {/* Column 6: Ready to Start */}
                  <div className="flex-none w-[300px] snap-start bg-teal-50/50 dark:bg-teal-900/10 rounded-2xl p-4 border border-teal-100/60 dark:border-teal-900/30 flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1 px-1">
                      <h4 className="font-bold text-sm text-teal-700 dark:text-teal-500">Ready to Start</h4>
                      <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 text-xs font-bold rounded-full">{readyCandidates.length}</span>
                    </div>
                    {readyCandidates.length === 0 ? (
                      <div className="py-6 text-center text-xs text-teal-600/50 dark:text-teal-500/30 border border-dashed border-teal-200 dark:border-teal-900/50 rounded-xl">No one ready yet</div>
                    ) : (
                      readyCandidates.map(c => <CandidateCard key={c.interestId} c={c} handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} currentStage="Ready to Start" />)
                    )}
                  </div>

                  {/* Column 7: Declined */}
                  <div className="flex-none w-[300px] snap-start bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800 flex flex-col gap-3 opacity-60 hover:opacity-100 transition-opacity mx-4">
                    <div className="flex justify-between items-center mb-1 px-1">
                      <h4 className="font-bold text-sm text-slate-500 dark:text-slate-400">Declined</h4>
                      <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-full">{declinedCandidates.length}</span>
                    </div>
                    {declinedCandidates.length > 0 && (
                      declinedCandidates.map(c => <CandidateCard key={c.interestId} c={c} handleReject={handleReject} openDm={openDm} setProposeCandidate={setProposeCandidate} getAvatarUrl={getAvatarUrl} currentStage="Declined" />)
                    )}
                  </div>
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
