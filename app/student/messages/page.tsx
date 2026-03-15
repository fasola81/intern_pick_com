"use client"

import React, { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { sendMessage } from '@/app/actions'

export default function StudentMessagesPage() {
  const [activeChat, setActiveChat] = useState<number | null>(1)
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sentMessages, setSentMessages] = useState<Array<{ text: string; time: string }>>([])
  const [blockAlert, setBlockAlert] = useState<{ reason: string; category?: string } | null>(null)

  const handleSend = async (text?: string) => {
    const msg = text || messageText
    if (!msg.trim()) return
    
    setIsSending(true)
    setBlockAlert(null)

    try {
      const result = await sendMessage({
        text: msg,
        senderRole: 'student',
      })

      if (result.blocked) {
        setBlockAlert({ reason: result.reason || 'Message flagged', category: result.category })
        setMessageText('')
      } else {
        setSentMessages(prev => [...prev, { 
          text: msg, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
        setMessageText('')
      }
    } catch (err) {
      console.error('[Messages] Send error:', err)
    } finally {
      setIsSending(false)
    }
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
            
            <div className="overflow-y-auto flex-grow p-3 flex flex-col gap-2 custom-scrollbar hide-scrollbar">
              
              {/* Active Chat Item */}
              <button 
                onClick={() => setActiveChat(1)}
                className={`w-full text-left p-4 rounded-2xl flex items-start gap-4 transition-all duration-300 ${activeChat === 1 ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'}`}
              >
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl border border-indigo-200 dark:border-indigo-800/50 relative">
                  🦷
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-500 border-2 border-white dark:border-slate-900"></div>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`font-bold truncate ${activeChat === 1 ? 'text-brand-900 dark:text-brand-100' : 'text-slate-900 dark:text-white'}`}>Springfield Dental</h3>
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">10m ago</span>
                  </div>
                  <p className={`text-sm truncate ${activeChat === 1 ? 'text-brand-700 dark:text-brand-300 font-semibold' : 'text-slate-500'}`}>
                    "Hi Alex! We loved your profile. Are you..."
                  </p>
                </div>
              </button>

              {/* Inactive Chat Item */}
              <button 
                onClick={() => setActiveChat(2)}
                className={`w-full text-left p-4 rounded-2xl flex items-start gap-4 transition-all duration-300 ${activeChat === 2 ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'}`}
              >
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-2xl border border-orange-200 dark:border-orange-800/50 relative">
                  ☕
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`font-bold truncate ${activeChat === 2 ? 'text-brand-900 dark:text-brand-100' : 'text-slate-900 dark:text-white'}`}>Springfield Coffee Co.</h3>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Yesterday</span>
                  </div>
                  <p className={`text-sm truncate ${activeChat === 2 ? 'text-brand-700 dark:text-brand-300 font-semibold' : 'text-slate-500'}`}>
                    You: Sounds great! I am available thi...
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Right: Active Chat Window */}
          <div className="flex-grow bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden relative">
            
            {activeChat === 1 ? (
              <>
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl border border-indigo-200 dark:border-indigo-800/50">
                      🦷
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Springfield Dental</h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Front Desk Coordinator Role</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* AI Safety Badge */}
                    <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-full px-3 py-1.5">
                      <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
                      </svg>
                      <span className="text-[10px] font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">AI Protected</span>
                    </div>
                    <Button variant="outline" className="rounded-xl shadow-sm hidden md:flex">View Role Details</Button>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-6 md:p-8 flex flex-col gap-6 custom-scrollbar hide-scrollbar">
                  
                  <div className="text-center px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-full mx-auto inline-block border border-slate-100 dark:border-slate-700/50 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    Springfield Dental sent a chat request • Today at 9:42 AM
                  </div>

                  {/* AI Safety Notice */}
                  <div className="text-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full mx-auto inline-block border border-green-100 dark:border-green-800/50 text-xs font-semibold text-green-600 dark:text-green-400">
                    🛡️ Messages are monitored by AI to protect your safety
                  </div>

                  {/* Incoming Message */}
                  <div className="flex gap-4 max-w-2xl">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">SD</span>
                    </div>
                    <div>
                      <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl rounded-tl-none px-5 py-4 text-[15px] shadow-sm leading-relaxed border border-slate-200 dark:border-slate-700/50 inline-block">
                        Hi Alex! We loved your profile. Are you available for a quick local coffee chat next week to discuss this front desk position?
                      </div>
                    </div>
                  </div>

                  {/* Sent messages */}
                  {sentMessages.map((msg, i) => (
                    <div key={i} className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center">
                        <span className="text-sm font-bold text-brand-700 dark:text-brand-400">AJ</span>
                      </div>
                      <div className="text-right">
                        <div className="bg-brand-600 text-white rounded-2xl rounded-tr-none px-5 py-4 text-[15px] shadow-sm leading-relaxed inline-block">
                          {msg.text}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{msg.time}</p>
                      </div>
                    </div>
                  ))}

                </div>

                <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col gap-3">

                    {/* Block Alert */}
                    {blockAlert && (
                      <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl animate-fade-in">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
                          </svg>
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-bold text-red-800 dark:text-red-200">🛡️ Message Blocked</p>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-0.5 leading-relaxed">{blockAlert.reason}</p>
                          {blockAlert.category && (
                            <span className="inline-block mt-1.5 text-[10px] font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {blockAlert.category.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => setBlockAlert(null)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    {/* Quick Replies (Icebreakers) */}
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar">
                      <button 
                        onClick={() => handleSend("Yes, I'd love to!")}
                        disabled={isSending}
                        className="flex-shrink-0 px-4 py-2 bg-white dark:bg-slate-800 border border-brand-200 dark:border-brand-800/50 text-brand-700 dark:text-brand-300 rounded-full text-sm font-semibold hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors shadow-sm whitespace-nowrap disabled:opacity-50"
                      >
                        Yes, I'd love to!
                      </button>
                      <button 
                        onClick={() => handleSend("Can you tell me more about the hours?")}
                        disabled={isSending}
                        className="flex-shrink-0 px-4 py-2 bg-white dark:bg-slate-800 border border-brand-200 dark:border-brand-800/50 text-brand-700 dark:text-brand-300 rounded-full text-sm font-semibold hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors shadow-sm whitespace-nowrap disabled:opacity-50"
                      >
                        Can you tell me more about the hours?
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <div className="relative flex-grow">
                        <input 
                          type="text" 
                          placeholder="Type your message..." 
                          value={messageText}
                          onChange={(e) => {
                            setMessageText(e.target.value)
                            if (blockAlert) setBlockAlert(null)
                          }}
                          onKeyDown={(e) => { if (e.key === 'Enter' && !isSending) handleSend() }}
                          disabled={isSending}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-inner transition-all disabled:opacity-50"
                        />
                      </div>
                      <Button 
                        onClick={() => handleSend()}
                        disabled={isSending || !messageText.trim()}
                        className="rounded-2xl px-6 bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 disabled:opacity-50"
                      >
                        {isSending ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : activeChat === 2 ? (
              <div className="flex items-center justify-center h-full text-slate-400 flex-col gap-4">
                 <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl">☕</div>
                 <p>Chat history with Springfield Coffee Co.</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Select a conversation to start chatting
              </div>
            )}
            
          </div>

        </div>
      </main>
    </div>
  )
}
