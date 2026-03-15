'use client'

import React, { useState, useEffect } from 'react'

interface RolePrepData {
  summary: string
  expectations: string[]
  profileFit: string
  prepTips: string[]
  videoTips: string[]
}

interface RolePrepProps {
  opportunityId: string
  opportunityTitle: string
  onReady?: () => void
}

export default function RolePrep({ opportunityId, opportunityTitle, onReady }: RolePrepProps) {
  const [data, setData] = useState<RolePrepData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchPrep() {
      try {
        setLoading(true)
        setError(null)
        const { getRolePrep } = await import('@/app/actions')
        const result = await getRolePrep(opportunityId)
        if (cancelled) return
        if (result.success && result.data) {
          setData(result.data)
          onReady?.()
        } else {
          setError('Unable to generate AI insights')
        }
      } catch (err) {
        if (!cancelled) setError('AI service temporarily unavailable')
        console.error('[RolePrep] Error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPrep()
    return () => { cancelled = true }
  }, [opportunityId, retryCount])

  // Loading skeleton
  if (loading) {
    return (
      <div className="mb-5 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/10 overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center animate-pulse">
            <span className="text-base">🧠</span>
          </div>
          <div className="flex-grow">
            <div className="h-4 w-40 bg-indigo-100 dark:bg-indigo-800/30 rounded animate-pulse" />
            <div className="h-3 w-56 bg-indigo-100/70 dark:bg-indigo-800/20 rounded animate-pulse mt-1.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  // Error state with retry
  if (error || !data) {
    return (
      <div className="mb-5 rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <span className="text-base">🧠</span>
          </div>
          <div className="flex-grow">
            <p className="text-sm font-bold text-amber-800 dark:text-amber-200">AI Role Prep</p>
            <p className="text-[11px] text-amber-600/80 dark:text-amber-400/70">Couldn&apos;t generate insights right now</p>
          </div>
          <button
            onClick={() => setRetryCount(c => c + 1)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-5 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-gradient-to-br from-indigo-50/80 to-purple-50/40 dark:from-indigo-900/20 dark:to-purple-900/10 overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-3 hover:bg-indigo-100/30 dark:hover:bg-indigo-900/20 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm shadow-indigo-500/30">
          <span className="text-white text-sm">🧠</span>
        </div>
        <div className="flex-grow text-left">
          <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">AI Role Prep</p>
          <p className="text-[11px] text-indigo-600/70 dark:text-indigo-400/70">Personalized insights for {opportunityTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
            AI Powered
          </span>
          <svg className={`w-4 h-4 text-indigo-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Role Summary */}
          <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-3.5 border border-indigo-100/80 dark:border-indigo-800/30">
            <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-1.5">📋 Role Summary</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{data.summary}</p>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* What They Expect */}
            {data.expectations.length > 0 && (
              <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-3.5 border border-indigo-100/80 dark:border-indigo-800/30">
                <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2">🎯 Expectations</p>
                <ul className="space-y-1.5">
                  {data.expectations.map((e, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                      <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Profile Fit */}
            {data.profileFit && (
              <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-3.5 border border-green-100/80 dark:border-green-800/30">
                <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wider mb-1.5">✨ How You Fit</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{data.profileFit}</p>
              </div>
            )}
          </div>

          {/* Prep Tips */}
          {data.prepTips.length > 0 && (
            <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-3.5 border border-amber-100/80 dark:border-amber-800/30">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-2">💡 Prep Tips</p>
              <ul className="space-y-1.5">
                {data.prepTips.map((t, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                    <span className="text-amber-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Video Tips */}
          {data.videoTips.length > 0 && (
            <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-3.5 border border-purple-100/80 dark:border-purple-800/30">
              <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-2">🎬 Video Intro Tips</p>
              <ul className="space-y-1.5">
                {data.videoTips.map((t, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                    <span className="text-purple-400 mt-0.5 flex-shrink-0">▸</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
