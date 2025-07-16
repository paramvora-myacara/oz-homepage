import { createClient } from '../supabase/client';

export async function trackUserEvent(eventType, metadata = {}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    const { error } = await supabase.from('user_events').insert({
      user_id: session.user.id,
      event_type: eventType,
      metadata: { ...metadata, path: window.location.pathname },
      endpoint: window.location.pathname,
    });

    if (error) {
      console.error(`Failed to track event [${eventType}]:`, error);
    }
  } else {
    // User is not logged in, so we can't track the event. This is expected.
    // console.log(`User not authenticated, cannot track event [${eventType}]`);
  }
} 