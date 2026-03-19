"use client"

import React, { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function InviteStudentsPage() {
  const [mode, setMode] = useState<'single' | 'csv'>('single')
  const [email, setEmail] = useState('')
  const [csvData, setCsvData] = useState('')
  const [invitedList, setInvitedList] = useState<{ email: string; status: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const parseCsv = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim())
    const emails: string[] = []
    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim())
      const found = parts.find(p => p.includes('@'))
      if (found) emails.push(found.toLowerCase())
    }
    return [...new Set(emails)]
  }

  const handleSingleInvite = async () => {
    if (!email.includes('@')) { setError('Enter a valid email'); return }
    setIsLoading(true)
    setError('')
    // For now, add to local list (email invite would be server-side)
    setInvitedList(prev => [...prev, { email: email.toLowerCase(), status: 'Invited' }])
    setEmail('')
    setIsLoading(false)
  }

  const handleCsvInvite = () => {
    const emails = parseCsv(csvData)
    if (emails.length === 0) { setError('No valid emails found in CSV'); return }
    setError('')
    setInvitedList(prev => [
      ...prev,
      ...emails
        .filter(e => !prev.some(p => p.email === e))
        .map(e => ({ email: e, status: 'Invited' }))
    ])
    setCsvData('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      setCsvData(evt.target?.result as string || '')
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">📩 Invite Students</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add students to your practicum program.</p>
            </div>
            <Link href="/educator/students" className="text-sm font-medium text-blue-600 hover:text-blue-700">&larr; Students</Link>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setMode('single')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === 'single' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              ✉️ Individual
            </button>
            <button
              onClick={() => setMode('csv')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === 'csv' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              📄 CSV Upload
            </button>
          </div>

          {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl p-3 text-sm text-red-700 dark:text-red-300">⚠️ {error}</div>}

          {/* Single Email */}
          {mode === 'single' ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Invite by Email</h3>
              <p className="text-sm text-slate-500">Send an invite link to a student&apos;s email address.</p>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@email.com"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleSingleInvite()}
                />
                <Button onClick={handleSingleInvite} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
                  Invite
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Bulk CSV Import</h3>
              <p className="text-sm text-slate-500">Upload a CSV with student names and emails. We&apos;ll extract the email column automatically.</p>

              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
                <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to upload CSV</p>
                  <p className="text-xs text-slate-400 mt-1">or paste content below</p>
                </label>
              </div>

              <textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="Name, Email&#10;John Smith, john@email.com&#10;Jane Doe, jane@email.com"
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm resize-none"
              />

              {csvData && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-emerald-600 font-medium">{parseCsv(csvData).length} emails found</p>
                  <Button onClick={handleCsvInvite} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
                    Import All
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Invited List */}
          {invitedList.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white">Invited ({invitedList.length})</h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {invitedList.map((inv, i) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{inv.email}</span>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
