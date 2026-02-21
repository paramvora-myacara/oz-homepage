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

export default function MapClient() {
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

                {/* Map Container - height fills remaining viewport so page fits in one screen */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[calc(100vh-20rem)] min-h-[280px]">
                    <div className="flex-1 relative w-full h-full">
                        <APIProvider apiKey={MAPS_API_KEY}>
                            <Map
                                defaultCenter={{ lat: 39.8283, lng: -98.5795 }} // Center of US
                                defaultZoom={4}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}
                                zoomControl={true}
                                zoomControlOptions={{ position: 9 }} // RIGHT_BOTTOM (from google.maps.ControlPosition enumeration)
                                streetViewControl={true}
                                streetViewControlOptions={{ position: 9 }} // RIGHT_BOTTOM
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
