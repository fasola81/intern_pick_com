"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { getComments, addComment } from '@/app/actions'

interface Comment {
  id: string
  parentId: string | null
  content: string
  createdAt: string
  displayName: string
  isOwn: boolean
  isEmployerComment: boolean
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function CommentBubble({ 
  comment, 
  replies = [], 
  onReply, 
  depth = 0 
}: { 
  comment: Comment
  replies: Comment[]
  onReply: (parentId: string) => void
  depth?: number
}) {
  const childReplies = replies.filter(r => r.parentId === comment.id)
  
  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-slate-200 dark:border-slate-700/50' : ''}`}>
      <div className="group flex gap-3 py-2">
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          comment.isEmployerComment 
            ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300' 
            : comment.isOwn 
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
        }`}>
          {comment.isEmployerComment ? '🏢' : comment.displayName.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`text-sm font-bold ${
              comment.isEmployerComment 
                ? 'text-brand-700 dark:text-brand-300' 
                : comment.isOwn 
                  ? 'text-purple-700 dark:text-purple-300'
                  : 'text-slate-600 dark:text-slate-400'
            }`}>
              {comment.displayName}
              {comment.isOwn && <span className="text-[10px] font-normal ml-1 text-purple-500">(You)</span>}
            </span>
            {comment.isEmployerComment && (
              <span className="text-[10px] font-bold bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded">EMPLOYER</span>
            )}
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
          <button
            onClick={() => onReply(comment.id)}
            className="text-[11px] font-semibold text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Reply
          </button>
        </div>
      </div>
      
      {/* Nested replies */}
      {childReplies.map(child => (
        <CommentBubble
          key={child.id}
          comment={child}
          replies={replies}
          onReply={onReply}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

export default function CommentThread({ opportunityId }: { opportunityId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchComments = useCallback(async () => {
    const result = await getComments(opportunityId)
    if (result.success) {
      setComments(result.data)
    }
    setIsLoading(false)
  }, [opportunityId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handlePost = async () => {
    if (!newComment.trim()) return
    setIsPosting(true)
    
    const result = await addComment({
      opportunityId,
      content: newComment.trim(),
      parentId: replyTo || undefined,
    })
    
    if (result.success) {
      setNewComment('')
      setReplyTo(null)
      await fetchComments()
    }
    setIsPosting(false)
  }

  const handleReply = (parentId: string) => {
    setReplyTo(parentId)
  }

  const topLevel = comments.filter(c => !c.parentId)
  const replyComment = replyTo ? comments.find(c => c.id === replyTo) : null

  return (
    <div className="mt-4 border-t border-slate-200 dark:border-slate-700/50 pt-4">
      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
        💬 Discussion
        {comments.length > 0 && (
          <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full">{comments.length}</span>
        )}
      </h4>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Comment list */}
          {topLevel.length > 0 ? (
            <div className="space-y-1 mb-4 max-h-80 overflow-y-auto pr-1">
              {topLevel.map(comment => (
                <CommentBubble
                  key={comment.id}
                  comment={comment}
                  replies={comments}
                  onReply={handleReply}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-3 mb-3">
              No comments yet. Be the first to ask a question!
            </p>
          )}

          {/* Reply indicator */}
          {replyComment && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl text-xs">
              <span className="text-slate-400">Replying to</span>
              <span className="font-bold text-slate-600 dark:text-slate-300">{replyComment.displayName}</span>
              <button onClick={() => setReplyTo(null)} className="ml-auto text-slate-400 hover:text-red-500 text-sm">&times;</button>
            </div>
          )}

          {/* Input */}
          <div className={`flex gap-2 ${replyComment ? 'rounded-b-xl' : 'rounded-xl'} bg-slate-50 dark:bg-slate-800/50 p-2 border border-slate-200 dark:border-slate-700/50`}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handlePost()}
              placeholder={replyTo ? 'Write a reply...' : 'Ask a question or leave a comment...'}
              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
              disabled={isPosting}
            />
            <button
              onClick={handlePost}
              disabled={!newComment.trim() || isPosting}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isPosting ? '...' : 'Post'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
