"use client"

import React, { useState, useEffect } from 'react'
import { getCandidatesByRole, updateCandidateStatus } from '@/app/actions'

export default function MyInternsPage() {
  const [interns, setInterns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    const res = await getCandidatesByRole()
    
    // Flatten roles to get all candidates
    const allCandidates = (res.data || []).flatMap((role: any) => 
      role.candidates.map((c: any) => ({ ...c, roleTitle: role.title }))
    )

    // Filter to only those in the "hired" lifecycle
    const hiredLifecycle = ['accepted', 'onboarding', 'ready_to_start']
    const activeInterns = allCandidates.filter(c => hiredLifecycle.includes(c.status))
    
    setInterns(activeInterns)
    setIsLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const getAvatarUrl = (name: string) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">🌍 My Interns</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your hired interns, track their onboarding, and assign logistics.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300">
            {interns.length} Active {interns.length === 1 ? 'Intern' : 'Interns'}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        </div>
      ) : interns.length === 0 ? (
        <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center bg-white/50 dark:bg-slate-900/30">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Interns</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            When you offer a position and a candidate accepts, they will appear here so you can manage their onboarding and day-to-day logistics.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interns.map((intern, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              
              {/* Card Header Background */}
              <div className="h-16 bg-gradient-to-r from-brand-500 to-indigo-600 relative">
                <span className="absolute top-3 right-3 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white font-bold text-[10px] uppercase tracking-wider shadow-sm border border-white/10">
                  {intern.status === 'accepted' ? 'Accepted Offer' : intern.status === 'onboarding' ? 'Onboarding' : 'Ready to Start'}
                </span>
              </div>
              
              {/* Content */}
              <div className="px-5 pt-0 pb-5 flex-1 flex flex-col relative z-10">
                <div className="flex justify-between items-end mb-3 -mt-8 relative drop-shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100">
                      <img src={getAvatarUrl(intern.name)} alt={intern.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{intern.name}</h3>
                <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-2">{intern.roleTitle}</p>
                
                <div className="space-y-2 mb-6 mt-1 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-800">🏫</span> 
                    <span className="truncate">{intern.highSchool || 'Local High School'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-800">📅</span> 
                    <span>Hired: {new Date(intern.appliedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Mock Onboarding Progress */}
                  <div className="pt-2 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>Onboarding Progress</span>
                      <span className={intern.status === 'ready_to_start' ? 'text-green-500' : ''}>
                        {intern.status === 'accepted' ? '20%' : intern.status === 'onboarding' ? '60%' : '100%'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${intern.status === 'accepted' ? 'w-1/5 bg-brand-400' : intern.status === 'onboarding' ? 'w-3/5 bg-amber-400' : 'w-full bg-green-500'}`}></div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button className="py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                    View Documents
                  </button>
                  <button className="py-2 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 border border-transparent hover:bg-slate-800 dark:hover:bg-slate-200 rounded-xl transition-colors shadow-sm">
                    {intern.status === 'ready_to_start' ? 'Assign First Task' : 'Send Next Step'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
