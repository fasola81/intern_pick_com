"use client"

import React from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function EmployerInterviewsPage() {
  return (
    <>
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex justify-between items-center bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white pl-2">Scheduled Interviews</h2>
                  </div>
                  
                  {/* Interview Card 1 */}
                  <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-brand-200 dark:border-brand-800/50 shadow-md hover:shadow-lg transition-all duration-300 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/5 rounded-full blur-[60px] pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10 w-full">
                      
                      {/* Avatar & Info */}
                      <div className="flex-shrink-0 flex items-center gap-5 min-w-0 md:w-[40%]">
                        <div className="w-16 h-16 flex-shrink-0 rounded-[1rem] bg-gradient-to-br from-indigo-100 to-brand-50 dark:from-indigo-900/40 dark:to-brand-900/20 border border-brand-200 dark:border-brand-800/50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                          🧑‍🎓
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">Sarah Jenkins</h3>
                          <p className="text-sm font-medium text-brand-600 dark:text-brand-400 truncate">Social Media Assistant</p>
                        </div>
                      </div>

                      {/* Scheduling Info */}
                      <div className="flex-grow flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 w-full md:w-auto">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200 dark:border-slate-600">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Tomorrow</p>
                            <p className="text-xs text-slate-500 font-medium">4:00 PM EST</p>
                          </div>
                        </div>
                        <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"></path><rect x="3" y="6" width="12" height="12" rx="2" ry="2"></rect></svg>
                          Join Video Call
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="w-full md:w-auto flex flex-row justify-end gap-2 md:pl-2 flex-shrink-0">
                         <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900 border-slate-200 hover:border-slate-300 dark:border-slate-700 rounded-xl shadow-sm">
                           Reschedule
                         </Button>
                      </div>

                    </div>
                  </div>

                  {/* Empty State / Future Interviews */}
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl mb-4 text-slate-400">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No other interviews scheduled</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                      Head over to the Talent Pipeline to review more matches and invite students to chat.
                    </p>
                    <Link href="/employer/shortlist"><Button variant="outline" className="mt-6 rounded-xl">Return to Short List</Button></Link>
                  </div>

                </div>
    </>
  )
}
