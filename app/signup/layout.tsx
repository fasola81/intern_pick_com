import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create an Account | InternPick',
  description: 'Join InternPick to connect schools, students, and local businesses for school-sponsored practicums.',
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
