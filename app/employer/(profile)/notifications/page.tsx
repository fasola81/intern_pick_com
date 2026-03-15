import React from 'react'

export default function EmployerNotificationsPage() {
  return (
    <section className="flex flex-col gap-6 animate-fade-in-up">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8 md:p-12 min-h-[400px] flex flex-col items-center justify-center">
         <div className="text-center space-y-4">
           <div className="text-6xl mb-4">🔔</div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h2>
           <p className="text-slate-500 max-w-md mx-auto">This section is currently under construction. All employer alerts and candidate messages will appear here.</p>
         </div>
      </div>
    </section>
  )
}
