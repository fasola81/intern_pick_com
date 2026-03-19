'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { STATE_MINIMUM_WAGES, FEDERAL_MINIMUM_WAGE } from '@/lib/minimumWages'

const TOC_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'benefits-students', label: 'Benefits for Students' },
  { id: 'benefits-employers', label: 'Benefits for Employers' },
  { id: 'paid-internships', label: 'Paid Internships' },
  { id: 'unpaid-internships', label: 'Unpaid Internships' },
  { id: 'dol-test', label: 'DOL 7-Factor Test' },
  { id: 'tax-implications', label: 'Tax & Financial Impact' },
  { id: 'state-minimum-wages', label: 'State Minimum Wages' },
  { id: 'flsa', label: 'Fair Labor Standards Act' },
  { id: 'your-rights', label: 'Your Rights & Getting Help' },
  { id: 'how-internpick-helps', label: 'How InternPick Protects You' },
  { id: 'resources', label: 'Official Resources' },
]

export default function InternshipRulesPage() {
  const [activeId, setActiveId] = useState('')
  const [wageSearch, setWageSearch] = useState('')

  useEffect(() => {
    document.title = 'Internship Wiki | InternPick.com'
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    )

    TOC_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-4 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex gap-0 lg:gap-12">

          {/* Sticky Sidebar TOC */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
              <Link href="/" className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors flex items-center gap-1 mb-6">
                ← Home
              </Link>

              <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">On This Page</p>

              <ul className="space-y-0.5 border-l-2 border-slate-200 dark:border-slate-800">
                {TOC_SECTIONS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`block pl-4 py-1.5 text-sm transition-all duration-200 border-l-2 -ml-[2px] ${
                        activeId === item.id
                          ? 'border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400 font-bold'
                          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400'
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Related</p>
                <Link href="/terms" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Terms of Service →
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <article className="flex-grow min-w-0 max-w-3xl">

            {/* Title */}
            <header className="mb-12 animate-fade-in-up">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-4">📋 Complete Guide</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Internship Wiki
              </h1>
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                A complete guide for students and employers — your rights, responsibilities, and how to build internships that are legal, ethical, and mutually beneficial.
              </p>
            </header>

            {/* Mobile TOC */}
            <nav className="lg:hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 mb-8 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">📑 On This Page</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {TOC_SECTIONS.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 py-1 transition-colors">
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>

            <hr className="border-slate-200 dark:border-slate-800 mb-10" />

            {/* ────────────── OVERVIEW ────────────── */}
            <section id="overview" className="scroll-mt-24 mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Overview</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Internships connect students with real-world work environments, giving them hands-on experience while businesses gain fresh perspectives and future talent. But not all internships are structured the same way.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                This guide covers the two main types — <strong className="text-slate-900 dark:text-white">paid</strong> and <strong className="text-slate-900 dark:text-white">unpaid</strong> — and explains the legal requirements, tax implications, and best practices for each. Whether you&apos;re a student exploring opportunities or a business creating them, this page will help you make informed decisions.
              </p>
              <div className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">🤖</span>
                  <div>
                    <h3 className="text-lg font-extrabold text-white mb-1">AI-Powered Compliance Assistance</h3>
                    <p className="text-brand-100 text-sm leading-relaxed">
                      InternPick uses <strong className="text-white">Google Gemini AI</strong> to automatically review every listing before publication. Our AI checks descriptions against DOL guidelines and flags potential compliance issues.
                    </p>
                    <p className="text-brand-200 text-xs mt-2 italic">
                      ⚠️ AI review is assistive only and does not constitute legal advice.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800 mb-16" />

            {/* ────────────── BENEFITS FOR STUDENTS ────────────── */}
            <section id="benefits-students" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Benefits for Students</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Internships are one of the most valuable experiences you can have during high school. They bridge the gap between classroom learning and real-world careers.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: '🛠️', title: 'Real-World Skills', desc: 'Develop practical skills that look great on college applications and résumés.' },
                  { icon: '🤝', title: 'Professional Network', desc: 'Build connections with mentors and professionals who can guide your career.' },
                  { icon: '🧭', title: 'Career Exploration', desc: 'Try out a career field before committing — discover what you love (and what you don\'t).' },
                  { icon: '📝', title: 'Stronger Applications', desc: 'Stand out on college and scholarship applications with real work experience.' },
                  { icon: '💡', title: 'Soft Skills', desc: 'Practice communication, teamwork, time management, and problem-solving.' },
                  { icon: '🏆', title: 'Confidence', desc: 'Gain confidence by contributing to real projects and seeing the impact of your work.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-brand-50/50 dark:bg-brand-900/5 border border-brand-100 dark:border-brand-900/20">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800 mb-16" />

            {/* ────────────── BENEFITS FOR EMPLOYERS ────────────── */}
            <section id="benefits-employers" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Benefits for Employers</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Hosting interns isn&apos;t just good for the community — it&apos;s good for business. Here&apos;s why local businesses invest in internship programs:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: '🌱', title: 'Build Your Pipeline', desc: 'Identify and train your future workforce before they even graduate.' },
                  { icon: '🌍', title: 'Community Impact', desc: 'Strengthen your local reputation and give back to the community that supports your business.' },
                  { icon: '💡', title: 'Fresh Perspectives', desc: 'Young interns bring energy, digital fluency, and creative ideas to the table.' },
                  { icon: '📣', title: 'Brand Awareness', desc: 'Interns become brand ambassadors, sharing their positive experience with their network.' },
                  { icon: '🎯', title: 'Low-Risk Evaluation', desc: 'Evaluate potential future employees in a real work environment before hiring.' },
                  { icon: '❤️', title: 'Give Back', desc: 'Help shape the next generation of professionals and build meaningful mentorship relationships.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-green-50/50 dark:bg-green-900/5 border border-green-100 dark:border-green-900/20">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800 mb-16" />

            {/* ────────────── PAID INTERNSHIPS ────────────── */}
            <section id="paid-internships" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Paid Internships</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                A paid internship treats the intern as an employee under federal and state labor law. This is the <strong className="text-slate-900 dark:text-white">safer and simpler</strong> path for most businesses, especially for-profit companies.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-xl p-6">
                  <h3 className="font-bold text-green-800 dark:text-green-300 mb-3">🏢 For Employers</h3>
                  <ul className="space-y-2.5 text-sm text-green-700 dark:text-green-400">
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>Wages are <strong>fully tax-deductible</strong> as a business expense</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>May qualify for the <strong>Work Opportunity Tax Credit</strong> (WOTC)</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>No risk of DOL misclassification lawsuits</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>Attracts better candidates and builds loyalty</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>Must comply with <strong>minimum wage</strong>, overtime, and hour restrictions for minors</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>Must carry <strong>workers&apos; comp</strong> and report wages via W-2</span></li>
                  </ul>
                </div>

                <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800/30 rounded-xl p-6">
                  <h3 className="font-bold text-brand-800 dark:text-brand-300 mb-3">🎓 For Students</h3>
                  <ul className="space-y-2.5 text-sm text-brand-700 dark:text-brand-400">
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>You are an <strong>employee</strong> — with full legal protections</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>Protected by minimum wage and overtime laws</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>Covered by anti-discrimination and harassment protections</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>Eligible for workers&apos; compensation if injured</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>Your earnings are <strong>taxable income</strong> — you&apos;ll receive a W-2</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>Hours are limited for minors under <strong>FLSA youth rules</strong></span></li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">Bottom line:</strong> Paid internships are straightforward. The intern is an employee, the business gets tax deductions, and everyone has clear legal protections. This is the recommended path for most businesses on InternPick.
                </p>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800 mb-16" />

            {/* ────────────── UNPAID INTERNSHIPS ────────────── */}
            <section id="unpaid-internships" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Unpaid Internships</h2>

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-5 mb-8">
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">⚠️ Strict Legal Requirements Apply</p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Unpaid internships at <strong>for-profit</strong> businesses must pass the DOL&apos;s Primary Beneficiary Test. If they don&apos;t, the intern is legally an employee and must be paid minimum wage. Non-compliant businesses risk lawsuits, back-pay, and penalties.
                </p>
              </div>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Unpaid internships are legal only when the experience <strong className="text-slate-900 dark:text-white">primarily benefits the intern</strong>, not the business. They must be structured as educational experiences, not free labor.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-6">
                  <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-3">🏢 For Employers</h3>
                  <ul className="space-y-2.5 text-sm text-amber-700 dark:text-amber-400">
                    <li className="flex gap-2"><span className="flex-shrink-0">✕</span><span><strong>No wage deduction</strong> — no payroll = nothing to write off</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✕</span><span><strong>No tax credits</strong> — WOTC and similar programs require paid employees</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✕</span><span>Training time is <strong>not deductible</strong> — IRS only allows hard costs</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span><em>Can</em> deduct supplies, equipment, and materials purchased for the intern</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span><em>Can</em> deduct business-related travel reimbursements (subject to IRS limits)</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">⚠️</span><span>Must pass all 7 factors of the <strong>DOL Primary Beneficiary Test</strong></span></li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl p-6">
                  <h3 className="font-bold text-red-800 dark:text-red-300 mb-3">🎓 For Students</h3>
                  <ul className="space-y-2.5 text-sm text-red-700 dark:text-red-400">
                    <li className="flex gap-2"><span className="flex-shrink-0">⚠️</span><span>You are <strong>not an employee</strong> — fewer legal protections</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">⚠️</span><span>Not covered by minimum wage or overtime laws</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>The experience <strong>must primarily benefit you</strong>, not the employer</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>Should be tied to your education (coursework or academic credit)</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>You should <strong>never replace</strong> a paid employee&apos;s duties</span></li>
                    <li className="flex gap-2"><span className="flex-shrink-0">✓</span><span>If it feels like a job — it probably <strong>should be paid</strong></span></li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">Bottom line:</strong> Unpaid internships carry significant legal risk for employers and fewer protections for students. They&apos;re only appropriate when the internship is genuinely educational and doesn&apos;t displace paid work. When in doubt, <strong className="text-slate-900 dark:text-white">pay your interns</strong>.
                </p>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800 mb-16" />

            {/* ────────────── DOL 7-FACTOR TEST ────────────── */}
            <section id="dol-test" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>The DOL Primary Beneficiary Test</h2>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                The Department of Labor uses a <strong className="text-slate-900 dark:text-white">7-factor test</strong> to determine whether an unpaid internship is legally compliant. No single factor is determinative — courts consider the totality of the circumstances:
              </p>

              <div className="space-y-4">
                {[
                  { num: 1, title: 'Clear Educational Understanding', desc: 'Both the intern and employer understand there is no expectation of compensation. The internship is structured around educational objectives.', tip: '✅ Put it in writing — use an internship agreement that clearly states unpaid status.' },
                  { num: 2, title: 'Educational Benefit to the Intern', desc: 'The training is similar to what would be given in an educational environment, including hands-on learning and skills development.', tip: '✅ Design a structured learning plan with specific skills the intern will develop.' },
                  { num: 3, title: 'Tied to Formal Education', desc: 'The internship is tied to the intern\'s formal education program through integrated coursework or academic credit.', tip: '✅ Partner with schools or offer documentation for academic credit.' },
                  { num: 4, title: 'Accommodates Academic Calendar', desc: 'The schedule accommodates the intern\'s academic commitments and school calendar.', tip: '✅ Offer flexible hours, especially during exams and school events.' },
                  { num: 5, title: 'Limited Duration', desc: 'The internship has a defined start and end date, limited to the period in which the intern receives beneficial learning.', tip: '✅ Set a clear term length (e.g., summer, one semester).' },
                  { num: 6, title: 'Does Not Displace Regular Employees', desc: 'The intern\'s work complements rather than displaces paid employees. The intern works under close supervision.', tip: '✅ Assign mentors and ensure the intern shadows — not replaces — employees.' },
                  { num: 7, title: 'No Entitlement to a Paid Position', desc: 'Both parties understand the internship does not guarantee a paid job afterward.', tip: '✅ Clearly communicate this in the internship agreement upfront.' },
                ].map((item) => (
                  <div key={item.num} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                    <div className="flex items-start gap-4">
                      <span className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 flex items-center justify-center text-sm font-black flex-shrink-0">{item.num}</span>
                      <div className="flex-grow">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                        <p className="text-xs text-green-700 dark:text-green-400 mt-2 font-medium bg-green-50 dark:bg-green-900/10 rounded-lg px-3 py-1.5 inline-block">{item.tip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800 mb-16" />

            {/* ────────────── TAX & FINANCIAL IMPACT ────────────── */}
            <section id="tax-implications" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Tax &amp; Financial Impact</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                The tax picture differs significantly between paid and unpaid internships. Here&apos;s a side-by-side comparison:
              </p>

              {/* Comparison Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="text-left px-5 py-3 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">Category</th>
                      <th className="text-left px-5 py-3 font-bold text-green-700 dark:text-green-400 border-b border-slate-200 dark:border-slate-700">💰 Paid</th>
                      <th className="text-left px-5 py-3 font-bold text-amber-700 dark:text-amber-400 border-b border-slate-200 dark:border-slate-700">🆓 Unpaid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {[
                      { cat: 'Wage deduction', paid: 'Yes — fully deductible as business expense', unpaid: 'No — no wages = nothing to deduct' },
                      { cat: 'Tax credits', paid: 'May qualify for WOTC', unpaid: 'Not eligible' },
                      { cat: 'Training time', paid: 'Part of compensation cost', unpaid: 'Not deductible (IRS only allows hard costs)' },
                      { cat: 'Supplies & equipment', paid: 'Deductible', unpaid: 'Deductible' },
                      { cat: 'Travel reimbursements', paid: 'Deductible (subject to IRS limits)', unpaid: 'Deductible (subject to IRS limits)' },
                      { cat: 'Payroll taxes', paid: 'Applies (FICA, unemployment)', unpaid: 'Not applicable' },
                      { cat: 'W-2 reporting', paid: 'Required', unpaid: 'Not required' },
                      { cat: 'Workers\' comp', paid: 'Required', unpaid: 'Depends on state law' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{row.cat}</td>
                        <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{row.paid}</td>
                        <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{row.unpaid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">Key takeaway:</strong> Paid internships offer clear financial benefits (tax deductions, WOTC eligibility). Unpaid internships have no payroll-related tax advantages — the only deductions are for hard costs like supplies and equipment.
                </p>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800 mb-16" />

            {/* ────────────── STATE MINIMUM WAGES ────────────── */}
            <section id="state-minimum-wages" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>State Minimum Wages</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                When offering a paid internship, you must comply with the <strong className="text-slate-900 dark:text-white">higher</strong> of your state&apos;s minimum wage or the federal minimum wage (${FEDERAL_MINIMUM_WAGE.toFixed(2)}/hr). Here are the current rates by state:
              </p>

              {/* Search */}
              <div className="relative mb-4">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" /></svg>
                <input
                  type="text"
                  value={wageSearch}
                  onChange={(e) => setWageSearch(e.target.value)}
                  placeholder="Search by state name..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="text-left px-4 py-2.5 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">State</th>
                      <th className="text-left px-4 py-2.5 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">Minimum Wage</th>
                      <th className="text-left px-4 py-2.5 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 hidden sm:table-cell">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {STATE_MINIMUM_WAGES
                      .filter(s => !wageSearch || s.state.toLowerCase().includes(wageSearch.toLowerCase()) || s.abbr.toLowerCase().includes(wageSearch.toLowerCase()))
                      .map(s => (
                        <tr key={s.abbr} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-2.5">
                            <span className="font-medium text-slate-900 dark:text-white">{s.state}</span>
                            <span className="text-slate-400 dark:text-slate-500 ml-1">({s.abbr})</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`font-bold ${s.rate > FEDERAL_MINIMUM_WAGE ? 'text-green-700 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>
                              ${s.rate.toFixed(2)}/hr
                            </span>
                            {s.rate === FEDERAL_MINIMUM_WAGE && (
                              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">Federal</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell">{s.note || '—'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  <strong>Note:</strong> Rates are as of 2024–2025 and may be updated annually. Some cities and counties have higher local minimums. Always verify with your <a href="https://www.dol.gov/agencies/whd/minimum-wage/state" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">state&apos;s Department of Labor</a> for the most current rate.
                </p>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800 mb-16" />

            {/* ────────────── FLSA ────────────── */}
            <section id="flsa" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Fair Labor Standards Act (FLSA)</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">When Unpaid Is Legal</h3>
                  <ul className="space-y-3">
                    {[
                      'The experience primarily benefits the intern, not the employer',
                      'The internship is closely tied to academic coursework or credit',
                      'The intern does not replace or displace a paid employee',
                      'A structured learning plan with mentorship is in place',
                      'The duration is limited and clearly defined upfront',
                    ].map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">When You Must Pay</h3>
                  <ul className="space-y-3">
                    {[
                      'The intern performs productive work that benefits the business',
                      'The intern replaces tasks a paid employee would otherwise do',
                      'There is no formal training or educational component',
                      'The employer derives immediate, tangible advantage from the work',
                      'The intern is treated as a regular staff member with assigned duties',
                    ].map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-red-500 flex-shrink-0 mt-0.5">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-5">
                <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">💡 Youth Labor Law Reminders</p>
                <ul className="space-y-1.5 text-sm text-blue-700 dark:text-blue-400">
                  <li>• Minors (14–17) have <strong>restricted work hours</strong> during the school year</li>
                  <li>• Certain <strong>hazardous occupations</strong> are prohibited for workers under 18</li>
                  <li>• State laws may impose <strong>stricter requirements</strong> than federal law</li>
                  <li>• Always check your <strong>state&rsquo;s Department of Labor</strong> for local regulations</li>
                </ul>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800 mb-16" />

            {/* ────────────── YOUR RIGHTS & GETTING HELP ────────────── */}
            <section id="your-rights" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Your Rights &amp; Getting Help</h2>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Every intern — whether paid or unpaid — deserves a <strong className="text-slate-900 dark:text-white">safe, respectful, and professional</strong> work environment. If you feel you are being mistreated, exploited, or abused, you are <strong className="text-slate-900 dark:text-white">not alone</strong>.
              </p>

              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl p-6 mb-8">
                <p className="text-sm font-bold text-red-800 dark:text-red-300 mb-3">🚨 Warning Signs of an Unsafe Internship</p>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    'Being asked to work excessive or illegal hours',
                    'Verbal, physical, or emotional harassment',
                    'Being asked to do hazardous or dangerous work',
                    'Unwanted personal contact or grooming behavior',
                    'Being threatened for reporting problems',
                    'Performing only menial tasks with zero training',
                    'Pressure to provide personal information or photos',
                    'Being isolated from other employees or supervisors',
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2 text-xs text-red-700 dark:text-red-400">
                      <span className="flex-shrink-0">🔴</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Where to Get Help</h3>
              <div className="space-y-3">
                {[
                  { icon: '📞', title: 'Talk to a Trusted Adult', desc: 'Your parent, guardian, school counselor, or a teacher — they can help you navigate the situation and take action.' },
                  { icon: '🏫', title: 'Contact Your School', desc: 'If the internship was arranged through your school, reach out to your guidance counselor or internship coordinator.' },
                  { icon: '📱', title: 'Report to InternPick', desc: 'Use the "Report" button on any listing, or email us at safety@internpick.com. We investigate every report.' },
                  { icon: '🏛️', title: 'File a Complaint with the DOL', desc: 'Call the Wage and Hour Division at 1-866-487-9243 or visit dol.gov/whd to file a complaint.' },
                  { icon: '🆘', title: 'National Child Labor Hotline', desc: 'For urgent concerns about child labor violations: 1-866-4-US-WAGE (1-866-487-9243), Mon–Fri 8am–5pm.' },
                  { icon: '🤝', title: 'EEOC', desc: 'Discrimination based on race, sex, disability, religion, or national origin — file at eeoc.gov or call 1-800-669-4000.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800/30 rounded-xl p-5">
                <p className="text-sm font-bold text-brand-800 dark:text-brand-300 mb-1">💬 Speaking up is brave, not wrong.</p>
                <p className="text-xs text-brand-600 dark:text-brand-400">If something feels wrong, it probably is. You have the right to a safe internship. Every report helps protect the next intern.</p>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800 mb-16" />

            {/* ────────────── HOW INTERNPICK PROTECTS YOU ────────────── */}
            <section id="how-internpick-helps" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>How InternPick Protects You</h2>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: '🤖', title: 'AI-Powered Review', desc: 'Every listing is reviewed by Google Gemini AI before publication. Unpaid roles get extra scrutiny against DOL guidelines.' },
                  { icon: '⚠️', title: 'Real-Time Warnings', desc: 'Employers creating unpaid roles see inline guidance about DOL requirements and compliance best practices.' },
                  { icon: '🛡️', title: 'Safety Reporting', desc: 'Students can report unsafe or suspicious listings directly through the platform.' },
                  { icon: '🔒', title: 'Age-Appropriate Screening', desc: 'Our platform serves minors (14–18), so safety standards are extremely high.' },
                  { icon: '📚', title: 'Educational Resources', desc: 'This guide plus links to official DOL and IRS resources help everyone make informed decisions.' },
                  { icon: '⚡', title: 'Proactive Moderation', desc: 'AI actively flags scam indicators, predatory language, and illegal labor practices.' },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-3 mb-1.5">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800 mb-16" />

            {/* ────────────── OFFICIAL RESOURCES ────────────── */}
            <section id="resources" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Official Resources</h2>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'DOL Fact Sheet #71', desc: 'Internship Programs Under the FLSA', url: 'https://www.dol.gov/agencies/whd/fact-sheets/71-flsa-internships' },
                  { title: 'DOL Youth & Labor', desc: 'Age requirements, hour limitations, prohibited jobs', url: 'https://www.dol.gov/agencies/whd/youth-employment' },
                  { title: 'IRS Business Expenses', desc: 'Publication 535: What businesses can deduct', url: 'https://www.irs.gov/publications/p535' },
                  { title: 'WOTC Tax Credit', desc: 'Work Opportunity Tax Credit for paid employees', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/work-opportunity-tax-credit' },
                  { title: 'File a DOL Complaint', desc: 'Report wage or labor violations (1-866-487-9243)', url: 'https://www.dol.gov/agencies/whd/contact/complaints' },
                  { title: 'EEOC Discrimination Help', desc: 'File a discrimination complaint (1-800-669-4000)', url: 'https://www.eeoc.gov/filing-charge-discrimination' },
                ].map((res, i) => (
                  <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all group">
                    <div className="flex-grow">
                      <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{res.title} ↗</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{res.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* Disclaimer */}
            <div className="text-center py-8 max-w-2xl mx-auto border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                <strong className="text-slate-500 dark:text-slate-400">Disclaimer:</strong> This page is for educational purposes only and does not constitute legal, tax, or professional advice. InternPick.com is a technology platform, not a law firm. Consult qualified professionals for compliance. See our <Link href="/terms" className="text-brand-600 dark:text-brand-400 hover:underline">Terms of Service</Link>.
              </p>
            </div>

          </article>
        </div>
      </main>
    </div>
  )
}
