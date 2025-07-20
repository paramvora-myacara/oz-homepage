export const mockListings = [
  {
    id: "1",
    slug: "downtown-tech-hub-development",
    title: "Downtown Tech Hub Development",
    state: "California", 
    irr: "18.5%",
    min_investment: "$100,000",
    ten_year_multiple: "3.2x",
    asset_type: "Multi-Asset",
    development_type: "Construction",
    image_url: "/images/isaac-quesada-s34TlUTPIf4-unsplash.jpg",
    summary: "Premium mixed-use development in the heart of San Francisco's emerging tech corridor. Features cutting-edge office spaces and luxury residential units."
  },
  {
    id: "2", 
    slug: "sustainable-energy-manufacturing",
    title: "Sustainable Energy Manufacturing",
    state: "Texas",
    irr: "22.1%",
    min_investment: "$250,000", 
    ten_year_multiple: "4.1x",
    asset_type: "Single Asset",
    development_type: "Development",
    image_url: "/images/brett-jordan-B4-h2B-DRhs-unsplash.jpg",
    summary: "State-of-the-art solar panel manufacturing facility positioned to capitalize on the renewable energy boom and federal tax incentives."
  },
  {
    id: "3",
    slug: "urban-revitalization-project",
    title: "Urban Revitalization Project", 
    state: "New York",
    irr: "15.8%",
    min_investment: "$75,000",
    ten_year_multiple: "2.8x", 
    asset_type: "Multi-Asset",
    development_type: "Refinance",
    image_url: "/images/jimmy-atkinson-founder.jpg",
    summary: "Comprehensive neighborhood transformation including affordable housing, retail spaces, and community amenities in Brooklyn's opportunity zone."
  },
  {
    id: "4",
    slug: "logistics-distribution-center",
    title: "Logistics & Distribution Center",
    state: "Florida", 
    irr: "19.3%",
    min_investment: "$150,000",
    ten_year_multiple: "3.5x",
    asset_type: "Single Asset",
    development_type: "Acquisition",
    image_url: "/Team-Stock.jpg",
    summary: "Strategic last-mile distribution hub serving the rapidly growing Southeast market with advanced automation and sustainability features."
  }
];

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", 
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", 
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", 
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
  "West Virginia", "Wisconsin", "Wyoming"
];

export const FILTER_OPTIONS = {
  irr: [
    { label: "< 10%", value: "0-10", min: 0, max: 10 },
    { label: "10% - 15%", value: "10-15", min: 10, max: 15 },
    { label: "15% - 20%", value: "15-20", min: 15, max: 20 },
    { label: "> 20%", value: "20+", min: 20, max: 100 }
  ],
  minInvestment: [
    { label: "< $50k", value: "0-50000", min: 0, max: 50000 },
    { label: "$50k - $100k", value: "50000-100000", min: 50000, max: 100000 },
    { label: "$100k - $250k", value: "100000-250000", min: 100000, max: 250000 },
    { label: "> $250k", value: "250000+", min: 250000, max: Infinity }
  ],
  tenYearMultiple: [
    { label: "< 2x", value: "0-2", min: 0, max: 2 },
    { label: "2x - 3x", value: "2-3", min: 2, max: 3 },
    { label: "3x - 4x", value: "3-4", min: 3, max: 4 },
    { label: "> 4x", value: "4+", min: 4, max: 100 }
  ],
  assetType: [
    { label: "Single Asset", value: "single-asset" },
    { label: "Multi-Asset", value: "multi-asset" }
  ]
}; 