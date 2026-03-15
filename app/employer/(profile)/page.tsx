"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function EmployerOverviewPage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      
      {/* 1. Welcome & High-Level Metrics */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Welcome back, Sarah! 👋</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is what's happening with your recruitment pipeline today.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group cursor-pointer hover:border-brand-300 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Roles</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">3</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-xl">
              💼
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group cursor-pointer hover:border-brand-300 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">New Matches (7d)</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">17</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center text-xl">
              ✨
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group cursor-pointer hover:border-brand-300 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Upcoming Interviews</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">1</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-xl">
              📅
            </div>
          </div>
        </div>
      </section>

      {/* 2. Needs Attention Alerts */}
      <section className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 text-lg flex-shrink-0 mt-0.5 sm:mt-0">
            🔔
          </div>
          <div>
            <h3 className="font-bold text-amber-900 dark:text-amber-100 text-sm">Interview Accepted!</h3>
            <p className="text-sm text-amber-800 dark:text-amber-200/80 font-medium">Sarah Jenkins accepted your interview request for Tomorrow at 4:00 PM.</p>
          </div>
        </div>
        <Link href="/employer/interviews" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto bg-white hover:bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700/50 dark:text-amber-100 rounded-xl text-sm h-9">
            View Schedule
          </Button>
        </Link>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Pipeline Snapshot */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Pipeline Snapshot</h3>
            <Link href="/employer/roles" className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">View All Roles &rarr;</Link>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
            
            <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Social Media Assistant</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Marketing • Fall 2026</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 w-full sm:w-auto">
                <div className="flex-1 sm:w-20 bg-white dark:bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-lg font-black text-slate-900 dark:text-white">5</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Matches</span>
                </div>
                <div className="flex-1 sm:w-20 bg-white dark:bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center shadow-sm border border-brand-200 dark:border-brand-800/50">
                  <span className="text-lg font-black text-brand-600 dark:text-brand-400">2</span>
                  <span className="text-[10px] uppercase font-bold text-brand-600/70 tracking-wider">Shortlist</span>
                </div>
                <div className="flex-1 sm:w-20 bg-white dark:bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-lg font-black text-slate-900 dark:text-white">1</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Interviews</span>
                </div>
              </div>
            </div>

            <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Weekend Barista Trainee</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Operations • Year-round</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 w-full sm:w-auto">
                <div className="flex-1 sm:w-20 bg-white dark:bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-lg font-black text-slate-900 dark:text-white">12</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Matches</span>
                </div>
                <div className="flex-1 sm:w-20 bg-white dark:bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-lg font-black text-slate-400 dark:text-slate-600">-</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Shortlist</span>
                </div>
                <div className="flex-1 sm:w-20 bg-white dark:bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-lg font-black text-slate-400 dark:text-slate-600">-</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Interviews</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. Quick Actions */}
        <section className="flex flex-col gap-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Quick Actions</h3>
          <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col gap-2">
            
            <Link href="/employer/create" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center text-lg group-hover:bg-brand-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">Post a New Role</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Create a new internship listing</p>
              </div>
            </Link>

            <Link href="/employer/search" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-lg group-hover:bg-indigo-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Search Talent Pool</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Find active students by skill or major</p>
              </div>
            </Link>

            <Link href="/employer/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-700/80 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-slate-700 transition-colors">Update Profile</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Edit company info and settings</p>
              </div>
            </Link>

          </div>
        </section>

      </div>
    </div>
  )
}
