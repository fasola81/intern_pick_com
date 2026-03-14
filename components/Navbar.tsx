import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/Button'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/icons/logo/logo_dark.png" 
              alt="InternPick Logo" 
              width={100} 
              height={100} 
              className="block h-9 w-auto object-contain dark:hidden"
              priority
            />
            <Image 
              src="/icons/logo/logo_white.png" 
              alt="InternPick Logo" 
              width={100} 
              height={100} 
              className="hidden h-9 w-auto object-contain dark:block"
              priority
            />
            <span className="text-2xl font-bold tracking-tight text-brand-600 dark:text-brand-400">
              InternPick
            </span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
              How it Works
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
              Our Mission
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/login">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
