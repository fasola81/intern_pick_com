import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
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
              <span className="text-2xl font-bold tracking-tight text-brand-400">
                InternPick.com
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              The premier platform connecting ambitious high school students with local businesses in their community.
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
                <Link href="/login?role=student" className="text-slate-400 hover:text-brand-400 transition-colors">
                  For Students
                </Link>
              </li>
              <li>
                <Link href="/login?role=employer" className="text-slate-400 hover:text-brand-400 transition-colors">
                  For Businesses
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
                <Link href="/#how-it-works" className="text-slate-400 hover:text-brand-400 transition-colors">
                  How it Works
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

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© {currentYear} InternPick.com. Empowering young careers.</p>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-slate-700 hidden md:block"></span>
            {/* Social fallbacks since icons aren't installed yet */}
            <span className="hover:text-brand-400 cursor-not-allowed transition-colors">X (Twitter)</span>
            <span className="hover:text-brand-400 cursor-not-allowed transition-colors">Instagram</span>
            <span className="hover:text-brand-400 cursor-not-allowed transition-colors">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
