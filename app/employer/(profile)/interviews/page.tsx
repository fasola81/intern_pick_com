"use client"

import React from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function EmployerInterviewsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white pl-2">Scheduled Interviews</h2>
      </div>

      {/* Empty State */}
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl mb-4 text-slate-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No interviews scheduled</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Head over to the Candidates board to review matched candidates and invite them to chat or schedule an interview.
        </p>
        <Link href="/employer/candidates"><Button variant="outline" className="mt-6 rounded-xl">Go to Candidates</Button></Link>
      </div>
    </div>
  )
}
