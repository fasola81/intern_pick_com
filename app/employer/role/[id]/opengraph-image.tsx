import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const alt = 'InternPick Practicum Opportunity Preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  // Edge runtime requires public or edge-safe libraries.
  // We'll use the public ANON key for Edge fetches. The opportunity table might be RLS protected,
  // but if it is public, this works. If not, fallback text is shown.
  // (In Edge, using service_role might throw warnings based on internal node crypto dependencies)
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // process.env.SUPABASE_SERVICE_ROLE_KEY! might run into edge runtime issues depending on the supabase client. 
    // We will use anon key. If it fails due to RLS, it defaults gracefully.
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: role } = await supabase
    .from('opportunities')
    .select('*, profiles(company_name)')
    .eq('id', params.id)
    .single()

  const title = role?.title || 'Internship Opportunity'
  const category = role?.category || 'Practicum'
  const company = role?.profiles?.company_name ? `${role.profiles.company_name}` : 'Local Business Partner'

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #e2e8f0, #f8fafc)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            background: 'white', 
            padding: '60px', 
            borderRadius: '40px', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', 
            width: '100%',
            border: '2px solid #e2e8f0'
          }}
        >
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 900, color: '#059669', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {category} • {company}
          </div>
          <div style={{ 
            fontSize: title.length > 40 ? 48 : 64, 
            fontWeight: 900, 
            color: '#0f172a', 
            textAlign: 'center', 
            lineHeight: 1.1, 
            marginBottom: 48, 
            maxHeight: '140px',
            overflow: 'hidden', 
          }}>
            {title}
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            {role?.compensation === 'paid' && <div style={{ display: 'flex', fontSize: 28, padding: '16px 32px', background: '#ecfdf5', color: '#047857', borderRadius: '100px', fontWeight: 800 }}>💰 Paid Position</div>}
            {role?.compensation === 'credit' && <div style={{ display: 'flex', fontSize: 28, padding: '16px 32px', background: '#f5f3ff', color: '#5b21b6', borderRadius: '100px', fontWeight: 800 }}>📚 School Credit</div>}
            {(role?.hours_per_week || 0) > 0 && <div style={{ display: 'flex', fontSize: 28, padding: '16px 32px', background: '#f1f5f9', color: '#334155', borderRadius: '100px', fontWeight: 800 }}>⏰ {role?.hours_per_week} hrs/wk</div>}
            {role?.work_setting === 'remote' && <div style={{ display: 'flex', fontSize: 28, padding: '16px 32px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '100px', fontWeight: 800 }}>💻 Remote</div>}
          </div>
        </div>
        
        <div style={{ display: 'flex', position: 'absolute', bottom: 40, alignItems: 'center', gap: 16 }}>
           <div style={{ color: '#059669', fontSize: 40, fontWeight: 900, letterSpacing: '-0.02em', background: 'white', padding: '8px 24px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>InternPick</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
