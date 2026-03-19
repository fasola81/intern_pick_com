"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { createBrowserClient } from '@supabase/ssr'

interface Program {
  id: string
  title: string
  description: string
  subject_area: string
  grade_levels: string
  learning_objectives: string | null
  required_total_hours: number | null
  school_provides_insurance: boolean
  created_at: string
  educator: {
    full_name: string
    school_name: string
    title: string
  } | null
}

export default function BrowseProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    async function fetchPrograms() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from('practicum_programs')
        .select(`
          id, title, description, subject_area, grade_levels,
          learning_objectives, required_total_hours, school_provides_insurance,
          created_at,
          educators!practicum_programs_educator_id_fkey (full_name, school_name, title)
        `)
        .eq('status', 'seeking_hosts')
        .order('created_at', { ascending: false })

      if (data) {
        setPrograms(data.map((d: any) => ({
          ...d,
          educator: d.educators || null,
        })))
      }
      if (error) console.error('Error fetching programs:', error)
      setIsLoading(false)
    }
    fetchPrograms()
  }, [])

  const filtered = filter
    ? programs.filter(p =>
        p.subject_area?.toLowerCase().includes(filter.toLowerCase()) ||
        p.title?.toLowerCase().includes(filter.toLowerCase()) ||
        p.educator?.school_name?.toLowerCase().includes(filter.toLowerCase())
      )
    : programs

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Hero Header */}
          <section className="animate-fade-in-up text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-bold border border-emerald-200 dark:border-emerald-800/50 mb-4">
              🏫 School-Sponsored Programs
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              Partner with a School
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Browse Practicum Programs from local schools. Apply to host students for academic credit — DOL-compliant, school-supervised, zero wage risk.
            </p>
          </section>

          {/* DOL Compliance Banner */}
          <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl flex gap-4 items-start">
            <span className="text-2xl mt-0.5">⚖️</span>
            <div>
              <p className="text-sm font-bold text-blue-800 dark:text-blue-200">Your FLSA Legal Shield</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                When a school sponsors a practicum for academic credit, it inherently passes the DOL&apos;s Primary Beneficiary Test. You get motivated student talent with <strong>zero risk</strong> of wage/hour complaints. The school handles academic supervision, learning objectives, and evaluation.
              </p>
            </div>
          </div>

          {/* Search / Filter */}
          <div className="mb-6">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="🔍 Search by subject, school, or program title..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white shadow-sm text-base"
            />
          </div>

          {/* Programs Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Loading programs...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                {filter ? 'No matching programs' : 'No programs available yet'}
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                {filter ? 'Try adjusting your search terms.' : 'Check back soon — schools are actively creating new practicum programs.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((program) => (
                <div key={program.id} className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 flex flex-col">

                  {/* Card Header */}
                  <div className="p-6 pb-4 flex-grow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🎓</span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{program.title}</h3>
                        {program.educator && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {program.educator.school_name} • {program.educator.full_name}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">{program.description}</p>

                    {/* Meta pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                        {program.subject_area}
                      </span>
                      {program.grade_levels && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          Grades {program.grade_levels}
                        </span>
                      )}
                      {program.required_total_hours && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                          {program.required_total_hours} hrs
                        </span>
                      )}
                      {program.school_provides_insurance && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                          ✓ Insurance
                        </span>
                      )}
                    </div>

                    {/* Learning Objectives Preview */}
                    {program.learning_objectives && (
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Learning Objectives</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 whitespace-pre-line">{program.learning_objectives}</p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6 pt-2">
                    <Link href={`/employer/programs/${program.id}/apply`}>
                      <Button className="w-full rounded-xl font-bold py-3 bg-emerald-600 hover:bg-emerald-700 text-sm">
                        🤝 Apply to Host Students
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
