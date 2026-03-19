"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function EducatorProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [educatorName, setEducatorName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('educators')
          .select('full_name, school_name, title, is_verified')
          .eq('id', user.id)
          .single()
        if (data && data.full_name) {
          setEducatorName(data.full_name)
          setSchoolName(data.school_name || '')
          setTitle(data.title || '')
        } else {
          router.push('/onboarding/educator')
          return
        }
      }
      setIsLoading(false)
    }
    fetchProfile()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          {/* Educator Header */}
          <section className="animate-fade-in-up bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="p-6 md:p-10 pb-6 flex items-start gap-5">
              <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-3xl md:text-4xl border border-emerald-200 dark:border-emerald-800/50 shadow-inner">
                🎓
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {educatorName}
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {title}{schoolName ? ` • ${schoolName}` : ''}
                </p>
              </div>
            </div>
          </section>

          {/* Page Content */}
          {children}

        </div>
      </main>
    </div>
  )
}
