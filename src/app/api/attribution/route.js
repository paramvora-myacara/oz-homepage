import { createClient } from '../../../lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const attributionData = await request.json();

    const dataToInsert = {
      user_id: user.id,
      utm_source: attributionData.utm_source,
      utm_medium: attributionData.utm_medium,
      utm_campaign: attributionData.utm_campaign,
      utm_term: attributionData.utm_term,
      utm_content: attributionData.utm_content,
      initial_utm_source: attributionData.initial_utm_source,
      initial_utm_medium: attributionData.initial_utm_medium,
      initial_utm_campaign: attributionData.initial_utm_campaign,
      initial_utm_term: attributionData.initial_utm_term,
      initial_utm_content: attributionData.initial_utm_content,
      initial_referrer: attributionData.initial_referrer,
      last_referrer: attributionData.last_referrer,
      initial_landing_page_url: attributionData.initial_landing_page_url,
      visits: attributionData.visits,
      // additional_params would go here if you add them
      last_synced_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_attribution')
      .upsert(dataToInsert, { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving attribution data:', error);
      return new NextResponse(JSON.stringify({ error: 'Failed to save attribution data', details: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new NextResponse(JSON.stringify({ error: 'An unexpected error occurred.', details: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 