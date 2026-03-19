import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand & SwiftLearn logo */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <Image 
                src="/icons/logo/logo_white.png" 
                alt="InternPick Logo" 
                width={100} 
                height={100} 
                className="block h-9 w-auto object-contain"
              />
              <span className="text-2xl tracking-tight text-slate-200">
                <span className="font-medium">Intern</span><span className="font-extrabold text-brand-400">Pick</span><span className="font-normal text-slate-500 text-base">.com</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              The platform connecting schools, students, and local businesses for school-sponsored work-based learning and academic-credit practicums.
            </p>
            <div className="pt-4 flex items-center gap-3 text-slate-400">
              <span className="text-sm font-medium">Powered by</span>
              <a
                href="https://swiftlearn.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity inline-block"
              >
                <Image
                  src="/icons/logo/SL_footer_Logo.png"
                  alt="SwiftLearn Logo"
                  width={120}
                  height={30}
                  className="h-6 w-auto object-contain"
                />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/signup?role=student" className="text-slate-400 hover:text-brand-400 transition-colors">
                  For Students
                </Link>
              </li>
              <li>
                <Link href="/signup?role=employer" className="text-slate-400 hover:text-brand-400 transition-colors">
                  For Businesses
                </Link>
              </li>
              <li>
                <Link href="/signup?role=educator" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  For Schools
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 hover:text-brand-400 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-brand-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-slate-400 hover:text-brand-400 transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/internship-rules" className="text-slate-400 hover:text-brand-400 transition-colors">
                  Internship Wiki
                </Link>
              </li>
              <li>
                <a href="https://swiftlearn.ai" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-1">
                  SwiftLearn
                  <span className="text-xs">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pb-6 mb-2 border-b border-slate-800 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">🛡️ FERPA Compliant</span>
          <span className="flex items-center gap-1.5">⚖️ Dept. of Labor Protected</span>
          <span className="flex items-center gap-1.5">👶 Children&apos;s Privacy Safe</span>
          <span className="flex items-center gap-1.5">🔒 256-bit SSL</span>
          <span className="flex items-center gap-1.5">🤖 AI Moderated</span>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© {currentYear} InternPick.com. School-credit work-based learning.</p>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
