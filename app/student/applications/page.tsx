"use client"

import React from 'react'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'

export default function StudentApplicationsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Active Applications</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Track your internship progress.</p>
            </div>
            <Link href="/student" className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
              &larr; Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            
            {/* App 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800/50 flex items-center justify-center text-3xl">
                  🥐
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xl">Local Bakery Assistant</h3>
                  <p className="font-medium text-slate-600 dark:text-slate-400">Sweet Bites Bakery • Applied 2d ago</p>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-200 dark:border-yellow-800/50 shadow-sm w-full sm:w-auto justify-center">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                  Under Review
                </span>
              </div>
            </div>

            {/* App 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center text-3xl">
                  🦷
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xl">Front Desk Coordinator</h3>
                  <p className="font-medium text-slate-600 dark:text-slate-400">Springfield Dental • Applied 1w ago</p>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider border border-green-200 dark:border-green-800/50 shadow-sm w-full sm:w-auto justify-center">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Interview Requested
                </span>
                <Link href="/student/messages" className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                  View Message &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  )
}
