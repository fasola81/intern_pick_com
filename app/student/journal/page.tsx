"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { createBrowserClient } from '@supabase/ssr'
import { createJournalEntry } from '@/app/actions'
import Link from 'next/link'

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [placementId, setPlacementId] = useState<string | null>(null)
  const [reflection, setReflection] = useState('')
  const [skillsLearned, setSkillsLearned] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

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

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">What did you learn or experience? *</label>
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
