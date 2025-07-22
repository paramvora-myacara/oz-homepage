import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';

// Helper function to get timezone display name with offset
const getTimezoneDisplayName = (timezone) => {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(date);
    const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value || '';
    
    // Simple and reliable timezone offset calculation
    const utcFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const tzFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const utcString = utcFormatter.format(date);
    const tzString = tzFormatter.format(date);
    
    const utcDate = new Date(utcString);
    const tzDate = new Date(tzString);
    const offsetMs = tzDate.getTime() - utcDate.getTime();
    const offsetHours = Math.floor(Math.abs(offsetMs) / (1000 * 60 * 60));
    const offsetMinutes = Math.floor((Math.abs(offsetMs) % (1000 * 60 * 60)) / (1000 * 60));
    const offsetString = `GMT${offsetMs >= 0 ? '+' : '-'}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
    
    return `${timezone} (${offsetString})`;
  } catch (error) {
    console.warn('Could not format timezone display name, using timezone as-is');
    return timezone;
  }
};

export async function POST(request) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries());

  // These should come from the client
  const {
    firstName,
    lastName,
    email,
    phone,
    userType,
    advertise,
    selectedSlot,
    timezone, // Now dynamic instead of hardcoded
  } = body;
  
  // Use the timezone from the client, fallback to America/Denver if not provided
  const userTimezone = timezone || 'America/Denver';

    // Update Supabase user record
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user && phone) {
    const { error: updateError } = await supabase
      .from('users')
      .update({ phone_number: phone })
      .eq('id', user.id);

    if (updateError) {
      console.error('Supabase user update error:', updateError);
      // Decide if you want to stop the process or just log the error
      // For now, we'll just log it and continue.
    }
  }

  const formId = process.env.NEXT_PUBLIC_LEADCONNECTOR_FORM_ID;
  const calendarId = process.env.NEXT_PUBLIC_LEADCONNECTOR_CALENDAR_ID;
  const locationId = "UCEJwd6XSvBv1Ilks00z"; // This seems static from the curl

  const apiFormData = new FormData();

  const jsonData = {
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    formId,
    location_id: locationId,
    calendar_id: calendarId,
    selected_slot: selectedSlot,
    selected_timezone: userTimezone,
    bEHWal4v3F2JgXQekx6q: userType, // "Investor" or "Developer"
    ...(userType === 'Developer' && advertise === 'Yes' && { "2nqe9idMx1pBD0QFVqA2": ["Yes"] }),
    paymentContactId: {},
    Timezone: getTimezoneDisplayName(userTimezone), // Dynamic timezone with offset
  };

  apiFormData.append('formData', JSON.stringify(jsonData));
  apiFormData.append('locationId', locationId);
  apiFormData.append('formId', formId);

  try {
    const response = await fetch('https://backend.leadconnectorhq.com/appengine/appointment', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Referer': 'https://api.leadconnectorhq.com/',
        'fullurl': 'https://api.leadconnectorhq.com/widget/bookings/oz-test',
        'timezone': userTimezone,
        'Origin': 'https://api.leadconnectorhq.com',
        'version': '2021-04-15',
      },
      body: apiFormData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error from booking API:', errorText);
        return NextResponse.json({ error: `Failed to book appointment: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 