"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { createBrowserClient } from '@supabase/ssr'

export default function EmployerOverviewPage() {
  const [companyName, setCompanyName] = useState('')
  const [roles, setRoles] = useState<any[]>([])
  const [applicationCount, setApplicationCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setIsLoading(false); return }

      // Get company name
      const { data: company } = await supabase
        .from('companies')
        .select('company_name')
        .eq('id', user.id)
        .single()
      if (company) setCompanyName(company.company_name || '')

      // Get roles
      const { data: opps } = await supabase
        .from('opportunities')
        .select('*')
        .eq('company_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      setRoles(opps || [])

      // Get total application count
      if (opps && opps.length > 0) {
        const oppIds = opps.map(o => o.id)
        const { count } = await supabase
          .from('interests')
          .select('*', { count: 'exact', head: true })
          .in('opportunity_id', oppIds)
        setApplicationCount(count || 0)
      }

      setIsLoading(false)
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      
      {/* 1. Welcome & High-Level Metrics */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back{companyName ? `, ${companyName}` : ''}! 👋
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is what's happening with your recruitment pipeline.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group cursor-pointer hover:border-brand-300 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Roles</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{roles.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-xl">
              💼
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group cursor-pointer hover:border-brand-300 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Applications</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{applicationCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center text-xl">
              ✨
            </div>
          </div>

          <Link href="/employer/create" className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-between group cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Post New Role</p>
              <p className="text-xl font-black text-brand-600 dark:text-brand-400 group-hover:text-brand-700 transition-colors">+ Create</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center text-xl">
              ➕
            </div>
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Pipeline Snapshot */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Your Active Roles</h3>
            <Link href="/employer/roles" className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">View All &rarr;</Link>
          </div>
          
          {roles.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">No roles posted yet</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first internship role to start receiving applications from local students.</p>
              <Link href="/employer/create">
                <Button>Post Your First Role</Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
              {roles.map((role) => (
                <div key={role.id} className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{role.title}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 capitalize">{role.category || 'General'} • {role.work_setting || 'On-site'}</p>
                  </div>
                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 w-full sm:w-auto">
                    <div className="flex-1 sm:w-20 bg-white dark:bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-lg font-black text-brand-600 dark:text-brand-400">{role.compensation === 'paid' ? `$${role.hourly_rate || '—'}` : role.compensation === 'credit' ? 'Credit' : 'Vol.'}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pay</span>
                    </div>
                    <div className="flex-1 sm:w-20 bg-white dark:bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-lg font-black text-slate-900 dark:text-white">{role.hours_per_week || '—'}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Hrs/wk</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. Quick Actions */}
        <section className="flex flex-col gap-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Quick Actions</h3>
          <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col gap-2">
            
            <Link href="/employer/create" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center text-lg group-hover:bg-brand-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">Post a New Role</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Create a new internship listing</p>
              </div>
            </Link>

            <Link href="/employer/search" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-lg group-hover:bg-indigo-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Search Talent Pool</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Find active students by skill or major</p>
              </div>
            </Link>

            <Link href="/employer/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-700/80 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-slate-700 transition-colors">Update Profile</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Edit company info and settings</p>
              </div>
            </Link>

          </div>
        </section>

      </div>
    </div>
  )
}
