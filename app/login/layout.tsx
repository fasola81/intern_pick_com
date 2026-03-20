import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log In | InternPick',
  description: 'Sign in to access your InternPick dashboard.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
