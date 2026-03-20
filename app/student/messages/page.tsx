"use client"

import React, { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { polishStudentMessageAction, demoModerateMessageAction } from '@/app/actions'

export default function StudentMessagesPage() {
  const [draft, setDraft] = useState('')
  const [isPolishing, setIsPolishing] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [errorText, setErrorText] = useState('')

  const [messages, setMessages] = useState([
    { id: 1, role: 'employer', text: 'Hi Michal, we reviewed your resume and would love to schedule a quick 15-minute chat about the Marketing Intern role. Are you available sometime next week?', time: '10:00 AM', sender: 'Sarah (Local Bakery)' }
  ])

  const handlePolish = async () => {
    if (!draft.trim()) return
    setIsPolishing(true)
    setErrorText('')
    const res = await polishStudentMessageAction(draft)
    if (res.success && res.data) {
      setDraft(res.data)
    } else {
      setErrorText(res.error || 'Failed to polish message. Please try again.')
    }
    setIsPolishing(false)
  }

  const handleSend = async () => {
    if (!draft.trim()) return
    setIsSending(true)
    setErrorText('')
    
    // Call our backend moderation (PII Shield)
    const modResult = await demoModerateMessageAction(draft)
    
    if (modResult.success && !modResult.isSafe) {
      setErrorText(`🛡️ PII Shield Blocked Message: ${modResult.reason}`)
      setIsSending(false)
      return
    }

    // Append to UI
    setMessages([...messages, { 
      id: Date.now(), 
      role: 'student', 
      text: draft, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      sender: 'You' 
    }])
    setDraft('')
    setIsSending(false)
  }

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
            
            <div className="flex-grow flex flex-col p-4 gap-2">
              <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-800/50 cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Sarah (Local Bakery)</h4>
                  <span className="text-xs text-brand-600 font-bold bg-brand-100 dark:bg-brand-900/40 px-2 py-0.5 rounded-full">New</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">Hi Michal, we reviewed your resume and would love to schedule a quick 15-minute chat about...</p>
              </div>
            </div>
          </div>

          {/* Right: Active Chat Window */}
          <div className="flex-grow bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-brand-100 text-brand-700 font-bold flex items-center justify-center rounded-full">LB</div>
                 <div>
                   <h3 className="font-bold text-slate-900 dark:text-white text-sm">Sarah (Local Bakery)</h3>
                   <p className="text-xs text-slate-500">Marketing Intern Role</p>
                 </div>
               </div>
               <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-full px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
                </svg>
                <span className="text-[10px] font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">AI Protected</span>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4 bg-slate-50/30 dark:bg-slate-900/10">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'student' ? 'items-end' : 'items-start'}`}>
                  <p className="text-[10px] font-bold text-slate-400 mb-1 ml-1 mr-1">{msg.sender} • {msg.time}</p>
                  <div className={`p-3.5 rounded-2xl text-sm max-w-[80%] leading-relaxed ${
                    msg.role === 'student'
                      ? 'bg-brand-600 text-white rounded-tr-sm shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 relative">
              {errorText && (
                <div className="px-4 py-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm font-medium rounded-xl flex items-center gap-2">
                  <span className="text-lg">🛡️</span>
                  {errorText}
                </div>
              )}
              
              <div className="flex gap-2">
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder="Type a message to Sarah..."
                  className="flex-grow px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none h-24"
                  disabled={isPolishing || isSending}
                />
                <div className="flex flex-col gap-2 justify-end w-40 flex-shrink-0">
                  <button 
                    onClick={handlePolish} 
                    disabled={!draft.trim() || isPolishing || isSending}
                    className="flex text-[11px] items-center justify-center gap-1.5 font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 dark:text-brand-300 py-2 rounded-lg transition-colors border border-brand-200 dark:border-brand-800/50 shadow-sm disabled:opacity-50"
                  >
                    {isPolishing ? '✨ Polishing...' : '✨ Make Professional'}
                  </button>
                  <button 
                    onClick={handleSend} 
                    disabled={!draft.trim() || isPolishing || isSending}
                    className="flex text-sm items-center justify-center font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                     {isSending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  )
}
