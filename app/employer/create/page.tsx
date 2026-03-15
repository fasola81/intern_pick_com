"use client"

import React, { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createOpportunity } from '@/app/actions'

type QuestionType = 'open_ended' | 'multiple_choice' | 'multiple_selection'

interface PrescreenQuestion {
  text: string;
  type: QuestionType;
  options: string[];
}

export default function CreateRolePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [description, setDescription] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [compensation, setCompensation] = useState<'paid' | 'unpaid' | 'credit'>('paid')
  const [hoursPerWeek, setHoursPerWeek] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [questions, setQuestions] = useState<PrescreenQuestion[]>([])
  const [requireVideo, setRequireVideo] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  const availableTags = [
    "Social Media", "Communication", "Canva", "Excel", "Data Entry", 
    "Customer Service", "Writing", "SEO", "Project Management", "Detail Oriented",
    "G-Suite", "Public Speaking", "Problem Solving"
  ]

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, { text: "", type: "open_ended", options: ["", ""] }])
    }
  }

  const handleRemoveQuestion = (indexToRemove: number) => {
    setQuestions(questions.filter((_, index) => index !== indexToRemove))
  }

  const handleUpdateQuestionText = (index: number, text: string) => {
    const newQuestions = [...questions]
    newQuestions[index].text = text
    setQuestions(newQuestions)
  }

  const handleUpdateQuestionType = (index: number, type: QuestionType) => {
    const newQuestions = [...questions]
    newQuestions[index].type = type
    setQuestions(newQuestions)
  }

  const handleAddOption = (qIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options.push("")
    setQuestions(newQuestions)
  }

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== optIndex)
    setQuestions(newQuestions)
  }

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options[optIndex] = text
    setQuestions(newQuestions)
  }

  const handleAIGenerate = () => {
    setIsGenerating(true)
    // Placeholder — will be connected to AI in production
    setTimeout(() => {
      setDescription("Describe the role responsibilities, skills the intern will develop, and what a typical day looks like. Be specific to attract the right candidates.")
      setIsGenerating(false)
    }, 1500)
  }

  const [workSetting, setWorkSetting] = useState<'onsite' | 'hybrid' | 'remote'>('onsite')

  const handlePublish = async () => {
    setIsPublishing(true)
    const result = await createOpportunity({
      title,
      category,
      compensation,
      hourlyRate: compensation === 'paid' ? parseFloat(hoursPerWeek) || undefined : undefined,
      hoursPerWeek: parseInt(hoursPerWeek) || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      workSetting,
      requiredSkills: selectedTags,
      description,
    })
    console.log('[Create Role] Result:', result)
    router.push('/employer')
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          {/* Header */}
          <section className="flex flex-col gap-2 animate-fade-in-up">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              <Link href="/employer" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Employer Portal</Link>
              <span>/</span>
              <span className="text-slate-900 dark:text-white">Post New Role</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create an Internship Opportunity</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Match with the brightest high school talent in your community.</p>
          </section>

          {/* Form Area */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            
            <div className="p-8 md:p-12 flex flex-col gap-10">
              
              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Role Details</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">The basics that students will see when browsing.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Role Title *</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Marketing Assistant, Barista Trainee" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category *</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none text-slate-900 dark:text-white">
                      <option value="">Select a category</option>
                      <option value="marketing">Marketing & Social Media</option>
                      <option value="tech">Technology & IT</option>
                      <option value="hospitality">Hospitality & Retail</option>
                      <option value="admin">Administration & Operations</option>
                      <option value="health">Healthcare & Medical</option>
                      <option value="finance">Finance & Accounting</option>
                      <option value="education">Education & Tutoring</option>
                      <option value="construction">Construction & Trades</option>
                      <option value="arts">Arts & Design</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Compensation *</label>
                    <select value={compensation} onChange={(e) => setCompensation(e.target.value as 'paid' | 'unpaid' | 'credit')} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none text-slate-900 dark:text-white">
                      <option value="paid">Paid (Hourly)</option>
                      <option value="unpaid">Unpaid (Experience)</option>
                      <option value="credit">School Credit</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hours/Week</label>
                    <input 
                      type="number" 
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(e.target.value)}
                      placeholder="e.g. 10" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Start Date</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">End Date</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                   <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Work Setting *</label>
                   <div className="flex flex-wrap gap-3">
                     <button
                       onClick={() => setWorkSetting('onsite')}
                       className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${
                         workSetting === 'onsite' 
                           ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-900/40 dark:border-brand-500/50 dark:text-brand-300 shadow-sm' 
                           : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
                       }`}
                     >
                        🏢 On-site
                     </button>
                     <button
                       onClick={() => setWorkSetting('hybrid')}
                       className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${
                         workSetting === 'hybrid' 
                           ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-900/40 dark:border-brand-500/50 dark:text-brand-300 shadow-sm' 
                           : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
                       }`}
                     >
                        🔄 Hybrid
                     </button>
                     <button
                       onClick={() => setWorkSetting('remote')}
                       className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${
                         workSetting === 'remote' 
                           ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-900/40 dark:border-brand-500/50 dark:text-brand-300 shadow-sm' 
                           : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
                       }`}
                     >
                        💻 Remote
                     </button>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Business Unit</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none text-slate-900 dark:text-white">
                      <option value="">Select Department (Optional)</option>
                      <option value="marketing">Marketing Team</option>
                      <option value="operations">Store Operations</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hiring Manager</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none text-slate-900 dark:text-white">
                      <option value="">Select Manager</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

              {/* Skills & Tagging */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Required Skills</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Select the baseline skills a student should possess. This helps our Match Engine connect you with the right candidates.</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                          isSelected 
                            ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-900/40 dark:border-brand-500/50 dark:text-brand-300 shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

              {/* Description & AI */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Role Description</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Describe the daily tasks and what the student will learn.</p>
                  </div>
                  <button 
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-xl text-sm font-bold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors border border-brand-200 dark:border-brand-800/50"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></span>
                        Generating...
                      </span>
                    ) : (
                      <>
                        <span>✨</span> Generate with AI
                      </>
                    )}
                  </button>
                </div>
                
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will the intern do? What skills will they develop?" 
                  rows={6}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-y"
                ></textarea>
                
                {/* Mobile only AI button */}
                <button 
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                  className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-xl text-sm font-bold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors border border-brand-200 dark:border-brand-800/50"
                >
                  {isGenerating ? "Generating..." : "✨ Generate Description with AI"}
                </button>
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

              {/* Pre-Screening Questions */}
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Application Requirements</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Add short questions for applicants to answer, or request an introductory video.</p>
                </div>

                {/* Video Requirement Toggle */}
                <div 
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    requireVideo 
                      ? 'bg-brand-50/50 dark:bg-brand-900/20 border-brand-300 dark:border-brand-700/50 shadow-sm' 
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setRequireVideo(!requireVideo)}
                >
                  <div className="pt-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      requireVideo 
                        ? 'bg-brand-600 dark:bg-brand-500 text-white' 
                        : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-transparent'
                    }`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  </div>
                  <div className="flex-grow space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-900 dark:text-white">Require 1-Minute Introductory Video</h3>
                      <div className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">New</div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Ask candidates to submit a short video message. This is a great way to learn more about a person's communication style and personality before an interview.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="mb-2 flex items-center justify-between">
                     <h3 className="font-bold text-slate-900 dark:text-white">Written Questions</h3>
                  </div>

                  {questions.map((question, index) => (
                    <div key={index} className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                      <div className="flex gap-3">
                        <div className="flex-grow space-y-3">
                          <input 
                            type="text" 
                            value={question.text}
                            onChange={(e) => handleUpdateQuestionText(index, e.target.value)}
                            placeholder={`Question ${index + 1}`} 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                          />
                          <select
                            value={question.type}
                            onChange={(e) => handleUpdateQuestionType(index, e.target.value as QuestionType)}
                            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none"
                          >
                            <option value="open_ended">Open Ended Text</option>
                            <option value="multiple_choice">Multiple Choice (Single Answer)</option>
                            <option value="multiple_selection">Multiple Selection (Checkboxes)</option>
                          </select>
                        </div>
                        <button 
                          onClick={() => handleRemoveQuestion(index)}
                          className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors border border-slate-200 dark:border-slate-700"
                          title="Remove question"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>

                      {/* Options for Multiple Choice/Selection */}
                      {(question.type === 'multiple_choice' || question.type === 'multiple_selection') && (
                        <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-2 mt-2">
                          {question.options.map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <div className={`w-4 h-4 ${question.type === 'multiple_choice' ? 'rounded-full' : 'rounded-sm'} border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 flex-shrink-0`}></div>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleUpdateOption(index, optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                                className="flex-grow px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                              />
                              <button
                                onClick={() => handleRemoveOption(index, optIndex)}
                                disabled={question.options.length <= 2}
                                className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => handleAddOption(index)}
                            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 mt-2"
                          >
                            <span className="text-lg leading-none">+</span> Add Option
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {questions.length < 5 && (
                    <button 
                      onClick={handleAddQuestion}
                      className="flex items-center gap-2 px-4 py-3 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-bold text-sm transition-colors border border-dashed border-brand-300 dark:border-brand-800/50 rounded-xl hover:bg-brand-50 w-full sm:w-auto mt-2"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      Add Question {questions.length > 0 ? `(${questions.length}/5)` : ''}
                    </button>
                  )}
                  {questions.length === 5 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">Maximum of 5 questions reached.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-4">
              <Link href="/employer" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full rounded-xl bg-white dark:bg-slate-900 border-slate-200 hover:border-slate-300 dark:border-slate-700">Cancel</Button>
              </Link>
              <Button 
                onClick={handlePublish}
                disabled={isPublishing || !title}
                className="w-full sm:w-auto rounded-xl shadow-brand-500/20 px-8 disabled:opacity-70 disabled:cursor-wait"
              >
                {isPublishing ? 'Publishing...' : 'Publish Opportunity'}
              </Button>
            </div>
            
          </section>

        </div>
      </main>
    </div>
  )
}
