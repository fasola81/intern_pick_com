'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { getStudentVideos } from '@/app/actions'

interface VideoMeta {
  id: string
  title: string
  storage_path: string
  duration_seconds: number | null
  created_at: string
}

interface VideoLibraryProps {
  onSelect: (video: VideoMeta) => void
  onRecordNew: () => void
  selectedVideoId?: string | null
}

export default function VideoLibrary({ onSelect, onRecordNew, selectedVideoId }: VideoLibraryProps) {
  const [videos, setVideos] = useState<VideoMeta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVideos() {
      const result = await getStudentVideos()
      if (result.success && result.data) {
        setVideos(result.data)
      }
      setLoading(false)
    }
    fetchVideos()
  }, [])

  const fmtDuration = (s: number | null) => {
    if (!s) return '0:00'
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const fmtDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <svg className="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-xs text-slate-400">Loading your videos…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Record new CTA */}
      <button
        onClick={onRecordNew}
        className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-brand-300 dark:border-brand-700 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all group"
      >
        <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-slate-900 dark:text-white">Record a New Video</p>
          <p className="text-[11px] text-slate-400">Up to 2 minutes</p>
        </div>
      </button>

      {/* Existing videos */}
      {videos.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mb-2">🎬</div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No videos yet</p>
          <p className="text-[11px] text-slate-400 mt-1">Record your first intro video above!</p>
        </div>
      ) : (
        <>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider px-1">Your Videos ({videos.length})</p>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
            {videos.map((v) => (
              <button
                key={v.id}
                onClick={() => onSelect(v)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  selectedVideoId === v.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 shadow-md shadow-brand-500/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {/* Video icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
                  selectedVideoId === v.id
                    ? 'bg-brand-100 dark:bg-brand-900/50'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}>
                  🎥
                </div>
                
                <div className="flex-grow min-w-0">
                  <p className={`text-sm font-bold truncate ${
                    selectedVideoId === v.id ? 'text-brand-700 dark:text-brand-300' : 'text-slate-900 dark:text-white'
                  }`}>
                    {v.title}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{fmtDuration(v.duration_seconds)}</span>
                    <span>•</span>
                    <span>{fmtDate(v.created_at)}</span>
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedVideoId === v.id && (
                  <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
