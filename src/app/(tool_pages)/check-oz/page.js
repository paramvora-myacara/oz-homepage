'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ozChecker from '../../../lib/ozChecker';
import TabContainer from '../../components/TabContainer';
import { 
  AddressTabContent, 
  CoordinatesTabContent, 
  ResultsDisplay, 
  ErrorDisplay 
} from '../../components/CheckOZ';
import { useAddressPredictions, useOZChecker } from '../../hooks/checkoz';
import ScheduleCallCTA from '../../components/ScheduleCallCTA';
import { useAuth } from '../../../lib/auth/AuthProvider';

export default function CheckOZPage() {
  const router = useRouter();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const { user } = useAuth();

  // Custom hooks for managing address predictions and OZ checking
  const addressPredictions = useAddressPredictions();
  const ozCheckerHook = useOZChecker(user);



  const handleAddressCheck = () => {
    ozCheckerHook.checkOZStatus(addressPredictions.selectedAddress);
  };

  const handleCoordinatesCheck = () => {
    ozCheckerHook.checkCoordinates(latitude, longitude);
  };

  const handleReset = () => {
    addressPredictions.resetForm();
    setLatitude('');
    setLongitude('');
    ozCheckerHook.resetForm();
  };

  const handleBack = () => {
            router.push('/invest');
  };

  // Memoize tabs array to prevent unnecessary re-renders
  const tabs = useMemo(() => [
    {
      id: 'address',
      label: 'Check Address',
      content: (
        <AddressTabContent
          {...addressPredictions}
          checkOZStatus={handleAddressCheck}
          resetForm={handleReset}
          isLoading={ozCheckerHook.isLoading}
          ozDataLoaded={ozCheckerHook.ozDataLoaded}
        />
      )
    },
    {
      id: 'coordinates',
      label: 'Enter Coordinates',
      content: (
        <CoordinatesTabContent
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
          checkCoordinates={handleCoordinatesCheck}
          isLoading={ozCheckerHook.isLoading}
          ozDataLoaded={ozCheckerHook.ozDataLoaded}
        />
      )
    }
  ], [
    addressPredictions,
    latitude,
    longitude,
    ozCheckerHook.isLoading,
    ozCheckerHook.ozDataLoaded,
    handleAddressCheck,
    handleCoordinatesCheck
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-950 dark:via-black dark:to-gray-900 px-8 pt-20 sm:pt-24 md:pt-28 pb-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl font-semibold text-black dark:text-white tracking-tight mb-4">
            Check if Your Development is in an OZ
          </h1>
          <p className="text-xl text-black/60 dark:text-white/60 font-light">
            Enter your development address or coordinates to see if it qualifies for Opportunity Zone benefits
          </p>
          {!ozCheckerHook.ozDataLoaded && (
            <div className="mt-6 text-sm text-[#0071e3] animate-pulse">
              Loading OZ data... ({ozChecker.getStats?.().totalOZTracts || '8,765'} census tracts)
            </div>
          )}
        </div>

        {/* Tab Container */}
        <TabContainer tabs={tabs} defaultTab={0} className="mb-8" />

        {/* Error Message */}
        <ErrorDisplay error={ozCheckerHook.error} />

        {/* Results */}
        <ResultsDisplay result={ozCheckerHook.result} />

        {/* Schedule Call CTA */}
        <ScheduleCallCTA userType="Developer" />

        {/* Navigation */}
        <div className="mt-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-3 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Invest
          </button>
        </div>
      </div>
    </div>
  );
} 