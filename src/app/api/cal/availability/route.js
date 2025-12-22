import { NextResponse } from 'next/server';

// Server-side proxy to Cal.com availability API to avoid browser CORS
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const timezone = searchParams.get('timezone') || 'America/Denver';

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'startDate and endDate are required' },
      { status: 400 },
    );
  }

  const input = {
    json: {
      isTeamEvent: false,
      usernameList: [process.env.CAL_USER],
      eventTypeSlug: process.env.CAL_EVENT_SLUG,
      startTime: `${startDate}T00:00:00.000Z`,
      endTime: `${endDate}T23:59:59.999Z`,
      timeZone: timezone,
      duration: null,
      rescheduleUid: null,
      orgSlug: null,
      teamMemberEmail: null,
      routedTeamMemberIds: null,
      skipContactOwner: false,
      routingFormResponseId: null,
      email: null,
      embedConnectVersion: '0',
      _isDryRun: false,
    },
    meta: {
      values: {
        duration: ['undefined'],
        orgSlug: ['undefined'],
        teamMemberEmail: ['undefined'],
        routingFormResponseId: ['undefined'],
      },
    },
  };

  const url = `https://cal.com/api/trpc/slots/getSchedule?input=${encodeURIComponent(
    JSON.stringify(input),
  )}`;

  try {
    const response = await fetch(url, {
      // No CORS issues server-side; just forward the request
      headers: {
        'Content-Type': 'application/json',
      },
      // Do not forward browser cookies; Cal public API should not require them
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Cal.com API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error when fetching availability' },
      { status: 500 },
    );
  }
}
