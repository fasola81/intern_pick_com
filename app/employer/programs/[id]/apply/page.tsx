"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { createBrowserClient } from '@supabase/ssr'
import { submitHostApplication } from '@/app/actions'
import { trackEvent } from '@/lib/tracking'

export default function ApplyToHostPage() {
  const { id: programId } = useParams()
  const router = useRouter()
  const [program, setProgram] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [mentorshipPlan, setMentorshipPlan] = useState('')
  const [capacity, setCapacity] = useState('1')
  const [proposedMentorName, setProposedMentorName] = useState('')

  useEffect(() => {
    async function fetchProgram() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase
        .from('practicum_programs')
        .select(`
          id, title, description, subject_area, grade_levels,
          learning_objectives, required_total_hours, school_provides_insurance,
          educators!practicum_programs_educator_id_fkey (full_name, school_name, title)
        `)
        .eq('id', programId)
        .single()

      if (data) {
        setProgram({
          ...data,
          educator: (data as any).educators || null,
        })
      }
      setIsLoading(false)
    }
    if (programId) fetchProgram()
  }, [programId])

  const canSubmit = mentorshipPlan.trim().length >= 20 && parseInt(capacity) > 0 && proposedMentorName.trim().length > 0

  const getMissingFields = () => {
    const missing: string[] = []
    if (!proposedMentorName.trim()) missing.push('Mentor Name')
    if (mentorshipPlan.trim().length < 20) missing.push('Mentorship Plan (at least 20 characters)')
    if (parseInt(capacity) <= 0 || !capacity) missing.push('Student Capacity')
    return missing
  }

  const handleSubmit = async () => {
    if (!programId || typeof programId !== 'string') return
    setIsSubmitting(true)
    setError('')
    try {
      const result = await submitHostApplication({
        practicumProgramId: programId,
        proposedMentorName,
        mentorshipPlan,
        capacity: parseInt(capacity) || 1,
      })
      if (result.success) {
        trackEvent({ event: 'employer_program_application_submitted', program_id: programId })
        setSubmitted(true)
      } else {
        setError(result.error || 'Failed to submit application')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setIsSubmitting(false)
  }

  const missingFields = getMissingFields()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </main>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Program not found</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">This program may have been removed or is no longer accepting hosts.</p>
            <Button onClick={() => router.push('/employer/programs')} className="bg-emerald-600 hover:bg-emerald-700">Browse Programs</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow flex justify-center items-start pt-8 pb-20 px-4">
        <div className="w-full max-w-2xl">

          {/* Program Info Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/30 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🎓</span>
              </div>
              <div>
                <h2 className="font-bold text-xl text-slate-900 dark:text-white">{program.title}</h2>
                {program.educator && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {program.educator.school_name} • {program.educator.full_name}, {program.educator.title}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                {program.subject_area}
              </span>
              {program.required_total_hours && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                  {program.required_total_hours} hrs required
                </span>
              )}
              {program.school_provides_insurance && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                  ✓ School provides insurance
                </span>
              )}
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">

            {submitted ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Application Submitted!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">The school&apos;s educator will review your application and get back to you. You&apos;ll receive a notification when they respond.</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => router.push('/employer/programs')} variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700">
                    Browse More Programs
                  </Button>
                  <Button onClick={() => router.push('/employer')} className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-brand-200 dark:border-brand-800/50">
                    🤝
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">Apply to Host Students</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">Tell the school how you&apos;ll mentor their students</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex gap-3 animate-fade-in">
                    <span className="text-red-500 text-xl">🚫</span>
                    <p className="text-sm font-bold text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Proposed Mentor Name *</label>
                    <input
                      type="text"
                      value={proposedMentorName}
                      onChange={(e) => setProposedMentorName(e.target.value)}
                      placeholder="e.g. Jane Smith, Operations Manager"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white"
                    />
                    <p className="text-xs text-slate-400">Who will be the student&apos;s day-to-day supervisor at your workplace?</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mentorship Plan *</label>
                    <textarea
                      value={mentorshipPlan}
                      onChange={(e) => setMentorshipPlan(e.target.value)}
                      placeholder={"Describe how you'll supervise and mentor students:\n\n• What tasks will students work on?\n• Who will be their day-to-day mentor?\n• What skills will they develop?\n• How will you ensure a safe, educational environment?"}
                      rows={7}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white resize-none ${
                        mentorshipPlan.trim().length < 20 ? 'border-amber-300 dark:border-amber-700' : 'border-emerald-300 dark:border-emerald-700'
                      }`}
                    />
                    <p className="text-xs text-slate-400">{mentorshipPlan.length} characters (min 20)</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">How many students can you host? *</label>
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      min={1}
                      max={50}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white"
                    />
                    <p className="text-xs text-slate-400">Number of student placements you can accommodate at your workplace</p>
                  </div>

                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex gap-3">
                    <span className="text-emerald-600 text-xl">💡</span>
                    <div>
                      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">What happens next?</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                        The school&apos;s educator will review your application and mentorship plan. If approved, they&apos;ll assign students to your workplace. You&apos;ll then complete a simple digital agreement.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Missing Fields */}
                {missingFields.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">Required to submit:</p>
                    {missingFields.map((f, i) => (
                      <p key={i} className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> {f}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-10 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/employer/programs')}
                    className="rounded-xl px-6 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 rounded-xl font-bold py-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 justify-center">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Submitting...
                      </span>
                    ) : '🤝 Submit Application'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
