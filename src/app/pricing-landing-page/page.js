"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Star, 
  Trophy, 
  TrendingUp, 
  Users, 
  Shield, 
  ArrowRight, 
  X, 
  Video, 
  Mail, 
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap
} from "lucide-react";
import Link from "next/link";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

// --- Components ---

const Section = ({ children, className = "", id = "" }) => {
  return (
    <section id={id} className={`relative w-full px-4 py-12 md:px-8 lg:px-12 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
};

const FadeIn = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// --- Hero Section ---

const Hero = () => {
  return (
    <div className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white pt-10 text-center dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      {/* Geometric pattern background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
              linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
              linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
              linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5)
            `,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
          }}></div>
        </div>
        {/* Radial gradient accents */}
        <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-radial from-[#1e88e5]/10 via-transparent to-transparent dark:from-[#1e88e5]/5"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-radial from-[#1565c0]/8 via-transparent to-transparent dark:from-[#1565c0]/4"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1/3 bg-gradient-radial from-slate-100/25 via-transparent to-transparent dark:from-slate-800/15"></div>
      </div>

      <div className="relative z-10 max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-block rounded-full bg-[#1e88e5]/10 px-4 py-1.5 text-sm font-semibold text-[#1e88e5] dark:bg-[#1e88e5]/20 dark:text-[#1e88e5]">
            For Sponsors & Developers
          </span>
          <h1 className="font-brand-black mb-6 text-4xl leading-tight text-gray-900 md:text-6xl dark:text-white">
            Connect With Qualified <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e88e5] to-[#1565c0]">
              Opportunity Zone Investors
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl dark:text-gray-300">
            The premier marketplace built exclusively for Opportunity Zone projects. Get your development in front of thousands of accredited investors actively seeking OZ investments.
          </p>

          <div className="mb-10 flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-x-8 sm:space-y-0">
            {[
              "Access to the largest network of OZ-focused investors",
              "Partner with the industry's leading authority",
              "Raise $500K-$5M+ in capital"
            ].map((item, i) => (
              <div key={i} className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button 
              onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
              className="rounded-lg bg-[#1e88e5] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#1565c0] hover:shadow-[#1e88e5]/30"
            >
              See Pricing Plans
            </button>
            <Link href="/schedule-a-call" className="rounded-lg border-2 border-gray-300 bg-transparent px-8 py-4 text-lg font-bold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800">
              Schedule a Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- Special Offer Banner ---

const SpecialOfferBanner = () => {
  return (
    <div className="bg-gray-900 px-4 py-3 text-white dark:bg-black border-y border-gray-800 relative z-50 mt-4">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-amber-400">FOUNDING MEMBER EXCLUSIVE</p>
            <p className="text-sm text-gray-300">Join the first 25 sponsors and save 20% + get a FREE strategy session.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-white">Only 12 spots remaining</p>
            <p className="text-xs text-gray-400">Offer ends Dec 31, 2025</p>
          </div>
          <button 
             onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
             className="whitespace-nowrap rounded-md bg-amber-500 px-4 py-2 text-sm font-bold text-black transition-transform hover:scale-105 hover:bg-amber-400"
          >
            Claim Rate
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Pricing Tiers ---

const PricingCard = ({ tier, isAnnual }) => {
  const { 
    name, 
    priceMonthly, 
    priceAnnual, 
    description, 
    features, 
    highlight, 
    color, 
    icon: Icon, 
    cta,
    savings 
  } = tier;

  const price = isAnnual ? priceAnnual : priceMonthly;
  const originalPrice = isAnnual ? tier.originalPriceAnnual : tier.originalPriceMonthly;
  
  return (
    <div className={`relative flex flex-col rounded-2xl border transition-all duration-300 ${highlight ? 'border-[#1e88e5] bg-white shadow-xl scale-105 z-10 dark:bg-gray-800 dark:border-[#1e88e5]' : 'border-gray-200 bg-white hover:shadow-lg dark:bg-gray-900 dark:border-gray-700'}`}>
      {highlight && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-max rounded-full bg-gradient-to-r from-[#1e88e5] to-[#1565c0] px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
          Most Popular
        </div>
      )}
      
      <div className="p-6 md:p-8">
        <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{name}</h3>
        <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{description}</p>
        
        <div className="mt-4">
          <div className="flex items-baseline">
            <span className="text-base md:text-lg text-gray-400 line-through decoration-red-500 decoration-2 opacity-70">${originalPrice}</span>
            <span className="ml-2 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">${price}</span>
            <span className="ml-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">/{isAnnual ? 'yr' : 'mo'}</span>
          </div>
          {isAnnual && savings && (
             <span className="mt-2 inline-block rounded-md bg-green-100 px-2 py-1 text-[10px] md:text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
               Save ${savings}/year
             </span>
          )}
        </div>

        <button className={`mt-6 w-full rounded-lg px-4 py-2.5 md:px-6 md:py-3 text-center text-sm md:text-base font-bold transition-colors ${highlight ? 'bg-[#1e88e5] text-white hover:bg-[#1565c0]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'}`}>
          {cta}
        </button>
      </div>

      <div className="flex-1 bg-gray-50 px-6 py-4 md:px-8 md:py-6 dark:bg-gray-800/50 rounded-b-2xl">
        <p className="mb-3 md:mb-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">What&apos;s included</p>
        <ul className="space-y-2 md:space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: "Standard",
      originalPriceMonthly: 595,
      priceMonthly: 476,
      originalPriceAnnual: 5950,
      priceAnnual: 4760,
      savings: "1,190",
      description: "For First-Time Sponsors",
      icon: Users,
      color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
      highlight: false,
      cta: "Start with Standard",
      features: [
        "Premium Listing Page",
        "Access to Qualified Investor Network",
        "Secure Deal Vault",
        "OZ Tools & Resources",
        "Unlimited Listing Updates"
      ]
    },
    {
      name: "Pro",
      originalPriceMonthly: 1195,
      priceMonthly: 956,
      originalPriceAnnual: 11950,
      priceAnnual: 9560,
      savings: "2,868",
      description: "For Growing Sponsors",
      icon: Star,
      color: "bg-[#1e88e5]/10 text-[#1e88e5] dark:bg-[#1e88e5]/20 dark:text-[#1e88e5]",
      highlight: true,
      cta: "Get Started with Pro",
      features: [
        "Everything in Standard, plus:",
        "Featured Search Placement",
        "\"Verified OZ Project\" Badge",
        "Newsletter & Social Promotion",
        "Professional Copy Editing",
        "Multi-Project Discount (25% off)"
      ]
    },
    {
      name: "Elite",
      originalPriceMonthly: 2395,
      priceMonthly: 1916,
      originalPriceAnnual: 23950,
      priceAnnual: 19160,
      savings: "7,188",
      description: "For Institutional Sponsors",
      icon: Trophy,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      highlight: false,
      cta: "Unlock Elite Benefits",
      features: [
        "Everything in Pro, plus:",
        "Homepage Banner Rotation",
        "Top Projects Carousel",
        "Dedicated Account Manager",
        "Professional Photography/Video",
        "Premium Analytics & Insights"
      ]
    }
  ];

  return (
    <section id="pricing" className="relative w-full px-4 py-8 md:px-8 lg:px-12 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      {/* Geometric pattern background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
              linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
              linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
              linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5)
            `,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
          }}></div>
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="font-brand-black text-3xl md:text-4xl text-gray-900 dark:text-white">Choose Your Plan</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Simple, transparent pricing to fuel your capital raise.</p>
          
          <div className="mt-6 flex justify-center">
            <div className="relative flex rounded-full bg-gray-100 p-1 dark:bg-gray-800">
              <button
                onClick={() => setIsAnnual(false)}
                className={`relative z-10 rounded-full px-6 py-2 text-sm font-medium transition-all ${!isAnnual ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`relative z-10 flex items-center rounded-full px-6 py-2 text-sm font-medium transition-all ${isAnnual ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                Annual
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 uppercase dark:bg-green-900/30 dark:text-green-400">
                  Save 2 Months
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {tiers.map((tier, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <PricingCard tier={tier} isAnnual={isAnnual} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- ROICalculator Component with Brand Colors ---

const ROICalculator = () => {
  const [capital, setCapital] = useState(2000000);
  
  const annualCost = 9560; // Pro tier
  const brokerRate = 0.045; // 4.5% avg
  
  const brokerFee = capital * brokerRate;
  const savings = brokerFee - annualCost;
  const roi = Math.round(capital / annualCost);

  return (
    <Section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl md:p-12 lg:p-16 dark:bg-gray-800">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Side - Calculator Inputs */}
          <div>
            <span className="mb-2 inline-block text-sm font-bold uppercase tracking-wider text-[#1e88e5]">Value Calculator</span>
            <h2 className="font-brand-black mb-4 text-3xl text-gray-900 md:text-4xl dark:text-white">Calculate Your ROI</h2>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              See how much capital you could raise and how much you'll save compared to traditional broker fees.
            </p>
            
            <div className="mb-8">
              <label className="mb-4 block font-semibold text-gray-700 dark:text-gray-200">
                How much capital are you seeking?
              </label>
              <div className="mb-6 text-5xl font-bold text-[#1e88e5]">
                ${(capital / 1000000).toFixed(1)}M
              </div>
              <div className="px-2">
                <Slider
                  min={500000}
                  max={10000000}
                  step={100000}
                  value={capital}
                  onChange={setCapital}
                  trackStyle={{ backgroundColor: '#1e88e5', height: 8, borderRadius: 4 }}
                  handleStyle={{
                    borderColor: '#1e88e5',
                    height: 24,
                    width: 24,
                    marginTop: -8,
                    backgroundColor: 'white',
                    opacity: 1,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                  railStyle={{ backgroundColor: '#e5e7eb', height: 8, borderRadius: 4 }}
                />
              </div>
              <div className="mt-3 flex justify-between text-xs font-medium text-gray-400">
                <span>$500K</span>
                <span>$10M</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 italic">
              Based on average broker fees of 3-6%. Your actual ROI may vary.
            </p>
          </div>

          {/* Right Side - Results Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e88e5] to-[#1565c0] p-8 text-white shadow-2xl md:p-10">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
               <div className="absolute inset-0" style={{
                 backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
                 backgroundSize: '20px 20px'
               }}></div>
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="mb-8 border-b border-white/20 pb-8">
                <p className="mb-2 text-white/80 font-medium">Your Investment (Pro Tier)</p>
                <p className="text-3xl font-bold">$9,560 / year</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="mb-2 text-sm text-white/80">Est. Broker Fee</p>
                  <p className="text-2xl font-bold text-white/70 line-through decoration-red-400/70 decoration-2">${brokerFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold text-amber-300 uppercase tracking-wide">You Save</p>
                  <p className="text-3xl font-extrabold text-white">${savings.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-auto rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white/90 text-lg">ROI Multiple</span>
                  <span className="text-5xl font-black text-white tracking-tight">{roi}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

// --- Comparison Table ---

const ComparisonTable = () => {
  const features = [
    { category: "Listing & Exposure", items: [
      { name: "Premium listing page", std: true, pro: true, elite: true },
      { name: "Photo gallery", std: "25 images", pro: "50 images", elite: "Unlimited" },
      { name: "Featured search placement", std: false, pro: true, elite: true },
      { name: "Homepage banner", std: false, pro: false, elite: true },
    ]},
    { category: "Investor Reach", items: [
      { name: "Investor network access", std: true, pro: true, elite: true },
      { name: "Newsletter inclusion", std: "Occasional", pro: "Monthly", elite: "Every issue" },
      { name: "Social media promotion", std: false, pro: "2x/quarter", elite: "2x/month" },
    ]},
    { category: "Support & Services", items: [
      { name: "Email support", std: "24-hour", pro: "4-hour", elite: "1-hour" },
      { name: "Account manager", std: false, pro: "Check-ins", elite: "Dedicated" },
      { name: "Strategy sessions", std: false, pro: false, elite: "Quarterly" },
      { name: "Performance reviews", std: false, pro: "Monthly", elite: "Weekly" },
    ]},
    { category: "Analytics & Tools", items: [
      { name: "Basic analytics", std: true, pro: true, elite: true },
      { name: "Investor engagement tracking", std: false, pro: true, elite: "Advanced" },
      { name: "Market insights", std: false, pro: "Quarterly", elite: "Monthly" },
      { name: "Competitive benchmarking", std: false, pro: false, elite: true },
    ]}
  ];

  const renderCell = (val) => {
    if (val === true) return <Check className="mx-auto h-5 w-5 text-green-500" />;
    if (val === false) return <span className="text-gray-300 text-xl">—</span>;
    return <span className="text-sm font-medium text-gray-900 dark:text-white">{val}</span>;
  };

  return (
    <Section className="overflow-hidden !py-8 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      {/* Geometric pattern background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
              linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
              linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
              linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5)
            `,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
          }}></div>
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="font-brand-black text-3xl text-gray-900 dark:text-white">Compare All Plans</h2>
        </div>
        
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <table className="w-full min-w-[800px] table-fixed text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="w-1/3 p-4 md:p-6 text-sm font-bold text-gray-500 dark:text-gray-400">Feature</th>
              <th className="w-1/5 p-4 md:p-6 text-center text-lg font-bold text-gray-900 dark:text-white">Standard</th>
              <th className="w-1/5 p-4 md:p-6 text-center text-lg font-bold text-[#1e88e5] dark:text-[#1e88e5]">Pro ⭐</th>
              <th className="w-1/5 p-4 md:p-6 text-center text-lg font-bold text-amber-600 dark:text-amber-400">Elite</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {features.map((section, i) => (
              <>
                <tr key={i} className="bg-gray-50/50 dark:bg-gray-800/30">
                  <td colSpan="4" className="px-6 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {section.category}
                  </td>
                </tr>
                {section.items.map((item, j) => (
                  <tr key={`${i}-${j}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">{item.name}</td>
                    <td className="px-6 py-3 text-center">{renderCell(item.std)}</td>
                    <td className="px-6 py-3 text-center bg-[#1e88e5]/5 dark:bg-[#1e88e5]/10">{renderCell(item.pro)}</td>
                    <td className="px-6 py-3 text-center bg-amber-50/30 dark:bg-amber-900/10">{renderCell(item.elite)}</td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </Section>
  );
};

// --- Add-ons ---

const AddOnCard = ({ icon: Icon, title, price, prevPrice, features, note }) => (
  <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-[#1e88e5] hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#1e88e5]">
    <div>
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1e88e5]/10 text-[#1e88e5] group-hover:bg-[#1e88e5] group-hover:text-white transition-colors dark:bg-[#1e88e5]/20 dark:text-[#1e88e5]">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      <div className="mb-6 flex items-baseline gap-2">
        {prevPrice && <span className="text-sm text-gray-400 line-through">${prevPrice}</span>}
        <span className="text-2xl font-bold text-[#1e88e5] dark:text-[#1e88e5]">${price}</span>
      </div>
      <ul className="space-y-3">
        {features.map((feat, i) => (
          <li key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
            <Check className="mr-2 h-4 w-4 shrink-0 text-green-500" />
            {feat}
          </li>
        ))}
      </ul>
    </div>
    {note && <div className="mt-6 rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">{note}</div>}
  </div>
);

// --- FAQ ---

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button 
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-gray-900 dark:text-white">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 dark:text-gray-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page Component ---

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 pt-14 dark:bg-black dark:text-gray-100">
      
      <SpecialOfferBanner />
      
      <Hero />
      
      <PricingSection />
      
      <ComparisonTable />
      
      <ROICalculator />

      {/* Add-Ons Section */}
      <Section className="bg-gray-50 dark:bg-gray-900">
        <div className="mb-12 text-center">
          <h2 className="font-brand-black text-3xl text-gray-900 dark:text-white">Premium Services & Add-Ons</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Maximize your exposure with these high-impact services.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <AddOnCard 
            icon={Video}
            title="Live Pitch Webinar"
            prevPrice="2,500"
            price="1,995"
            features={["30-min live presentation", "Email to 60K+ subscribers", "Lead capture & analytics", "Recorded for future use"]}
            note="Launch Pricing - First 10 Only"
          />
          <AddOnCard 
            icon={Mail}
            title="VIP Email Blast"
            prevPrice="5,000"
            price="3,995"
            features={["Email to 2,500+ Family Offices", "Exclusive featuring (1 per blast)", "Professional copywriting", "Detailed engagement report"]}
            note="Only ONE per month available"
          />
          <AddOnCard 
            icon={LinkIcon}
            title="CRM Integration"
            price="395"
            features={["Salesforce/HubSpot integration", "Real-time lead sync", "Custom API endpoints", "Dedicated tech support"]}
          />
        </div>
      </Section>

      {/* Special Launch Bonus */}
      <Section className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        {/* Geometric pattern background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
                linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
                linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
                linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5)
              `,
              backgroundSize: '80px 140px',
              backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
            }}></div>
          </div>
          {/* Radial gradient accents */}
          <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-radial from-[#1e88e5]/10 via-transparent to-transparent dark:from-[#1e88e5]/5"></div>
          <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-radial from-[#1565c0]/8 via-transparent to-transparent dark:from-[#1565c0]/4"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="mb-6 flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-[#1e88e5]" />
              <span className="text-sm font-bold uppercase tracking-widest text-[#1e88e5]">Launch Bonus</span>
            </div>
            <h2 className="font-brand-black mb-6 text-3xl md:text-4xl text-gray-900 dark:text-white leading-tight text-center">
              First 50 Sponsors Get Free Upgrades
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-light text-center">
              Sign up by December 31, 2025 and receive:
            </p>
            
            {/* Value Breakdown */}
            <div className="mb-10 space-y-4 max-w-xl mx-auto">
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">FREE upgrade to next tier for first 3 months</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">($3,585 value for Standard → Pro upgrade)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">FREE professional listing consultation</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">($500 value)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">BONUS: Featured placement in January newsletter</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">($1,000 value)</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-[#1e88e5]/10 dark:bg-[#1e88e5]/20 rounded-xl border border-[#1e88e5]/20 dark:border-[#1e88e5]/30">
                <p className="text-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value: </span>
                  <span className="text-2xl font-bold text-[#1e88e5]">Up to $5,085</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
              <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700 p-6 border border-gray-200 dark:border-gray-600 w-[140px]">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">38</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">Spots Left</span>
              </div>
              <button 
                onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                className="rounded-lg bg-gradient-to-r from-[#1e88e5] to-[#1565c0] px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl w-[140px] text-center leading-tight"
              >
                Claim My Launch Bonus
              </button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="font-brand-black mb-12 text-center text-3xl text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-2">
            <FAQItem question="Can I switch plans later?" answer="Absolutely! You can upgrade at any time. Upgrades are prorated and take effect immediately." />
            <FAQItem question="What's included in the Founding Member discount?" answer="The first 25 sponsors get 20% off their first year on any plan. This discount applies to both monthly and annual billing. After year one, you'll still receive a 15% 'founding member' discount for as long as you remain a customer." />
            <FAQItem question="Can I pay annually to save more?" answer="Yes! Annual plans save you 2 months (16.7% discount). With the Founding Member discount stacked on top, you're saving over 35% vs. regular monthly pricing." />
            <FAQItem question="Do you offer multi-project discounts?" answer="Yes! Add additional projects at 25% off the same tier. For example, if you have 5 Pro listings, you pay full price for one and get 25% off the other four. This can save you $14,340/year or more." />
            <FAQItem question="How quickly can I get my listing live?" answer="Standard and Pro listings typically go live within 24-48 hours after you submit your project information. Elite tier includes white-glove setup assistance and can be live within 24 hours." />
            <FAQItem question="What kind of investors use OZ Listings?" answer="Our investor network includes accredited investors, family offices, qualified opportunity funds (QOFs), and institutional investors—all actively seeking OZ investments. 80% of our investors have completed at least one OZ investment." />
            <FAQItem question="Is my information secure?" answer="Yes. All sensitive documents are stored in our secure deal vault behind confidentiality agreements. Investors must sign an NDA before accessing your detailed financials and documents." />
            <FAQItem question="Can I see who's viewing my listing?" answer="Pro and Elite tiers include investor engagement tracking. You'll see which investors viewed your listing, how long they spent, which documents they accessed, and their contact information (when they opt in)." />
            <FAQItem question="How much capital can I expect to raise?" answer="Results vary by project quality, location, and asset class, but our average sponsor raises $500K-$5M in capital through our platform. We've facilitated over $50M in OZ investments to date. We recommend combining OZ Listings with your other fundraising efforts for best results." />
            <FAQItem question="How long does it take to raise capital?" answer="Most sponsors start receiving investor inquiries within 7-14 days of listing. Time to close depends on your project, but average fundraising timelines are 3-6 months for full capitalization. Elite tier sponsors often see faster results due to enhanced exposure." />
            <FAQItem question="What do I need to get started?" answer="You'll need basic project information (location, asset type, capital needed), a project description, photos (we can help with professional photography), and your offering documents. Our team will guide you through the setup process." />
            <FAQItem question="Can I try before I buy?" answer="We offer a free consultation and demo for all prospective sponsors. Schedule a call with our team to see the platform in action and discuss which tier is right for your project." />
            <FAQItem question="How do I claim the Founding Member discount?" answer="Simply select any plan and the founding member discount will be automatically applied at checkout if spots are still available. The discount counter on this page updates in real-time." />
            <FAQItem question="Do you offer custom Enterprise packages?" answer="Yes! If you have 5+ projects or unique requirements, contact our team for custom Enterprise pricing and features. We can create a tailored package that fits your portfolio needs." />
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden py-8 lg:py-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        {/* Geometric pattern background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
                linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
                linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
                linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5)
              `,
              backgroundSize: '80px 140px',
              backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
            }}></div>
          </div>
          {/* Radial gradient accents */}
          <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-radial from-[#1e88e5]/10 via-transparent to-transparent dark:from-[#1e88e5]/5"></div>
          <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-radial from-[#1565c0]/8 via-transparent to-transparent dark:from-[#1565c0]/4"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1/3 bg-gradient-radial from-slate-100/25 via-transparent to-transparent dark:from-slate-800/15"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 dark:text-white mb-6 sm:mb-8 leading-tight">
              Ready to Connect With <span className="font-semibold text-[#1e88e5]">Investors</span>?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto font-light">
              Join the nation's premier Opportunity Zone marketplace and get your project in front of thousands of qualified investors.
            </p>
            
            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 max-w-5xl mx-auto">
              {[
                 { step: "1", title: "Choose Your Plan", desc: "Select the tier that fits your capital needs.", time: "2 min" },
                 { step: "2", title: "Submit Project", desc: "Provide details and upload your documents.", time: "24-48 hrs" },
                 { step: "3", title: "Start Raising", desc: "Receive inquiries from qualified investors.", time: "7-14 days" }
              ].map((s, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                  <div className="mx-auto mb-4 sm:mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#1e88e5]/10 text-[#1e88e5] font-bold text-lg group-hover:bg-[#1e88e5] group-hover:text-white transition-colors">
                    {s.step}
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">{s.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">{s.desc}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{s.time}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.button 
                onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 xl:py-5 rounded-full font-semibold text-sm sm:text-base lg:text-lg xl:text-xl shadow-xl transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 ml-2 sm:ml-3 inline-block group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <Link href="/schedule-a-call" className="rounded-full border-2 border-gray-300 bg-transparent px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 xl:py-5 text-sm sm:text-base lg:text-lg xl:text-xl font-semibold text-gray-700 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600">
                Talk to an Expert
              </Link>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* Sticky Bottom Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 px-4 py-4 shadow-2xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500"></div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              <span className="font-bold text-red-500">12 Spots Left:</span> Founding Member Discount (Save 20%) ends soon.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
              className="rounded-md bg-[#1e88e5] px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-[#1565c0]"
            >
              Claim Discount
            </button>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
