"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createStudentProfile } from '@/app/actions'

export default function StudentOnboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isFinishing, setIsFinishing] = useState(false)
  
  // Form State
  const [location, setLocation] = useState('')
  const [highSchool, setHighSchool] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const interestsList = [
    "Software Engineering", "Marketing", "Graphic Design", 
    "Data Analysis", "Sales", "Customer Support", 
    "Healthcare", "Finance", "Social Media", "Retail"
  ]

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleFinish = async () => {
    setIsFinishing(true)
    
    const result = await createStudentProfile({
      highSchool: highSchool,
      zipCode: location,
      interests: selectedInterests,
    })
    
    console.log('[Onboarding] Student profile result:', result)
    router.push('/student')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      
      <div className="w-full max-w-lg">
        
        {/* Progress indicator */}
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step 
                  ? 'w-10 bg-brand-500' 
                  : i < step 
                    ? 'w-2 bg-brand-200 dark:bg-brand-900/50' 
                    : 'w-2 bg-slate-200 dark:bg-slate-800'
              }`}
            ></div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
          
          {/* Step 1: High School */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-brand-200 dark:border-brand-800/50">
                  🏫
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Welcome to InternPick!</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Let's get your profile set up so you can start matching with local businesses.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">What high school do you attend?</label>
                <input 
                  type="text" 
                  value={highSchool}
                  onChange={(e) => setHighSchool(e.target.value)}
                  placeholder="e.g. Springfield High School" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-blue-200 dark:border-blue-800/50">
                  📍
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Where are you looking?</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">We prioritize internships that are close to your home or school.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Your Zip Code</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. 12345" 
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-orange-200 dark:border-orange-800/50">
                  🎯
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">What interests you?</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Select a few areas you'd like to get experience in. Our match engine uses this to find the best roles.</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {interestsList.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                      selectedInterests.includes(interest)
                        ? 'bg-brand-500 border-brand-500 text-white shadow-md transform scale-105' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
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
            
            {step < 3 ? (
              <Button 
                onClick={handleNext} 
                className="flex-1 rounded-xl font-bold py-6 text-md shadow-brand-500/20"
                disabled={step === 1 && !highSchool || step === 2 && !location}
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={handleFinish} 
                className="flex-1 rounded-xl font-bold py-6 text-md bg-brand-600 hover:bg-brand-700 shadow-brand-500/30 text-white disabled:opacity-70 disabled:cursor-wait"
                disabled={selectedInterests.length === 0 || isFinishing}
              >
                {isFinishing ? "Building your Feed..." : "Finish Setup"}
              </Button>
            )}
          </div>
          
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-500 mt-6">
          <Link href="/login" className="hover:underline">Cancel and return to login</Link>
        </p>

      </div>
    </div>
  )
}
