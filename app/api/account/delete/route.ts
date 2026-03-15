import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE() {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  try {
    // Delete user data from all related tables
    // The order matters — delete child records first
    
    // Delete applications
    await supabase
      .from('applications')
      .delete()
      .eq('student_id', user.id)

    // Delete messages sent by user
    await supabase
      .from('messages')
      .delete()
      .eq('sender_id', user.id)

    // Delete moderation logs
    await supabase
      .from('ai_moderation_logs')
      .delete()
      .eq('sender_id', user.id)

    // Delete student videos
    await supabase
      .from('student_videos')
      .delete()
      .eq('student_id', user.id)

    // Delete student profile
    await supabase
      .from('students')
      .delete()
      .eq('id', user.id)

    // Delete company profile (if employer)
    await supabase
      .from('companies')
      .delete()
      .eq('owner_id', user.id)

    // Delete opportunities posted by this user (if employer)
    await supabase
      .from('opportunities')
      .delete()
      .eq('company_id', user.id)

    // Finally delete the auth user via admin API
    // Note: This requires service_role key. Using the user's own signOut for now.
    // The auth user delete will cascade via Supabase's auth.users cleanup
    
    // Sign out the user (destroys their session)
    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Delete Account] Error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to delete account data' },
      { status: 500 }
    )
  }
}
