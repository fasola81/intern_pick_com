"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { createBrowserClient } from '@supabase/ssr'

export default function EmployerProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [companyStatus, setCompanyStatus] = useState('')
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
          .from('companies')
          .select('company_name, industry, zip_code, logo_url, status')
          .eq('id', user.id)
          .single()
        if (data && data.company_name) {
          setCompanyName(data.company_name || '')
          setIndustry(data.industry || '')
          setZipCode(data.zip_code || '')
          setLogoUrl(data.logo_url || '')
          setCompanyStatus(data.status || 'active')
        } else {
          // First-time user — redirect to onboarding
          router.push('/onboarding/employer')
          return
        }
      }
      setIsLoading(false)
    }
    fetchProfile()
  }, [router])

  const industryEmojis: Record<string, string> = {
    food: '☕', tech: '💻', retail: '🛍️', education: '📚',
    health: '🏥', finance: '💰', arts: '🎨', other: '🏢',
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">

          {/* Pending Review Banner */}
          {companyStatus === 'pending_review' && (
            <div className="animate-fade-in bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 flex gap-4 items-start">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Your company profile is under review</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">The InternPick team is verifying your business. Your profile and job postings won&apos;t be visible to students until approved. This usually takes 1-2 business days.</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Questions? Email <a href="mailto:help@internpick.com" className="underline font-bold hover:text-amber-800">help@internpick.com</a></p>
              </div>
            </div>
          )}
          
          {/* Header & Metric Bar */}
          <section className="animate-fade-in-up bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
            
            {/* Header / Profile Content */}
            <div className="p-6 md:p-10 pb-6 flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Logo & Company Name */}
                <div className="flex items-center gap-5 md:gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-3xl md:text-4xl border border-brand-200 dark:border-brand-800/50 shadow-inner overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt={`${companyName} logo`} className="w-full h-full object-cover" />
                    ) : (
                      industryEmojis[industry] || '🏢'
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                      {companyName || 'Your Company'}
                    </h1>
                    
                    {/* Meta stats */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {zipCode && (
                        <>
                          <span className="flex items-center gap-1.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            ZIP {zipCode}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        </>
                      )}
                      {industry && (
                        <span className="flex items-center gap-1.5 capitalize">
                          {industry}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <Link href="/onboarding/employer?edit=true">
                  <button className="px-4 py-2 text-sm font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors">
                    ✏️ Edit My Business Profile
                  </button>
                </Link>
              </div>
            </div>

            {/* URL Routing Tab Navigation */}
            <div className="flex justify-center md:justify-start w-full overflow-x-auto p-6 md:px-10 pb-8 pt-0 relative z-20">
              <div className="inline-flex bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200 dark:border-slate-700/50 whitespace-nowrap overflow-x-auto">
                <Link 
                  href="/employer" 
                  className={twMerge(
                    "px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 select-none",
                    pathname === '/employer' 
                      ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/employer/roles" 
                  className={twMerge(
                    "px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 select-none",
                    pathname.startsWith('/employer/roles') 
                      ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  Roles
                </Link>
                <Link 
                  href="/employer/search" 
                  className={twMerge(
                    "px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 select-none",
                    pathname.startsWith('/employer/search')
                      ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  Search
                </Link>
                <Link 
                  href="/employer/shortlist" 
                  className={twMerge(
                    "px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 select-none",
                    pathname.startsWith('/employer/shortlist') 
                      ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  Short List
                </Link>
                <Link 
                  href="/employer/interviews" 
                  className={twMerge(
                    "px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 select-none",
                    pathname.startsWith('/employer/interviews') 
                      ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  Interviews
                </Link>
                <Link 
                  href="/employer/hired" 
                  className={twMerge(
                    "px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 select-none",
                    pathname.startsWith('/employer/hired') 
                      ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  Hired
                </Link>
                <Link 
                  href="/employer/analytics" 
                  className={twMerge(
                    "px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 select-none",
                    pathname.startsWith('/employer/analytics') 
                      ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  Analytics
                </Link>
              </div>
            </div>

            {/* Render subpages cleanly here! */}
            <div className="min-h-[500px] px-6 md:px-10 pb-8">
               {children}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
