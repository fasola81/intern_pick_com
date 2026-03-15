"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function EmployerShortlistPage() {
  // Feedback Modal State
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<{name: string, role: string} | null>(null)
  const [feedbackType, setFeedbackType] = useState<string>('')
  const [feedbackText, setFeedbackText] = useState('')

  // Shortlist Modal State
  const [isShortlistModalOpen, setIsShortlistModalOpen] = useState(false)
  const [shortlistActionType, setShortlistActionType] = useState<'interview' | 'intro'>('interview')

  const handlePassClick = (name: string, role: string) => {
    setSelectedCandidate({ name, role })
    setIsFeedbackModalOpen(true)
  }

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false)
    setSelectedCandidate(null)
    setFeedbackType('')
    setFeedbackText('')
  }

  const handleShortlistClick = (name: string, role: string) => {
    setSelectedCandidate({ name, role })
    setIsShortlistModalOpen(true)
  }

  const closeShortlistModal = () => {
    setIsShortlistModalOpen(false)
    setSelectedCandidate(null)
    setShortlistActionType('interview')
  }

  return (
    <>
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white pl-1">Short List Candidates</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 pl-1 mt-1">Reviewing <span className="font-bold text-slate-700 dark:text-slate-300">2</span> matches</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      {/* Role Filter */}
                      <div className="relative w-full sm:w-auto">
                        <select defaultValue="social" className="w-full sm:w-48 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all">
                          <option value="all">All Roles</option>
                          <option value="social">Social Media Assistant</option>
                          <option value="barista">Weekend Barista Trainee</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                        </div>
                      </div>

                      {/* Match Score Filter */}
                      <div className="relative w-full sm:w-auto">
                        <select defaultValue="75" className="w-full sm:w-48 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all">
                          <option value="any">Any Match Score</option>
                          <option value="90">90% +</option>
                          <option value="75">75% +</option>
                          <option value="50">50% +</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Profile 1 */}
                  <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border-2 border-brand-100 dark:border-brand-900/50 shadow-sm hover:shadow-lg transition-all duration-300 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/5 rounded-full blur-[60px] pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                      
                      {/* Avatar & Info */}
                      <div className="flex-shrink-0 flex items-center gap-5 w-full md:w-1/3">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-indigo-100 to-brand-50 dark:from-indigo-900/40 dark:to-brand-900/20 border border-brand-200 dark:border-brand-800/50 flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                          🧑‍🎓
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sarah Jenkins</h3>
                            <span className="bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">98% Match</span>
                          </div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Junior • Springfield High</p>
                          <p className="text-xs text-slate-500 mt-1">Applied to: Social Media Assistant</p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="w-full md:w-1/3 flex flex-wrap gap-2 pt-2 md:pt-0">
                         <span className="px-3 py-1.5 bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700/50">Digital Marketing</span>
                         <span className="px-3 py-1.5 bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700/50">Graphic Design</span>
                         <span className="px-3 py-1.5 bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700/50">CapCut</span>
                      </div>

                      {/* Actions */}
                      <div className="w-full md:w-1/3 flex flex-row justify-end gap-3 md:pl-6">
                        <Button 
                          variant="outline" 
                          onClick={() => handlePassClick('Sarah Jenkins', 'Social Media Assistant')}
                          className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-xl"
                        >
                          Pass
                        </Button>
                        <Button 
                          onClick={() => handleShortlistClick('Sarah Jenkins', 'Social Media Assistant')}
                          className="flex-1 md:flex-none bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20 rounded-xl border border-brand-500"
                        >
                          💬 Start Chat
                        </Button>
                      </div>

                    </div>
                    
                    {/* Why they are a match */}
                    <div className="mt-8 bg-brand-50/50 dark:bg-brand-900/10 p-5 rounded-2xl border border-brand-100 dark:border-brand-800/30 flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-brand-600 dark:text-brand-400 font-bold text-sm">💡 AI Recommendation</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                          "Highly relevant experience managing school newspaper's Instagram account. Grew engagement by 40% over two years."
                        </p>
                      </div>
                      <button className="flex-shrink-0 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm whitespace-nowrap">
                        Unlock Resume 🔒
                      </button>
                    </div>
                  </div>

                  {/* Candidate Profile 2 */}
                  <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                      
                      {/* Avatar & Info */}
                      <div className="flex-shrink-0 flex items-center gap-5 w-full md:w-1/3">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-4xl shadow-inner">
                          👨‍🎓
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">David Lee</h3>
                            <span className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">75% Match</span>
                          </div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Senior • Union Catholic Prep</p>
                          <p className="text-xs text-slate-500 mt-1">Applied to: Weekend Trainee</p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="w-full md:w-1/3 flex flex-wrap gap-2 pt-2 md:pt-0">
                         <span className="px-3 py-1.5 bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700/50">Customer Service</span>
                         <span className="px-3 py-1.5 bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700/50">Punctual</span>
                      </div>

                      {/* Actions */}
                      <div className="w-full md:w-1/3 flex flex-row justify-end gap-3 md:pl-6">
                        <Button 
                          variant="outline" 
                          onClick={() => handlePassClick('David Lee', 'Weekend Trainee')}
                          className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-xl"
                        >
                          Pass
                        </Button>
                        <Button 
                          onClick={() => handleShortlistClick('David Lee', 'Weekend Trainee')}
                          className="flex-1 md:flex-none bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20 rounded-xl border border-brand-500"
                        >
                          💬 Start Chat
                        </Button>
                      </div>

                    </div>
                  </div>

                </div>

      {/* Feedback Modal */}
      {isFeedbackModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeFeedbackModal}
          ></div>
          
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
            
            <div className="p-6 sm:p-8">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Pass on {selectedCandidate.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">For {selectedCandidate.role}</p>
                  </div>
                  <button 
                    onClick={closeFeedbackModal}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-full transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
               </div>

               <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-2xl border border-brand-100 dark:border-brand-800/50 mb-6 flex gap-3">
                 <span className="text-brand-600 dark:text-brand-400 text-xl">💡</span>
                 <p className="text-sm text-brand-800 dark:text-brand-300 font-medium">
                   <strong className="block mb-1">Help students grow.</strong>
                   Providing optional feedback helps students understand what skills they are missing and how they can improve their chances for future opportunities.
                 </p>
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Primary Reason (Optional)</label>
                   <select 
                     value={feedbackType}
                     onChange={(e) => setFeedbackType(e.target.value)}
                     className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white appearance-none"
                   >
                     <option value="">Select a reason</option>
                     <option value="experience">Needs more specific experience</option>
                     <option value="skills">Missing required technical skills</option>
                     <option value="availability">Schedule doesn't align</option>
                     <option value="other">Other</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Additional Feedback for {selectedCandidate.name.split(' ')[0]}</label>
                   <textarea 
                     value={feedbackText}
                     onChange={(e) => setFeedbackText(e.target.value)}
                     placeholder="e.g. 'We loved your enthusiasm! We'd recommend taking a course on X to be better prepared next time.'"
                     className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white min-h-[100px] resize-none"
                   ></textarea>
                 </div>
               </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button variant="ghost" onClick={closeFeedbackModal} className="text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
                Cancel
              </Button>
              <Button onClick={closeFeedbackModal} className="bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 rounded-xl border border-red-500">
                Confirm Pass {feedbackText || feedbackType ? '& Send Feedback' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Start Chat Modal */}
      {isShortlistModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeShortlistModal}
          ></div>
          
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
               <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center text-lg">💬</div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Message {selectedCandidate.name.split(' ')[0]}</h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 pl-13">Moving forward for: <span className="font-semibold">{selectedCandidate.role}</span></p>
                  </div>
                  <button 
                    onClick={closeShortlistModal}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-full transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
               </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto">
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50 mb-6 flex gap-3">
                 <span className="text-blue-600 dark:text-blue-400 text-xl">ℹ️</span>
                 <p className="text-sm text-blue-800 dark:text-blue-300 font-medium pt-0.5">
                   We believe in a text-first, low-pressure candidate experience. Sending this message will move the candidate to your "Interviews" pipeline and open a direct chat thread with them.
                 </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Quick Icebreakers</label>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 dark:bg-slate-800 dark:hover:bg-brand-900/40 dark:text-slate-300 dark:hover:text-brand-300 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
                    👋 Say Hello
                  </button>
                   <button className="px-4 py-2 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 dark:bg-slate-800 dark:hover:bg-brand-900/40 dark:text-slate-300 dark:hover:text-brand-300 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
                    🗓️ Ask About Schedule
                  </button>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 dark:bg-slate-800 dark:hover:bg-brand-900/40 dark:text-slate-300 dark:hover:text-brand-300 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
                    💡 Ask About Experience
                  </button>
                </div>
              </div>
                   
               <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                 <textarea 
                   defaultValue={`Hey ${selectedCandidate.name.split(' ')[0]}!\n\nWe loved your profile and match score for the ${selectedCandidate.role} position! \n\nCan you tell us a little bit more about your current school schedule and when you'd normally be available to work?`}
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white min-h-[160px] resize-none"
                 ></textarea>
               </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button variant="ghost" onClick={closeShortlistModal} className="text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
                Cancel
              </Button>
              <Button onClick={closeShortlistModal} className="bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20 shadow-md rounded-xl border border-brand-500">
                Send Notification & Start Chat
              </Button>
            </div>
          </div>
        </div>
      )}
    
    </>
  )
}
