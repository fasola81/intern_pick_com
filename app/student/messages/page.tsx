"use client"

import React from 'react'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'

export default function StudentMessagesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-6xl mx-auto h-[calc(100vh-180px)] min-h-[500px] flex flex-col lg:flex-row gap-6">
          
          {/* Left: Chat List */}
          <div className="w-full lg:w-96 flex-shrink-0 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h2>
              <Link href="/student" className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">
                Back to Feed
              </Link>
            </div>
            
            <div className="flex-grow flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No conversations yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Messages from employers will appear here when they reach out.</p>
              </div>
            </div>
          </div>

          {/* Right: Empty Chat Window */}
          <div className="flex-grow bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden relative">
            <div className="flex items-center justify-center h-full text-slate-400 flex-col gap-4 p-8">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl">
                📨
              </div>
              <div className="text-center">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Your inbox is empty</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  When you apply for roles, employers can start conversations with you here. All messages are monitored by AI for your safety.
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-full px-3 py-1.5 mt-2">
                <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
                </svg>
                <span className="text-[10px] font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">AI Protected</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
