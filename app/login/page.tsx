import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function LoginPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-xl text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Sign in to your InternPick account.</p>
          
          <div className="space-y-4">
            <Link href="/student" className="block">
              <Button className="w-full" variant="primary">Log in as Student</Button>
            </Link>
            <Link href="/employer" className="block">
              <Button className="w-full" variant="secondary">Log in as Business</Button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-slate-500">
            (Supabase Auth UI goes here)
          </p>
        </div>
      </main>
    </div>
  )
}
