import React from 'react'
import { twMerge } from 'tailwind-merge'
import Image from 'next/image'

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  imageUrl?: string
  variant?: 'student' | 'business' | 'default'
  className?: string
}

export function FeatureCard({ title, description, icon, imageUrl, variant = 'default', className }: FeatureCardProps) {
  const variantStyles = {
    student: 'hover:border-brand-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20',
    business: 'hover:border-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-800',
    default: 'hover:border-brand-200 group-hover:bg-brand-50/50',
  }

  const iconColors = {
    student: 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300',
    business: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    default: 'bg-indigo-50 text-indigo-500',
  }

  return (
    <div className={twMerge(
      "group relative flex flex-col items-start p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
      variantStyles[variant],
      className
    )}>
      {icon && (
        <div className={twMerge(
          "p-3 rounded-2xl mb-6 transition-colors",
          iconColors[variant]
        )}>
          {icon}
        </div>
      )}
      {imageUrl && (
        <div className="w-full h-48 mb-6 relative rounded-2xl overflow-hidden shadow-sm">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
