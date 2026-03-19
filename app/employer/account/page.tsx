"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { formatPhone, formatEmail } from '@/lib/formatters'
import { uploadCompanyLogo } from '@/app/actions'

export default function AccountSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [company, setCompany] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Editable settings
  const [contactEmail, setContactEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [about, setAbout] = useState('')
  const [industry, setIndustry] = useState('')
  const [employeeCount, setEmployeeCount] = useState('')
  const [addressLine, setAddressLine] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [socialLinks, setSocialLinks] = useState<Array<{ label: string; url: string }>>([])
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [applicationAlerts, setApplicationAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  // Account Owner
  const [ownerName, setOwnerName] = useState('')
  const [ownerTitle, setOwnerTitle] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')



  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: comp } = await supabase
          .from('companies')
          .select('*')
          .eq('id', user.id)
          .single()

        if (comp) {
          setCompany(comp)
          setContactEmail(comp.contact_email || user.email || '')
          setPhone(comp.phone || '')
          setWebsite(comp.website || '')
          setAbout(comp.about || '')
          setIndustry(comp.industry || '')
          setEmployeeCount(comp.employee_count || '')
          setAddressLine(comp.address_line || '')
          setCity(comp.city || '')
          setState(comp.state || '')
          setZipCode(comp.zip_code || '')
          setOwnerName(comp.owner_name || '')
          setOwnerTitle(comp.owner_title || '')
          setOwnerEmail(comp.owner_email || user.email || '')
          setOwnerPhone(comp.owner_phone || '')
          setLogoUrl(comp.logo_url || '')
          try {
            const parsed = typeof comp.social_links === 'string' ? JSON.parse(comp.social_links) : comp.social_links
            setSocialLinks(Array.isArray(parsed) ? parsed : [])
          } catch { setSocialLinks([]) }
        }
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    // Validate social link URLs
    const invalidLinks = socialLinks.filter(l => l.url.trim() && !/^https?:\/\/.+\..+/.test(l.url.trim()))
    if (invalidLinks.length > 0) {
      setSaveMessage('Please fix invalid social link URLs before saving.')
      setIsSaving(false)
      return
    }

    const { error } = await supabase
      .from('companies')
      .update({
        contact_email: contactEmail,
        phone,
        website,
        about,
        industry,
        employee_count: employeeCount,
        address_line: addressLine,
        city,
        state,
        zip_code: zipCode,
        owner_name: ownerName,
        owner_title: ownerTitle,
        owner_email: ownerEmail,
        owner_phone: ownerPhone,
        logo_url: logoUrl,
        social_links: JSON.stringify(socialLinks.filter(l => l.url.trim())),
      })
      .eq('id', user.id)

    if (error) {
      setSaveMessage('Failed to save. Please try again.')
    } else {
      setSaveMessage('Settings saved!')
      window.scrollTo(0, 0)
      router.push('/employer')
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-8 pb-20 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            <Link href="/employer" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white">Account Settings</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Account Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your company profile and account.</p>

          <div className="space-y-6">

            {/* ====== Company Profile ====== */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-brand-50/40 dark:bg-transparent">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Company Profile</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">This info is visible to students viewing your listings.</p>
              </div>

              <div className="p-6 md:p-8 space-y-5">
                {/* Company Logo */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Company Logo</label>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setIsUploadingLogo(true)
                      try {
                        const fd = new FormData()
                        fd.append('logo', file)
                        const result = await uploadCompanyLogo(fd)
                        if (result.success && result.logoUrl) {
                          setLogoUrl(result.logoUrl)
                        }
                      } catch (err) {
                        console.error('Logo upload error:', err)
                      }
                      setIsUploadingLogo(false)
                      e.target.value = ''
                    }}
                  />
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      className="group relative w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-3xl border-2 border-dashed border-brand-300 dark:border-brand-700 hover:border-brand-500 dark:hover:border-brand-400 transition-all cursor-pointer overflow-hidden flex-shrink-0"
                      title="Click to upload logo"
                    >
                      {isUploadingLogo ? (
                        <div className="w-6 h-6 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin"></div>
                      ) : logoUrl ? (
                        <img src={logoUrl} alt="Company logo" className="w-full h-full object-cover" />
                      ) : (
                        <span>🏢</span>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                    </button>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Click to upload a new logo</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Recommended: square image, at least 200×200px</p>
                    </div>
                  </div>
                </div>

                {/* Company Name (read-only) */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Company Name</label>
                  <div className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm">
                    {company?.company_name || 'Not set'}
                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">(contact support to change)</span>
                  </div>
                </div>

                {/* Industry & Company Size */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Industry</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none text-slate-900 dark:text-white"
                    >
                      <option value="">Select Industry</option>
                      <option value="retail">Retail & E-commerce</option>
                      <option value="food">Food & Beverage</option>
                      <option value="tech">Technology & Software</option>
                      <option value="health">Healthcare Services</option>
                      <option value="construction">Construction & Trades</option>
                      <option value="finance">Finance & Accounting</option>
                      <option value="education">Education</option>
                      <option value="legal">Legal Services</option>
                      <option value="marketing">Marketing & Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Company Size</label>
                    <select
                      value={employeeCount}
                      onChange={(e) => setEmployeeCount(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none text-slate-900 dark:text-white"
                    >
                      <option value="">Select Size</option>
                      <option value="1-5">1–5 (Solo / Micro)</option>
                      <option value="6-20">6–20 (Small)</option>
                      <option value="21-50">21–50 (Growing)</option>
                      <option value="51-200">51–200 (Mid-size)</option>
                      <option value="200+">200+ (Large)</option>
                    </select>
                  </div>
                </div>

                {/* Business Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Business Address</label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="Street address"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                      placeholder="State"
                      maxLength={2}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      placeholder="Zip Code"
                      maxLength={5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* About */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">About Your Company</label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows={3}
                    placeholder="Tell students about your company and what makes it a great place to intern…"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-slate-900 dark:text-white resize-y"
                  />
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Contact Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Contact Email</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(formatEmail(e.target.value))}
                      placeholder="contact@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      placeholder="(555) 123 4567"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Social Links</label>
                  <div className="space-y-2">
                    {socialLinks.map((link, i) => {
                      const isValidUrl = !link.url.trim() || /^https?:\/\/.+\..+/.test(link.url.trim())
                      return (
                      <div key={i} className="flex items-start gap-2">
                        <select
                          value={['linkedin','facebook','instagram','youtube','tiktok','twitter','yelp','google'].includes(link.label.toLowerCase()) ? link.label.toLowerCase() : link.label === 'Custom URL' || link.label === '' ? 'other' : 'other'}
                          onChange={(e) => {
                            const val = e.target.value
                            const labelMap: Record<string, string> = {
                              linkedin: 'LinkedIn', facebook: 'Facebook', instagram: 'Instagram',
                              youtube: 'Youtube', tiktok: 'Tiktok', twitter: 'Twitter',
                              yelp: 'Yelp', google: 'Google', other: 'Custom URL'
                            }
                            setSocialLinks(prev => prev.map((l, j) => j === i ? { ...l, label: labelMap[val] || 'Custom URL' } : l))
                          }}
                          className="w-40 shrink-0 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-900 dark:text-white appearance-none"
                        >
                          <option value="linkedin">LinkedIn</option>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="youtube">YouTube</option>
                          <option value="tiktok">TikTok</option>
                          <option value="twitter">X / Twitter</option>
                          <option value="yelp">Yelp</option>
                          <option value="google">Google</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="flex-1 flex flex-col gap-1">
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => setSocialLinks(prev => prev.map((l, j) => j === i ? { ...l, url: e.target.value } : l))}
                            placeholder="https://..."
                            className={`w-full px-3 py-2.5 rounded-xl border ${isValidUrl ? 'border-slate-200 dark:border-slate-700' : 'border-red-400 dark:border-red-500'} bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 ${isValidUrl ? 'focus:ring-brand-500' : 'focus:ring-red-500'} text-sm text-slate-900 dark:text-white`}
                          />
                          {!isValidUrl && (
                            <p className="text-xs text-red-500 font-medium">Please enter a valid URL (e.g. https://linkedin.com/in/...)</p>
                          )}
                        </div>
                        <button
                          onClick={() => setSocialLinks(prev => prev.filter((_, j) => j !== i))}
                          className="text-red-400 hover:text-red-600 text-lg shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-0.5"
                        >
                          &times;
                        </button>
                      </div>
                      )
                    })}
                    <button
                      onClick={() => setSocialLinks(prev => [...prev, { label: 'LinkedIn', url: '' }])}
                      className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      + Add Social Link
                    </button>
                  </div>
                </div>
              </div>
            </div>



            {/* ====== Account Owner ====== */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-green-50/40 dark:bg-transparent">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Account Owner</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">The person responsible for managing this business account on InternPick.</p>
              </div>

              <div className="p-6 md:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Title / Role</label>
                    <input
                      type="text"
                      value={ownerTitle}
                      onChange={(e) => setOwnerTitle(e.target.value)}
                      placeholder="e.g. HR Director, Business Owner"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                    <input
                      type="email"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(formatEmail(e.target.value))}
                      placeholder="owner@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Phone</label>
                    <input
                      type="tel"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(formatPhone(e.target.value))}
                      placeholder="(555) 123 4567"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>



            {/* ====== Account ====== */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-transparent">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Account</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your login and account security.</p>
              </div>

              <div className="p-6 md:p-8 space-y-4">
                {/* Login Email (read-only) */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Login Email</label>
                  <div className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm">
                    {user?.email || 'Not set'}
                  </div>
                </div>

                {/* Site Appearance */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Site Appearance</label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Choose how InternPick.com looks for you.</p>
                  <div className="flex gap-2">
                    {([
                      { key: 'auto', label: 'Auto', icon: '💻' },
                      { key: 'light', label: 'Light', icon: '☀️' },
                      { key: 'dark', label: 'Dark', icon: '🌙' },
                    ] as const).map((opt) => {
                      const current = typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'auto') : 'auto'
                      const isActive = current === opt.key
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            localStorage.setItem('theme', opt.key)
                            const html = document.documentElement
                            if (opt.key === 'dark') {
                              html.classList.add('dark')
                            } else if (opt.key === 'light') {
                              html.classList.remove('dark')
                            } else {
                              // auto — respect OS preference
                              if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                                html.classList.add('dark')
                              } else {
                                html.classList.remove('dark')
                              }
                            }
                            // Force re-render to update active state
                            setSaveMessage('')
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                            isActive
                              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <span>{opt.icon}</span>
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-3">Danger Zone</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/forgot-password">
                      <Button variant="outline" className="rounded-xl text-sm w-full sm:w-auto">🔑 Change Password</Button>
                    </Link>
                    <Link href="/account/delete">
                      <Button variant="outline" className="rounded-xl text-sm w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/10">🗑️ Delete Account</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ====== Save Button ====== */}
            <div className="flex items-center justify-between">
              <div>
                {saveMessage && (
                  <span className={`text-sm font-bold ${saveMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                    {saveMessage}
                  </span>
                )}
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl px-8 shadow-brand-500/20 disabled:opacity-70"
              >
                {isSaving ? 'Saving…' : '💾 Save Settings'}
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
