import React from 'react'

export default function EmployerSearchPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search candidates by skills, major, or name..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button className="whitespace-nowrap px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Software Eng</button>
          <button className="whitespace-nowrap px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Marketing</button>
          <button className="whitespace-nowrap px-4 py-2 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800/50 rounded-lg text-sm font-semibold flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Filters
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 hover:shadow-md transition-all group cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Candidate${i}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight block group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Alex Johnson</h3>
                  <span className="text-xs font-medium text-slate-500">CompSci @ UIUC '25</span>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </button>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">Passionate about full-stack development. Experience with React, Node.js, and PostgreSQL from previous internship.</p>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-md">React</span>
              <span className="px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-bold rounded-md">Node.js</span>
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-md">Available Summer</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
