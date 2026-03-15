import React from 'react'
import { Navbar } from '@/components/Navbar'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-8 md:p-12 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 space-y-6">
            <p className="font-medium text-slate-900 dark:text-slate-200">Last Updated: March 2026</p>
            
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Introduction</h2>
              <p>At InternPick, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform connecting students with local employers.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, school, graduation year, and profile photo when you register.</li>
                <li><strong>Professional Information:</strong> Skills, interests, past experiences, resume content, and introductory videos you choose to upload.</li>
                <li><strong>Usage Data:</strong> Information on how you interact with the Platform, including pages visited, roles viewed, and applications submitted.</li>
                <li><strong>Employer Information:</strong> Company details, hiring manager contacts, and job posting content.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use the collected information for various purposes, including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To provide and maintain the Platform.</li>
                <li>To match Students with relevant internship opportunities.</li>
                <li>To facilitate communication between Students and Employers (e.g., in-app messaging, interview coordination).</li>
                <li>To improve, personalize, and expand our services.</li>
                <li>To send administrative emails, such as application updates or policy changes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Sharing Your Information</h2>
              <p>We do not sell your personal information. We share your information in the following situations:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>With Potential Employers:</strong> When a Student applies for a role or opts into the public talent pool, their profile information and application materials are shared with the relevant Employer(s).</li>
                <li><strong>Service Providers:</strong> We may employ third-party companies and individuals to facilitate our Service (e.g., hosting, video processing) who have access to your personal information only to perform these tasks on our behalf.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Data Security</h2>
              <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
            </section>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 mt-12">
              <p className="text-sm">If you have any questions about this Privacy Policy, please contact us at privacy@internpick.com.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
