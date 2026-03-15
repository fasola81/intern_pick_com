import React from 'react'
import { Button } from '@/components/ui/Button'

export default function EmployerHiredPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Alumni & Current Interns</h2>
          <p className="text-sm text-slate-500 mt-1">1 Past Hire</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-sm font-semibold rounded-xl border border-brand-200 dark:border-brand-800/50">Current (0)</button>
           <button className="px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700">Past (1)</button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Past Hire */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[1.25rem] bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl overflow-hidden border border-indigo-200 dark:border-indigo-800/50">
                 🧑‍💼
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Michael Chen</h3>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Marketing Intern</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700/50 text-sm">
             <div className="flex justify-between items-center mb-1">
               <span className="text-slate-500 font-medium">Summer 2025</span>
               <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-md uppercase">Completed</span>
             </div>
             <p className="text-slate-700 dark:text-slate-300 font-medium">10 weeks • Excellent performance</p>
          </div>

          <div className="mt-auto flex gap-2">
            <Button variant="outline" className="flex-1 bg-white dark:bg-slate-900 border-slate-200 hover:border-slate-300 dark:border-slate-700 rounded-xl shadow-sm">View Profile</Button>
            <Button variant="outline" className="flex-1 bg-white dark:bg-slate-900 border-slate-200 hover:border-slate-300 dark:border-slate-700 rounded-xl shadow-sm">Write Review</Button>
          </div>
        </div>

      </div>
    </div>
  )
}
