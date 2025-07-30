import { createClient } from '../supabase/client';

export async function trackUserEvent(eventType, metadata = {}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    try {
      // Prepare the insert data for user_events table
      const insertData = {
        user_id: session.user.id,
        event_type: eventType,
        metadata: { ...metadata, path: window.location.pathname },
        endpoint: window.location.pathname,
      };

      console.log('Attempting to insert event:', {
        eventType,
        userId: session.user.id,
        metadata: insertData.metadata
      });

      const { error } = await supabase.from('user_events').insert(insertData);

      if (error) {
        console.error(`Failed to track event [${eventType}]:`, error.message || error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        
        // Check for specific error types
        if (error.message) {
          if (error.message.includes('user_events')) {
            console.error('❌ TABLE_ERROR: user_events table may not exist or have wrong permissions');
          } else if (error.message.includes('user_id')) {
            console.error('❌ USER_ID_ERROR: user_id column issue');
          } else if (error.message.includes('event_type')) {
            console.error('❌ EVENT_TYPE_ERROR: event_type column issue');
          } else if (error.message.includes('metadata')) {
            console.error('❌ METADATA_ERROR: metadata column issue');
          }
        }
      } else {
        console.log(`✅ Successfully tracked event [${eventType}]`);
      }
    } catch (error) {
      console.error(`❌ Exception tracking event [${eventType}]:`, error.message || error);
      console.error('Full exception:', error);
    }
  } else {
    console.log(`⚠️ User not authenticated, cannot track event [${eventType}]`);
  }
} 