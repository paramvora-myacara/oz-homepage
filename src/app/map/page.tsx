"use client";

import { useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { APIProvider, Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

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
            map.data.loadGeoJson('/data/opportunity-zones-compressed.geojson');

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

export default function OpportunityZoneMap() {
    const router = useRouter();

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
        <div className="min-h-screen bg-gray-50 pt-24 lg:pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-[1440px] mx-auto space-y-8">
                {/* Header Section - centered, landing-style */}
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl border border-gray-100 px-6 py-5 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Opportunity Zone Map</h1>
                        <p className="mt-1 text-sm text-gray-500">Interactive viewer for designated Opportunity Zones in the United States.</p>
                    </div>
                </div>

                {/* Map Container */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[75vh] min-h-[600px]">
                    <div className="flex-1 relative w-full h-full">
                        <APIProvider apiKey={MAPS_API_KEY}>
                            <Map
                                defaultCenter={{ lat: 39.8283, lng: -98.5795 }} // Center of US
                                defaultZoom={4}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}
                                mapId="DEMO_MAP_ID" // recommended by google for styling
                            >
                                <Suspense fallback={
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                                    </div>
                                }>
                                    <MapEffect />
                                </Suspense>
                            </Map>
                        </APIProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}
