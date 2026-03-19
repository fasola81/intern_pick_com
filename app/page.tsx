import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "InternPick — School-Credit Work-Based Learning Platform",
  description: "The platform connecting schools, students, and local businesses for school-sponsored practicums. FERPA-compliant, DOL-protected, zero employer risk.",
  openGraph: {
    title: "InternPick — School-Credit Work-Based Learning Platform",
    description: "Connecting schools, students, and businesses for academic-credit practicums. FERPA-compliant. DOL-protected.",
    url: "https://www.internpick.com/",
    images: [
      {
        url: "/images/hero_background.png",
        width: 1200,
        height: 630,
        alt: "InternPick — Work-Based Learning",
      },
    ],
  },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex flex-col items-center justify-center">
        {/* ═══════════════════════════════════════════════════
            HERO — "School-Credit Practicums for Everyone"
        ═══════════════════════════════════════════════════ */}
        <section className="relative w-full min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950 py-12 md:py-20 px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.10]">
            <Image
              src="/images/hero_background.png"
              alt="Work-based learning background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 z-0 bg-grid-slate-100/[0.08] dark:bg-grid-white/[0.04]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="bg-emerald-500/15 w-[800px] h-[800px] rounded-full blur-[120px] opacity-50 absolute top-[-200px] left-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-bold border border-emerald-200 dark:border-emerald-800/50 mb-8 animate-fade-in">
              🏫 School-Sponsored • FERPA-Compliant • DOL-Protected
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 animate-fade-in-up">
              School-Credit Practicums<br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Made Simple.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              The platform that connects <strong>schools</strong>, <strong>students</strong>, and <strong>local businesses</strong> for academic-credit work-based learning. No wages. No legal gray areas. Just real-world experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup?role=educator">
                <Button size="lg" className="w-full sm:w-auto gap-2 group bg-emerald-600 hover:bg-emerald-700" data-tracking="hero-cta-school">
                  🏫 I&apos;m a School
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
              <Link href="/signup?role=employer">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white" data-tracking="hero-cta-business">
                  🏢 I&apos;m a Business
                </Button>
              </Link>
              <Link href="/signup?role=student">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white" data-tracking="hero-cta-student">
                  🎓 I&apos;m a Student
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Banner */}
        <div className="w-full bg-emerald-50 dark:bg-emerald-900/20 py-4 px-4 border-b border-emerald-100 dark:border-emerald-900/50">
          <p className="text-center text-sm md:text-base font-medium text-emerald-700 dark:text-emerald-300">
            ⚖️ School-sponsored practicums for academic credit only — no paid or unpaid internships outside of school programs at this time.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════
            HOW IT WORKS — 3-Step Flow
        ═══════════════════════════════════════════════════ */}
        <section id="how-it-works" className="w-full py-24 px-4 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                A simple three-step process that connects schools with local businesses to create real-world learning experiences for students.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300">
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-black text-sm border border-emerald-200 dark:border-emerald-800/50">1</div>
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 border border-emerald-200 dark:border-emerald-800/50">
                  🏫
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">School Posts a Program</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  An educator creates a Practicum Program describing what students will learn, the hours required, and what host businesses need to provide.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-black text-sm border border-blue-200 dark:border-blue-800/50">2</div>
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 border border-blue-200 dark:border-blue-800/50">
                  🏢
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Business Applies to Host</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Local businesses browse programs and apply to host students. They propose a mentor and describe how they&apos;ll support the student&apos;s learning.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-300">
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-700 dark:text-brand-300 font-black text-sm border border-brand-200 dark:border-brand-800/50">3</div>
                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 border border-brand-200 dark:border-brand-800/50">
                  🎓
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Student Earns Credit</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  The educator matches students with approved hosts. Students log hours, keep journals, and earn academic credit — all tracked in one place.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            THREE TRACKS — Value Props for Each User Type
        ═══════════════════════════════════════════════════ */}
        <section className="w-full py-24 px-4 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Three Tracks, One Platform
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Whether you&apos;re a school managing practicums, a business mentoring the next generation, or a student earning credit — InternPick has you covered.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* School Track */}
              <div className="space-y-6 bg-white dark:bg-slate-950 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute -right-12 -top-12 bg-emerald-500/5 w-48 h-48 rounded-full blur-3xl" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl border border-emerald-200 dark:border-emerald-800">
                    🏫
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">For Schools</h3>
                </div>
                <div className="space-y-6 relative z-10">
                  <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                    Create and manage practicum programs. Invite employers. Track every student&apos;s hours and progress.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-500 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Post &quot;Calls for Hosts&quot;</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Describe your program and let local businesses come to you.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-500 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">FERPA-Compliant by Design</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Student data is never exposed. Invite-only access via secure codes.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-500 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">AI-Moderated Programs</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Every program is reviewed by AI for FERPA, safety, and clarity before publishing.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-500 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Timesheet & Evaluation Tracking</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Students log hours. Employers approve them. You see everything in one dashboard.</span>
                      </div>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <Link href="/signup?role=educator" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1">
                      Create an Educator Account →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Business Track */}
              <div className="space-y-6 bg-white dark:bg-slate-950 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute -left-12 -bottom-12 bg-blue-500/5 w-48 h-48 rounded-full blur-3xl" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xl border border-blue-200 dark:border-blue-800">
                    🏢
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">For Businesses</h3>
                </div>
                <div className="space-y-6 relative z-10">
                  <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                    Mentor students from local schools. No wages, no legal gray areas — just community impact.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Zero Wage/Hour Risk</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">School-sponsored programs inherently pass the DOL Primary Beneficiary Test.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">School Provides Insurance</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Many programs include school-provided liability insurance — zero risk for you.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Browse &amp; Apply</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Browse school programs and apply to host students. The school handles everything else.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Community Impact</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Shape the next generation of professionals right in your own community.</span>
                      </div>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <Link href="/signup?role=employer" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1">
                      Create a Business Account →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Student Track */}
              <div className="space-y-6 bg-white dark:bg-slate-950 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute -right-12 -bottom-12 bg-brand-500/5 w-48 h-48 rounded-full blur-3xl" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100/50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xl border border-brand-200 dark:border-brand-800">
                    🎓
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">For Students</h3>
                </div>
                <div className="space-y-6 relative z-10">
                  <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                    Gain real-world experience at local businesses while earning academic credit through your school.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-brand-500 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Invited by Your School</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Your educator sends you a secure invite link. No public browsing — your data is protected.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-brand-500 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Log Hours &amp; Journal</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Track your work hours and write reflections — everything your school needs for credit.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-brand-500 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Earn Academic Credit</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Every practicum is school-supervised and structured for course credit.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-brand-500 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Safe &amp; Supervised</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Your school and employer are both involved every step of the way.</span>
                      </div>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <Link href="/signup?role=student" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline inline-flex items-center gap-1">
                      Join via Your School&apos;s Invite →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            TRUST & COMPLIANCE — FERPA / FLSA / Insurance
        ═══════════════════════════════════════════════════ */}
        <section className="w-full py-20 px-4 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-green-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-green-950/30 border-y border-emerald-200 dark:border-emerald-900/50 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50 rounded-full px-4 py-2 mb-8">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
              </svg>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Built for Trust &amp; Compliance</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Three Legal Shields,<br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Zero Gray Areas</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              InternPick is purpose-built for school-sponsored programs. Every feature is designed around the legal realities of working with minors.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl border border-emerald-200 dark:border-emerald-800/50">
                  🔒
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">FERPA Compliant</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Students join only via educator invite codes. No public student profiles. AI blocks any personally identifiable information in program posts.</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl border border-emerald-200 dark:border-emerald-800/50">
                  ⚖️
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">DOL / FLSA Protected</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">School-sponsored practicums for academic credit inherently pass the DOL Primary Beneficiary Test. Employers face zero wage/hour liability.</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl border border-emerald-200 dark:border-emerald-800/50">
                  🛡️
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Insurance Shield</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Schools can provide liability and workers&apos; comp insurance for students during placements — dropping the barrier to entry for businesses to zero.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            PILOT SECTION
        ═══════════════════════════════════════════════════ */}
        <section className="w-full py-24 px-4 bg-white dark:bg-slate-950 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 pointer-events-none z-0">
            <div className="bg-emerald-500/10 w-[600px] h-[600px] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-sm font-semibold tracking-wide mb-6 uppercase">
              Now Live
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              The Springfield, NJ Pilot
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              We&apos;ve launched our local pilot connecting schools, students, and businesses in Springfield, New Jersey and surrounding Union County. Join the inaugural cohort shaping the future of work-based learning.
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center min-w-[170px]">
                <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-2">5+</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Schools</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center min-w-[170px]">
                <span className="text-4xl font-black text-brand-500 mb-2">50+</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Students</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center min-w-[170px]">
                <span className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">10+</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Business Partners</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
