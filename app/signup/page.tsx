"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

function SignupForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'student' | 'employer' | 'educator'>('student')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Auto-select role from URL param
  useEffect(() => {
    const urlRole = searchParams.get('role')
    if (urlRole === 'employer' || urlRole === 'educator' || urlRole === 'student') {
      setRole(urlRole)
    }
  }, [searchParams])

  const passwordStrength = (() => {
    if (password.length === 0) return { label: '', color: '', width: '0%' }
    if (password.length < 6) return { label: 'Too short', color: 'bg-red-500', width: '20%' }
    if (password.length < 8) return { label: 'Weak', color: 'bg-orange-500', width: '40%' }
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { label: 'Strong', color: 'bg-green-500', width: '100%' }
    if (/(?=.*\d)/.test(password) || /(?=.*[A-Z])/.test(password)) return { label: 'Medium', color: 'bg-yellow-500', width: '60%' }
    return { label: 'Weak', color: 'bg-orange-500', width: '40%' }
  })()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    // TODO: Re-enable educator email validation before production launch
    // if (role === 'educator') {
    //   const emailDomain = email.split('@')[1]?.toLowerCase() || ''
    //   const isSchoolEmail = emailDomain.endsWith('.edu') ||
    //     /\.k12\.[a-z]{2}\.us$/.test(emailDomain) ||
    //     emailDomain.endsWith('.org')
    //   if (!isSchoolEmail) {
    //     setError('School accounts require a .edu, .k12.[state].us, or .org email address to verify your educator status.')
    //     return
    //   }
    // }

    setIsLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${role === 'employer' ? '/onboarding/employer' : role === 'educator' ? '/onboarding/educator' : '/onboarding/student'}`,
      },
    })

    setIsLoading(false)

    if (error) {
      if (error.message.includes('already registered')) {
        setError('This email is already registered. Try signing in instead.')
      } else {
        setError(error.message)
      }
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-md text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border border-green-200 dark:border-green-800/50">
              📧
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Check Your Email</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
              We've sent a verification link to <span className="font-bold text-slate-900 dark:text-white">{email}</span>.
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm mb-8">
              Click the link in the email to activate your account and complete your profile setup.
            </p>
            <Link href="/login">
              <Button variant="outline" className="rounded-xl px-6 border-slate-200 dark:border-slate-700">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-200 dark:border-emerald-800/50">
                🚀
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Create Your Account</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Join InternPick — School-Credit Practicums</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              
              {/* Role Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">I am a...</label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                      role === 'student'
                        ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                      role === 'employer'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    🏢 Business
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('educator')}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                      role === 'educator'
                        ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    🏫 School
                  </button>
                </div>
                {role === 'educator' && (
                  <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1.5">For career &amp; technical education coordinators, teachers &amp; counselors:</p>
                    <ul className="text-xs text-emerald-600/80 dark:text-emerald-400/80 space-y-1">
                      <li>✅ Create unlimited practicum programs</li>
                      <li>✅ Invite students via email or CSV</li>
                      <li>✅ Track hours, journals &amp; evaluations</li>
                      <li>✅ FERPA-compliant data handling</li>
                    </ul>
                  </div>
                )}
                {role === 'employer' && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1.5">Host practicum students at your business:</p>
                    <ul className="text-xs text-blue-600/80 dark:text-blue-400/80 space-y-1">
                      <li>✅ Zero wage liability — school credit only</li>
                      <li>✅ School provides insurance coverage</li>
                      <li>✅ Shape the next generation in your community</li>
                    </ul>
                  </div>
                )}
                {role === 'student' && (
                  <div className="mt-2 p-3 bg-brand-50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-800/30">
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-bold mb-1.5">Your school invites you — here&apos;s what you get:</p>
                    <ul className="text-xs text-brand-600/80 dark:text-brand-400/80 space-y-1">
                      <li>✅ Log hours with employer approval</li>
                      <li>✅ Write weekly reflection journals</li>
                      <li>✅ Build your career interest profile</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                {/* Strength Indicator */}
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`} style={{ width: passwordStrength.width }}></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{passwordStrength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  minLength={8}
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-red-300 dark:border-red-700'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || password !== confirmPassword || password.length < 8}
                className="w-full rounded-xl font-bold py-6 text-md shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </Button>
            </form>

            {/* Terms */}
            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-4 leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-slate-600">Terms of Service</Link>{' '}
              and <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
            </p>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">already have an account?</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>

            <Link href="/login" className="block">
              <Button variant="outline" className="w-full rounded-xl font-semibold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                Sign In Instead
              </Button>
            </Link>
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-500 mt-6">
            <Link href="/" className="hover:underline">← Back to home</Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}