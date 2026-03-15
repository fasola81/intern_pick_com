'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

interface VideoRecorderProps {
  onVideoReady: (blob: Blob, durationSeconds: number) => void
  onCancel: () => void
}

const MAX_DURATION = 120 // 2 minutes

export default function VideoRecorder({ onVideoReady, onCancel }: VideoRecorderProps) {
  const [state, setState] = useState<'idle' | 'recording' | 'preview'>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 360 } },
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Use catch to handle AbortError if play() is interrupted by a new load
        videoRef.current.play().catch(() => { /* Ignored: interrupted by new load */ })
      }
      setState('idle')
    } catch (err: any) {
      setError('Camera access denied. Please allow camera permissions and try again.')
      console.error('[VideoRecorder] Camera error:', err)
    }
  }, [])

  // Start camera on mount
  useEffect(() => {
    startCamera()
  }, [startCamera])

  const startRecording = () => {
    if (!streamRef.current) return
    
    chunksRef.current = []
    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? 'video/webm;codecs=vp9' 
        : 'video/webm',
    })
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      setRecordedBlob(blob)
      setState('preview')
      
      // Show preview
      if (previewRef.current) {
        previewRef.current.src = URL.createObjectURL(blob)
        previewRef.current.play().catch(() => { /* Ignored: interrupted by new load */ })
      }
      
      // Stop camera stream
      stopStream()
    }
    
    mediaRecorderRef.current = recorder
    recorder.start(1000) // collect every 1s
    startTimeRef.current = Date.now()
    setElapsed(0)
    setState('recording')
    
    // Timer
    timerRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setElapsed(secs)
      if (secs >= MAX_DURATION) {
        stopRecording()
      }
    }, 250)
  }

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  const retake = async () => {
    setRecordedBlob(null)
    setElapsed(0)
    setState('idle')
    await startCamera()
  }

  const confirmVideo = () => {
    if (recordedBlob) {
      onVideoReady(recordedBlob, elapsed)
    }
  }

  const remaining = MAX_DURATION - elapsed
  const progress = elapsed / MAX_DURATION

  // Format seconds as M:SS
  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-3xl">🚫</div>
        <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="rounded-xl text-sm">Cancel</Button>
          <Button onClick={startCamera} className="rounded-xl text-sm">Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Video viewport */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video shadow-inner">
        {/* Live camera feed */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover ${state === 'preview' ? 'hidden' : ''}`}
          style={{ transform: 'scaleX(-1)' }}
        />
        
        {/* Preview playback */}
        <video
          ref={previewRef}
          controls
          playsInline
          className={`w-full h-full object-cover ${state !== 'preview' ? 'hidden' : ''}`}
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Recording overlay */}
        {state === 'recording' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Red border pulse */}
            <div className="absolute inset-0 border-[3px] border-red-500 rounded-2xl animate-pulse" />
            
            {/* Timer badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm rounded-full px-3 py-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-xs font-bold text-white font-mono">{fmt(elapsed)}</span>
            </div>

            {/* Countdown badge */}
            <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm rounded-full px-3 py-1.5">
              <span className="text-xs font-bold text-slate-300 font-mono">{fmt(remaining)} left</span>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/50">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-300 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Idle camera ready overlay */}
        {state === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 border-2 border-white/40">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <p className="text-white/80 text-xs font-medium">Camera ready</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {state === 'idle' && (
          <>
            <Button variant="outline" onClick={onCancel} className="flex-1 rounded-xl text-sm h-11 border-slate-200 dark:border-slate-700">
              Cancel
            </Button>
            <Button onClick={startRecording} className="flex-1 rounded-xl text-sm h-11 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white" />
                Start Recording
              </span>
            </Button>
          </>
        )}
        
        {state === 'recording' && (
          <Button onClick={stopRecording} className="w-full rounded-xl text-sm h-11 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25">
            <span className="flex items-center gap-2 justify-center">
              <span className="w-2.5 h-2.5 rounded-sm bg-white" />
              Stop Recording ({fmt(remaining)} left)
            </span>
          </Button>
        )}
        
        {state === 'preview' && (
          <>
            <Button variant="outline" onClick={retake} className="flex-1 rounded-xl text-sm h-11 border-slate-200 dark:border-slate-700">
              🔄 Retake
            </Button>
            <Button onClick={confirmVideo} className="flex-1 rounded-xl text-sm h-11 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/25">
              ✓ Use This Video
            </Button>
          </>
        )}
      </div>

      {/* Duration hint */}
      {state === 'idle' && (
        <p className="text-[11px] text-slate-400 text-center">
          Max 2 minutes • face the camera and introduce yourself • audio is recorded
        </p>
      )}
    </div>
  )
}
