import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { FeatureCard } from '@/components/ui/FeatureCard'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex flex-col items-center justify-center">
        {/* Responsive Hero Section */}
        <section className="relative w-full overflow-hidden bg-white dark:bg-slate-950 pt-32 pb-24 md:pt-40 md:pb-32 px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.10]">
            <Image 
              src="/images/hero_background.png" 
              alt="Mentorship matchmaking background" 
              fill 
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 z-0 bg-grid-slate-100/[0.08] dark:bg-grid-white/[0.04]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="bg-brand-500/20 w-[800px] h-[800px] rounded-full blur-[120px] opacity-50 absolute top-[-200px] left-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 animate-fade-in-up">
              Match With the Best <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">
                Local Talent Fast.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              The premier platform connecting ambitious high school students with local businesses. Ditch the cold emails and find the perfect match in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login?role=student">
                <Button size="lg" className="w-full sm:w-auto gap-2 group" data-tracking="hero-cta-student">
                  I'm a Student (Find an Internship)
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
              <Link href="/login?role=employer">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white" data-tracking="hero-cta-employer">
                  I'm a Business (Post a Role)
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Local Trust Banner */}
        <div className="w-full bg-brand-50 dark:bg-brand-900/20 py-4 px-4 border-b border-brand-100 dark:border-brand-900/50">
          <p className="text-center text-sm md:text-base font-medium text-brand-700 dark:text-brand-300">
            🚀 Now launching our 2026 Pilot Program for students and businesses in Springfield, NJ and surrounding Union County.
          </p>
        </div>

        {/* Trending Local Opportunities */}
        <section className="w-full py-24 px-4 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Trending Local Opportunities
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                A sneak peek at open roles businesses in your area are hiring for right now.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative group flex">
                <FeatureCard 
                  title="Social Media Assistant"
                  description="Help manage content creation, engagement strategy, and local weekly campaigns for a boutique marketing firm."
                  imageUrl="/images/marketing_internship.png"
                  className="pb-24 h-full flex-1"
                />
                <div className="absolute bottom-8 left-8 right-8">
                  <Button className="w-full opacity-0 group-hover:opacity-100 transition-opacity" disabled>
                    Quick Apply
                  </Button>
                </div>
              </div>

              <div className="relative group flex">
                <FeatureCard 
                  title="Tech Support Trainee"
                  description="Learn the ropes of IT support, hardware troubleshooting, and client communication at a dedicated tech repair shop."
                  imageUrl="/images/it_internship.png"
                  className="pb-24 h-full flex-1"
                />
                <div className="absolute bottom-8 left-8 right-8">
                  <Button className="w-full opacity-0 group-hover:opacity-100 transition-opacity" disabled>
                    Quick Apply
                  </Button>
                </div>
              </div>

              <div className="relative group flex">
                <FeatureCard 
                  title="Front Desk Coordinator"
                  description="Gain invaluable customer service experience and operations insight working the front desk at a busy local wellness center."
                  imageUrl="/images/front_desk_internship.png"
                  className="pb-24 h-full flex-1"
                />
                <div className="absolute bottom-8 left-8 right-8">
                  <Button className="w-full opacity-0 group-hover:opacity-100 transition-opacity" disabled>
                    Quick Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="w-full py-24 px-4 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Two Tracks, One Marketplace
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Whether you're a driven student building your first resume or a business owner looking for fresh talent, InternPick clears the friction.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
              {/* Student Track */}
              <div className="space-y-6 bg-white dark:bg-slate-950 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute -right-12 -top-12 bg-brand-500/5 w-48 h-48 rounded-full blur-3xl" />
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100/50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xl border border-brand-200 dark:border-brand-800">
                    🎓
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">For Students</h3>
                </div>
                <div className="space-y-6 relative z-10">
                  <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                    Stop sending resumes into the void. Use our tools to stand out and apply locally.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-brand-500 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">AI Resume Builder</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Turn your extracurriculars into a polished, professional PDF automatically.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-brand-500 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Verified Local Roles</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Browse businesses in your area specifically asking for high school talent.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-brand-500 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">One-Click Apply</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Send your profile directly to decision-makers with zero friction.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-brand-500 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">AI Safety Shield</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Every message is screened by AI to protect students from inappropriate contact and personal info requests.</span>
                      </div>
                    </li>
                  </ul>
                  <div className="pt-4">
                     <Link href="/login?role=student" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline inline-flex items-center gap-1">
                        Create Student Profile →
                     </Link>
                  </div>
                </div>
              </div>

              {/* Business Track */}
              <div className="space-y-6 bg-white dark:bg-slate-950 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden mt-8 md:mt-0">
                <div className="absolute -left-12 -bottom-12 bg-slate-500/5 w-48 h-48 rounded-full blur-3xl" />
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xl border border-slate-200 dark:border-slate-700">
                    🏢
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">For Businesses</h3>
                </div>
                <div className="space-y-6 relative z-10">
                  <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                    Tap into an eager, motivated local talent pool without the hiring headache.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-slate-700 dark:text-slate-300 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Zero-Friction Hiring</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Post a mentorship or internship role in minutes, completely free.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-slate-700 dark:text-slate-300 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Standardized Resumes</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Review talent through our unified application view—no formatting mess.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-slate-700 dark:text-slate-300 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Community Impact</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Foster the next generation of professionals right in your own backyard.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-slate-700 dark:text-slate-300 mt-1">✓</span>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">AI-Powered Compliance</strong>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">All communications are AI-monitored to ensure professional, safe interactions with student applicants.</span>
                      </div>
                    </li>
                  </ul>
                  <div className="pt-4">
                     <Link href="/login?role=employer" className="text-slate-700 dark:text-slate-300 font-semibold hover:underline inline-flex items-center gap-1">
                        Post a Role →
                     </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI-Powered Safety Section */}
        <section className="w-full py-20 px-4 bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-teal-950/30 border-y border-green-200 dark:border-green-900/50 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800/50 rounded-full px-4 py-2 mb-8">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
              </svg>
              <span className="text-sm font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">AI-Powered Safety</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Built with <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Safety First</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Because our platform connects businesses with high school students, we use AI to ensure every interaction is professional, safe, and appropriate.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-green-200 dark:border-green-800/40 shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl border border-green-200 dark:border-green-800/50">
                  🔍
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Real-Time Screening</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Every message is analyzed by AI before delivery — inappropriate content never reaches the other party.</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-green-200 dark:border-green-800/40 shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl border border-green-200 dark:border-green-800/50">
                  🛡️
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">PII Protection</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">AI blocks requests for home addresses, phone numbers, social security numbers, and other sensitive personal information.</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-green-200 dark:border-green-800/40 shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl border border-green-200 dark:border-green-800/50">
                  📋
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Audit Trail</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">All flagged content is logged and reviewed, keeping the platform accountable and continuously improving safety.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Local Pilot Section */}
        <section className="w-full py-24 px-4 bg-white dark:bg-slate-950 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 pointer-events-none z-0">
            <div className="bg-brand-500/10 w-[600px] h-[600px] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-sm font-semibold tracking-wide mb-6 uppercase">
              Now Live
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              The Springfield, NJ Pilot
            </h2>
            <p className="text-xl md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              We've launched our local pilot connecting driven high school students and local businesses right here in Springfield, New Jersey. Join the inaugural cohort shaping the future of internships.
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center min-w-[200px]">
                <span className="text-4xl font-black text-brand-500 mb-2">50+</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Local Students</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center min-w-[200px]">
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
