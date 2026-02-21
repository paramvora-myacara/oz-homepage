import { Metadata } from 'next';
import MapClient from './MapClient';

export const metadata: Metadata = {
    title: 'Opportunity Zone Map | OZ Listings',
    description: 'Interactive map and viewer for designated Opportunity Zones in the United States. Find and explore qualified census tracts for investment.',
    openGraph: {
        title: 'Opportunity Zone Map | OZ Listings',
        description: 'Interactive map and viewer for designated Opportunity Zones in the United States. Find and explore qualified census tracts for investment.',
        type: 'website',
    }
};

export default function OpportunityZoneMap() {
    return <MapClient />;
}
