"use client";

import { useCallback, useEffect, Suspense, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import ScrollIndicator from "../components/Invest/ScrollIndicator";
import ModernKpiDashboard from "../components/ModernKpiDashboard";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/app/contexts/AuthModalContext";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

/** Pans the map to the given lat/lng when target is set (e.g. after Check OZ result). */
function MapPanTo({ target, onDone }: { target: { lat: number; lng: number } | null; onDone: () => void }) {
    const map = useMap();
    const onDoneRef = useRef(onDone);
    onDoneRef.current = onDone;
    const lastDoneRef = useRef<{ lat: number; lng: number } | null>(null);
    useEffect(() => {
        if (!map || !target) {
            if (!target) lastDoneRef.current = null;
            return;
        }
        map.setCenter(target);
        map.setZoom(14);
        if (lastDoneRef.current?.lat !== target.lat || lastDoneRef.current?.lng !== target.lng) {
            lastDoneRef.current = target;
            onDoneRef.current();
        }
    }, [map, target?.lat, target?.lng]);
    return null;
}

function MapEffect() {
    const map = useMap();
    const geocoding = useMapsLibrary('geocoding');
    const searchParams = useSearchParams();
    const stateParam = searchParams.get('state');
    const loadedGeoJsonRef = useRef(false);

    useEffect(() => {
        if (!map) return;

        if (!loadedGeoJsonRef.current) {
            // Load GeoJSON
            map.data.loadGeoJson('/data/opportunity-zones-trimmed-20260222-154812.geojson');

            // Style the data layer
            map.data.setStyle({
                fillColor: '#3B82F6', // Tailwind blue-500
                fillOpacity: 0.3,
                strokeColor: '#2563EB', // Tailwind blue-600
                strokeWeight: 1,
                clickable: true,
            });
            loadedGeoJsonRef.current = true;
        }

    }, [map]);

    useEffect(() => {
        if (!map || !geocoding || !stateParam) return;

        const geocoder = new geocoding.Geocoder();
        geocoder.geocode({ address: `${stateParam}, USA` }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const bounds = results[0].geometry.viewport;
                if (bounds) {
                    map.fitBounds(bounds);
                } else {
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(6);
                }
            } else {
                console.error("Geocode was not successful for the following reason: " + status);
            }
        });
    }, [map, geocoding, stateParam]);

    return null;
}

/** Address search bar with autocomplete that appears on top of the map */
function AddressSearchBar({
    onAddressSelected,
    isAuthenticated,
    onAuthRequired
}: {
    onAddressSelected: (lat: number, lng: number) => void;
    isAuthenticated: boolean;
    onAuthRequired: () => void;
}) {
    const [inputValue, setInputValue] = useState('');
    const [predictions, setPredictions] = useState<{ placeId: string; description: string }[]>([]);
    const [showPredictions, setShowPredictions] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const predictionsRef = useRef<HTMLDivElement>(null);
    const geocoding = useMapsLibrary('geocoding');

    // Debounced autocomplete
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue === selectedAddress) {
                setPredictions([]);
                setShowPredictions(false);
                return;
            }
            if (inputValue.length > 2) {
                fetchPredictions(inputValue);
            } else {
                setPredictions([]);
                setShowPredictions(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [inputValue, selectedAddress]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (predictionsRef.current && !predictionsRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowPredictions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchPredictions = async (input: string) => {
        if (!MAPS_API_KEY) {
            setPredictions([]);
            setShowPredictions(false);
            return;
        }
        try {
            const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': MAPS_API_KEY,
                    'X-Goog-FieldMask': 'suggestions.placePrediction.text,suggestions.placePrediction.placeId'
                },
                body: JSON.stringify({
                    input: input,
                    includedRegionCodes: ['us'],
                    includedPrimaryTypes: ['street_address', 'premise'],
                    languageCode: 'en'
                })
            });
            if (response.ok) {
                const data = await response.json();
                const addressPredictions = data.suggestions
                    ?.filter((s: any) => s.placePrediction)
                    ?.map((s: any) => ({
                        placeId: s.placePrediction.placeId,
                        description: s.placePrediction.text.text
                    })) || [];
                setPredictions(addressPredictions);
                setShowPredictions(addressPredictions.length > 0);
            } else {
                setPredictions([]);
                setShowPredictions(false);
            }
        } catch {
            setPredictions([]);
            setShowPredictions(false);
        }
    };

    const selectPrediction = async (prediction: { placeId: string; description: string }) => {
        setInputValue(prediction.description);
        setSelectedAddress(prediction.description);
        setShowPredictions(false);
        setPredictions([]);
        setIsChecking(true);

        // Geocode to get coordinates
        if (geocoding) {
            const geocoder = new geocoding.Geocoder();
            geocoder.geocode({ address: prediction.description }, (results, status) => {
                setIsChecking(false);
                if (status === 'OK' && results && results[0]) {
                    const location = results[0].geometry.location;
                    const lat = location.lat();
                    const lng = location.lng();
                    onAddressSelected(lat, lng);
                }
            });
        } else {
            setIsChecking(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && predictions.length > 0) {
            selectPrediction(predictions[0]);
        }
    };

    const handleInputClick = () => {
        if (!isAuthenticated) {
            onAuthRequired();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isAuthenticated) {
            onAuthRequired();
            return;
        }
        setInputValue(e.target.value);
    };

    return (
        <div className="w-full md:w-[400px] lg:w-[480px]">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onClick={handleInputClick}
                        placeholder="Enter an address to check if it's in an Opportunity Zone"
                        className="w-full pl-10 pr-4 py-3 text-sm md:text-base text-gray-800 placeholder-gray-400 focus:outline-none"
                        readOnly={!isAuthenticated}
                    />
                    {isChecking && (
                        <div className="absolute right-3">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                        </div>
                    )}
                </div>
                {showPredictions && predictions.length > 0 && (
                    <div
                        ref={predictionsRef}
                        className="border-t border-gray-100 max-h-60 overflow-y-auto"
                    >
                        {predictions.map((prediction) => (
                            <button
                                key={prediction.placeId}
                                onClick={() => selectPrediction(prediction)}
                                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                            >
                                {prediction.description}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MapClient() {
    const router = useRouter();
    const { user } = useAuth();
    const { openModal } = useAuthModal();
    const isAuthenticated = !!user;
    const [mapTarget, setMapTarget] = useState<{ lat: number; lng: number } | null>(null);
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

    const onAddressSelected = useCallback((lat: number, lng: number) => {
        setMapTarget({ lat, lng });
        setMarkerPosition({ lat, lng });
    }, []);
    const onPanDone = useCallback(() => setMapTarget(null), []);

    const handleAuthRequired = useCallback(() => {
        openModal({
            title: 'Create Your Free Account',
            description: 'Sign up to search addresses and check if they are in Opportunity Zones.\n✨ Get access to exclusive deal flow and investment opportunities',
            redirectTo: '/map',
        });
    }, [openModal]);

    if (!MAPS_API_KEY) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Google Maps API Key Missing</h1>
                <p className="text-gray-600">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.</p>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full text-navy font-sans antialiased">
            {/* Grid Background - same as listings marketplace */}
            <div className="fixed inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[600px] w-[600px] rounded-full bg-radial-gradient from-blue-500/10 to-transparent blur-[100px] pointer-events-none" />

            {/* Main Content Layout - same as listings */}
            <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-8 pb-16 pt-24">
                {/* Header Section - same font sizes and styles as listings Marketplace */}
                <div className="mb-8 text-center md:mb-12">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-navy">
                        Opportunity Zone Map
                    </h1>
                    <p className="text-lg font-medium text-gray-600 md:text-xl max-w-4xl mx-auto">
                        Interactive viewer for designated Opportunity Zones in the United States.
                    </p>
                </div>

                {/* Search Bar - above the map */}
                <div className="mb-4 flex justify-center">
                    <APIProvider apiKey={MAPS_API_KEY}>
                        <AddressSearchBar
                            onAddressSelected={onAddressSelected}
                            isAuthenticated={isAuthenticated}
                            onAuthRequired={handleAuthRequired}
                        />
                    </APIProvider>
                </div>

                {/* Map Container */}
                <div className="relative">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[calc(100vh-30rem)] min-h-[280px]">
                        <div className="flex-1 relative w-full h-full">
                            <APIProvider apiKey={MAPS_API_KEY}>
                                <Map
                                    defaultCenter={{ lat: 39.8283, lng: -98.5795 }} // Center of US
                                    defaultZoom={4}
                                    gestureHandling={'greedy'}
                                    disableDefaultUI={true}
                                    zoomControl={true}
                                    zoomControlOptions={{ position: 9 }} // RIGHT_BOTTOM
                                    streetViewControl={true}
                                    streetViewControlOptions={{ position: 9 }} // RIGHT_BOTTOM
                                    mapId="DEMO_MAP_ID"
                                >
                                    <Suspense fallback={
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                                        </div>
                                    }>
                                        <MapEffect />
                                        <MapPanTo target={mapTarget} onDone={onPanDone} />
                                        {markerPosition && <Marker position={markerPosition} />}
                                    </Suspense>
                                </Map>
                            </APIProvider>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator below the map */}
                <div className="mt-12 h-24 relative flex justify-center">
                    <ScrollIndicator scrollToId="market-report" />
                </div>

                {/* Market Report */}
                <section id="market-report" className="pt-16 md:pt-24 pb-8 scroll-mt-24" aria-label="Market overview">
                    <ModernKpiDashboard />
                </section>
            </div>
        </div>
    );
}
