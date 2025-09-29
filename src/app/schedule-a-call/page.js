"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import { format, startOfMonth, endOfMonth, isValid, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useAuth } from "../../lib/auth/AuthProvider";
import { trackUserEvent } from "../../lib/analytics/trackUserEvent";

// Fallback for Suspense
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-black">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1e88e5] border-t-transparent"></div>
  </div>
);

// New Sub-components

const Disclaimer = () => (
  <motion.div
    className="mt-6 border-t border-gray-200/50 pt-6 dark:border-gray-700/50"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
  >
    <h4 className="font-brand-bold mb-2 text-base text-gray-900 dark:text-white">
      Disclaimer
    </h4>
    <p className="font-brand-normal text-xs text-gray-600 dark:text-gray-400">
      OZ Listings™ is a marketing platform and does not provide investment,
      tax, or legal advice. By scheduling a call, you acknowledge that OZ
      Listings is not a registered broker-dealer, investment adviser, or
      fiduciary. We do not offer or sell securities. Any discussions are purely
      informational and intended for marketing purposes only. All project
      information shared is provided by third-party sponsors. OZ Listings does
      not verify or underwrite sponsor offerings and is not responsible for
      third-party representations, performance, or the accuracy of external
      content. You should consult with your own financial, legal, and tax
      professionals before making any investment decisions.
    </p>
  </motion.div>
);

const CalendarView = ({
  onDateChange,
  selectedDate,
  tileClassName,
  onActiveStartDateChange,
  userTimezone,
  onTimezoneChange,
}) => (
  <div className="rounded-2xl border border-gray-200/50 bg-gray-50 p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-900/50">
    <TimezoneSelector
      userTimezone={userTimezone}
      onTimezoneChange={onTimezoneChange}
    />
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
    console.warn(
      "Could not detect user timezone, falling back to America/Denver",
    );
    return "America/Denver";
  }
};

// Helper function to get timezone display name
const getTimezoneDisplayName = (timezone) => {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(date);
    const timeZoneName =
      parts.find((part) => part.type === "timeZoneName")?.value || "";

    // Simple and reliable timezone offset calculation
    const utcFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const tzFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const utcString = utcFormatter.format(date);
    const tzString = tzFormatter.format(date);

    const utcDate = new Date(utcString);
    const tzDate = new Date(tzString);
    const offsetMs = tzDate.getTime() - utcDate.getTime();
    const offsetHours = Math.floor(Math.abs(offsetMs) / (1000 * 60 * 60));
    const offsetMinutes = Math.floor(
      (Math.abs(offsetMs) % (1000 * 60 * 60)) / (1000 * 60),
    );
    const offsetString = `GMT${offsetMs >= 0 ? "+" : "-"}${offsetHours.toString().padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`;

    return `${timeZoneName} ${offsetString}`;
  } catch (error) {
    console.warn("Error calculating timezone offset:", error);
    return "Local Time";
  }
};

// Common timezones for the selector
const COMMON_TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT/AEST)" },
];

// Timezone selector component
const TimezoneSelector = ({ userTimezone, onTimezoneChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4">
      <label className="font-brand-medium mb-2 block text-sm text-gray-700 dark:text-gray-300">
        Timezone
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="font-brand-normal flex w-full items-center justify-between rounded-lg border border-gray-300 px-3 py-2 text-left text-base transition-colors duration-300 focus:ring-2 focus:ring-[#1e88e5] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <span>{getTimezoneDisplayName(userTimezone)}</span>
          <svg
            className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
          >
            {COMMON_TIMEZONES.map((tz) => (
              <button
                key={tz.value}
                type="button"
                onClick={() => {
                  onTimezoneChange(tz.value);
                  setIsExpanded(false);
                }}
                className={`font-brand-normal w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  userTimezone === tz.value
                    ? "bg-[#1e88e5]/10 text-[#1e88e5]"
                    : "text-gray-700 dark:text-gray-300"
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

const TimeSlots = ({
  selectedDate,
  availableSlots,
  selectedSlot,
  onSlotSelect,
  loading,
  userTimezone,
}) => {
  if (!selectedDate) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Select a date to see available times.</p>
      </div>
    );
  }

  const dateString = format(selectedDate, "yyyy-MM-dd");
  const slots = availableSlots[dateString]?.slots || [];

  return (
    <div>
      <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Available Times for {format(selectedDate, "MMMM d, yyyy")}
      </h3>
      <p className="-mt-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
        All times are in {getTimezoneDisplayName(userTimezone)}.
      </p>
      {loading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-lg bg-gray-200 p-2 dark:bg-gray-700"
            ></div>
          ))}
        </div>
      ) : slots.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {slots.map((slot) => (
            <motion.button
              key={slot}
              onClick={() => onSlotSelect(slot)}
              className={`font-brand-normal rounded-lg p-2.5 text-sm font-semibold transition-all duration-200 focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900 ${
                selectedSlot === slot
                  ? "bg-[#1e88e5] text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-[#1e88e5]/20 dark:bg-gray-800 dark:text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {formatInTimeZone(parseISO(slot), userTimezone, "h:mm a")}
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
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
  formSuccess,
  smsConsent,
  setSmsConsent,
  attemptSubmit,
  setAttemptSubmit,
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
        <label className="font-brand-medium mb-3 block text-sm text-gray-700 dark:text-gray-300">
          Are you an Investor or Developer?
        </label>
        <div className="flex items-center space-x-6">
          <label className="flex cursor-pointer items-center space-x-2">
            <input
              type="radio"
              name="userType"
              value="Investor"
              checked={userType === "Investor"}
              onChange={(e) => setUserType(e.target.value)}
              className="form-radio h-4 w-4 border-gray-300 bg-gray-200 text-[#1e88e5] focus:ring-[#1e88e5] dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-900"
            />
            <span className="font-brand-normal text-base text-gray-700 dark:text-gray-300">
              Investor
            </span>
          </label>
          <label className="flex cursor-pointer items-center space-x-2">
            <input
              type="radio"
              name="userType"
              value="Developer"
              checked={userType === "Developer"}
              onChange={(e) => setUserType(e.target.value)}
              className="form-radio h-4 w-4 border-gray-300 bg-gray-200 text-[#1e88e5] focus:ring-[#1e88e5] dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-900"
            />
            <span className="font-brand-normal text-base text-gray-700 dark:text-gray-300">
              Developer
            </span>
          </label>
        </div>
      </div>

      {userType === "Developer" && (
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
            checked={advertise === "Yes"}
            onChange={(e) => setAdvertise(e.target.checked ? "Yes" : "No")}
            className="h-4 w-4 rounded border-gray-300 text-[#1e88e5] focus:ring-[#1e88e5] dark:border-gray-600 dark:bg-gray-800"
          />
          <label
            htmlFor="advertise-checkbox"
            className="font-brand-medium ml-3 block text-sm text-gray-700 dark:text-gray-300"
          >
            <b>Do you want to explore advertising on OZListings?</b>
          </label>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="font-brand-medium mb-2 block text-sm text-gray-700 dark:text-gray-300">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="font-brand-normal w-full rounded-lg border border-gray-300 px-3 py-2 text-base transition-colors duration-300 focus:ring-2 focus:ring-[#1e88e5] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="font-brand-medium mb-2 block text-sm text-gray-700 dark:text-gray-300">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="font-brand-normal w-full rounded-lg border border-gray-300 px-3 py-2 text-base transition-colors duration-300 focus:ring-2 focus:ring-[#1e88e5] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
      <div>
        <label className="font-brand-medium mb-2 block text-sm text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="font-brand-normal w-full rounded-lg border border-gray-300 px-3 py-2 text-base transition-colors duration-300 focus:ring-2 focus:ring-[#1e88e5] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="font-brand-medium mb-2 block text-sm text-gray-700 dark:text-gray-300">
          Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          required
          className="font-brand-normal w-full rounded-lg border border-gray-300 px-3 py-2 text-base transition-colors duration-300 focus:ring-2 focus:ring-[#1e88e5] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <div className="mt-3 flex items-start">
          <input
            type="checkbox"
            id="sms-consent"
            checked={smsConsent}
            onChange={(e) => { setSmsConsent(e.target.checked); if (e.target.checked) setAttemptSubmit(false); }}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1e88e5] focus:ring-[#1e88e5] dark:border-gray-600 dark:bg-gray-800"
          />
          <label htmlFor="sms-consent" className="font-brand-normal ml-3 text-xs text-gray-600 dark:text-gray-300">
            Yes, I agree to receive SMS updates from OZ Listings about this call, future events and webinars. Reply STOP to opt-out.
          </label>
        </div>
        {(attemptSubmit && !smsConsent) && (
          <p className="mt-2 text-xs text-red-500">Please check the box to proceed.</p>
        )}
      </div>
    </div>

    <button
      type="submit"
      disabled={isBooking}
      className="font-brand-semibold w-full rounded-lg bg-[#1e88e5] px-4 py-3 text-base text-white transition-colors duration-300 hover:bg-[#1976d2] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isBooking ? "Booking..." : "Confirm Meeting"}
    </button>

    {formError && (
      <p className="mt-2 text-center text-sm text-red-500">{formError}</p>
    )}
    {formSuccess && (
      <p className="mt-2 text-center text-sm text-green-500">{formSuccess}</p>
    )}
  </motion.form>
);

function ScheduleACall() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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
  const [userTimezone, setUserTimezone] = useState("America/Denver");

  // Form state
  const [userType, setUserType] = useState("Investor");
  const [advertise, setAdvertise] = useState("No");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Auto-fill user info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [attemptSubmit, setAttemptSubmit] = useState(false);



  // Detect user's timezone on component mount
  useEffect(() => {
    const detectedTimezone = getUserTimezone();
    setUserTimezone(detectedTimezone);
  }, []);

  useEffect(() => {
    const prefillUserType = searchParams.get("userType");
    const prefillAdvertise = searchParams.get("advertise");
    const endpoint = searchParams.get("endpoint");

    if (prefillUserType) {
      setUserType(prefillUserType);
    }
    if (prefillAdvertise === "true") {
      setAdvertise("Yes");
    }
    if (endpoint) {
      trackUserEvent("schedule_call_page_view", { source_endpoint: endpoint });
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      const nameParts = user.user_metadata?.full_name?.split(" ") || ["", ""];
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setPhoneNumber(user.user_metadata?.phone_number || "");
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
        const res = await fetch(
          `/api/calendar/availability?startDate=${startDate}&endDate=${endDate}&timezone=${encodeURIComponent(userTimezone)}`,
        );
        if (!res.ok) throw new Error("Failed to fetch slots");
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
    setFormError("");
    setFormSuccess("");
    setAttemptSubmit(true);

    if (!selectedSlot) {
      setFormError("Please select a time slot.");
      return;
    }

    if (!smsConsent) {
      setFormError("Please check the SMS updates box to proceed.");
      return;
    }

    setIsBooking(true);

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phoneNumber);
    formData.append("userType", userType);
    formData.append("advertise", advertise);
    formData.append("selectedSlot", selectedSlot);
    formData.append("timezone", userTimezone);
    formData.append("smsConsent", smsConsent ? "Yes" : "No");

    try {
      const res = await fetch("/api/calendar/book", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Booking failed");
      }

      setFormSuccess("Your meeting has been booked successfully!");
      setBookingComplete(true); // Set booking as complete

      // Track successful submission if coming from promotional card
      if (userType === "Developer" && advertise === "Yes") {
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
    setFormSuccess("");
    setFormError("");
  };

  const handleTimezoneChange = (newTimezone) => {
    setUserTimezone(newTimezone);
    setSelectedSlot(null); // Reset selected slot when timezone changes
    setFormSuccess("");
    setFormError("");
  };

  // Render logic for calendar tile styling
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateString = format(date, "yyyy-MM-dd");
      if (availableSlots[dateString]?.slots?.length > 0) {
        // More prominent styling for available days
        return "available-day";
      }
    }
    return null;
  };

  if (!user) {
    return <LoadingFallback />;
  }

  return (
    <div className="font-brand-normal min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-black dark:text-white">
      <main className="container mx-auto px-4 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-5xl"
        >
          {bookingComplete ? (
            <motion.div
              className="rounded-2xl border border-gray-200/50 bg-gray-50 p-8 text-center shadow-lg dark:border-gray-700/50 dark:bg-gray-900/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="font-brand-bold mb-4 text-3xl tracking-tight text-gray-900 dark:text-white">
                You're in! Your Opportunity Zone journey just got real. 🚀
              </h1>
              <p className="font-brand-normal mb-6 text-lg text-gray-600 dark:text-gray-400">
                {formSuccess} Get ready to tap into our exclusive deal flow,
                strategic insights, and tax advantages you won't find anywhere
                else.
              </p>
              <button
                onClick={() => router.push("/")}
                className="font-brand-semibold rounded-lg bg-[#1e88e5] px-6 py-2.5 text-white transition-colors duration-300 hover:bg-[#1976d2]"
              >
                Go to Homepage
              </button>
            </motion.div>
          ) : (
            <>
              <div className="mb-12 text-center">
                <h1 className="font-brand-black mb-4 text-4xl tracking-tight text-gray-900 md:text-5xl dark:text-white">
                  Schedule a Call
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                  Select a date and time that works for you. We look forward to
                  speaking with you!
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                <CalendarView
                  onActiveStartDateChange={({ activeStartDate }) =>
                    setActiveDate(activeStartDate)
                  }
                  onDateChange={handleDateChange}
                  selectedDate={selectedDate}
                  tileClassName={tileClassName}
                  userTimezone={userTimezone}
                  onTimezoneChange={handleTimezoneChange}
                />

                <div className="rounded-2xl border border-gray-200/50 bg-gray-50 p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-900/50">
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
                      smsConsent={smsConsent}
                      setSmsConsent={setSmsConsent}
                      attemptSubmit={attemptSubmit}
                      setAttemptSubmit={setAttemptSubmit}
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
        .dark
          .react-calendar-custom
          .react-calendar__month-view__weekdays__weekday {
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
