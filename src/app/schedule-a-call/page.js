'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import { format, startOfMonth, endOfMonth, isValid, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { useAuth } from '../../lib/auth/AuthProvider';
import { useAuthNavigation } from '../../lib/auth/useAuthNavigation';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

// Fallback for Suspense
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-black">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1e88e5] border-t-transparent"></div>
  </div>
);

// New Sub-components

const Disclaimer = () => (
    <motion.div
        className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
    >
        <h4 className="font-brand-bold text-base text-gray-900 dark:text-white mb-2">Disclaimer</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 font-brand-normal">
            OZ Listings™ is a marketing platform and does not provide investment, tax, or legal advice. By scheduling a call, you acknowledge that OZ Listings is not a registered broker-dealer, investment adviser, or fiduciary. We do not offer or sell securities. Any discussions are purely informational and intended for marketing purposes only. All project information shared is provided by third-party sponsors. OZ Listings does not verify or underwrite sponsor offerings and is not responsible for third-party representations, performance, or the accuracy of external content. You should consult with your own financial, legal, and tax professionals before making any investment decisions.
        </p>
    </motion.div>
);

const CalendarView = ({ onDateChange, selectedDate, tileClassName, onActiveStartDateChange, userTimezone, onTimezoneChange }) => (
    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <TimezoneSelector userTimezone={userTimezone} onTimezoneChange={onTimezoneChange} />
        <Calendar
            onChange={onDateChange}
            value={selectedDate}
            tileClassName={tileClassName}
            className="react-calendar-custom"
            view="month"
            minDate={new Date()} // Users cannot select past dates
            onActiveStartDateChange={onActiveStartDateChange}
        />
        <Disclaimer />
    </div>
);

// Helper function to detect user's timezone
const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('Could not detect user timezone, falling back to America/Denver');
    return 'America/Denver';
  }
};

// Helper function to get timezone display name
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
    
    return `${timeZoneName} ${offsetString}`;
  } catch (error) {
    console.warn('Error calculating timezone offset:', error);
    return 'Local Time';
  }
};

// Common timezones for the selector
const COMMON_TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
];

// Timezone selector component
const TimezoneSelector = ({ userTimezone, onTimezoneChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-brand-medium text-gray-700 dark:text-gray-300 mb-2">
        Timezone
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e88e5] dark:bg-gray-800 dark:text-white transition-colors duration-300 font-brand-normal text-base text-left flex items-center justify-between"
        >
          <span>{getTimezoneDisplayName(userTimezone)}</span>
          <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {COMMON_TIMEZONES.map((tz) => (
              <button
                key={tz.value}
                type="button"
                onClick={() => {
                  onTimezoneChange(tz.value);
                  setIsExpanded(false);
                }}
                className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-brand-normal text-sm ${
                  userTimezone === tz.value ? 'bg-[#1e88e5]/10 text-[#1e88e5]' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex flex-col">
                  <span>{tz.label}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getTimezoneDisplayName(tz.value)}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const TimeSlots = ({ selectedDate, availableSlots, selectedSlot, onSlotSelect, loading, userTimezone }) => {
    if (!selectedDate) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p>Select a date to see available times.</p>
            </div>
        );
    }

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const slots = availableSlots[dateString]?.slots || [];

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Available Times for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 -mt-2">
                All times are in {getTimezoneDisplayName(userTimezone)}.
            </p>
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse h-10"></div>
                    ))}
                </div>
            ) : slots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {slots.map((slot) => (
                        <motion.button
                            key={slot}
                            onClick={() => onSlotSelect(slot)}
                            className={`p-2.5 rounded-lg text-sm font-brand-normal font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e88e5] dark:focus:ring-offset-gray-900 ${
                                selectedSlot === slot
                                    ? 'bg-[#1e88e5] text-white shadow-md'
                                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#1e88e5]/20'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {formatInTimeZone(parseISO(slot), userTimezone, 'h:mm a')}
                        </motion.button>
                    ))}
                </div>
            ) : (
                 <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <p>No available times for this date.</p>
                </div>
            )}
        </div>
    );
};

const BookingForm = ({ 
    handleBooking, 
    userType, 
    setUserType, 
    advertise, 
    setAdvertise, 
    firstName, 
    setFirstName, 
    lastName, 
    setLastName, 
    email, 
    setEmail, 
    phoneNumber,
    setPhoneNumber,
    isBooking, 
    formError, 
    formSuccess 
}) => (
    <motion.form 
        onSubmit={handleBooking} 
        className="mt-8 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
    >
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-brand-medium text-gray-700 dark:text-gray-300 mb-3">
                    Are you an Investor or Developer?
                </label>
                <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                            type="radio" 
                            name="userType" 
                            value="Investor" 
                            checked={userType === 'Investor'} 
                            onChange={(e) => setUserType(e.target.value)}
                            className="form-radio h-4 w-4 text-[#1e88e5] bg-gray-200 border-gray-300 focus:ring-[#1e88e5] dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-offset-gray-900"
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-brand-normal text-base">Investor</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                            type="radio" 
                            name="userType" 
                            value="Developer" 
                            checked={userType === 'Developer'} 
                            onChange={(e) => setUserType(e.target.value)}
                            className="form-radio h-4 w-4 text-[#1e88e5] bg-gray-200 border-gray-300 focus:ring-[#1e88e5] dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-offset-gray-900"
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-brand-normal text-base">Developer</span>
                    </label>
                </div>
            </div>

            {userType === 'Developer' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center"
                >
                    <input
                        type="checkbox"
                        id="advertise-checkbox"
                        checked={advertise === 'Yes'}
                        onChange={(e) => setAdvertise(e.target.checked ? 'Yes' : 'No')}
                        className="h-4 w-4 text-[#1e88e5] border-gray-300 rounded focus:ring-[#1e88e5] dark:border-gray-600 dark:bg-gray-800"
                    />
                    <label htmlFor="advertise-checkbox" className="ml-3 block text-sm font-brand-medium text-gray-700 dark:text-gray-300">
                       <b>Do you want to explore advertising on OZListings?</b>
                    </label>
                </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-brand-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e88e5] dark:bg-gray-800 dark:text-white transition-colors duration-300 font-brand-normal text-base"/>
                </div>
                <div>
                    <label className="block text-sm font-brand-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e88e5] dark:bg-gray-800 dark:text-white transition-colors duration-300 font-brand-normal text-base"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-brand-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e88e5] dark:bg-gray-800 dark:text-white transition-colors duration-300 font-brand-normal text-base"/>
            </div>
             <div>
                <label className="block text-sm font-brand-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <PhoneInput
                    international
                    defaultCountry="US"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e88e5] dark:bg-gray-800 dark:text-white transition-colors duration-300 font-brand-normal text-base"
                    />
            </div>
        </div>

        <button type="submit" disabled={isBooking} className="w-full bg-[#1e88e5] text-white py-3 px-4 rounded-lg font-brand-semibold text-base hover:bg-[#1976d2] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {isBooking ? 'Booking...' : 'Confirm Meeting'}
        </button>
        
        {formError && <p className="text-red-500 text-sm mt-2 text-center">{formError}</p>}
        {formSuccess && <p className="text-green-500 text-sm mt-2 text-center">{formSuccess}</p>}
    </motion.form>
);


function ScheduleACall() {
  const { user } = useAuth();
  const { navigateWithAuth } = useAuthNavigation();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Component State
  const [activeDate, setActiveDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableSlots, setAvailableSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  
  // Keep track of booking success to show confirmation
  const [bookingComplete, setBookingComplete] = useState(false);

  // Timezone state
  const [userTimezone, setUserTimezone] = useState('America/Denver');

  // Form state
  const [userType, setUserType] = useState('Investor');
  const [advertise, setAdvertise] = useState('No');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Auto-fill user info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // If user is not logged in, trigger the auth flow
  useEffect(() => {
    if (!user) {
      navigateWithAuth('/schedule-a-call');
    }
  }, [user, navigateWithAuth]);

  // Detect user's timezone on component mount
  useEffect(() => {
    const detectedTimezone = getUserTimezone();
    setUserTimezone(detectedTimezone);
  }, []);

  useEffect(() => {
    const prefillUserType = searchParams.get('userType');
    const prefillAdvertise = searchParams.get('advertise');
    const endpoint = searchParams.get('endpoint');

    if (prefillUserType) {
      setUserType(prefillUserType);
    }
    if (prefillAdvertise === 'true') {
      setAdvertise('Yes');
    }
    if (endpoint) {
      trackUserEvent('schedule_call_page_view', { source_endpoint: endpoint });
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      const nameParts = user.user_metadata?.full_name?.split(' ') || ['', ''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setPhoneNumber(user.user_metadata?.phone_number || '');
    }
  }, [user]);

  // Fetch availability
  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError(null);

      const startDate = startOfMonth(activeDate).getTime();
      const endDate = endOfMonth(activeDate).getTime();

      try {
        const res = await fetch(`/api/calendar/availability?startDate=${startDate}&endDate=${endDate}&timezone=${encodeURIComponent(userTimezone)}`);
        if (!res.ok) throw new Error('Failed to fetch slots');
        const data = await res.json();
        setAvailableSlots(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [activeDate, userTimezone]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!selectedSlot) {
      setFormError('Please select a time slot.');
      return;
    }

    setIsBooking(true);

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phone', phoneNumber);
    formData.append('userType', userType);
    formData.append('advertise', advertise);
    formData.append('selectedSlot', selectedSlot);
    formData.append('timezone', userTimezone);

    try {
      const res = await fetch('/api/calendar/book', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Booking failed');
      }

      setFormSuccess('Your meeting has been booked successfully!');
      setBookingComplete(true); // Set booking as complete

      // Track successful submission if coming from promotional card
      if (userType === 'Developer' && advertise === 'Yes') {
        trackUserEvent("listing_inquiry_submitted", {
          source: "promotional_card",
          success: true,
          timestamp: new Date().toISOString(),
          user_email: email,
        });
      }
      
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsBooking(false);
    }
  };
  
   const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset selected slot when date changes
    setBookingComplete(false); // Reset booking confirmation
    setFormSuccess('');
    setFormError('');
  };

  const handleTimezoneChange = (newTimezone) => {
    setUserTimezone(newTimezone);
    setSelectedSlot(null); // Reset selected slot when timezone changes
    setFormSuccess('');
    setFormError('');
  };

  // Render logic for calendar tile styling
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = format(date, 'yyyy-MM-dd');
      if (availableSlots[dateString]?.slots?.length > 0) {
        // More prominent styling for available days
        return 'available-day';
      }
    }
    return null;
  };
  
  if (!user) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 font-brand-normal">
      <main className="container mx-auto px-4 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {bookingComplete ? (
             <motion.div 
                className="text-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
             >
                <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-brand-bold tracking-tight text-gray-900 dark:text-white mb-4">
                    Booking Confirmed!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 font-brand-normal">
                    {formSuccess} A confirmation has been sent to your email.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="bg-[#1e88e5] text-white py-2.5 px-6 rounded-lg font-brand-semibold hover:bg-[#1976d2] transition-colors duration-300"
                >
                    Go to Homepage
                </button>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-brand-black tracking-tight mb-4 text-gray-900 dark:text-white">Schedule a Call</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Select a date and time that works for you. We look forward to speaking with you!
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <CalendarView
                    onActiveStartDateChange={({activeStartDate}) => setActiveDate(activeStartDate)}
                    onDateChange={handleDateChange}
                    selectedDate={selectedDate}
                    tileClassName={tileClassName}
                    userTimezone={userTimezone}
                    onTimezoneChange={handleTimezoneChange}
                />
                
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <TimeSlots
                        selectedDate={selectedDate}
                        availableSlots={availableSlots}
                        selectedSlot={selectedSlot}
                        onSlotSelect={setSelectedSlot}
                        loading={loading}
                        userTimezone={userTimezone}
                    />

                    {selectedSlot && (
                        <BookingForm 
                            handleBooking={handleBooking}
                            userType={userType}
                            setUserType={setUserType}
                            advertise={advertise}
                            setAdvertise={setAdvertise}
                            firstName={firstName}
                            setFirstName={setFirstName}
                            lastName={lastName}
                            setLastName={setLastName}
                            email={email}
                            setEmail={setEmail}
                            phoneNumber={phoneNumber}
                            setPhoneNumber={setPhoneNumber}
                            isBooking={isBooking}
                            formError={formError}
                            formSuccess={formSuccess}
                        />
                    )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </main>
      <style jsx global>{`
        .react-calendar-custom {
          width: 100%;
          border: none;
          background: transparent;
          font-family: var(--font-brand-normal);
        }
        .react-calendar-custom .react-calendar__navigation {
          display: flex;
          align-items: center;
          margin-bottom: 1em;
        }
        .react-calendar-custom .react-calendar__navigation__label {
          flex-grow: 1;
          text-align: center;
          font-family: var(--font-brand-bold);
          font-size: 1.1rem;
        }
        .react-calendar-custom .react-calendar__navigation button {
          color: #1e88e5;
          min-width: 44px;
          background: none;
          font-size: 1.2rem;
          font-family: var(--font-brand-bold);
        }
        .react-calendar-custom .react-calendar__month-view__weekdays__weekday {
          text-align: center;
          text-transform: uppercase;
          font-family: var(--font-brand);
          font-weight: 700;
          font-size: 0.75em;
          color: #6b7280;
          padding-bottom: 0.5em;
        }
        .react-calendar-custom .react-calendar__tile {
          max-width: 100%;
          text-align: center;
          padding: 0.75em 0.5em;
          background: none;
          border-radius: 8px;
          transition: all 0.2s ease-in-out;
          border: 2px solid transparent;
        }
        .react-calendar-custom .react-calendar__tile:disabled {
          color: #9ca3af;
          background: transparent;
        }
        .dark .react-calendar-custom .react-calendar__tile:disabled {
            color: #4b5563;
        }
        .react-calendar-custom .react-calendar__tile:enabled:hover,
        .react-calendar-custom .react-calendar__tile:enabled:focus {
          background-color: #e5e7eb;
        }
        .dark .react-calendar-custom .react-calendar__tile:enabled:hover,
        .dark .react-calendar-custom .react-calendar__tile:enabled:focus {
          background-color: #374151;
        }
        .react-calendar-custom .react-calendar__tile--now {
          background: transparent;
          border: 2px solid #1e88e580;
        }
        .react-calendar-custom .react-calendar__tile--active {
          background: #1e88e5 !important;
          color: white !important;
        }
        .available-day {
          font-family: var(--font-brand);
          font-weight: 700;
          background-color: #1e88e520;
          border: 2px solid #1e88e540;
        }
        .available-day:hover {
            background-color: #1e88e540 !important;
        }
        .dark .react-calendar-custom .react-calendar__navigation button {
            color: #64b5f6;
        }
        .dark .react-calendar-custom .react-calendar__month-view__weekdays__weekday {
            color: #9ca3af;
        }
        .react-calendar__navigation__prev2-button,
        .react-calendar__navigation__next2-button {
          display: none;
        }
        .PhoneInputInput {
            background-color: transparent !important;
            border: none !important;
            outline: none !important;
            color: inherit !important;
        }
      `}</style>
    </div>
  );
}

export default function ScheduleACallPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ScheduleACall />
    </Suspense>
  );
}