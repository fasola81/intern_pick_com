export type GA4Event =
  | { event: 'auth_signup'; role: 'student' | 'company' | 'educator' | string }
  | { event: 'auth_login'; role: string }
  | { event: 'employer_opportunity_created'; opportunity_id?: string; title?: string }
  | { event: 'employer_program_application_submitted'; program_id: string }
  | { event: 'educator_program_published'; program_title?: string }
  | { event: 'ai_feature_utilized'; feature_name: string }

/**
 * Trigger a typed GA4 event. Assumes the raw gtag script 
 * is correctly mounted in the root layout.
 */
export const trackEvent = (payload: GA4Event) => {
  if (typeof window === 'undefined') return

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[GA4 Event]:', payload)
  }

  // Fallback to raw gtag window array initialized in layout.tsx
  if (typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', payload.event, payload)
  }
}
