"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function EducatorProgressPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [stats, setStats] = useState({ totalStudents: 0, avgHours: 0, completion: 0, activePlacements: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch educator's programs with placement counts
      const { data: progs } = await supabase
        .from('practicum_programs')
        .select('id, title, required_total_hours, status')
        .eq('educator_id', user.id)

      const programList = progs || []
      const programIds = programList.map(p => p.id)

      let totalStudents = 0
      let activePlacements = 0
      let totalHoursAll = 0
      let totalRequiredAll = 0
      const enrichedPrograms: any[] = []

      for (const prog of programList) {
        const { data: placements } = await supabase
          .from('placements')
          .select('id, status, student_id')
          .eq('practicum_program_id', prog.id)

        const placementCount = placements?.length || 0
        const activeCount = placements?.filter((p: any) => p.status === 'active').length || 0
        totalStudents += placementCount
        activePlacements += activeCount

        // Get hours for this program's placements
        let programHours = 0
        if (placements && placements.length > 0) {
          const placementIds = placements.map(p => p.id)
          const { data: logs } = await supabase
            .from('time_logs')
            .select('hours')
            .in('placement_id', placementIds)
          programHours = (logs || []).reduce((sum: number, l: any) => sum + (l.hours || 0), 0)
        }
        totalHoursAll += programHours
        totalRequiredAll += (prog.required_total_hours || 120) * placementCount

        enrichedPrograms.push({
          ...prog,
          studentCount: placementCount,
          activeCount,
          totalHours: programHours,
          avgHoursPerStudent: placementCount > 0 ? Math.round(programHours / placementCount * 10) / 10 : 0,
        })
      }

      setPrograms(enrichedPrograms)
      setStats({
        totalStudents,
        avgHours: totalStudents > 0 ? Math.round(totalHoursAll / totalStudents * 10) / 10 : 0,
        completion: totalRequiredAll > 0 ? Math.round((totalHoursAll / totalRequiredAll) * 100) : 0,
        activePlacements,
      })
      setIsLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">📊 Progress Analytics</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track student progress across your practicum programs.</p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Aggregate Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-1">Total Students</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalStudents}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-1">Active Placements</p>
                  <p className="text-3xl font-black text-emerald-600">{stats.activePlacements}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-1">Avg Hours/Student</p>
                  <p className="text-3xl font-black text-blue-600">{stats.avgHours}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-1">Completion Rate</p>
                  <p className="text-3xl font-black text-purple-600">{stats.completion}%</p>
                </div>
              </div>

              {/* Per-Program Breakdown */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Per-Program Breakdown</h3>
              {programs.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                  <p className="text-slate-500">No programs yet. <Link href="/educator/create-program" className="text-emerald-600 font-bold">Create one →</Link></p>
                </div>
              ) : (
                <div className="space-y-4">
                  {programs.map((prog) => (
                    <div key={prog.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{prog.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {prog.studentCount} students • {prog.activeCount} active • {prog.required_total_hours || 120} hrs required
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          prog.status === 'active' || prog.status === 'seeking_hosts' ? 'bg-emerald-100 text-emerald-700' :
                          prog.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {prog.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                          <p className="text-lg font-black text-slate-900 dark:text-white">{prog.totalHours}</p>
                          <p className="text-[10px] font-bold text-slate-400">Total Hours</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                          <p className="text-lg font-black text-emerald-600">{prog.avgHoursPerStudent}</p>
                          <p className="text-[10px] font-bold text-slate-400">Avg/Student</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                          <p className="text-lg font-black text-blue-600">
                            {prog.studentCount > 0 ? Math.round((prog.totalHours / (prog.studentCount * (prog.required_total_hours || 120))) * 100) : 0}%
                          </p>
                          <p className="text-[10px] font-bold text-slate-400">Completion</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
