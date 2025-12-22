import { NextResponse } from 'next/server';

// Server-side proxy to Cal.com booking API to avoid browser CORS
export async function POST(request) {
  try {
    const bookingData = await request.json();

    const payload = {
      responses: {
        name: `${bookingData.firstName} ${bookingData.lastName}`.trim(),
        email: bookingData.email,
        guests: [],
      },
      user: process.env.CAL_USER,
      start: bookingData.selectedSlot,
      end: calculateEndTime(bookingData.selectedSlot),
      eventTypeId: parseInt(process.env.CAL_EVENT_ID),
      eventTypeSlug: process.env.CAL_EVENT_SLUG,
      timeZone: bookingData.timezone,
      language: 'en',
      metadata: {},
      hasHashedBookingLink: false,
      routedTeamMemberIds: null,
      skipContactOwner: false,
      _isDryRun: false,
      dub_id: null,
    };

    const response = await fetch('https://cal.com/api/book/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        // Try to parse as JSON if possible
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorJson.message || errorText, calError: errorJson },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: `Cal.com error: ${errorText}` },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error when creating booking' },
      { status: 500 },
    );
  }
}

function calculateEndTime(startTime) {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  return end.toISOString();
}
