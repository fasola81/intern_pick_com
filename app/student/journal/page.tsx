"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { createBrowserClient } from '@supabase/ssr'
import { createJournalEntry, generateJournalQuestionAction, synthesizeJournalEntryAction } from '@/app/actions'
import Link from 'next/link'

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [placementId, setPlacementId] = useState<string | null>(null)
  const [reflection, setReflection] = useState('')
  const [skillsLearned, setSkillsLearned] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [chatMode, setChatMode] = useState(false)
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([])
  const [draftMsg, setDraftMsg] = useState('')
  const [isChatting, setIsChatting] = useState(false)
  const [synthesizing, setSynthesizing] = useState(false)

  const startChatMode = () => {
    setChatMode(true)
    if (chatHistory.length === 0) {
      setChatHistory([{ role: 'assistant', content: "Hi! I'm your Journal Copilot ✨ What was the most interesting task you worked on this week?" }])
    }
  }

  const handleSendChat = async () => {
    if (!draftMsg.trim()) return;
    const newHistory = [...chatHistory, { role: 'user', content: draftMsg }]
    setChatHistory(newHistory as any)
    setDraftMsg('')
    
    const userCount = newHistory.filter(m => m.role === 'user').length
    if (userCount >= 3) {
      setSynthesizing(true)
      const res = await synthesizeJournalEntryAction(newHistory as any)
      if (res.success && res.data) {
        setReflection(res.data)
        setChatMode(false)
      }
      setSynthesizing(false)
    } else {
      setIsChatting(true)
      const res = await generateJournalQuestionAction(newHistory as any)
      if (res.success && res.data) {
        setChatHistory([...newHistory, { role: 'assistant', content: res.data }] as any)
      }
      setIsChatting(false)
    }
  }

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get active placement
      const { data: placements } = await supabase
        .from('placements')
        .select('id')
        .eq('student_id', user.id)
        .eq('status', 'active')
        .limit(1)
      if (placements?.[0]) setPlacementId(placements[0].id)

      // Get journal entries
      const { data: journal } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('student_id', user.id)
        .order('entry_date', { ascending: false })
        .limit(20)
      setEntries(journal || [])
      setIsLoading(false)
    }
    load()
  }, [])

  const handleSubmit = async () => {
    if (!reflection.trim()) return
    setIsSubmitting(true)
    setSuccess(false)

    const result = await createJournalEntry({
      placementId: placementId || undefined,
      reflection,
      skillsLearned: skillsLearned || undefined,
    })

    if (result.success) {
      setSuccess(true)
      setReflection('')
      setSkillsLearned('')
      // Refresh
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('journal_entries').select('*').eq('student_id', user.id).order('entry_date', { ascending: false }).limit(20)
        setEntries(data || [])
      }
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">📓 My Journal</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Reflect on your practicum experience each week.</p>
            </div>
            <Link href="/student" className="text-sm font-medium text-blue-600 hover:text-blue-700">&larr; Dashboard</Link>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <>
              {/* New Entry */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="font-bold text-slate-900 dark:text-white">New Reflection</h3>
                {success && <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-700 dark:text-emerald-300">✅ Journal entry saved!</div>}

                {chatMode ? (
                  <div className="flex flex-col gap-3 rounded-[1.5rem] border border-brand-200 dark:border-brand-800/50 bg-brand-50/50 dark:bg-brand-900/10 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">✨</span>
                      <div>
                        <h4 className="font-bold text-brand-900 dark:text-brand-100 text-sm">Journal Copilot</h4>
                        <p className="text-xs text-brand-700/70 dark:text-brand-300/70">Reflect on your week in a chat. I'll write the formal entry when we're done!</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-2 hide-scrollbar">
                      {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`p-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'assistant' 
                            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 mr-8 border border-slate-200 dark:border-slate-700 shadow-sm rounded-tl-sm' 
                            : 'bg-brand-600 text-white ml-8 shadow-sm rounded-tr-sm'
                        }`}>
                          {msg.content}
                        </div>
                      ))}
                      {isChatting && <div className="text-xs text-slate-500 animate-pulse py-2 px-1">✨ Copilot is typing...</div>}
                      {synthesizing && <div className="text-xs text-emerald-600 animate-pulse font-bold py-2 px-1">✨ Synthesizing your formal journal entry...</div>}
                    </div>
                    
                    <div className="flex gap-2 mt-auto">
                       <input value={draftMsg} onChange={e => setDraftMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChat()} placeholder="Type your answer..." className="flex-grow px-4 py-3 rounded-xl border border-brand-200 dark:border-brand-800/50 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" disabled={isChatting || synthesizing} />
                       <Button onClick={handleSendChat} disabled={!draftMsg.trim() || isChatting || synthesizing} className="bg-brand-600 hover:bg-brand-700 text-white text-sm px-5 py-3 h-auto rounded-xl shadow-sm">Send</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>What did you learn or experience? *</span>
                      <button onClick={startChatMode} className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 px-3 py-1.5 rounded-lg transition-colors border border-brand-200 dark:border-brand-800/50 shadow-sm">
                        ✨ Start AI Copilot
                      </button>
                    </label>
                    <textarea
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                      placeholder="Describe what you worked on, what you learned, challenges you faced, and how you grew..."
                      rows={5}
                      maxLength={1000}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                    />
                    <p className="text-xs text-slate-400 mt-1 text-right">{reflection.length}/1000</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Skills Practiced <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input
                    value={skillsLearned}
                    onChange={(e) => setSkillsLearned(e.target.value)}
                    placeholder="e.g. communication, teamwork, graphic design, customer service"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <Button onClick={handleSubmit} disabled={isSubmitting || !reflection.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {isSubmitting ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>

              {/* Past Entries */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Past Entries ({entries.length})</h3>
                {entries.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                    <p className="text-slate-500 text-sm">No journal entries yet. Start reflecting on your practicum experience!</p>
                  </div>
                ) : (
                  entries.map((entry) => (
                    <div key={entry.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">
                          {new Date(entry.entry_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">{entry.reflection}</p>
                      {entry.skills_learned && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-bold text-slate-400 mb-1">Skills Practiced</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{entry.skills_learned}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
