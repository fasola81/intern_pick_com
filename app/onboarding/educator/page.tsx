"use client"

import React, { useState, Suspense } from 'react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { registerEducator } from '@/app/actions'

function EducatorOnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isFinishing, setIsFinishing] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [fullName, setFullName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [schoolDistrict, setSchoolDistrict] = useState('')
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('')

  const totalSteps = 3

  const stepIcons = ['🎓', '🏫', '🚀']
  const stepTitles = [
    'Tell us about you',
    'Your school details',
    'Review & Launch',
  ]
  const stepSubtitles = [
    'We need a few details to set up your educator profile.',
    'Help us connect you with local employers in your area.',
    'Everything look good? Let\'s get your WBL program started!',
  ]

  const canProceed = () => {
    switch (step) {
      case 1: return fullName.trim() && title.trim()
      case 2: return schoolName.trim()
      case 3: return true
      default: return false
    }
  }

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleFinish = async () => {
    setIsFinishing(true)
    setError('')
    try {
      const result = await registerEducator({
        fullName,
        schoolName,
        schoolDistrict: schoolDistrict || undefined,
        title,
        department: department || undefined,
      })
      if (result.success) {
        router.push('/educator')
      } else {
        setError(result.error || 'Something went wrong. Please try again.')
        setIsFinishing(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setIsFinishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg">

        {/* Progress indicator */}
        <div className="mb-8 flex justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-10 bg-emerald-600 dark:bg-emerald-400'
                  : i < step
                    ? 'w-2 bg-emerald-300 dark:bg-emerald-600'
                    : 'w-2 bg-slate-200 dark:bg-slate-800'
              }`}
            ></div>
          ))}
        </div>

        <p className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider">
          Step {step} of {totalSteps}
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">

          {/* Step Icon & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-200 dark:border-emerald-800/50">
              {stepIcons[step - 1]}
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{stepTitles[step - 1]}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">{stepSubtitles[step - 1]}</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex gap-3 animate-fade-in">
              <span className="text-red-500 text-xl">🚫</span>
              <p className="text-sm font-bold text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="animate-fade-in space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Johnson"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Your Title / Role *</label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none text-slate-900 dark:text-white"
                >
                  <option value="">Select your role</option>
                  <option value="CTE Coordinator">CTE Coordinator</option>
                  <option value="Career Counselor">Career Counselor</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Department Head">Department Head</option>
                  <option value="Principal">Principal</option>
                  <option value="Work-Based Learning Coordinator">Work-Based Learning Coordinator</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Department <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Career & Technical Education"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Step 2: School Info */}
          {step === 2 && (
            <div className="animate-fade-in space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">School Name *</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Springfield High School"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">School District <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={schoolDistrict}
                  onChange={(e) => setSchoolDistrict(e.target.value)}
                  placeholder="e.g. Union County School District"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex gap-3">
                <span className="text-emerald-600 text-xl">🔒</span>
                <div>
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">FERPA Compliant</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">Student data is never shared publicly. Students can only join your programs via invite links you generate.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="animate-fade-in space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                <div className="p-5 flex items-center gap-4 border-b border-slate-200 dark:border-slate-700/50">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl border border-emerald-200 dark:border-emerald-800/50">
                    🎓
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{fullName}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{title}{department ? ` • ${department}` : ''}</p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 dark:text-slate-500 text-sm w-24 flex-shrink-0 font-medium">School</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{schoolName}</span>
                  </div>
                  {schoolDistrict && (
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 dark:text-slate-500 text-sm w-24 flex-shrink-0 font-medium">District</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{schoolDistrict}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/50 flex gap-3">
                <span className="text-emerald-600 text-xl">✅</span>
                <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                  Your educator profile is ready! After setup, you can create your first Practicum Program and invite local employers to host your students.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-10 flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="rounded-xl px-6 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                disabled={isFinishing}
              >
                Back
              </Button>
            )}

            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                className="flex-1 rounded-xl font-bold py-6 text-md shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700"
                disabled={!canProceed()}
              >
                Continue →
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                className="flex-1 rounded-xl font-bold py-6 text-md shadow-emerald-500/20 disabled:opacity-50 bg-emerald-600 hover:bg-emerald-700"
                disabled={isFinishing}
              >
                {isFinishing ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Creating Profile...
                  </span>
                ) : (
                  '🚀 Launch My Educator Profile'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EducatorOnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    }>
      <EducatorOnboardingWizard />
    </Suspense>
  )
}
