import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "How It Works | InternPick — School-Credit WBL Platform",
  description: "See exactly how InternPick connects schools, businesses, and students for school-credit practicums. Step-by-step flows for educators, employers, and students.",
  openGraph: {
    title: "How It Works | InternPick",
    description: "Step-by-step flows for schools, businesses, and students on the InternPick WBL platform.",
    url: "https://www.internpick.com/how-it-works",
  },
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* ═══════════════════════════════════════
            HERO
        ═══════════════════════════════════════ */}
        <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950 py-16 md:py-24 px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.10]">
            <Image
              src="/images/how_it_works_hero.png"
              alt="Work-based learning flow background"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-bold border border-emerald-200 dark:border-emerald-800/50 mb-6">
              🏫 School-Sponsored · FERPA-Compliant · DOL-Protected
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              How{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                InternPick
              </span>{' '}
              Works
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              A simple three-way partnership between schools, businesses, and students — all managed on one platform.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            OVERVIEW — The 3-Step Flow
        ═══════════════════════════════════════ */}
        <section className="w-full py-16 px-4 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">The Big Picture</h2>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
              Every practicum follows the same three-step pattern. The school is always in control.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300">
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-black text-sm border border-emerald-200 dark:border-emerald-800/50">1</div>
                <div className="w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-800/50">
                  <Image src="/images/step_school_posts.png" alt="School posts a program" width={200} height={200} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">School Posts a Program</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  An educator creates a Practicum Program describing what students will learn, the hours required, and what host businesses need to provide.
                </p>
              </div>
              {/* Step 2 */}
              <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-black text-sm border border-blue-200 dark:border-blue-800/50">2</div>
                <div className="w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden border border-blue-200 dark:border-blue-800/50">
                  <Image src="/images/step_business_applies.png" alt="Business applies to host" width={200} height={200} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Business Applies to Host</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Local businesses browse programs and apply to host students. They propose a mentor and describe how they&apos;ll support the student&apos;s learning.
                </p>
              </div>
              {/* Step 3 */}
              <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center group hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-300">
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-700 dark:text-brand-300 font-black text-sm border border-brand-200 dark:border-brand-800/50">3</div>
                <div className="w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden border border-brand-200 dark:border-brand-800/50">
                  <Image src="/images/step_student_earns.png" alt="Student earns credit" width={200} height={200} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Student Earns Credit</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  The educator matches students with approved hosts. Students log hours, keep journals, and earn academic credit — all tracked in one place.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            DETAILED FLOW — For Schools
        ═══════════════════════════════════════ */}
        <section id="schools" className="w-full py-20 px-4 bg-white dark:bg-slate-950">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-3xl border border-emerald-200 dark:border-emerald-800">🏫</div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">For Schools &amp; Educators</h2>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">Career & Technical Education (CTE) coordinators, career counselors, and teachers</p>
              </div>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Create Your Account',
                  desc: 'Sign up as an educator with your school email. Enter your school name, district, and your role (career & technical education coordinator, career counselor, teacher, etc.).',
                  details: ['Takes less than 2 minutes', 'No credit card required', 'Instantly access your educator dashboard'],
                },
                {
                  step: '2',
                  title: 'Post a Practicum Program',
                  desc: 'Create a program describing the learning objectives, required hours (e.g. 120 hours over a semester), career pathway alignment, and what you need from host businesses.',
                  details: ['AI reviews your program for FERPA compliance and clarity', 'Specify time blocks (e.g. mornings only, 3 days/week)', 'Add documentation requirements (journals, evaluations, supervisor sign-off)'],
                },
                {
                  step: '3',
                  title: 'Invite Your Students',
                  desc: 'Add students individually by email or upload your entire class roster via CSV. Students receive a secure invite link and create their profiles.',
                  details: ['Bulk CSV upload for entire classes', 'Students can only join via your invite — no public registration', 'FERPA-compliant: student data is never publicly exposed'],
                },
                {
                  step: '4',
                  title: 'Review Business Applications',
                  desc: 'Local businesses will browse your program and apply to host students. You review each application, check their proposed mentor, and approve or decline.',
                  details: ['See company details, proposed mentor, and hosting plan', 'You decide which businesses are approved to host your students', 'AI flags any compliance concerns automatically'],
                },
                {
                  step: '5',
                  title: 'Match Students to Hosts',
                  desc: 'Once you have approved host businesses, assign your students to them based on career interests, location, and availability.',
                  details: ['Match by career pathway and student preferences', 'Students and businesses are notified when matched', 'You can reassign students at any time'],
                },
                {
                  step: '6',
                  title: 'Monitor Progress',
                  desc: 'Track every student\'s hours, journal entries, and evaluations from your dashboard. Get real-time visibility into who\'s on track and who needs support.',
                  details: ['Live dashboard with hours logged vs. required', 'Read student journal reflections weekly', 'Employer evaluations and supervisor feedback in one place'],
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-black text-lg border border-emerald-200 dark:border-emerald-800/50">
                    {item.step}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">{item.desc}</p>
                    <ul className="space-y-1.5">
                      {item.details.map((d, i) => (
                        <li key={i} className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5 font-bold">•</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
              <Link href="/signup?role=educator">
                <Button size="lg" className="gap-2 group bg-emerald-600 hover:bg-emerald-700">
                  🏫 Create Educator Account
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            DETAILED FLOW — For Businesses
        ═══════════════════════════════════════ */}
        <section id="businesses" className="w-full py-20 px-4 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-3xl border border-blue-200 dark:border-blue-800">🏢</div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">For Local Businesses</h2>
                <p className="text-blue-600 dark:text-blue-400 font-medium">Restaurants, shops, offices, nonprofits — any local employer</p>
              </div>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Create Your Business Account',
                  desc: 'Sign up as a business. Add your company name, industry, location, and a brief description of what you do. This helps schools understand if you\'re a good fit.',
                  details: ['Free to join — no subscription fees', 'Your profile is visible to local schools looking for host businesses', 'Takes about 3 minutes to complete'],
                },
                {
                  step: '2',
                  title: 'Browse School Programs',
                  desc: 'See what local schools are looking for. Each program listing describes the career pathway, required hours, student grade level, and what the school expects from hosts.',
                  details: ['Filter by location, industry, and time commitment', 'See exactly what the school will handle (insurance, supervision, credit)', 'Programs are AI-reviewed for safety and compliance'],
                },
                {
                  step: '3',
                  title: 'Apply to Host Students',
                  desc: 'Found a program that fits? Apply by describing what students would do at your business, who their mentor would be, and what schedule works for you.',
                  details: ['Propose a specific mentor from your team', 'Describe the learning activities and skills students will gain', 'The school reviews and approves your application'],
                },
                {
                  step: '4',
                  title: 'Welcome Your Student',
                  desc: 'Once the school assigns a student to you, you\'ll see their profile (name, career interests, grade level). Coordinate the start date through the platform.',
                  details: ['Student arrives with school-provided insurance coverage', 'No wages to pay — this is for school credit only', 'Your assigned mentor guides the student day-to-day'],
                },
                {
                  step: '5',
                  title: 'Approve Hours & Provide Feedback',
                  desc: 'Students log their hours daily. You review and approve them with one click. At the end of each evaluation period, provide feedback on the student\'s performance.',
                  details: ['Quick hourly approval — takes seconds', 'Mid-term and final evaluations help the school assess credit', 'Everything is tracked and visible to the school coordinator'],
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-black text-lg border border-blue-200 dark:border-blue-800/50">
                    {item.step}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">{item.desc}</p>
                    <ul className="space-y-1.5">
                      {item.details.map((d, i) => (
                        <li key={i} className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5 font-bold">•</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
              <Link href="/signup?role=employer">
                <Button size="lg" className="gap-2 group">
                  🏢 Create Business Account
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            DETAILED FLOW — For Students
        ═══════════════════════════════════════ */}
        <section id="students" className="w-full py-20 px-4 bg-white dark:bg-slate-950">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-3xl border border-brand-200 dark:border-brand-800">🎓</div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">For Students</h2>
                <p className="text-brand-600 dark:text-brand-400 font-medium">High school students enrolled in career & technical education or work-based learning programs</p>
              </div>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Get Invited by Your School',
                  desc: 'Your career & technical education coordinator or teacher sends you a secure invite link via email. Click it to create your InternPick account — no public signup needed.',
                  details: ['Look for an email from your school with your invite link', 'You\'ll need to set a password to create your account', 'Your data is protected by FERPA — only your school and host business can see it'],
                },
                {
                  step: '2',
                  title: 'Complete Your Profile',
                  desc: 'Tell us about yourself: your grade level, graduation year, career interests, and a short bio. This helps your school match you with the right host business.',
                  details: ['Choose from 16 career clusters (Health Science, IT, Business, etc.)', 'Write a short bio about your goals and interests', 'Your profile is only visible to your school and approved businesses'],
                },
                {
                  step: '3',
                  title: 'Get Matched to a Host Business',
                  desc: 'Your educator reviews approved host businesses and assigns you to one that aligns with your career interests. You\'ll see your placement details in your dashboard.',
                  details: ['See your assigned business, mentor name, and schedule', 'Learn what you\'ll be doing before your first day', 'Your school handles insurance and supervision — you just show up'],
                },
                {
                  step: '4',
                  title: 'Log Your Hours',
                  desc: 'Every day you work at your host business, log your hours in the app. Record what time you arrived, when you left, and a brief description of what you did.',
                  details: ['Takes less than a minute each day', 'Your employer reviews and approves each entry', 'Track your progress toward the required hours (e.g. 120 of 120)'],
                },
                {
                  step: '5',
                  title: 'Write Your Journal Reflections',
                  desc: 'Each week, write a short reflection about what you learned, what skills you practiced, and how the experience connects to your career goals.',
                  details: ['Your school may require weekly or bi-weekly entries', 'Mention specific skills: communication, teamwork, problem-solving, etc.', 'These reflections are part of your grade/credit evaluation'],
                },
                {
                  step: '6',
                  title: 'Earn Your Academic Credit',
                  desc: 'Once you\'ve completed your required hours, submitted your journals, and received your employer evaluations, your school awards you academic credit for the practicum.',
                  details: ['Your educator reviews all your logged data on their dashboard', 'Employer evaluations are factored into your final assessment', 'You earn school credit and real-world experience — a win-win'],
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-700 dark:text-brand-300 font-black text-lg border border-brand-200 dark:border-brand-800/50">
                    {item.step}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">{item.desc}</p>
                    <ul className="space-y-1.5">
                      {item.details.map((d, i) => (
                        <li key={i} className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-2">
                          <span className="text-brand-500 mt-0.5 font-bold">•</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
                Students can only join via their school&apos;s invite. Ask your career & technical education coordinator or career counselor if your school uses InternPick.
              </p>
              <Link href="/signup?role=student">
                <Button size="lg" variant="secondary" className="gap-2 group">
                  🎓 I Have an Invite Code
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            FAQ / Common Questions
        ═══════════════════════════════════════ */}
        <section className="w-full py-20 px-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">Common Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Is InternPick free?',
                  a: 'Yes. Creating an account and using the platform is free for schools, businesses, and students during our pilot program.',
                },
                {
                  q: 'Do businesses need to pay the students?',
                  a: 'No. InternPick is exclusively for school-credit practicums. Students earn academic credit, not wages. This model inherently passes the Department of Labor\'s Primary Beneficiary Test.',
                },
                {
                  q: 'Who provides insurance for the students?',
                  a: 'The school typically provides liability and workers\' compensation coverage for students during their placement. This is standard practice for school-sponsored work-based learning programs.',
                },
                {
                  q: 'Is student data protected?',
                  a: 'Yes. InternPick is FERPA-compliant. Students can only join via their school\'s invite. No student data is publicly visible. All data is encrypted in transit and at rest.',
                },
                {
                  q: 'Can students sign up on their own?',
                  a: 'Students must be invited by their school\'s educator. This ensures the program is school-supervised and credit-eligible. If you\'re a student interested in participating, talk to your career & technical education coordinator.',
                },
                {
                  q: 'What if my school isn\'t on InternPick yet?',
                  a: 'Any educator can create a free account and start posting programs immediately. Share this page with your school\'s career & technical education coordinator to get started.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.q}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            FINAL CTA
        ═══════════════════════════════════════ */}
        <section className="w-full py-20 px-4 bg-white dark:bg-slate-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Ready to Get Started?</h2>
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
        </section>
      </main>
    </div>
  )
}
