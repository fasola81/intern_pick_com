"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { createBrowserClient } from '@supabase/ssr'
import { createTimeLog } from '@/app/actions'
import Link from 'next/link'

export default function LogHoursPage() {
  const [placement, setPlacement] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0])
  const [hours, setHours] = useState<number>(1)
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: placements } = await supabase
        .from('placements')
        .select('id, status, practicum_programs!placements_practicum_program_id_fkey(title, required_total_hours), companies!placements_employer_id_fkey(company_name)')
        .eq('student_id', user.id)
        .eq('status', 'active')
        .limit(1)

      if (placements && placements.length > 0) {
        setPlacement(placements[0])
        const { data: timeLogs } = await supabase
          .from('time_logs')
          .select('*')
          .eq('placement_id', placements[0].id)
          .order('log_date', { ascending: false })
          .limit(20)
        setLogs(timeLogs || [])
      }
      setIsLoading(false)
    }
    load()
  }, [])

  const totalHours = logs.reduce((sum, l) => sum + (l.hours || 0), 0)

  const handleSubmit = async () => {
    if (!placement) return
    if (hours <= 0 || hours > 12) { setError('Hours must be between 0.5 and 12'); return }
    setIsSubmitting(true)
    setError('')
    setSuccess(false)

    const result = await createTimeLog({
      placementId: placement.id,
      logDate,
      hours,
      notes,
    })

    if (result.success) {
      setSuccess(true)
      setNotes('')
      setHours(1)
      // Refresh logs
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { data } = await supabase.from('time_logs').select('*').eq('placement_id', placement.id).order('log_date', { ascending: false }).limit(20)
      setLogs(data || [])
    } else {
      setError(result.error || 'Failed to log hours')
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
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">⏱️ Log Hours</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your practicum hours for credit.</p>
            </div>
            <Link href="/student" className="text-sm font-medium text-blue-600 hover:text-blue-700">&larr; Dashboard</Link>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : !placement ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-12 text-center">
              <div className="text-5xl mb-4">🏫</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Placement</h3>
              <p className="text-slate-500">You&apos;ll be able to log hours once your educator assigns you to a practicum.</p>
            </div>
          ) : (
            <>
              {/* Summary card */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-white">
                <p className="text-sm font-medium text-emerald-100 mb-1">{(placement as any).practicum_programs?.title}</p>
                <p className="text-2xl font-black">{totalHours} hrs <span className="text-base font-medium text-emerald-200">/ {(placement as any).practicum_programs?.required_total_hours || '—'} required</span></p>
              </div>

              {/* Log form */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="font-bold text-slate-900 dark:text-white">New Entry</h3>

                {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-300">⚠️ {error}</div>}
                {success && <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-sm text-emerald-700 dark:text-emerald-300">✅ Hours logged successfully!</div>}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Date</label>
                    <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Hours</label>
                    <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} min={0.5} max={12} step={0.5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Notes <span className="text-slate-400 font-normal">(optional)</span></label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did you work on today?"
                    rows={3} maxLength={300}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none" />
                </div>

                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {isSubmitting ? 'Logging...' : 'Log Hours'}
                </Button>
              </div>

              {/* Recent logs */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="font-bold text-slate-900 dark:text-white">Recent Entries</h3>
                </div>
                {logs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No hours logged yet.</div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {logs.map((log) => (
                      <div key={log.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(log.log_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                          {log.notes && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{log.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-emerald-600">{log.hours} hrs</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${log.approved_by_employer ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {log.approved_by_employer ? '✓ Approved' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
