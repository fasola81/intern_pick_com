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
        <section className="relative w-full overflow-hidden bg-white dark:bg-slate-950 pt-32 pb-24 md:pt-40 md:pb-32 px-4">
          <div className="absolute inset-0 z-0 bg-grid-slate-100/[0.04] dark:bg-grid-white/[0.02]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="bg-brand-500/20 w-[800px] h-[800px] rounded-full blur-[120px] opacity-50 absolute top-[-200px] left-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 animate-fade-in-up">
              Pick Your Future <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">
                Right Now.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Empowering students to take control of their careers by matching them with local business internships. Flip the traditional model and choose where you want to grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2 group">
                  Start Your Profile 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  See How it Works
                </Button>
              </Link>
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
                Whether you're a driven student building your resume or a business owner looking for fresh talent, InternPick connects you directly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Student Track */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-brand-200 dark:border-brand-900/50">
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">For Students</h3>
                </div>
                <div className="grid gap-6">
                  <FeatureCard 
                    variant="student"
                    title="Build Your Profile"
                    description="Highlight your skills, coursework, and extracurriculars in a guided, student-friendly process."
                  />
                  <FeatureCard 
                    variant="student"
                    title="Auto-Generate a Polished Resume"
                    description="Our AI turns your profile into a professional, beautifully formatted resume ready for employers."
                  />
                  <FeatureCard 
                    variant="student"
                    title="Pick Your Internship"
                    description="Browse local businesses actively seeking interns. Send your resume with one click."
                  />
                </div>
              </div>

              {/* Business Track */}
              <div className="space-y-6 mt-12 md:mt-0">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">For Businesses</h3>
                </div>
                <div className="grid gap-6">
                  <FeatureCard 
                    variant="business"
                    title="Post Mentorship Opportunities"
                    description="Easily list the roles and projects where a driven high schooler could add value to your team."
                  />
                  <FeatureCard 
                    variant="business"
                    title="Discover Driven Young Talent"
                    description="Review concise, unified resumes from local students who chose your business specifically."
                  />
                  <FeatureCard 
                    variant="business"
                    title="Support the Community"
                    description="Foster the next generation of professionals right in your own backyard."
                  />
                </div>
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
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 text-sm font-semibold tracking-wide mb-6 uppercase">
              Coming Soon
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              The Springfield, NJ Pilot
            </h2>
            <p className="text-xl md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              We're launching our local pilot connecting driven high school students and local businesses right here in Springfield, New Jersey. Be part of the inaugural cohort shaping the future of internships.
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
            <div className="mt-12">
              <Link href="/login">
                <Button size="lg" className="px-10">Join the Waitlist</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Basic Footer */}
      <footer className="bg-slate-100 dark:bg-slate-900 py-12 px-4 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} InternPick. Empowering young careers.</p>
          <a
            href="https://swiftlearn.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            Powered by
            <Image
              src="/icons/logo/SL_footer_Logo.png"
              alt="SwiftLearn Logo"
              width={120}
              height={30}
              className="h-6 w-auto object-contain"
            />
          </a>
        </div>
      </footer>
    </div>
  )
}
