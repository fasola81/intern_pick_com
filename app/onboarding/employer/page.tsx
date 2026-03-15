"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createEmployerProfile } from '@/app/actions'

export default function EmployerOnboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isFinishing, setIsFinishing] = useState(false)
  
  // Form State
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')

  const handleNext = () => {
    if (step < 2) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleFinish = async () => {
    setIsFinishing(true)
    
    const result = await createEmployerProfile({
      companyName: companyName,
      industry: industry,
      zipCode: location,
    })
    
    console.log('[Onboarding] Employer profile result:', result)
    router.push('/employer')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      
      <div className="w-full max-w-lg">
        
        {/* Progress indicator */}
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2].map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step 
                  ? 'w-10 bg-slate-900 dark:bg-white' 
                  : i < step 
                    ? 'w-2 bg-slate-400 dark:bg-slate-500' 
                    : 'w-2 bg-slate-200 dark:bg-slate-800'
              }`}
            ></div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
          
          {/* Step 1: Company Profile */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-slate-200 dark:border-slate-700">
                  🏢
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Set up your business</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Let high school talent know who you are and what you do.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Company Name</label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Springfield Coffee Co." 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all appearance-none text-slate-900 dark:text-white"
                  >
                    <option value="">Select Industry</option>
                    <option value="retail">Retail & E-commerce</option>
                    <option value="food">Food & Beverage</option>
                    <option value="tech">Technology & Software</option>
                    <option value="health">Healthcare Services</option>
                    <option value="construction">Construction & Trades</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-blue-200 dark:border-blue-800/50">
                  🗺️
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Where are you located?</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Students prefer local opportunities. We use your zip code to connect you with nearby talent.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">HQ Zip Code</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. 12345" 
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white"
                />
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
            
            {step < 2 ? (
              <Button 
                onClick={handleNext} 
                className="flex-1 rounded-xl font-bold py-6 text-md bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm"
                disabled={step === 1 && (!companyName || !industry)}
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={handleFinish} 
                className="flex-1 rounded-xl font-bold py-6 text-md bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm disabled:opacity-70 disabled:cursor-wait"
                disabled={!location || location.length < 5 || isFinishing}
              >
                {isFinishing ? "Creating Account..." : "Go to Dashboard"}
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
