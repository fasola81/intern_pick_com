"use client"

import React, { useState } from 'react'
import { Button } from './ui/Button'
import { trackEvent } from '@/lib/tracking'

interface InviteModuleProps {
  type: 'school' | 'business' | 'program'
  programId?: string
  programTitle?: string
  userId?: string
}

export function InviteModule({ type, programId, programTitle, userId }: InviteModuleProps) {
  const [copied, setCopied] = useState(false)
  
  // Base App URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.internpick.com'

  // Generate Invite URL
  let inviteUrl = ''
  let subject = ''
  let body = ''

  if (type === 'school') {
    inviteUrl = `${baseUrl}/signup?role=educator&ref=${userId || ''}`
    subject = "Join InternPick - Connect your students with local business practicums"
    body = `Hi,\n\nI'm using InternPick to manage our school's practicum and work-based learning programs.\n\nIt makes it incredibly easy to connect students with local employers for academic-credit internships, while handling the DOL compliance requirements automatically.\n\nYou can create your school's free account here:\n${inviteUrl}\n\nBest,`
  } else if (type === 'business') {
    inviteUrl = `${baseUrl}/signup?role=company&ref=${userId || ''}`
    subject = "Join InternPick - Host student interns from our school"
    body = `Hi,\n\nI'd like to invite your business to join InternPick. It's a platform that connects local businesses with high school students looking for unpaid, academic-credit practicums and internships.\n\nYou can directly mentor our students, help them build their careers, and gain eager talent for your workplace.\n\nJoin for free as an Employer here:\n${inviteUrl}\n\nBest,`
  } else if (type === 'program' && programId) {
    inviteUrl = `${baseUrl}/employer/programs/${programId}/apply?ref=${userId || ''}`
    subject = `Invitation to Host Interns for: ${programTitle || 'our Practicum Program'}`
    body = `Hi,\n\nI'm running a practicum program titled "${programTitle || 'Student Practicum'}" and I would love for your business to host some of our students.\n\nYou can review the program details and apply to host our students directly here:\n${inviteUrl}\n\nThank you for supporting our local students!\n\nBest,`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    trackEvent({ event: 'invite_link_generated', feature_name: type })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEmail = () => {
    trackEvent({ event: 'invite_email_opened', feature_name: type })
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 lg:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col gap-3 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
      <div className="flex items-start gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800/50 flex items-center justify-center text-xl flex-shrink-0">
          {type === 'school' ? '🏫' : '🏢'}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">
            {type === 'school' ? 'Invite a School' : type === 'business' ? 'Invite Business to Host' : 'Invite a Local Business'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
            {type === 'program' ? 'Send a direct link for them to apply as a host to this specific program.' : 'Send a referral link. They can join the platform for free.'}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2 w-full mt-2">
        <Button onClick={handleCopy} variant="outline" className="flex-1 text-xs py-2 h-auto whitespace-nowrap border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
          {copied ? '✅ Copied!' : '🔗 Copy Link'}
        </Button>
        <Button onClick={handleEmail} className="flex-1 text-xs py-2 h-auto bg-brand-600 hover:bg-brand-700 text-white whitespace-nowrap shadow-sm border border-brand-700/50">
          ✉️ Send Email
        </Button>
      </div>
    </div>
  )
}
