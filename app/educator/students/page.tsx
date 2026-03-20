"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { generateMatchesAction } from '@/app/actions'

export default function EducatorStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [selectedProgram, setSelectedProgram] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Matching Copilot State
  const [matchingStudentId, setMatchingStudentId] = useState<string | null>(null)
  const [matchesForStudent, setMatchesForStudent] = useState<any>(null)
  const [isMatching, setIsMatching] = useState(false)

  const handleFindMatches = async (student: any) => {
    setIsMatching(true)
    setMatchingStudentId(student.id)
    const res = await generateMatchesAction(student.id)
    if (res.success && res.data) {
      setMatchesForStudent({ student, matches: res.data })
    } else {
      alert(res.error || 'Failed to find matches')
      setMatchingStudentId(null)
    }
    setIsMatching(false)
  }

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch educator's programs
      const { data: progs } = await supabase
        .from('practicum_programs')
        .select('id, title')
        .eq('educator_id', user.id)
      setPrograms(progs || [])

      // Fetch all placements for this educator's programs
      const programIds = (progs || []).map(p => p.id)
      if (programIds.length > 0) {
        const { data: placements } = await supabase
          .from('placements')
          .select(`
            id, status, created_at,
            practicum_program_id,
            students!placements_student_id_fkey (id, first_name, last_name, bio, grade_level, career_interests, profile_complete),
            companies!placements_employer_id_fkey (company_name)
          `)
          .in('practicum_program_id', programIds)

        setStudents((placements || []).map((p: any) => ({
          ...p.students,
          placementStatus: p.status,
          company: p.companies?.company_name,
          programId: p.practicum_program_id,
        })))
      }

      // Also fetch students invited but not yet placed (from students table)
      const { data: invitedStudents } = await supabase
        .from('students')
        .select('id, first_name, last_name, bio, grade_level, career_interests, profile_complete, invite_code')
        .not('invite_code', 'is', null)

      // Merge invited students who aren't already in placements
      const placedIds = new Set(students.map(s => s.id))
      const newInvited = (invitedStudents || [])
        .filter(s => !placedIds.has(s.id))
        .map(s => ({ ...s, placementStatus: 'invited', company: null, programId: null }))

      setStudents(prev => [...prev, ...newInvited])
      setIsLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredStudents = selectedProgram === 'all'
    ? students
    : students.filter(s => s.programId === selectedProgram)

  const profileCompleteCount = students.filter(s => s.profile_complete).length

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">👩‍🎓 Students</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor student readiness and placement status.</p>
            </div>
            <Link href="/educator/invite-students" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors">
              + Invite Students
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center">
              <p className="text-2xl font-black text-slate-900 dark:text-white">{students.length}</p>
              <p className="text-xs font-bold text-slate-400 mt-1">Total Students</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center">
              <p className="text-2xl font-black text-emerald-600">{profileCompleteCount}</p>
              <p className="text-xs font-bold text-slate-400 mt-1">Profile Complete</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center">
              <p className="text-2xl font-black text-blue-600">{students.filter(s => s.placementStatus === 'active').length}</p>
              <p className="text-xs font-bold text-slate-400 mt-1">Active Placements</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center">
              <p className="text-2xl font-black text-amber-600">{students.filter(s => s.placementStatus === 'invited' || s.placementStatus === 'pending').length}</p>
              <p className="text-xs font-bold text-slate-400 mt-1">Awaiting Placement</p>
            </div>
          </div>

          {/* Filter */}
          {programs.length > 1 && (
            <div>
              <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
                <option value="all">All Programs</option>
                {programs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          )}

          {/* Student List */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-12 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Students Yet</h3>
              <p className="text-slate-500 mb-4">Invite students to join your practicum programs.</p>
              <Link href="/educator/invite-students" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors">
                Invite Students
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-400 tracking-wider">Student</th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-400 tracking-wider">Grade</th>
                      <th className="px-5 py-3 text-center text-xs font-bold uppercase text-slate-400 tracking-wider">Profile</th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-400 tracking-wider">Placement</th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-400 tracking-wider">Host</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{student.first_name} {student.last_name}</p>
                          {student.career_interests?.length > 0 && (
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{student.career_interests.slice(0, 2).join(', ')}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{student.grade_level || '—'}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex w-8 h-8 rounded-full items-center justify-center text-xs font-bold ${
                            student.profile_complete
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          }`}>
                            {student.profile_complete ? '✓' : '!'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              student.placementStatus === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                              student.placementStatus === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                              student.placementStatus === 'invited' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' :
                              'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                            }`}>
                              {student.placementStatus === 'active' ? 'Active' :
                               student.placementStatus === 'completed' ? 'Completed' :
                               student.placementStatus === 'invited' ? 'Invited' : 'Pending'}
                            </span>
                            {(!student.placementStatus || student.placementStatus === 'invited' || student.placementStatus === 'pending') && student.profile_complete && (
                              <button 
                                onClick={() => handleFindMatches(student)}
                                disabled={isMatching}
                                className="text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 px-2 py-1 rounded-md transition-colors border border-brand-200 dark:border-brand-800/50 shadow-sm flex items-center gap-1 whitespace-nowrap"
                              >
                                {isMatching && matchingStudentId === student.id ? '✨ Analyzing...' : '✨ Find Matches'}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{student.company || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Matches Modal */}
      {matchesForStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-brand-50/50 dark:bg-brand-900/10">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✨</span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Placement Matches</h3>
                  <p className="text-sm text-slate-500 font-medium">Top 3 recommendations for {matchesForStudent.student.first_name} {matchesForStudent.student.last_name}</p>
                </div>
              </div>
              <button onClick={() => { setMatchesForStudent(null); setMatchingStudentId(null) }} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex flex-col gap-4">
              {matchesForStudent.matches.length === 0 ? (
                <div className="text-center p-8 text-slate-500">No active matches found.</div>
              ) : (
                matchesForStudent.matches.map((match: any, idx: number) => (
                  <div key={match.opportunityId} className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-5 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs font-black text-brand-600 uppercase tracking-widest mb-1 block">Match #{idx + 1}</span>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{match.title}</h4>
                        <p className="text-sm text-slate-500 font-medium">{match.company}</p>
                      </div>
                      <Link href={`/opportunity/${match.opportunityId}`} target="_blank" className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg">View Role</Link>
                    </div>
                    <div className="mt-4 bg-brand-50 dark:bg-brand-900/20 text-brand-800 dark:text-brand-200 text-sm p-3 rounded-xl leading-relaxed border border-brand-100 dark:border-brand-800/50">
                      <strong>AI Reasoning:</strong> {match.reason}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
