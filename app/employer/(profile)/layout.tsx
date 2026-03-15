"use client"

import React from 'react'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

export default function EmployerProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          
          {/* Header & Metric Bar */}
          <section className="animate-fade-in-up bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
            
            {/* Header / Profile Content */}
            <div className="p-6 md:p-10 pb-6 flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Logo & Company Name */}
                <div className="flex items-center gap-5 md:gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-3xl md:text-4xl border border-orange-200 dark:border-orange-800/50 shadow-inner">
                    ☕
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Springfield Coffee Co.</h1>
                    
                    {/* Meta stats */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        Springfield, IL
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <span className="flex items-center gap-1.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                        Food & Beverage
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <span className="flex items-center gap-1.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        45 Employees
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <a href="#" className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        springfieldcoffee.co
                      </a>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full md:w-auto items-center">
                  <Link href="/employer/notifications" className="p-3 text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-colors" title="Notifications">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                  </Link>
                  <Link href="/employer/settings" className="p-3 text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-colors" title="Settings">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  </Link>
                </div>
              </div>

              {/* Mission / About */}
              <div className="bg-slate-50/50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">About Us</h3>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  "We are a local, independent coffee roaster dedicated to sourcing ethical beans and building community spaces. We believe in providing young talent with hands-on experience, fostering a supportive environment where high school students can learn real-world business skills and grow into confident professionals."
                </p>
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
