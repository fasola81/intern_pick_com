import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 md:pt-40 md:pb-32 px-4 max-w-5xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">Us</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Empowering students to take control of their professional careers, backed by the team at <a href="https://swiftlearn.ai" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-500 hover:underline transition-colors font-semibold">SwiftLearn.ai</a>.
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
                InternPick was created to help and empower high school students be matched directly with local businesses for great internship opportunities. We believe in giving the authority and cutting-edge tools to the interns to have total control over their first steps into the professional world.
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
                As a project driven by the <a href="https://swiftlearn.ai" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline">SwiftLearn</a> team, placing responsibility and education at the forefront is our core belief. We utilize artificial intelligence fundamentally to teach, scale perfectly-matched opportunities, and accelerate professional growth safely.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-brand-50 dark:bg-brand-900/20 rounded-[3rem] p-12 md:p-16 border border-brand-100 dark:border-brand-800/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-brand-100/[0.4] dark:bg-grid-white/[0.02]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Ready to take the first step?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              Join InternPick today and start connecting with local opportunities in your community.
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
