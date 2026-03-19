"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function EmployerPlacementsPage() {
  const [placements, setPlacements] = useState<any[]>([])
  const [pendingLogs, setPendingLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get company
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_user_id', user.id)
        .single()
      if (!company) { setIsLoading(false); return }

      // Get placements with student + program details
      const { data: p } = await supabase
        .from('placements')
        .select(`
          id, status, start_date, end_date,
          students!placements_student_id_fkey (first_name, last_name, grade_level),
          practicum_programs!placements_practicum_program_id_fkey (title, required_total_hours)
        `)
        .eq('employer_id', company.id)
        .order('created_at', { ascending: false })

      const enriched = []
      for (const placement of (p || [])) {
        const { data: logs } = await supabase
          .from('time_logs')
          .select('id, hours, log_date, notes, approved_by_employer')
          .eq('placement_id', placement.id)
          .order('log_date', { ascending: false })

        const totalHours = (logs || []).reduce((sum: number, l: any) => sum + (l.hours || 0), 0)
        const pending = (logs || []).filter((l: any) => !l.approved_by_employer)

        enriched.push({
          ...placement,
          student: (placement as any).students,
          program: (placement as any).practicum_programs,
          totalHours,
          pendingCount: pending.length,
          logs: logs || [],
        })

        setPendingLogs(prev => [...prev, ...pending.map((l: any) => ({ ...l, placementId: placement.id, student: (placement as any).students }))])
      }
      setPlacements(enriched)
      setIsLoading(false)
    }
    load()
  }, [])

  const approveLog = async (logId: string) => {
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    await supabase.from('time_logs').update({ approved_by_employer: true }).eq('id', logId)
    setPendingLogs(prev => prev.filter(l => l.id !== logId))
    // Update placement counts
    setPlacements(prev => prev.map(p => ({
      ...p,
      pendingCount: p.logs.filter((l: any) => l.id !== logId && !l.approved_by_employer).length,
      logs: p.logs.map((l: any) => l.id === logId ? { ...l, approved_by_employer: true } : l),
    })))
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">🤝 Student Placements</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage practicum students placed at your business.</p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : placements.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-12 text-center">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Students Yet</h3>
              <p className="text-slate-500 mb-4">Students will appear here once an educator assigns them to your business.</p>
              <Link href="/employer/programs" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors">
                Browse School Programs
              </Link>
            </div>
          ) : (
            <>
              {/* Pending Approvals */}
              {pendingLogs.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] border border-amber-200 dark:border-amber-800/50 p-5">
                  <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-3">⏳ Pending Hour Approvals ({pendingLogs.length})</h3>
                  <div className="space-y-2">
                    {pendingLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="bg-white dark:bg-slate-900 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {log.student?.first_name} {log.student?.last_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(log.log_date).toLocaleDateString()} • {log.hours} hrs
                            {log.notes && <> — {log.notes}</>}
                          </p>
                        </div>
                        <Button onClick={() => approveLog(log.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5">
                          ✓ Approve
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placement Cards */}
              <div className="space-y-4">
                {placements.map((p) => (
                  <div key={p.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{p.student?.first_name} {p.student?.last_name}</h4>
                        <p className="text-sm text-slate-500">{p.program?.title} • Grade {p.student?.grade_level || '—'}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${
                        p.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        p.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-slate-700 dark:text-slate-300">Hours Progress</span>
                        <span className="text-emerald-600">{p.totalHours} / {p.program?.required_total_hours || 120} hrs</span>
                      </div>
                      <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                          style={{ width: `${Math.min(100, Math.round((p.totalHours / (p.program?.required_total_hours || 120)) * 100))}%` }}
                        ></div>
                      </div>
                    </div>

                    {p.pendingCount > 0 && (
                      <p className="mt-3 text-xs font-bold text-amber-600">{p.pendingCount} hour entries awaiting approval</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
