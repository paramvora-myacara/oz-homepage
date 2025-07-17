import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const timezone = searchParams.get('timezone') || 'UTC';

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
  }

  const calendarId = process.env.NEXT_PUBLIC_LEADCONNECTOR_CALENDAR_ID;
  const url = `https://backend.leadconnectorhq.com/calendars/${calendarId}/free-slots?startDate=${startDate}&endDate=${endDate}&timezone=${encodeURIComponent(timezone)}&sendSeatsPerSlot=false`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
        'channel': 'APP',
        'source': 'WEB_USER',
        'timezone': timezone,
        'version': '2021-04-15',
        'Origin': 'https://api.leadconnectorhq.com',
        'Referer': 'https://api.leadconnectorhq.com/',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from availability API:', errorText);
      return NextResponse.json({ error: `Failed to fetch availability: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 