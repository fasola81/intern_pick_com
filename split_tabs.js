const fs = require('fs');
const file = 'app/employer/(profile)/page.tsx';
const content = fs.readFileSync(file, 'utf8');

const pipelineMatch = content.match(/\{activeTab === 'pipeline' && \(\n([\s\S]*?)\n              \)\}/);
const authPipeline = pipelineMatch ? pipelineMatch[1] : '';

const interviewsMatch = content.match(/\{activeTab === 'interviews' && \(\n([\s\S]*?)\n              \)\}/);
const authInterviews = interviewsMatch ? interviewsMatch[1] : '';

const listingsMatch = content.match(/\{activeTab === 'listings' && \(\n([\s\S]*?)\n              \)\}/);
const authListings = listingsMatch ? listingsMatch[1] : '';

const modalsMatch = content.match(/\{\/\* Feedback Modal \*\/\}([\s\S]*?)<\/>\n  \)\n\}/);
const authModals = modalsMatch ? `{/* Feedback Modal */}${modalsMatch[1]}` : '';

// Generate PIPELINE page
const pipelinePage = `"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function EmployerPipelinePage() {
  // Feedback Modal State
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<{name: string, role: string} | null>(null)
  const [feedbackType, setFeedbackType] = useState<string>('')
  const [feedbackText, setFeedbackText] = useState('')

  // Shortlist Modal State
  const [isShortlistModalOpen, setIsShortlistModalOpen] = useState(false)
  const [shortlistActionType, setShortlistActionType] = useState<'interview' | 'intro'>('interview')

  const handlePassClick = (name: string, role: string) => {
    setSelectedCandidate({ name, role })
    setIsFeedbackModalOpen(true)
  }

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false)
    setSelectedCandidate(null)
    setFeedbackType('')
    setFeedbackText('')
  }

  const handleShortlistClick = (name: string, role: string) => {
    setSelectedCandidate({ name, role })
    setIsShortlistModalOpen(true)
  }

  const closeShortlistModal = () => {
    setIsShortlistModalOpen(false)
    setSelectedCandidate(null)
    setShortlistActionType('interview')
  }

  return (
    <>
${authPipeline}

      ${authModals}
    </>
  )
}
`;
fs.writeFileSync('app/employer/(profile)/pipeline/page.tsx', pipelinePage);

// Generate INTERVIEWS page
const interviewsPage = `"use client"

import React from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function EmployerInterviewsPage() {
  return (
    <>
${authInterviews.replace("onClick={() => setActiveTab('pipeline')}", "").replace('<Button variant="outline" className="mt-6 rounded-xl" >\n                      Return to Pipeline\n                    </Button>', '<Link href="/employer/pipeline"><Button variant="outline" className="mt-6 rounded-xl">Return to Pipeline</Button></Link>')}
    </>
  )
}
`;
fs.writeFileSync('app/employer/(profile)/interviews/page.tsx', interviewsPage);

// Generate ROLES page
const rolesPage = `"use client"

import React from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function EmployerRolesPage() {
  return (
    <>
${authListings}
    </>
  )
}
`;
fs.writeFileSync('app/employer/(profile)/roles/page.tsx', rolesPage);

// Generate OVERVIEW fallback (could redirect, or just show a message)
const overviewPage = `"use client"

import React from 'react'
import { redirect } from 'next/navigation'

export default function EmployerOverviewPage() {
  redirect('/employer/pipeline')
  return null
}
`;
fs.writeFileSync('app/employer/(profile)/page.tsx', overviewPage);

