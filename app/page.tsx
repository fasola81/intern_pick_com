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
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              InternPick is purpose-built for school-sponsored programs. Every feature is designed around the legal realities of working with minors.
            </p>
            <div className="w-40 h-40 mx-auto mb-10">
              <Image src="/images/trust_compliance.png" alt="Trust and compliance" width={200} height={200} className="w-full h-full object-contain drop-shadow-lg" />
            </div>
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
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Dept. of Labor / Fair Labor Standards Act</h3>
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
            <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 text-sm font-semibold tracking-wide mb-6 uppercase">
              Coming Soon
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              The Springfield, NJ Pilot
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              We&apos;re launching our local pilot connecting schools, students, and businesses in Springfield, New Jersey and surrounding Union County. Be part of the inaugural cohort shaping the future of work-based learning.
            </p>
            <div className="max-w-md mx-auto mb-10">
              <Image src="/images/springfield_municipal.png" alt="Springfield NJ Municipal Building" width={500} height={500} className="rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800" />
            </div>
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
