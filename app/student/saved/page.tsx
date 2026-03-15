"use client"

import React from 'react'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function StudentSavedRolesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Saved Roles</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Internships you've bookmarked for later.</p>
            </div>
            <Link href="/student" className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
              &larr; Back to Dashboard
            </Link>
          </div>

          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 border-dashed">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl mx-auto mb-6">
              🔖
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No saved roles yet</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">
              When you see an interesting internship on the Home Feed, click the bookmark icon to save it here.
            </p>
            <Link href="/student">
              <Button className="rounded-xl px-8 shadow-sm">
                Browse Roles
              </Button>
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}
