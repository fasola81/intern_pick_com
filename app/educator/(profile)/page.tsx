"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { createBrowserClient } from '@supabase/ssr'

interface PracticumProgram {
  id: string
  title: string
  subject_area: string
  grade_levels: string
  status: string
  learning_objectives: string | null
  required_total_hours: number | null
  school_provides_insurance: boolean
  created_at: string
}

export default function EducatorDashboardPage() {
  const [programs, setPrograms] = useState<PracticumProgram[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, seekingHosts: 0, active: 0, placements: 0 })

  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setIsLoading(false); return }

      // Get programs
      const { data: progs } = await supabase
        .from('practicum_programs')
        .select('*')
        .eq('educator_id', user.id)
        .order('created_at', { ascending: false })

      const programs = progs || []
      setPrograms(programs)

      // Get placement count
      const programIds = programs.map(p => p.id)
      let placementCount = 0
      if (programIds.length > 0) {
        const { count } = await supabase
          .from('placements')
          .select('*', { count: 'exact', head: true })
          .in('practicum_program_id', programIds)
        placementCount = count || 0
      }

      setStats({
        total: programs.length,
        seekingHosts: programs.filter(p => p.status === 'seeking_hosts').length,
        active: programs.filter(p => p.status === 'active').length,
        placements: placementCount,
      })

      setIsLoading(false)
    }
    fetchData()
  }, [])

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', label: 'Draft' },
      seeking_hosts: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', label: 'Seeking Hosts' },
      active: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', label: 'Active' },
      completed: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', label: 'Completed' },
    }
    const s = map[status] || map.draft
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Programs', value: stats.total, icon: '📋', color: 'from-emerald-500 to-teal-400' },
          { label: 'Seeking Hosts', value: stats.seekingHosts, icon: '📢', color: 'from-amber-500 to-orange-400' },
          { label: 'Active', value: stats.active, icon: '🟢', color: 'from-green-500 to-emerald-400' },
          { label: 'Placements', value: stats.placements, icon: '🤝', color: 'from-blue-500 to-indigo-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Programs List */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Your Programs</h3>
          </div>

          {programs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">No programs yet</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first Practicum Program to start connecting students with local employers.</p>
              <Link href="/educator/create-program">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Create Your First Program</Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
              {programs.map((program) => (
                <Link key={program.id} href={`/educator/program/${program.id}`} className="block">
                  <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🎓</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{program.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {program.subject_area || 'General'} • {program.grade_levels || 'All Grades'}
                          {program.required_total_hours ? ` • ${program.required_total_hours}hrs` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {statusBadge(program.status)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="flex flex-col gap-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Quick Actions</h3>
          <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-2">

            <Link href="/educator/create-program" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center text-lg group-hover:bg-emerald-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Create Program</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Post a new Practicum program</p>
              </div>
            </Link>

            <Link href="/educator/invite-students" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-lg group-hover:bg-blue-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Invite Students</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Generate secure invite links</p>
              </div>
            </Link>

            <Link href="/educator/progress" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-lg group-hover:bg-purple-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">Student Progress</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Track hours and evaluations</p>
              </div>
            </Link>

          </div>
        </section>

      </div>
    </div>
  )
}
