"use client"

import React, { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    setIsLoading(false)

    if (error) {
      setError(error.message)
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
              ✉️
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Check Your Email</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
              We've sent a password reset link to <span className="font-bold text-slate-900 dark:text-white">{email}</span>.
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm mb-8">
              Click the link in the email to set a new password. The link will expire in 1 hour.
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
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-amber-200 dark:border-amber-800/50">
                🔑
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Forgot Password?</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your email and we'll send you a reset link</p>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl font-bold py-6 text-md shadow-brand-500/20 disabled:opacity-70 disabled:cursor-wait"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Sending reset link...
                  </span>
                ) : 'Send Reset Link'}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-500 mt-6">
              <Link href="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">← Back to Sign In</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
