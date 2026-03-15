"use client"

import React from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function EmployerRolesPage() {
  return (
    <>
                <div className="space-y-4 animate-fade-in-up">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 gap-4 mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white pl-1">Manage Active Roles</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 pl-1 mt-1">You have 3 active internship postings.</p>
                    </div>
                    <Link href="/employer/create">
                      <Button className="rounded-xl px-5 py-2.5 shadow-brand-500/20 shadow-md border border-brand-500/50 hover:border-brand-400 w-full sm:w-auto">
                        + Post Another Role
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Role Item 1 */}
                  <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xl flex-shrink-0 mt-1">💡</div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Social Media Assistant</h3>
                          <span className="px-2.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-black rounded-md uppercase tracking-wider">
                            Active
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Marketing Team • Remote • Paid ($15/hr)</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Posted 2 days ago • Fall Semester 2026</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                      <div className="flex gap-4 sm:gap-6 w-full justify-between sm:justify-end">
                        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl min-w-[80px]">
                          <span className="block text-2xl font-black text-slate-900 dark:text-white leading-none">5</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Matches</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Button variant="outline" className="rounded-xl bg-white dark:bg-slate-900 shadow-sm border-slate-200 hover:border-slate-300 dark:border-slate-700">Edit</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Role Item 2 */}
                  <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl flex-shrink-0 mt-1">☕</div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Weekend Barista Trainee</h3>
                          <span className="px-2.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-black rounded-md uppercase tracking-wider">
                            Active
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Store Operations • On-site • Paid ($14/hr)</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Posted 1 week ago • Year-round</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                      <div className="flex gap-4 sm:gap-6 w-full justify-between sm:justify-end">
                        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl min-w-[80px]">
                          <span className="block text-2xl font-black text-slate-900 dark:text-white leading-none">12</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Matches</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Button variant="outline" className="rounded-xl bg-white dark:bg-slate-900 shadow-sm border-slate-200 hover:border-slate-300 dark:border-slate-700">Edit</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Role Item 3 */}
                  <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl flex-shrink-0 mt-1">📦</div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Inventory Management Intern</h3>
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-black rounded-md uppercase tracking-wider">
                            Draft
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Logistics • On-site • Unpaid (Credit)</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Created 2 hours ago • Summer 2026</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                      <div className="flex gap-4 sm:gap-6 w-full justify-between sm:justify-end">
                        <div className="flex flex-col items-center bg-slate-50/50 dark:bg-slate-800/20 px-4 py-2 rounded-xl min-w-[80px] opacity-50">
                          <span className="block text-2xl font-black text-slate-400 dark:text-slate-600 leading-none">-</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Matches</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Button variant="outline" className="rounded-xl bg-white dark:bg-slate-900 shadow-sm border-slate-200 hover:border-slate-300 dark:border-slate-700">Edit</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
    </>
  )
}
