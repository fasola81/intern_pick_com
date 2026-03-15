import React from 'react'
import { Button } from '@/components/ui/Button'

export default function EmployerAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm">
           <span className="text-slate-500 font-medium mb-2 text-sm">Profile Views</span>
           <div className="flex items-end gap-3">
             <span className="text-4xl font-black text-slate-900 dark:text-white">1,248</span>
             <span className="text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-2 pl-1 py-0.5 rounded-md text-sm mb-1 flex items-center">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
               12%
             </span>
           </div>
         </div>
         <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm">
           <span className="text-slate-500 font-medium mb-2 text-sm">Role Applications</span>
           <div className="flex items-end gap-3">
             <span className="text-4xl font-black text-slate-900 dark:text-white">45</span>
             <span className="text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-2 pl-1 py-0.5 rounded-md text-sm mb-1 flex items-center">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
               8%
             </span>
           </div>
         </div>
         <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm">
           <span className="text-slate-500 font-medium mb-2 text-sm">Offer Acceptance Rate</span>
           <div className="flex items-end gap-3">
             <span className="text-4xl font-black text-slate-900 dark:text-white">100%</span>
             <span className="text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-sm mb-1 flex items-center">
               --
             </span>
           </div>
         </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 min-h-[400px] flex flex-col shadow-sm">
         <div className="flex justify-between items-center mb-8">
           <h3 className="font-bold text-slate-900 dark:text-white text-lg">Traffic Overview (Last 30 Days)</h3>
           <select className="bg-slate-50 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500">
             <option>Last 30 Days</option>
             <option>Last 6 Months</option>
             <option>All Time</option>
           </select>
         </div>

         {/* Placeholder for actual chart */}
         <div className="flex-grow flex items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 relative h-48">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none mb-2">
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800/50"></div>
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800/50"></div>
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800/50"></div>
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800/50"></div>
            </div>

            {/* Bars */}
            {[40, 60, 30, 80, 50, 90, 45, 75, 65, 85, 55, 100].map((height, i) => (
              <div key={i} className="w-full bg-brand-100 dark:bg-brand-900/30 hover:bg-brand-500 dark:hover:bg-brand-500 rounded-t-sm transition-colors relative group" style={{ height: `${height}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                   {height * 4}
                 </div>
              </div>
            ))}
         </div>
         <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
           <span>Week 1</span>
           <span>Week 2</span>
           <span>Week 3</span>
           <span>Week 4</span>
         </div>
      </div>

    </div>
  )
}
