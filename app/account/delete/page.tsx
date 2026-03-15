"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function DeleteAccountPage() {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
      } else {
        router.push('/login')
      }
    }
    getUser()
  }, [router])

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return
    
    setError(null)
    setIsDeleting(true)

    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
      })
      
      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Failed to delete account. Please try again.')
        setIsDeleting(false)
        return
      }

      // Sign out locally
      const supabase = createClient()
      await supabase.auth.signOut()
      
      router.push('/?deleted=true')
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
            
            {/* Warning Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-red-200 dark:border-red-800/50">
                ⚠️
              </div>
              <h1 className="text-2xl font-black text-red-600 dark:text-red-400">Delete Account</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">This action is permanent and cannot be undone</p>
            </div>

            {/* Warning Box */}
            <div className="mb-6 px-4 py-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl">
              <p className="text-sm text-red-800 dark:text-red-300 font-semibold mb-2">Deleting your account will permanently remove:</p>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-1 ml-4 list-disc">
                <li>Your profile and all personal data</li>
                <li>All applications and messages</li>
                <li>All uploaded videos</li>
                <li>Your login credentials</li>
              </ul>
            </div>

            {userEmail && (
              <div className="mb-6 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Account</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{userEmail}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Confirmation Input */}
            <div className="space-y-2 mb-6">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Type <span className="font-black text-red-600 dark:text-red-400">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
              />
            </div>

            <div className="flex gap-3">
              <Link href="/student" className="flex-1">
                <Button variant="outline" className="w-full rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  Cancel
                </Button>
              </Link>
              <Button
                onClick={handleDelete}
                disabled={confirmText !== 'DELETE' || isDeleting}
                className="flex-1 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-red-500/20"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Deleting...
                  </span>
                ) : 'Delete Account'}
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-500 mt-6">
            <Link href="/student" className="hover:underline">← Back to Dashboard</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
