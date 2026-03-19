"use client"

import React, { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { createPracticumProgram, moderateAndPublishPracticumAction } from '@/app/actions'

export default function CreateProgramPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [savedProgramId, setSavedProgramId] = useState<string | null>(null)
  const [publishResult, setPublishResult] = useState<{ success: boolean; issues?: string[] } | null>(null)
  const [error, setError] = useState('')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subjectArea, setSubjectArea] = useState('')
  const [gradeLevels, setGradeLevels] = useState('')
  const [learningObjectives, setLearningObjectives] = useState('')
  const [requiredTotalHours, setRequiredTotalHours] = useState('120')
  const [schoolProvidesInsurance, setSchoolProvidesInsurance] = useState(false)

  const totalSteps = 4
  const stepIcons = ['📋', '🎯', '⚙️', '🚀']
  const stepTitles = [
    'Program Basics',
    'Learning Objectives',
    'Program Settings',
    'Review & Publish',
  ]

  const canProceed = () => {
    switch (step) {
      case 1: return title.trim() && description.trim().length >= 20 && subjectArea.trim()
      case 2: return learningObjectives.trim().length >= 20
      case 3: return parseInt(requiredTotalHours) > 0
      case 4: return true
      default: return false
    }
  }

  const getMissingFields = () => {
    const missing: string[] = []
    switch (step) {
      case 1:
        if (!title.trim()) missing.push('Program Title')
        if (description.trim().length < 20) missing.push('Description (at least 20 characters)')
        if (!subjectArea.trim()) missing.push('Subject Area')
        break
      case 2:
        if (learningObjectives.trim().length < 20) missing.push('Learning Objectives (at least 20 characters)')
        break
      case 3:
        if (parseInt(requiredTotalHours) <= 0 || !requiredTotalHours) missing.push('Required Hours')
        break
    }
    return missing
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    setError('')
    try {
      const result = await createPracticumProgram({
        title,
        description,
        schoolName: subjectArea, // maps to school_name in DB — subject area stored there
        category: gradeLevels || undefined,
        learningObjectives: learningObjectives || undefined,
        requiredTotalHours: parseInt(requiredTotalHours) || 120,
        schoolProvidesInsurance,
      })
      if (result.success && result.program) {
        setSavedProgramId(result.program.id)
        setStep(4)
      } else {
        setError(result.error || 'Failed to save program')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setIsSaving(false)
  }

  const handlePublish = async () => {
    if (!savedProgramId) return
    setIsPublishing(true)
    setError('')
    try {
      const result = await moderateAndPublishPracticumAction(savedProgramId)
      if (result.success) {
        setPublishResult({ success: true })
        setTimeout(() => router.push('/educator'), 2000)
      } else {
        const issues: string[] = []
        if (result.review) {
          issues.push(...(result.review.ferpaViolations || []))
          issues.push(...(result.review.safetyIssues || []))
          issues.push(...(result.review.clarityIssues || []))
        } else if (result.error) {
          issues.push(result.error)
        }
        setPublishResult({ success: false, issues: issues.length > 0 ? issues : ['Unknown error'] })
      }
    } catch {
      setError('Failed to publish. Please try again.')
    }
    setIsPublishing(false)
  }

  const missingFields = getMissingFields()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow flex justify-center items-start pt-8 pb-20 px-4">
        <div className="w-full max-w-2xl">

          {/* Progress */}
          <div className="mb-8 flex justify-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-10 bg-emerald-600 dark:bg-emerald-400'
                  : i < step ? 'w-2 bg-emerald-300 dark:bg-emerald-600'
                    : 'w-2 bg-slate-200 dark:bg-slate-800'
              }`}></div>
            ))}
          </div>

          <p className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider">
            Step {step} of {totalSteps}
          </p>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-200 dark:border-emerald-800/50">
                {stepIcons[step - 1]}
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{stepTitles[step - 1]}</h1>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex gap-3 animate-fade-in">
                <span className="text-red-500 text-xl">🚫</span>
                <p className="text-sm font-bold text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Step 1: Basics */}
            {step === 1 && (
              <div className="animate-fade-in space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Program Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Business Administration Practicum — Spring 2026"
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white ${
                      !canProceed() && !title.trim() ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {!title.trim() && step === 1 && (
                    <p className="text-xs text-red-500 font-medium">Required</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Subject Area *</label>
                  <select
                    value={subjectArea}
                    onChange={(e) => setSubjectArea(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none text-slate-900 dark:text-white ${
                      !canProceed() && !subjectArea.trim() ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <option value="">Select subject area</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing & Communications">Marketing & Communications</option>
                    <option value="Culinary Arts">Culinary Arts</option>
                    <option value="Construction & Trades">Construction & Trades</option>
                    <option value="Legal Studies">Legal Studies</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Grade Levels <span className="text-slate-400 font-normal">(optional)</span></label>
                  <select
                    value={gradeLevels}
                    onChange={(e) => setGradeLevels(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none text-slate-900 dark:text-white"
                  >
                    <option value="">Any grade level</option>
                    <option value="9-10">9th – 10th Grade</option>
                    <option value="11-12">11th – 12th Grade</option>
                    <option value="9-12">All High School (9-12)</option>
                    <option value="College">College / University</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Program Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what students will experience, the type of workplace environments, and what skills they'll develop..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white resize-none ${
                      !canProceed() && description.trim().length < 20 ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  <p className="text-xs text-slate-400">{description.length} characters (min 20)</p>
                </div>
              </div>
            )}

            {/* Step 2: Learning Objectives */}
            {step === 2 && (
              <div className="animate-fade-in space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex gap-3">
                  <span className="text-emerald-600 text-xl">💡</span>
                  <div>
                    <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">What will students learn?</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">Clear learning objectives help employers understand what the practicum is about and how to mentor students effectively.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Learning Objectives *</label>
                  <textarea
                    value={learningObjectives}
                    onChange={(e) => setLearningObjectives(e.target.value)}
                    placeholder={"• Apply classroom business concepts in a real workplace setting\n• Develop professional communication and teamwork skills\n• Understand workplace safety and professional ethics\n• Complete a capstone reflection project"}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white resize-none ${
                      !canProceed() && learningObjectives.trim().length < 20 ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  <p className="text-xs text-slate-400">{learningObjectives.length} characters (min 20)</p>
                </div>
              </div>
            )}

            {/* Step 3: Settings */}
            {step === 3 && (
              <div className="animate-fade-in space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Required Total Hours *</label>
                  <input
                    type="number"
                    value={requiredTotalHours}
                    onChange={(e) => setRequiredTotalHours(e.target.value)}
                    min={1}
                    max={2000}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white"
                  />
                  <p className="text-xs text-slate-400">Total hours students must complete for credit (typical: 80-200)</p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={schoolProvidesInsurance}
                    onChange={(e) => setSchoolProvidesInsurance(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="insurance" className="cursor-pointer">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">School provides liability insurance</p>
                    <p className="text-xs text-slate-500 mt-1">Check this if your school covers students with liability insurance during their placement. This is a key factor employers consider.</p>
                  </label>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl flex gap-3">
                  <span className="text-blue-600 text-xl">⚖️</span>
                  <div>
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-200">FLSA Compliance Built-In</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Because this is a school-sponsored program for academic credit, it inherently passes the DOL&apos;s Primary Beneficiary Test. Employers are protected from wage/hour complaints.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Publish */}
            {step === 4 && (
              <div className="animate-fade-in space-y-4">
                {publishResult?.success ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Program Published!</h3>
                    <p className="text-slate-500 dark:text-slate-400">Local employers can now see your program and apply to host students.</p>
                    <p className="text-sm text-slate-400 mt-4">Redirecting to dashboard...</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                      <div className="p-5 border-b border-slate-200 dark:border-slate-700/50">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subjectArea} • {gradeLevels || 'All Grades'} • {requiredTotalHours} hours</p>
                      </div>
                      <div className="p-5 space-y-3 text-sm">
                        <div>
                          <span className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">Description</span>
                          <p className="text-slate-700 dark:text-slate-300 mt-1">{description}</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">Learning Objectives</span>
                          <p className="text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-line">{learningObjectives}</p>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <span className={`w-3 h-3 rounded-full ${schoolProvidesInsurance ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                          <span className="text-slate-600 dark:text-slate-400 text-sm">
                            {schoolProvidesInsurance ? 'School provides liability insurance' : 'No school insurance coverage'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {publishResult && !publishResult.success && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
                        <p className="text-sm font-bold text-red-800 dark:text-red-200 mb-2">⚠️ AI Review found issues:</p>
                        <ul className="space-y-1">
                          {publishResult.issues?.map((issue, i) => (
                            <li key={i} className="text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                              <span>•</span><span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-3">Please go back and fix these issues, then try publishing again.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Missing Fields Indicator */}
            {step < 4 && missingFields.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">Required to continue:</p>
                {missingFields.map((f, i) => (
                  <p key={i} className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> {f}
                  </p>
                ))}
              </div>
            )}

            {/* Navigation */}
            {!publishResult?.success && (
              <div className="mt-10 flex gap-3">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="rounded-xl px-6 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    disabled={isSaving || isPublishing}
                  >
                    Back
                  </Button>
                )}

                {step < 3 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    className="flex-1 rounded-xl font-bold py-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!canProceed()}
                  >
                    Continue →
                  </Button>
                ) : step === 3 ? (
                  <Button
                    onClick={handleSaveDraft}
                    className="flex-1 rounded-xl font-bold py-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                    disabled={!canProceed() || isSaving}
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2 justify-center">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Saving...
                      </span>
                    ) : 'Save & Review →'}
                  </Button>
                ) : (
                  <Button
                    onClick={handlePublish}
                    className="flex-1 rounded-xl font-bold py-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <span className="flex items-center gap-2 justify-center">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        🤖 AI Reviewing...
                      </span>
                    ) : '📢 Publish — Start Seeking Hosts'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
