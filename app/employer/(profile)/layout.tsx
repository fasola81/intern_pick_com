"use client"

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'


import { createBrowserClient } from '@supabase/ssr'

export default function EmployerProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [about, setAbout] = useState('')
  const [companyStatus, setCompanyStatus] = useState('')
  const [employeeCount, setEmployeeCount] = useState('')
  const [website, setWebsite] = useState('')
  const [phone, setPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [socialLinks, setSocialLinks] = useState<Array<{ label: string; url: string }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('companies')
          .select('company_name, industry, zip_code, city, state, address_line, logo_url, status, about, phone, contact_email, employee_count, website, social_links')
          .eq('id', user.id)
          .single()
        if (data && data.company_name) {
          setCompanyName(data.company_name || '')
          setIndustry(data.industry || '')
          setZipCode(data.zip_code || '')
          setCity(data.city || '')
          setState(data.state || '')
          setLogoUrl(data.logo_url || '')
          setAbout(data.about || '')
          setCompanyStatus(data.status || 'active')
          setEmployeeCount(data.employee_count || '')
          setWebsite(data.website || '')
          setPhone(data.phone || '')
          setContactEmail(data.contact_email || '')
          try {
            const parsed = typeof data.social_links === 'string' ? JSON.parse(data.social_links) : data.social_links
            setSocialLinks(Array.isArray(parsed) ? parsed : [])
          } catch { setSocialLinks([]) }
        } else {
          // First-time user — redirect to onboarding
          router.push('/onboarding/employer')
          return
        }
      }
      setIsLoading(false)
    }
    fetchProfile()
  }, [router])

  const industryEmojis: Record<string, string> = {
    food: '☕', tech: '💻', retail: '🛍️', education: '📚',
    health: '🏥', finance: '💰', arts: '🎨', construction: '🔨',
    legal: '⚖️', marketing: '📢', other: '🏢',
  }

  const industryLabels: Record<string, string> = {
    retail: 'Retail & E-commerce', food: 'Food & Beverage', tech: 'Technology & Software',
    health: 'Healthcare Services', construction: 'Construction & Trades',
    finance: 'Finance & Accounting', education: 'Education', legal: 'Legal Services',
    marketing: 'Marketing & Media', other: 'Other',
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">

          {/* Pending Review Banner */}
          {companyStatus === 'pending_review' && (
            <div className="animate-fade-in bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 flex gap-4 items-start">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Your company profile is under review</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">The InternPick team is verifying your business. Your profile and job postings won&apos;t be visible to students until approved. This usually takes 1-2 business days.</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Questions? Email <a href="mailto:help@internpick.com" className="underline font-bold hover:text-amber-800">help@internpick.com</a></p>
              </div>
            </div>
          )}
          
          {/* Header & Metric Bar */}
          <section className="animate-fade-in-up bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] overflow-hidden relative">
            
            {/* Header / Profile Content — only on Dashboard */}
            {pathname === '/employer' && (
            <div className="p-6 md:p-10 pb-6 flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                {/* Logo & Company Name */}
                <div className="flex items-start gap-5 md:gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-3xl md:text-4xl border border-brand-200 dark:border-brand-800/50 shadow-inner overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt={`${companyName} logo`} className="w-full h-full object-cover" />
                    ) : (
                      industryEmojis[industry] || '🏢'
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                      {companyName || 'Your Company'}
                    </h1>
                    
                    {/* Meta stats */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {zipCode && (
                        <>
                          <span className="flex items-center gap-1.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            {[city, state, zipCode].filter(Boolean).join(', ') || `ZIP ${zipCode}`}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        </>
                      )}
                      {industry && (
                        <>
                          <span className="flex items-center gap-1.5">
                            {industryLabels[industry] || industry}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        </>
                      )}
                      {employeeCount && (
                        <span className="flex items-center gap-1.5">
                          👥 {employeeCount} employees
                        </span>
                      )}
                    </div>

                    {/* Contact row */}
                    {(website || phone || contactEmail) && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                        {website && (
                          <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                            {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </a>
                        )}
                        {phone && (
                          <span className="flex items-center gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            {phone}
                          </span>
                        )}
                        {contactEmail && (
                          <a href={`mailto:${contactEmail}`} className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            {contactEmail}
                          </a>
                        )}
                      </div>
                    )}

                    {about && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">{about}</p>
                    )}

                    {/* Social Links */}
                    {socialLinks.length > 0 && (() => {
                      const platformIcon = (label: string) => {
                        const key = label.toLowerCase()
                        const cls = "w-4 h-4 shrink-0"
                        if (key === 'linkedin') return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        if (key === 'facebook') return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        if (key === 'instagram') return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z"/></svg>
                        if (key === 'youtube') return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        if (key === 'tiktok') return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                        if (key === 'twitter' || key === 'x') return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                        if (key === 'yelp') return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.905-4.308a1.072 1.072 0 011.596-.206 7.26 7.26 0 012.054 3.128 1.074 1.074 0 01-.384 1.583zm-6.67 3.879l2.325 4.659a1.073 1.073 0 01-.384 1.412 7.26 7.26 0 01-3.514 1.143 1.072 1.072 0 01-1.11-1.158l.27-5.217c.054-1.013 1.447-1.407 2.098-.592l.315.407zM12.232.49c-.506-.03-.97.36-1.058.863L9.12 11.462c-.191 1.04.94 1.747 1.717 1.074l4.008-3.47a1.073 1.073 0 00.063-1.606 16.14 16.14 0 00-2.676-2.97zM7.554 14.31l-4.866-2.08A1.073 1.073 0 012.13 10.9a7.263 7.263 0 011.783-2.842 1.073 1.073 0 011.608.107l3.12 4.1c.625.82-.075 1.96-1.087 2.044zM7.78 17.104l-3.344 3.89c-.543.634-1.583.344-1.68-.483a7.26 7.26 0 01.573-3.635 1.073 1.073 0 011.393-.533l3.058 1.27z"/></svg>
                        if (key === 'google') return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                        return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      }
                      const platformColor = (label: string) => {
                        const key = label.toLowerCase()
                        if (key === 'linkedin') return 'hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/5'
                        if (key === 'facebook') return 'hover:text-[#1877F2] hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5'
                        if (key === 'instagram') return 'hover:text-[#E4405F] hover:border-[#E4405F]/30 hover:bg-[#E4405F]/5'
                        if (key === 'youtube') return 'hover:text-[#FF0000] hover:border-[#FF0000]/30 hover:bg-[#FF0000]/5'
                        if (key === 'tiktok') return 'hover:text-[#000000] hover:border-[#000000]/30 hover:bg-[#000000]/5 dark:hover:text-white'
                        if (key === 'twitter' || key === 'x') return 'hover:text-[#000000] hover:border-[#000000]/30 hover:bg-[#000000]/5 dark:hover:text-white'
                        if (key === 'yelp') return 'hover:text-[#D32323] hover:border-[#D32323]/30 hover:bg-[#D32323]/5'
                        if (key === 'google') return 'hover:text-[#4285F4] hover:border-[#4285F4]/30 hover:bg-[#4285F4]/5'
                        return 'hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 dark:hover:text-brand-400 dark:hover:border-brand-800/50 dark:hover:bg-brand-900/20'
                      }
                      return (
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {socialLinks.filter(l => l.url.trim()).map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all duration-200 ${platformColor(link.label)}`}
                          >
                            {platformIcon(link.label)}
                            <span>{link.label || 'Link'}</span>
                          </a>
                        ))}
                      </div>
                      )
                    })()}
                  </div>
                </div>

                {/* Edit Profile Button */}
                <Link href="/employer/account">
                  <button className="px-4 py-2 text-sm font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors">
                    ✏️ Edit
                  </button>
                </Link>
              </div>
            </div>
            )}




            {/* Render subpages cleanly here! */}
            <div className="min-h-[200px] px-6 md:px-10 pt-6 md:pt-8 pb-8">
               {children}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
