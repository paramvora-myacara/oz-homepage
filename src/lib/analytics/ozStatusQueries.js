import { createClient } from '../supabase/client';

/**
 * Get OZ status statistics for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - Statistics about the user's OZ checks
 */
export async function getUserOzStats(userId) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('oz_status, created_at')
      .eq('user_id', userId)
      .eq('event_type', 'oz_check_completed')
      .not('oz_status', 'is', null);
    
    if (error) {
      console.error('Error fetching user OZ stats:', error);
      return null;
    }
    
    const totalChecks = data.length;
    const ozChecks = data.filter(event => event.oz_status === true).length;
    const nonOzChecks = data.filter(event => event.oz_status === false).length;
    
    return {
      totalChecks,
      ozChecks,
      nonOzChecks,
      ozPercentage: totalChecks > 0 ? (ozChecks / totalChecks * 100).toFixed(1) : 0,
      recentChecks: data.slice(-5) // Last 5 checks
    };
  } catch (error) {
    console.error('Error in getUserOzStats:', error);
    return null;
  }
}

/**
 * Get OZ status for a specific location check
 * @param {string} userId - The user ID
 * @param {string} address - The address that was checked
 * @returns {Promise<boolean|null>} - The OZ status or null if not found
 */
export async function getLocationOzStatus(userId, address) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('oz_status, created_at')
      .eq('user_id', userId)
      .eq('event_type', 'oz_check_completed')
      .eq('metadata->address', address)
      .not('oz_status', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error fetching location OZ status:', error);
      return null;
    }
    
    return data.length > 0 ? data[0].oz_status : null;
  } catch (error) {
    console.error('Error in getLocationOzStatus:', error);
    return null;
  }
}

/**
 * Get all OZ checks for a user with their status
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Array of OZ check events with status
 */
export async function getUserOzChecks(userId) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('oz_status, metadata, created_at')
      .eq('user_id', userId)
      .eq('event_type', 'oz_check_completed')
      .not('oz_status', 'is', null)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user OZ checks:', error);
      return [];
    }
    
    return data.map(event => ({
      ozStatus: event.oz_status,
      address: event.metadata?.address || event.metadata?.result?.address,
      coordinates: event.metadata?.result?.coordinates,
      geoid: event.metadata?.result?.geoid,
      createdAt: event.created_at
    }));
  } catch (error) {
    console.error('Error in getUserOzChecks:', error);
    return [];
  }
}

/**
 * Get aggregate OZ statistics across all users
 * @returns {Promise<Object>} - Aggregate statistics
 */
export async function getAggregateOzStats() {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('user_events')
      .select('oz_status')
      .eq('event_type', 'oz_check_completed')
      .not('oz_status', 'is', null);
    
    if (error) {
      console.error('Error fetching aggregate OZ stats:', error);
      return null;
    }
    
    const totalChecks = data.length;
    const ozChecks = data.filter(event => event.oz_status === true).length;
    const nonOzChecks = data.filter(event => event.oz_status === false).length;
    
    return {
      totalChecks,
      ozChecks,
      nonOzChecks,
      ozPercentage: totalChecks > 0 ? (ozChecks / totalChecks * 100).toFixed(1) : 0
    };
  } catch (error) {
    console.error('Error in getAggregateOzStats:', error);
    return null;
  }
} 