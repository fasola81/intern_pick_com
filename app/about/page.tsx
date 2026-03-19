import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About Us | InternPick.com",
  description: "Learn about InternPick.com, a marketplace connecting ambitious high school students with local businesses for incredible internship opportunities.",
  openGraph: {
    title: "About Us | InternPick.com",
    description: "Learn about InternPick.com, a marketplace connecting ambitious high school students with local businesses for incredible internship opportunities.",
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
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">Us</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Empowering students to take control of their professional careers — one internship at a time.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-8">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="p-2 bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 rounded-xl">🎓</span>
                Student Empowerment
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg flex-grow">
                InternPick.com was created to help and empower high school students be matched directly with local businesses for great internship opportunities. We believe in giving the authority and cutting-edge tools to the interns to have total control over their first steps into the professional world.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="p-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">🤖</span>
                Responsible AI Use
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg flex-grow">
                Placing responsibility and education at the forefront is our core belief. We utilize artificial intelligence fundamentally to teach, scale perfectly-matched opportunities, and accelerate professional growth safely.
              </p>
            </div>
          </div>
        </div>

        {/* How InternPick.com Supports You */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">InternPick.com</span> Supports You
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            We don&apos;t manage employment relationships — we build the tools and resources that help students and employers find the right fit, safely and compliantly.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🤖', title: 'AI-Powered Listing Review', desc: 'Every listing is reviewed by Google Gemini AI before publication. Unpaid roles receive extra scrutiny against DOL guidelines to help employers stay compliant.' },
              { icon: '⚠️', title: 'Real-Time Compliance Guidance', desc: 'Employers creating unpaid roles see inline guidance about DOL requirements and the Primary Beneficiary Test — right inside the role creation wizard.' },
              { icon: '📚', title: 'Educational Resources', desc: 'Our comprehensive Internship Wiki covers labor law, tax implications, school-credit programs, and youth employment rules — all in plain language.' },
              { icon: '🛡️', title: 'Age-Appropriate Platform', desc: 'InternPick.com serves minors (14–18), so safety standards are built into the platform from the ground up — from listing requirements to content moderation.' },
              { icon: '⚡', title: 'Proactive Moderation', desc: 'AI actively flags scam indicators, predatory language, and illegal labor practices before listings ever go live.' },
              { icon: '🎯', title: 'Smart Matching', desc: 'Our intelligent matching system connects students with roles that align with their interests, skills, and career goals — so every internship is a meaningful step forward.' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:shadow-md transition-shadow">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-3 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/internship-rules#how-internpick-helps" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline transition-colors">
              Learn more in our Internship Wiki →
            </Link>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-brand-50 dark:bg-brand-900/20 rounded-[3rem] p-12 md:p-16 border border-brand-100 dark:border-brand-800/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-brand-100/[0.4] dark:bg-grid-white/[0.02]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Ready to take the first step?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              Join InternPick.com today and start connecting with local opportunities in your community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login?role=student">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-brand-500/25">
                  I'm a Student
                </Button>
              </Link>
              <Link href="/login?role=employer">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">
                  I'm a Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
