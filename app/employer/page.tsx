import { Navbar } from '@/components/Navbar'

export default function EmployerDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Employer Dashboard</h1>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-600 dark:text-slate-400">
            Welcome to the business portal. Here you can post mentorship opportunities and discover driven young talent.
          </p>
        </div>
      </main>
    </div>
  )
}
