"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function StudentDashboard() {
  const [userName, setUserName] = useState('')
  const [userSchool, setUserSchool] = useState('')
  const [placement, setPlacement] = useState<any>(null)
  const [timeLogs, setTimeLogs] = useState<any[]>([])
  const [totalHoursLogged, setTotalHoursLogged] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setIsLoading(false); return }

      // Fetch student profile
      const { data: profile } = await supabase
        .from('students')
        .select('first_name, last_name, high_school_name')
        .eq('id', user.id)
        .single()
      if (profile) {
        setUserName(profile.first_name || user.email?.split('@')[0] || 'Student')
        setUserSchool(profile.high_school_name || '')
      } else {
        setUserName(user.email?.split('@')[0] || 'Student')
      }

      // Fetch active placement with program + employer details
      const { data: placements } = await supabase
        .from('placements')
        .select(`
          id, status, start_date, end_date, created_at,
          practicum_programs!placements_practicum_program_id_fkey (
            id, title, subject_area, required_total_hours,
            educators!practicum_programs_educator_id_fkey (full_name, school_name)
          ),
          companies!placements_employer_id_fkey (company_name)
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (placements && placements.length > 0) {
        const p = placements[0]
        setPlacement({
          ...p,
          program: (p as any).practicum_programs,
          company: (p as any).companies,
          educator: (p as any).practicum_programs?.educators,
        })

        // Fetch time logs for this placement
        const { data: logs } = await supabase
          .from('time_logs')
          .select('*')
          .eq('placement_id', p.id)
          .order('log_date', { ascending: false })
          .limit(10)
        setTimeLogs(logs || [])

        const total = (logs || []).reduce((sum: number, log: any) => sum + (log.hours || 0), 0)
        setTotalHoursLogged(total)
      }

      setIsLoading(false)
    }
    init()
  }, [])

  const requiredHours = placement?.program?.required_total_hours || 0
  const progressPercent = requiredHours > 0 ? Math.min(100, Math.round((totalHoursLogged / requiredHours) * 100)) : 0

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">

          {/* Welcome Banner */}
          <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2rem] p-6 md:p-8 text-white shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">🎓</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
              Welcome back, {userName}!
            </h1>
            <p className="text-emerald-100 max-w-md">
              {placement
                ? <>Your practicum at <span className="font-bold text-white">{placement.company?.company_name || 'your host business'}</span> is in progress.</>
                : 'Your school will assign you to a practicum placement soon.'
              }
            </p>
          </section>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your practicum...</p>
            </div>
          ) : !placement ? (
            /* No Placement State */
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-12 text-center">
              <div className="text-6xl mb-4">🏫</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Waiting for Your School</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                You haven&apos;t been assigned to a practicum yet. Your educator will match you with a host business and you&apos;ll see your placement details here.
              </p>
              <Link href="/student/profile" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-bold border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                💡 Complete your profile so your educator can match you →
              </Link>
            </div>
          ) : (
            <>
              {/* Active Placement Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{placement.program?.title || 'My Practicum'}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {placement.company?.company_name || 'Host Business'} • {placement.educator?.school_name || 'School'}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${
                    placement.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                    placement.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}>
                    {placement.status === 'active' ? 'Active' : placement.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-700 dark:text-slate-300">Hours Progress</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{totalHoursLogged} / {requiredHours} hrs ({progressPercent}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Subject</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{placement.program?.subject_area || '—'}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Educator</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{placement.educator?.full_name || '—'}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Start</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{placement.start_date ? new Date(placement.start_date).toLocaleDateString() : '—'}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">End</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{placement.end_date ? new Date(placement.end_date).toLocaleDateString() : '—'}</p>
                  </div>
                </div>
              </div>

              {/* Recent Time Logs */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="font-bold text-slate-900 dark:text-white">Recent Time Logs</h3>
                  <span className="text-xs font-bold text-slate-400">{timeLogs.length} entries</span>
                </div>
                {timeLogs.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-3">⏱️</div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">No hours logged yet. Start tracking your practicum hours!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {timeLogs.map((log) => (
                      <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {new Date(log.log_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          {log.notes && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{log.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{log.hours} hrs</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            log.approved_by_employer ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          }`}>
                            {log.approved_by_employer ? '✓ Approved' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/student/log-hours" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 text-center hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⏱️</div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Log Hours</h4>
                  <p className="text-xs text-emerald-600 mt-1 font-medium">Track practicum time</p>
                </Link>
                <Link href="/student/journal" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 text-center hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📓</div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">My Journal</h4>
                  <p className="text-xs text-emerald-600 mt-1 font-medium">Write reflections</p>
                </Link>
                <Link href="/student/profile" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 text-center hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👤</div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">My Profile</h4>
                  <p className="text-xs text-emerald-600 mt-1 font-medium">Edit skills & interests</p>
                </Link>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  )
}
