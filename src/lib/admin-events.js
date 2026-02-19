/**
 * Utility to track administrative and system events in the database.
 * These events are picked up by the event processor and sent to Slack.
 */
export async function trackAdminEvent(supabase, eventType, payload = {}) {
    try {
        const { error } = await supabase
            .from('admin_events')
            .insert({
                event_type: eventType,
                payload: payload
            });

        if (error) {
            console.error(`[AdminEvents] Error tracking ${eventType}:`, error);
            return false;
        }

        return true;
    } catch (err) {
        console.error(`[AdminEvents] Exception tracking ${eventType}:`, err);
        return false;
    }
}
