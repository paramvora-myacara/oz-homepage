import { Metadata } from 'next';
import MapClient from './MapClient';

export const metadata: Metadata = {
    title: 'Opportunity Zone Map & Address Checker | OZ Listings',
    description: 'Search any U.S. address to instantly verify if it qualifies as a designated Opportunity Zone. Explore the complete interactive map of 8,765 Opportunity Zones across the United States.',
    keywords: ['Opportunity Zone map', 'OZ checker', 'address lookup', 'qualified census tracts', 'OZ search', 'opportunity zones by address', 'OZ investment map'],
    openGraph: {
        title: 'Opportunity Zone Map & Address Checker | OZ Listings',
        description: 'Search any U.S. address to instantly verify if it qualifies as a designated Opportunity Zone. Explore the complete interactive map of 8,765 Opportunity Zones.',
        type: 'website',
    }
};

export default function OpportunityZoneMap() {
    return <MapClient />;
}
