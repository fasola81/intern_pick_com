import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

// We use the Service Role Key so that anonymous crawlers (LinkedIn/GoogleBot) 
// can safely bypass RLS to read the public listing title.
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const { data: role } = await supabase
    .from('opportunities')
    .select('title, description')
    .eq('id', params.id)
    .single()
    
  if (!role) {
    return {
      title: 'Internship Not Found | InternPick'
    }
  }

  const cleanDescription = (role.description || '').substring(0, 160).trim()

  return {
    title: `${role.title} | InternPick`,
    description: cleanDescription || 'School-sponsored practicum on InternPick.',
    openGraph: {
      type: 'website',
      title: `${role.title} | InternPick`,
      description: cleanDescription || 'School-sponsored practicum on InternPick.',
      // opengraph-image.tsx is automatically mapped by Next.js if placed in the same dir.
    },
    twitter: {
      card: 'summary_large_image',
      title: `${role.title} | InternPick`,
      description: cleanDescription || 'School-sponsored practicum on InternPick.',
    }
  }
}

export default function RolePreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
