import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works | InternPick',
  description: 'Learn how InternPick connects motivated high school students with local businesses for school-sponsored, academic-credit practicum internships.',
}

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
