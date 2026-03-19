"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { createBrowserClient } from '@supabase/ssr'
import { updateStudentProfile } from '@/app/actions'
import Link from 'next/link'

const CAREER_CLUSTERS = [
  'Agriculture & Natural Resources', 'Architecture & Construction', 'Arts & Communications',
  'Business Management', 'Education & Training', 'Finance', 'Government & Public Admin',
  'Health Science', 'Hospitality & Tourism', 'Human Services', 'Information Technology',
  'Law & Public Safety', 'Manufacturing', 'Marketing', 'STEM', 'Transportation',
]

export default function StudentProfilePage() {
  const [bio, setBio] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [graduationYear, setGraduationYear] = useState<number>(2026)
  const [careerInterests, setCareerInterests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('students')
        .select('first_name, last_name, bio, grade_level, graduation_year, career_interests')
        .eq('id', user.id)
        .single()
      if (data) {
        setFirstName(data.first_name || '')
        setLastName(data.last_name || '')
        setBio(data.bio || '')
        setGradeLevel(data.grade_level || '')
        setGraduationYear(data.graduation_year || 2026)
        setCareerInterests(data.career_interests || [])
      }
      setIsLoading(false)
    }
    load()
  }, [])

  const toggleInterest = (cluster: string) => {
    setCareerInterests(prev =>
      prev.includes(cluster)
        ? prev.filter(c => c !== cluster)
        : prev.length < 5 ? [...prev, cluster] : prev
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaved(false)
    const result = await updateStudentProfile({
      bio,
      gradeLevel,
      graduationYear,
      careerInterests,
    })
    setIsSaving(false)
    if (result.success) setSaved(true)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Help your educator match you with the best practicum placement.</p>
            </div>
            <Link href="/student" className="text-sm font-medium text-blue-600 hover:text-blue-700">&larr; Dashboard</Link>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 flex flex-col gap-6">

              {/* Name (read-only) */}
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Name</label>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{firstName} {lastName}</p>
              </div>

              {/* Grade Level */}
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Grade Level *</label>
                <div className="flex gap-2 flex-wrap">
                  {['Freshman', 'Sophomore', 'Junior', 'Senior'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGradeLevel(g)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        gradeLevel === g
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Graduation Year */}
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Expected Graduation Year</label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  {[2025, 2026, 2027, 2028, 2029].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Bio */}
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">About Me</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell educators and host businesses about yourself, your interests, and what you hope to learn..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{bio.length}/500</p>
              </div>

              {/* Career Interests */}
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Career Interests <span className="text-slate-400 font-normal">(select up to 5)</span></label>
                <div className="flex flex-wrap gap-2">
                  {CAREER_CLUSTERS.map((cluster) => (
                    <button
                      key={cluster}
                      onClick={() => toggleInterest(cluster)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        careerInterests.includes(cluster)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {cluster}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
                {saved && <span className="text-sm font-bold text-emerald-600">✓ Profile saved!</span>}
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  )
}
