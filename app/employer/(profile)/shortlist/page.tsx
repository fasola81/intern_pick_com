"use client"

import React from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function EmployerShortlistPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white pl-1">Short List Candidates</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 pl-1 mt-1">Review matched applicants and move them forward in your pipeline.</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center text-3xl mb-4">
          🧑‍🎓
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No matched candidates yet</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Once students apply for your roles, their profiles will appear here for review. Post a role to get started!
        </p>
        <Link href="/employer/create"><Button className="mt-6 rounded-xl">Post a Role</Button></Link>
      </div>
    </div>
  )
}
