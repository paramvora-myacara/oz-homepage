export class CalApiService {
  constructor() {
    this.sessionCookies = null;
  }

  async getAvailability(startDate, endDate, timezone) {
    console.log('🔍 CalApiService.getAvailability called with:', { startDate, endDate, timezone });

    const queryParams = new URLSearchParams({
      startDate,
      endDate,
      timezone
    });

    const url = `/api/cal/availability?${queryParams.toString()}`;
    console.log('🌐 Making API call to internal proxy:', url);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 Raw API response from proxy:', data);

      const transformed = this.transformAvailabilityData(data);
      console.log('🔄 Transformed availability data:', transformed);

      return transformed;
    } catch (error) {
      console.error('💥 Error in getAvailability:', error);
      throw error;
    }
  }

  async createBooking(bookingData) {
    console.log('📝 CalApiService.createBooking called with:', bookingData);

    console.log('🌐 Making booking POST to (proxy): /api/cal/book');

    try {
      const response = await fetch('/api/cal/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData) // Send original bookingData, proxy handles payload
      });

      console.log('📡 Booking response status:', response.status);
      console.log('📡 Booking response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Booking API Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Booking successful via proxy:', data);
      return data;
    } catch (error) {
      console.error('💥 Error creating booking via proxy:', error);
      throw error;
    }
  }

  calculateEndTime(startTime) {
    // Add 30 minutes to start time for 30min event
    const start = new Date(startTime);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    return end.toISOString();
  }

  transformAvailabilityData(data) {
    // Transform Cal.com's tRPC response format to match what the current UI expects
    // TRPC structure: data.result.data.json.slots
    // Each date is a key, value is array of objects with a 'time' property

    console.log('🔍 transformAvailabilityData called with raw data:', data);

    const slotsData = data?.result?.data?.json?.slots;

    if (!slotsData) {
      console.log('⚠️ No slots data found in expected path (result.data.json.slots)');
      return {};
    }

    const transformed = {};
    Object.keys(slotsData).forEach(date => {
      const slots = slotsData[date];

      if (slots && Array.isArray(slots) && slots.length > 0) {
        // Extract just the start times from slot objects
        const slotTimes = slots.map(slot => {
          if (typeof slot === 'string') {
            return slot;
          } else if (slot && slot.time) {
            return slot.time;
          }
          return null;
        }).filter(time => time !== null);

        if (slotTimes.length > 0) {
          transformed[date] = {
            slots: slotTimes
          };
        }
      }
    });

    console.log('🎉 Final transformed data:', transformed);
    console.log('📈 Total dates with slots:', Object.keys(transformed).length);
    return transformed;
  }
}
