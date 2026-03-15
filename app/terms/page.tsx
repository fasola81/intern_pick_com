import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-8 md:p-12 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">Terms of Service</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 space-y-6">
            <p className="font-medium text-slate-900 dark:text-slate-200">Last Updated: March 2026</p>
            
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and utilizing InternPick ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Description of Service</h2>
              <p>InternPick provides a marketplace connecting high school students seeking internship opportunities ("Students") with local businesses offering such roles ("Employers"). We facilitate the discovery, application, and communication process between these two parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Students:</strong> Must provide accurate information regarding their education, skills, and experience. Must communicate professionally with potential employers.</li>
                <li><strong>Employers:</strong> Must provide accurate descriptions of internship roles, including compensation structure (paid, unpaid, or academic credit) and work environment. Must comply with all local, state, and federal labor laws regarding internships and youth employment.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Platform Rules</h2>
              <p>Users agree not to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Submit false or misleading information.</li>
                <li>Use the platform for any illegal or unauthorized purpose.</li>
                <li>Harass, abuse, or harm another person.</li>
                <li>Interfere with or disrupt the integrity or performance of the Platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Disclaimer of Warranties</h2>
              <p>InternPick does not guarantee employment or internship placement for Students, nor does it guarantee the quality or suitability of candidates for Employers. The Platform is provided on an "as-is" and "as-available" basis.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">6. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. We will notify users of significant changes through the Platform. Continued use of the Platform after changes constitutes acceptance of the new terms.</p>
            </section>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 mt-12">
              <p className="text-sm">If you have any questions about these Terms, please contact us at support@internpick.com.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
