"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { createBrowserClient } from '@supabase/ssr'
import { InviteModule } from '@/components/InviteModule'

export default function EmployerOverviewPage() {
  const [ownerFirstName, setOwnerFirstName] = useState('')
  const [applications, setApplications] = useState<any[]>([])
  const [placementCount, setPlacementCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setIsLoading(false); return }
      setUserId(user.id)

      // Get owner name
      const { data: company } = await supabase
        .from('companies')
        .select('owner_name')
        .eq('id', user.id)
        .single()
      if (company?.owner_name) {
        setOwnerFirstName(company.owner_name.split(' ')[0])
      }

      // Get host applications with program details
      const { data: apps } = await supabase
        .from('host_applications')
        .select(`
          id, status, capacity, proposed_mentor_name, mentorship_plan, created_at,
          practicum_programs!host_applications_practicum_program_id_fkey (
            id, title, subject_area, required_total_hours, school_provides_insurance,
            educators!practicum_programs_educator_id_fkey (full_name, school_name)
          )
        `)
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false })
      setApplications(apps || [])

      // Get placement count
      const { count } = await supabase
        .from('placements')
        .select('*', { count: 'exact', head: true })
        .eq('employer_id', user.id)
      setPlacementCount(count || 0)

      setIsLoading(false)
    }
    fetchData()
  }, [])

  const pendingApps = applications.filter(a => a.status === 'pending')
  const approvedApps = applications.filter(a => a.status === 'approved_by_school')

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">

      {/* Welcome & Metrics */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back{ownerFirstName ? `, ${ownerFirstName}` : ''}! 🤝
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your school partnership dashboard — manage your practicum hosting commitments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/employer/programs" className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-300 transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400"></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Applications</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{applications.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-xl">📋</div>
          </Link>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400"></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Pending Review</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{pendingApps.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center text-xl">⏳</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-400"></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Approved</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{approvedApps.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center text-xl">✅</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-400"></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Students Hosted</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{placementCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-xl">🎓</div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Active Partnerships */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Your Applications</h3>
            <Link href="/employer/programs" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">Browse Programs &rarr;</Link>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center">
              <div className="text-5xl mb-4">🏫</div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">No applications yet</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Browse school programs and apply to host students. The school handles academic credit, grading, and often even insurance.</p>
              <Link href="/employer/programs">
                <Button className="bg-blue-600 hover:bg-blue-700">Browse School Programs</Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
              {applications.map((app) => {
                const program = (app as any).practicum_programs
                const educator = program?.educators
                const statusConfig: Record<string, { label: string; color: string }> = {
                  pending: { label: 'Under Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
                  approved_by_school: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
                  rejected: { label: 'Not Selected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
                }
                const status = statusConfig[app.status] || statusConfig.pending

                return (
                  <div key={app.id} className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🎓</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{program?.title || 'Program'}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {educator?.school_name || 'School'} • Mentor: {app.proposed_mentor_name} • {app.capacity} student{app.capacity > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {program?.school_provides_insurance && (
                        <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/30">🛡️ Insured</span>
                      )}
                      <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${status.color}`}>{status.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="flex flex-col gap-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Quick Actions</h3>
          <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 flex flex-col gap-2">

            <Link href="/employer/programs" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-lg group-hover:bg-blue-100 transition-colors">
                🏫
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Browse Programs</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Find school practicum programs to host</p>
              </div>
            </Link>

            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-default opacity-60">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-lg">
                📊
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">View Placements</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Manage active student placements (coming soon)</p>
              </div>
            </div>

            <Link href="/employer/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-700/80 transition-colors">
                ⚙️
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-slate-700 transition-colors">Update Profile</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Edit company info and settings</p>
              </div>
            </Link>

          </div>

          {/* Grow Your Network */}
          <div className="flex flex-col gap-3 mt-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Refer a Business</h4>
            <InviteModule type="business" userId={userId || undefined} />
          </div>

          {/* Trust Badge */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-[1.5rem] border border-emerald-200 dark:border-emerald-800/40 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚖️</span>
              <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-200">DOL Compliant</h4>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
              All practicums on InternPick are school-sponsored for academic credit. This inherently passes the DOL Primary Beneficiary Test — zero wage/hour risk for your business.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
