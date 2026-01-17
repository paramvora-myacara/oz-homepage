'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Star,
  Trophy,
  Users,
  Video,
  Mail,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Zap,
  X
} from 'lucide-react';
import Link from 'next/link';
import { trackUserEvent } from '../../../lib/analytics/trackUserEvent';

// --- Helper Components ---

const FadeIn = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

// --- Pricing Card ---

const PricingCard = ({ tier, isAnnual, onSubscribe, loading, hasPromoCode }) => {
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

  const handleSubscribe = () => {
    onSubscribe(name, isAnnual);
  };

  return (
    <div className={`relative flex flex-col rounded-2xl border transition-all duration-300 h-full ${highlight ? 'border-[#1e88e5] bg-white shadow-xl scale-105 z-10 dark:bg-gray-800 dark:border-[#1e88e5]' : 'border-gray-200 bg-white hover:shadow-lg dark:bg-gray-900 dark:border-gray-700'}`}>
      {highlight && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-max rounded-full bg-gradient-to-r from-[#1e88e5] to-[#1565c0] px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
          Most Popular
        </div>
      )}
      {hasPromoCode && (
        <div className="absolute -top-3 right-4 rounded-full bg-green-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
          30-Day Trial
        </div>
      )}

      <div className="p-6 md:p-8">
        <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{name}</h3>
        <p className="mt-1 text-sm md:text-base text-gray-500 dark:text-gray-400 line-clamp-1">{description}</p>

        <div className="mt-4">
          <div className="flex items-baseline">
            <span className="text-base md:text-lg text-gray-400 line-through decoration-red-500 decoration-2 opacity-70">${originalPrice}</span>
            <span className="ml-2 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">${price}</span>
            <span className="ml-1 text-sm md:text-base text-gray-500 dark:text-gray-400">/{isAnnual ? 'yr' : 'mo'}</span>
          </div>
          {isAnnual && savings && (
            <span className="mt-2 inline-block rounded-md bg-green-100 px-2 py-1 text-[10px] md:text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Save ${savings}/year
            </span>
          )}
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className={`mt-6 w-full rounded-lg px-4 py-2.5 md:px-6 md:py-3 text-center text-sm md:text-base font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${highlight ? 'bg-[#1e88e5] text-white hover:bg-[#1565c0]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'}`}
        >
          {loading ? 'Processing...' : cta}
        </button>
      </div>

      <div className="flex-1 bg-gray-50 px-6 py-4 md:px-8 md:py-6 dark:bg-gray-800/50 rounded-b-2xl">
        <p className="mb-3 md:mb-4 text-xs md:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">What&apos;s included</p>
        <ul className="space-y-2 md:space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
              <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// --- Comparison Table ---

const ComparisonTable = () => {
  const features = [
    {
      category: "Listing & Exposure", items: [
        { name: "Premium listing page", std: true, pro: true, elite: true },
        { name: "Photo gallery", std: "25 images", pro: "50 images", elite: "Unlimited" },
        { name: "Featured search placement", std: false, pro: true, elite: true },
        { name: "Homepage banner", std: false, pro: false, elite: true },
      ]
    },
    {
      category: "Investor Reach", items: [
        { name: "Investor network access", std: true, pro: true, elite: true },
        { name: "Newsletter inclusion", std: "Occasional", pro: "Monthly", elite: "Every issue" },
        { name: "Social media promotion", std: false, pro: "2x/quarter", elite: "2x/month" },
      ]
    },
    {
      category: "Support & Services", items: [
        { name: "Email support", std: "24-hour", pro: "4-hour", elite: "1-hour" },
        { name: "Account manager", std: false, pro: "Check-ins", elite: "Dedicated" },
        { name: "Strategy sessions", std: false, pro: false, elite: "Quarterly" },
        { name: "Performance reviews", std: false, pro: "Monthly", elite: "Weekly" },
      ]
    },
    {
      category: "Analytics & Tools", items: [
        { name: "Basic analytics", std: true, pro: true, elite: true },
        { name: "Investor engagement tracking", std: false, pro: true, elite: "Advanced" },
        { name: "Market insights", std: false, pro: "Quarterly", elite: "Monthly" },
        { name: "Competitive benchmarking", std: false, pro: false, elite: true },
      ]
    }
  ];

  const renderCell = (val) => {
    if (val === true) return <Check className="mx-auto h-5 w-5 text-green-500" />;
    if (val === false) return <span className="text-gray-300 text-xl">—</span>;
    return <span className="text-base font-medium text-gray-900 dark:text-white">{val}</span>;
  };

  return (
    <div className="relative w-full px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="font-brand-black text-3xl text-gray-900 dark:text-white">Compare All Plans</h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm dark:bg-gray-900/80 dark:border-gray-800">
            <table className="w-full min-w-[800px] table-fixed text-left">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="w-1/3 p-5 md:p-6 text-base font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">Feature</th>
                  <th className="w-1/5 p-5 md:p-6 text-center text-lg font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">Standard</th>
                  <th className="w-1/5 p-5 md:p-6 text-center text-lg font-bold text-[#1e88e5] dark:text-[#1e88e5] bg-gray-50 dark:bg-gray-800">Pro ⭐</th>
                  <th className="w-1/5 p-5 md:p-6 text-center text-lg font-bold text-amber-600 dark:text-amber-400 bg-gray-50 dark:bg-gray-800">Elite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {features.map((section, i) => (
                  <React.Fragment key={i}>
                    <tr key={`category-${i}`} className="bg-gray-50/50 dark:bg-gray-800/30">
                      <td colSpan="4" className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        {section.category}
                      </td>
                    </tr>
                    {section.items.map((item, j) => (
                      <tr key={`${i}-${j}`} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-100 dark:border-gray-800">
                        <td className="px-6 py-4 text-base font-medium text-gray-800 dark:text-gray-200">{item.name}</td>
                        <td className="px-6 py-4 text-center">{renderCell(item.std)}</td>
                        <td className="px-6 py-4 text-center bg-[#1e88e5]/5 dark:bg-[#1e88e5]/10">{renderCell(item.pro)}</td>
                        <td className="px-6 py-4 text-center bg-amber-50/30 dark:bg-amber-900/10">{renderCell(item.elite)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Add-on Card ---

const AddOnCard = ({ icon: Icon, title, price, prevPrice, features, note }) => (
  <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-8 transition-all hover:border-[#1e88e5] hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/80 dark:hover:border-[#1e88e5] h-full">
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
          <li key={i} className="flex items-start text-base text-gray-600 dark:text-gray-400">
            <Check className="mr-2 h-4 w-4 shrink-0 text-green-500" />
            {feat}
          </li>
        ))}
      </ul>
    </div>
    {note && <div className="mt-6 rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">{note}</div>}
  </div>
);

// --- Promo Code Component ---

const PromoCodeSection = ({ promoCode, setPromoCode, isValidated, setIsValidated, validationMessage, setValidationMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const VALID_PROMO_CODE = "TODD-OZL-2026";

  const handleApply = () => {
    if (!promoCode) {
      setValidationMessage("Please enter a promo code");
      return;
    }

    setIsValidating(true);
    setValidationMessage("");

    // Simulate validation (immediate for exact match)
    setTimeout(() => {
      if (promoCode === VALID_PROMO_CODE) {
        setIsValidated(true);
        setValidationMessage("✓ Promo code valid - 30-day trial will be applied");
        setIsValidating(false);
        // Collapse after 2.5 seconds
        setTimeout(() => {
          setIsExpanded(false);
        }, 2500);
      } else {
        setIsValidated(false);
        setValidationMessage("✗ Invalid promo code");
        setIsValidating(false);
      }
    }, 300);
  };

  const handleRemove = () => {
    setPromoCode("");
    setIsValidated(false);
    setValidationMessage("");
    setIsExpanded(false);
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setPromoCode(newCode);
    // Clear validation if code changes
    if (isValidated) {
      setIsValidated(false);
      setValidationMessage("");
    }
  };

  return (
    <div className="mb-6">
      {!isValidated ? (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-[#1e88e5] hover:text-[#1565c0] transition-colors"
            aria-expanded={isExpanded}
          >
            Have a promo code?
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={handleCodeChange}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1e88e5] focus:border-transparent dark:bg-gray-900 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleApply();
                      }
                    }}
                  />
                  <button
                    onClick={handleApply}
                    disabled={isValidating}
                    className="px-6 py-2 bg-[#1e88e5] text-white rounded-lg font-semibold hover:bg-[#1565c0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isValidating ? "Checking..." : "Apply"}
                  </button>
                </div>
                {validationMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 text-sm ${validationMessage.startsWith("✓")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                      }`}
                  >
                    {validationMessage}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Promo code active - 30-day trial will be included
            </span>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors"
            aria-label="Remove promo code"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// --- FAQ Item ---

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
            <p className="pb-6 text-lg text-gray-600 dark:text-gray-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Component ---

export default function PricingOverview() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const handleSubscribe = async (planName, isAnnual) => {
    trackUserEvent("clicked_pricing_cta", { plan: planName, billing: isAnnual ? 'annual' : 'monthly' });
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName,
          isAnnual,
          promoCode: isValidated ? promoCode : null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        "Premium Analytics & Insights"
      ]
    }
  ];

  return (
    <>
      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 w-full px-4 py-16 md:py-24 md:px-8 lg:px-12">
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h2 className="font-brand-black text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white">Choose Your Plan</h2>
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
          </motion.div>

          <div className="flex justify-center mb-6">
            <PromoCodeSection
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              isValidated={isValidated}
              setIsValidated={setIsValidated}
              validationMessage={validationMessage}
              setValidationMessage={setValidationMessage}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
            {tiers.map((tier, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <PricingCard
                  key={tier.name}
                  tier={tier}
                  isAnnual={isAnnual}
                  onSubscribe={handleSubscribe}
                  loading={loading}
                  hasPromoCode={isValidated}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <ComparisonTable />

      {/* Add-Ons Section */}
      <section className="relative z-10 w-full px-4 py-12 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-brand-black text-3xl text-gray-900 dark:text-white">Premium Services & Add-Ons</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Maximize your exposure with these high-impact services.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <FadeIn delay={0}>
              <AddOnCard
                icon={Video}
                title="Live Pitch Webinar"
                prevPrice="2,500"
                price="1,995"
                features={["30-min live presentation", "Email to 60K+ subscribers", "Lead capture & analytics", "Recorded for future use"]}
                note="Launch Pricing - First 10 Only"
              />
            </FadeIn>
            <FadeIn delay={0.1}>
              <AddOnCard
                icon={Mail}
                title="VIP Email Blast"
                prevPrice="5,000"
                price="3,995"
                features={["Email to 2,500+ Family Offices", "Exclusive featuring (1 per blast)", "Professional copywriting", "Detailed engagement report"]}
                note="Only ONE per month available"
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <AddOnCard
                icon={LinkIcon}
                title="CRM Integration"
                price="395"
                features={["Salesforce/HubSpot integration", "Real-time lead sync", "Custom API endpoints", "Dedicated tech support"]}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 w-full px-4 py-12 md:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-brand-black mb-12 text-center text-3xl text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-2">
            <FAQItem question="Can I switch plans later?" answer="Absolutely! You can upgrade at any time. Upgrades are prorated and take effect immediately." />
            <FAQItem question="What's included in the Founding Member discount?" answer="The first 25 sponsors get 20% off their first year on any plan. This discount applies to both monthly and annual billing. After year one, you'll still receive a 15% 'founding member' discount for as long as you remain a customer." />
            <FAQItem question="Can I pay annually to save more?" answer="Yes! Annual plans save you 2 months (16.7% discount). With the Founding Member discount stacked on top, you're saving over 35% vs. regular monthly pricing." />
            <FAQItem question="Do you offer multi-project discounts?" answer="Yes! Add additional projects at 25% off the same tier. For example, if you have 5 Pro listings, you pay full price for one and get 25% off the other four. This can save you $14,340/year or more." />
            <FAQItem question="How quickly can I get my listing live?" answer="Standard and Pro listings typically go live within 24-48 hours after you submit your project information. Elite tier includes white-glove setup assistance and can be live within 24 hours." />
            <FAQItem question="Is my information secure?" answer="Yes. All sensitive documents are stored in our secure deal vault behind confidentiality agreements. Investors must sign an NDA before accessing your detailed financials and documents." />
            <FAQItem question="Can I see who's viewing my listing?" answer="Pro and Elite tiers include investor engagement tracking. You'll see which investors viewed your listing, how long they spent, which documents they accessed, and their contact information (when they opt in)." />
            <FAQItem question="What do I need to get started?" answer="You'll need basic project information (location, asset type, capital needed), a project description, photos (we can help with professional photography), and your offering documents. Our team will guide you through the setup process." />
            <FAQItem question="Can I try before I buy?" answer="We offer a free consultation and demo for all prospective sponsors. Schedule a call with our team to see the platform in action and discuss which tier is right for your project." />
            <FAQItem question="How do I claim the Founding Member discount?" answer="Simply select any plan and the founding member discount will be automatically applied at checkout if spots are still available. The discount counter on this page updates in real-time." />
            <FAQItem question="Do you offer custom Enterprise packages?" answer="Yes! If you have 5+ projects or unique requirements, contact our team for custom Enterprise pricing and features. We can create a tailored package that fits your portfolio needs." />
          </div>
        </div>
      </section>
    </>
  );
}
