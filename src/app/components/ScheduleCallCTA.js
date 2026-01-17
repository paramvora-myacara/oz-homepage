'use client';
import { useAuthNavigation } from '../../lib/auth/useAuthNavigation';
import { usePathname } from 'next/navigation';

export default function ScheduleCallCTA({ className = '', userType = null }) {
  const { navigateWithAuth } = useAuthNavigation();
  const pathname = usePathname();

  const handleScheduleCall = () => {
    const params = new URLSearchParams();
    if (userType) {
      params.append('userType', userType);
    }
    params.append('endpoint', pathname);
    
    navigateWithAuth(`/schedule-a-call?${params.toString()}`);
  };

  return (
    <div className={`my-8 text-center ${className}`}>
      <button
        onClick={handleScheduleCall}
        className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300"
      >
        Schedule a Call
      </button>
    </div>
  );
}