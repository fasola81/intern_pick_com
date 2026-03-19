"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/Button'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { twMerge } from 'tailwind-merge'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }
    getUser()
    
    // Close mobile menu and dropdowns instantly on any navigation
    setShowMobileMenu(false)
    setShowDropdown(false)
    setShowNotifications(false)
  }, [pathname])

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setShowDropdown(false)
    router.push('/')
    router.refresh()
  }

  const userRole = user?.user_metadata?.role || 'student'
  const dashboardPath = userRole === 'employer' ? '/employer' : userRole === 'educator' ? '/educator' : '/student'
  const settingsPath = userRole === 'employer' ? '/employer/account' : userRole === 'educator' ? '/educator' : '/student'
  const userInitial = user?.email?.[0]?.toUpperCase() || '?'

  // Notification items — will be dynamic in the future
  const notifications = [
    // Empty for now — real notifications will come from DB
  ] as Array<{ id: string; text: string; link: string; time: string; unread: boolean }>

  const employerTabs = [
    { href: '/employer', label: 'Dashboard', exact: true },
    { href: '/employer/programs', label: 'Programs' },
    { href: '/employer/placements', label: 'Placements' },
    { href: '/employer/account', label: 'Settings' },
  ]

  const studentTabs = [
    { href: '/student', label: 'Dashboard', exact: true },
    { href: '/student/profile', label: 'Profile' },
    { href: '/student/log-hours', label: 'Log Hours' },
    { href: '/student/journal', label: 'Journal' },
  ]

  const educatorTabs = [
    { href: '/educator', label: 'Dashboard', exact: true },
    { href: '/educator/create-program', label: 'Create Program' },
    { href: '/educator/students', label: 'Students' },
    { href: '/educator/progress', label: 'Progress' },
  ]

  const isEmployer = user && userRole === 'employer'
  const isEducator = user && userRole === 'educator'

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <Image 
              src="/icons/logo/logo_dark.png" 
              alt="InternPick Logo" 
              width={100} 
              height={100} 
              className="block h-9 w-auto object-contain dark:hidden"
              priority
            />
            <Image 
              src="/icons/logo/logo_white.png" 
              alt="InternPick Logo" 
              width={100} 
              height={100} 
              className="hidden h-9 w-auto object-contain dark:block"
              priority
            />
            <span className="text-lg md:text-2xl tracking-tight text-slate-800 dark:text-slate-200">
              <span className="font-medium">Intern</span><span className="font-extrabold text-brand-600 dark:text-brand-400">Pick</span><span className="font-normal text-slate-400 dark:text-slate-500 text-sm md:text-base">.com</span>
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {isEducator && pathname.startsWith('/educator') ? (
              <div className="flex bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/40">
                {educatorTabs.map((tab) => {
                  const isActive = tab.exact
                    ? pathname === tab.href
                    : pathname.startsWith(tab.href)
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={twMerge(
                        'px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none whitespace-nowrap',
                        isActive
                          ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      )}
                    >
                      {tab.label}
                    </Link>
                  )
                })}
              </div>
            ) : isEmployer && pathname.startsWith('/employer') ? (
              <div className="flex bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/40">
                {employerTabs.map((tab) => {
                  const isActive = tab.exact
                    ? pathname === tab.href
                    : pathname.startsWith(tab.href)
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={twMerge(
                        'px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none whitespace-nowrap',
                        isActive
                          ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      )}
                    >
                      {tab.label}
                    </Link>
                  )
                })}
              </div>
            ) : user && userRole === 'student' && pathname.startsWith('/student') ? (
              <div className="flex bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/40">
                {studentTabs.map((tab) => {
                  const isActive = tab.exact
                    ? pathname === tab.href
                    : pathname.startsWith(tab.href)
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={twMerge(
                        'px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none whitespace-nowrap',
                        isActive
                          ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      )}
                    >
                      {tab.label}
                    </Link>
                  )
                })}
              </div>
            ) : (
              <>
                <Link href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors px-2">
                  How it Works
                </Link>
                <Link href="/internship-rules" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors px-2">
                  WBL Resources
                </Link>
                <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors px-2">
                  About Us
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Menu"
          >
            {showMobileMenu ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          ) : user ? (
            /* Authenticated state */
            <>
              {/* Notifications Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false) }}
                  className="p-2 rounded-xl text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                  title="Notifications"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 animate-fade-in overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                    </div>
                    
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <div className="text-3xl mb-2">🔔</div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No notifications yet</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">You&#39;ll be notified about applications, messages, and updates.</p>
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notif) => (
                          <Link
                            key={notif.id}
                            href={notif.link}
                            onClick={() => setShowNotifications(false)}
                            className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${notif.unread ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}
                          >
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.unread ? 'bg-brand-500' : 'bg-transparent'}`}></div>
                            <div className="min-w-0">
                              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{notif.text}</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{notif.time}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Settings Gear */}
              <Link
                href={settingsPath}
                className="p-2 rounded-xl text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Settings"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </Link>

              {/* User Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false) }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold">
                    {userInitial}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block max-w-[120px] truncate">
                    {user.email}
                  </span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{user.email}</p>
                    </div>
                    
                    <Link
                      href={dashboardPath}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>📊</span> Dashboard
                    </Link>
                    
                    <Link
                      href={`${dashboardPath}/messages`}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>💬</span> Messages
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Unauthenticated state */
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Dropdown Menu */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md animate-fade-in absolute top-full left-0 w-full shadow-lg">
          <div className="flex flex-col px-4 py-4 gap-2">
            {isEducator && pathname.startsWith('/educator') ? (
              educatorTabs.map((tab) => {
                const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={twMerge(
                      'px-4 py-3 rounded-xl text-sm font-bold transition-all',
                      isActive
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    {tab.label}
                  </Link>
                )
              })
            ) : isEmployer && pathname.startsWith('/employer') ? (
              employerTabs.map((tab) => {
                const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={twMerge(
                      'px-4 py-3 rounded-xl text-sm font-bold transition-all',
                      isActive
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    {tab.label}
                  </Link>
                )
              })
            ) : user && userRole === 'student' && pathname.startsWith('/student') ? (
              studentTabs.map((tab) => {
                const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={twMerge(
                      'px-4 py-3 rounded-xl text-sm font-bold transition-all',
                      isActive
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    {tab.label}
                  </Link>
                )
              })
            ) : (
              <>
                <Link href="/#how-it-works" className="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  How it Works
                </Link>
                <Link href="/internship-rules" className="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  WBL Resources
                </Link>
                <Link href="/about" className="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  About Us
                </Link>
                {!user && (
                  <Link href="/login" className="px-4 py-3 text-sm font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl sm:hidden transition-colors">
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
