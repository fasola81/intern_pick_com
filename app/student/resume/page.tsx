"use client"

import React, { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

import { generateStudentResumeAction } from '@/app/actions'
import { ResumeExperience } from '@/lib/gemini'

export default function StudentResumeBuilderPage() {
  const [step, setStep] = useState(1)
  const [inputText, setInputText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [resumeData, setResumeData] = useState<{ experiences: ResumeExperience[], skills: string[] } | null>(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!inputText.trim()) return
    setIsGenerating(true)
    setError('')
    try {
      const res = await generateStudentResumeAction(inputText)
      if (res.success && res.data) {
        setResumeData(res.data)
        setStep(2)
      } else {
        setError(res.error || 'Failed to generate resume.')
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          <div className="flex items-center gap-4 animate-fade-in-down">
            <Link href="/student" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-brand-600 shadow-sm transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Resume Builder</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Turn your experiences into a professional profile.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-10 flex flex-col gap-8 animate-fade-in-up">
            
            {step === 1 ? (
              <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-1/2 flex flex-col gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-3xl border border-brand-200 dark:border-brand-800/50 mb-2">
                    ✨
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Tell us what you've done. <br/>We'll make it sound great.</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Don't worry about formatting or "professional" language. Just brain dump your school projects, clubs you're in, or any part-time jobs you've had. Our AI will automatically extract your skills and format it for employers.
                  </p>
                  
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Example</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                      "I help run the high school debate team instagram account and we got 500 new followers this year. I also work at Starbucks on weekends making drinks and talking to customers."
                    </p>
                  </div>
                </div>

                <div className="md:w-1/2 flex flex-col gap-4">
                  <textarea 
                    className="w-full h-64 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 resize-none transition-all text-lg shadow-inner"
                    placeholder="Type your experiences here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  ></textarea>

                  <Button 
                    onClick={handleGenerate}
                    disabled={inputText.trim() === '' || isGenerating}
                    className="w-full rounded-2xl py-6 text-lg font-bold shadow-xl shadow-brand-500/25 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Generating Magic...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Generate My Resume <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    )}
                    {error && (
                      <div className="mt-4 px-4 py-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm font-medium rounded-xl flex items-center justify-start gap-2">
                        <span>⚠️</span> {error}
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8 animate-fade-in-up">
                
                <div className="flex items-center justify-center gap-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-2xl border border-green-200 dark:border-green-800/30">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">✓</div>
                  <span className="font-bold">Resume successfully generated!</span>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Before */}
                  <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 uppercase text-xs tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-slate-300"></span> What you wrote
                    </h4>
                    <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 text-sm italic">
                      {inputText || "I help run the high school debate team instagram account and we got 500 new followers this year. I also work at Starbucks on weekends making drinks and talking to customers."}
                    </div>
                  </div>

                  {/* After */}
                  <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-2 uppercase text-xs tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> AI Generated Profile
                    </h4>
                    
                    <div className="flex flex-col gap-4">
                      {resumeData?.experiences?.map((exp, idx) => (
                        <div key={idx} className="p-6 bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-slate-900 border border-brand-200 dark:border-brand-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                          <h5 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{exp.title}</h5>
                          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-3">{exp.entity}</p>
                          <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-2">
                            {exp.bullets?.map((bullet, bIdx) => (
                              <li key={bIdx} className="leading-relaxed">{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {resumeData?.skills && resumeData.skills.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detected Skills Added to Profile:</p>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill, idx) => (
                              <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold ring-1 ring-slate-200 dark:ring-slate-700">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-2xl px-8 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Try Again
                  </Button>
                  <Link href="/student" className="flex-grow">
                    <Button className="w-full rounded-2xl bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25 gap-2">
                      Save to Profile & Return Home <span className="translate-x-1">→</span>
                    </Button>
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}
