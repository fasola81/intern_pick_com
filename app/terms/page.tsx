import React from 'react'
import { Navbar } from '@/components/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Terms of Service | InternPick",
  description: "Read the Terms of Service for using the InternPick platform.",
  openGraph: {
    title: "Terms of Service | InternPick",
    description: "Read the Terms of Service for using the InternPick platform.",
    url: "https://www.internpick.com/terms",
  },
}
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-4 pb-20 px-4 md:px-8">
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
              <p>InternPick does not guarantee employment or internship placement for Students, nor does it guarantee the quality or suitability of candidates for Employers. The Platform is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">6. Limitation of Liability</h2>
              <p>InternPick operates solely as a technology marketplace platform that facilitates connections between Students and Employers. <strong>InternPick is not a party to any internship, employment, or work arrangement</strong> between users of the Platform.</p>
              <p className="mt-3">To the fullest extent permitted by applicable law, InternPick, its officers, directors, employees, agents, and affiliates shall not be liable for:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Any damages, losses, costs, or liabilities arising from interactions, agreements, or disputes between Students and Employers.</li>
                <li>Any violation of federal, state, or local labor laws — including but not limited to the Fair Labor Standards Act (FLSA), child labor laws, minimum wage requirements, or the Department of Labor&apos;s Primary Beneficiary Test — by any Employer using the Platform.</li>
                <li>Any physical, emotional, or financial harm arising from or related to any internship or work experience arranged through the Platform.</li>
                <li>Any inaccurate, misleading, or incomplete information provided by any user of the Platform.</li>
                <li>Any loss of data, revenue, profits, or business opportunities arising from use of or inability to use the Platform.</li>
              </ul>
              <p className="mt-3">In no event shall InternPick&apos;s total liability to any user exceed the amount paid by such user to InternPick in the twelve (12) months preceding the event giving rise to the claim, or fifty dollars ($50), whichever is greater.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">7. Indemnification</h2>
              <p>You agree to indemnify, defend, and hold harmless InternPick, its officers, directors, employees, agents, affiliates, and licensors from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or related to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Your use of the Platform or any internship or work arrangement facilitated through the Platform.</li>
                <li>Your violation of these Terms of Service or any applicable law or regulation.</li>
                <li>Any claim by a third party (including interns, employees, or governmental agencies) arising from your failure to comply with applicable labor, employment, wage, or workplace safety laws.</li>
                <li>Any content, information, or materials you submit, post, or transmit through the Platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">8. AI Services Disclaimer</h2>
              <p>InternPick utilizes artificial intelligence (AI) technology to assist in reviewing internship listings, moderating content, and providing general guidance to users. <strong>AI-generated reviews, flags, and recommendations are assistive tools only and do not constitute legal advice, compliance certification, or guarantee of regulatory compliance.</strong></p>
              <p className="mt-3">AI moderation may not identify all potential issues or legal violations. Employers remain <strong>solely and fully responsible</strong> for ensuring that their internship offerings comply with all applicable federal, state, and local laws, including but not limited to the Fair Labor Standards Act, Department of Labor regulations, and state-specific youth employment laws.</p>
              <p className="mt-3">InternPick makes no warranty or representation regarding the accuracy, completeness, or reliability of any AI-generated content or analysis.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">9. No Legal, Tax, or Professional Advice</h2>
              <p>Nothing on the Platform — including but not limited to the Internship Rules page, AI moderation results, compliance warnings, or educational content — constitutes legal, tax, financial, or professional advice. All information provided is for <strong>educational and informational purposes only.</strong></p>
              <p className="mt-3">Users should consult with qualified legal counsel, tax advisors, and/or compliance professionals before making decisions regarding internship programs, compensation structures, or labor law compliance.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">10. Third-Party Relationships</h2>
              <p>InternPick is not an employer, employment agency, staffing company, or educational institution. We do not employ, supervise, or control any Students or interns who use the Platform. We do not endorse, recommend, or guarantee any Employer, internship opportunity, or Student profile listed on the Platform.</p>
              <p className="mt-3">Each Employer is independently responsible for the legality, safety, and ethical conduct of their internship programs. Each Student (and their parent or legal guardian, as applicable) is independently responsible for evaluating the suitability and safety of any internship opportunity.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">11. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. We will notify users of significant changes through the Platform. Continued use of the Platform after changes constitutes acceptance of the new terms.</p>
            </section>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 mt-12">
              <p className="text-sm">If you have any questions about these Terms, please contact us at support@internpick.com.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
