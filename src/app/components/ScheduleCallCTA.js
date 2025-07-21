'use client';
import { useAuthNavigation } from '../../lib/auth/useAuthNavigation';

export default function ScheduleCallCTA({ className = '', userType = null }) {
  const { navigateWithAuth } = useAuthNavigation();

  const handleScheduleCall = () => {
    let path = '/schedule-a-call';
    if (userType) {
      path += `?userType=${userType}`;
    }
    navigateWithAuth(path);
  };

  return (
    <div className={`my-8 text-center ${className}`}>
      <button
        onClick={handleScheduleCall}
        className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
      >
        Schedule a Call
      </button>
    </div>
  );
} 