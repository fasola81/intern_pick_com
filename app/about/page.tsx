import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About InternPick — School-Credit WBL Platform for Educators",
  description: "InternPick is the all-in-one platform that helps Career & Technical Education coordinators manage school-credit work-based learning — from posting programs to tracking student hours. FERPA-compliant.",
  openGraph: {
    title: "About InternPick — School-Credit WBL Platform for Educators",
    description: "Built for educators who run practicum programs. FERPA-compliant, DOL-protected, school-sponsored work-based learning.",
    url: "https://www.internpick.com/about",
    images: ["/images/hero_background.png"],
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-4 pb-24 md:pt-4 md:pb-32 px-4 max-w-5xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-bold border border-emerald-200 dark:border-emerald-800/50 mb-6">
            🏫 Built for Educators · FERPA Compliant · DOL Protected
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            The Platform Behind Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Practicum Program
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            InternPick is the all-in-one platform that helps Career & Technical Education (CTE) coordinators manage school-credit work-based learning — from posting programs to tracking student hours.
          </p>
        </div>

        {/* Three-Way Partnership */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-3xl border border-emerald-200 dark:border-emerald-800/50 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <span className="text-4xl mb-4">🏫</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">For Schools</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">
              Post practicum programs, invite students via email or CSV, match them with host businesses, and track every hour and journal entry from one dashboard. You stay in full control of the academic experience.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Create unlimited practicum programs</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Bulk invite students (email or CSV)</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Track hours, journals, and evaluations</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> FERPA-compliant data handling</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <span className="text-4xl mb-4">🏢</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">For Businesses</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">
              Browse school programs, apply to host students, assign mentors, and approve logged hours. The school handles insurance and academic oversight — you provide the real-world experience.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Zero wage liability (school-credit only)</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> School provides insurance coverage</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Browse &amp; apply to school programs</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Community impact &amp; talent pipeline</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <span className="text-4xl mb-4">🎓</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">For Students</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">
              Your school assigns you to a host business where you gain real-world skills. Log your hours, write journal reflections, and build a professional profile — all while earning academic credit.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Log hours with employer approval</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Weekly reflection journals</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Career interest profile</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> Track progress toward required hours</li>
            </ul>
          </div>
        </div>

        {/* Trust & Compliance Section */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">
            Compliance &amp; Safety{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Built In</span>
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            We built InternPick around the regulatory frameworks that school districts operate within. Your administrators and parents can trust every aspect of the platform.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🛡️', title: 'FERPA Compliant', desc: 'Student data is never shared outside the school-business-student triad. Invite-only access via secure codes. No public browsing of student information.' },
              { icon: '⚖️', title: 'Dept. of Labor Protected', desc: 'School-sponsored practicums for academic credit are explicitly covered by the Department of Labor\'s Primary Beneficiary Test. No wages means no wage/hour liability for businesses.' },
              { icon: '🤖', title: 'AI-Moderated Content', desc: 'Every program listing is reviewed by Google Gemini AI before publication. We flag unsafe language, compliance risks, and predatory patterns automatically.' },
              { icon: '🔒', title: '256-bit SSL Encryption', desc: 'All data transmitted between users and InternPick is encrypted using bank-grade TLS encryption. Student records are protected in transit and at rest.' },
              { icon: '👶', title: 'COPPA Safe', desc: 'InternPick serves minors (14-18), so age-appropriate safety standards are built into every layer — from content moderation to data collection limits.' },
              { icon: '📋', title: 'School Oversight', desc: 'Educators control every step: which businesses can host students, which students are enrolled, and what learning objectives are required. Nothing happens without school approval.' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:shadow-md transition-shadow">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-3 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works for Schools */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-10 text-center">
            Getting Started Takes{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Minutes</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', icon: '📝', title: 'Create Your Account', desc: 'Sign up as an educator. Enter your school name, district, and contact info.' },
              { step: '2', icon: '📋', title: 'Post a Program', desc: 'Describe your practicum — subject area, hours required, learning objectives, and what host businesses need to provide.' },
              { step: '3', icon: '📩', title: 'Invite Students', desc: 'Invite students one by one or upload a CSV of your entire class roster. They create profiles and are ready to be matched.' },
              { step: '4', icon: '🤝', title: 'Match & Track', desc: 'Local businesses apply to host students. You approve matches, and students start logging hours — all tracked in your dashboard.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-lg font-black mb-3">
                  {item.step}
                </div>
                <span className="text-2xl">{item.icon}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-emerald-50 dark:bg-emerald-900/20 rounded-[3rem] p-12 md:p-16 border border-emerald-100 dark:border-emerald-800/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-brand-100/[0.4] dark:bg-grid-white/[0.02]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Ready to launch your practicum program?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              Join the growing network of educators, businesses, and students building the future of work-based learning.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup?role=educator">
                <Button size="lg" className="w-full sm:w-auto gap-2 group bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25">
                  🏫 Create School Account
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
              <Link href="/signup?role=employer">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">
                  🏢 I&apos;m a Business
                </Button>
              </Link>
              <Link href="/signup?role=student">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">
                  🎓 I&apos;m a Student
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
