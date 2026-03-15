"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function EmployerRolesPage() {
  const [roles, setRoles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRoles() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('opportunities')
          .select('*')
          .eq('company_id', user.id)
          .order('created_at', { ascending: false })
        setRoles(data || [])
      }
      setIsLoading(false)
    }
    fetchRoles()
  }, [])

  const categoryEmojis: Record<string, string> = {
    marketing: '💡', tech: '💻', admin: '📋', arts: '🎨',
    finance: '💰', education: '📚', health: '🏥', food: '☕', other: '📦',
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white pl-1">Manage Roles</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 pl-1 mt-1">
            You have {roles.length} internship posting{roles.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <Link href="/employer/create">
          <Button className="rounded-xl px-5 py-2.5 shadow-brand-500/20 shadow-md border border-brand-500/50 hover:border-brand-400 w-full sm:w-auto">
            + Post Another Role
          </Button>
        </Link>
      </div>

      {roles.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No roles yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            Create your first internship listing to start receiving applications from local students.
          </p>
          <Link href="/employer/create"><Button>Post Your First Role</Button></Link>
        </div>
      ) : (
        roles.map((role) => (
          <div key={role.id} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-xl flex-shrink-0 mt-1">
                {categoryEmojis[role.category] || '🚀'}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{role.title}</h3>
                  <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider ${
                    role.is_active 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {role.is_active ? 'Active' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 capitalize">
                  {role.category || 'General'} • {role.work_setting || 'On-site'} • {
                    role.compensation === 'paid' && role.hourly_rate ? `Paid ($${role.hourly_rate}/hr)` :
                    role.compensation === 'credit' ? 'School Credit' : 
                    role.compensation === 'paid' ? 'Paid' : 'Unpaid'
                  }
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Posted {new Date(role.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
              <div className="flex gap-4 sm:gap-6 w-full justify-between sm:justify-end">
                <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl min-w-[80px]">
                  <span className="block text-2xl font-black text-slate-900 dark:text-white leading-none">{role.hours_per_week || '—'}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Hrs/wk</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
