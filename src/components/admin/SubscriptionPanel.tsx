'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Check,
    Star,
    Trophy,
    Users,
    Loader2,
    AlertCircle
} from 'lucide-react';

const FREE_PERIOD_END_DATE = new Date('2026-06-01T06:59:59Z');
const FREE_PERIOD_END_FORMATTED = 'June 1st, 2026';
const PLAN_TIERS: Record<string, number> = { 'Standard': 1, 'Pro': 2, 'Elite': 3 };

interface Tier {
    name: string;
    originalPriceMonthly: number;
    priceMonthly: number;
    originalPriceAnnual: number;
    priceAnnual: number;
    savings: string;
    description: string;
    icon: any;
    color: string;
    highlight: boolean;
    features: string[];
}

const tiers: Tier[] = [
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
        features: [
            "Premium Listing Page",
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
        color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        highlight: true,
        features: [
            "Everything in Standard, plus:",
            "Access to Qualified Investor Network",
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
        description: "For Elite Sponsors",
        icon: Trophy,
        color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
        highlight: false,
        features: [
            "Everything in Pro, plus:",
            "Homepage Banner Rotation",
            "Top Projects Carousel",
            "Dedicated Account Manager",
            "Premium Analytics & Insights"
        ]
    }
];

const PricingCard = ({ tier, isAnnual, onUpgrade, loading, currentPlanName, isFreePeriodActive }: any) => {
    const {
        name,
        priceMonthly,
        description,
        features,
        highlight,
        color,
        icon: Icon
    } = tier;

    const price = priceMonthly;
    const originalPrice = tier.originalPriceMonthly;
    const isCurrentPlan = name === currentPlanName;
    const isUpgrade = PLAN_TIERS[name] > (PLAN_TIERS[currentPlanName] || 0);

    return (
        <div className={`relative flex flex-col rounded-2xl border transition-all duration-300 h-full ${isCurrentPlan
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
            : highlight
                ? 'border-blue-500 bg-white shadow-xl scale-105 z-10 dark:bg-gray-800 dark:border-blue-500'
                : 'border-gray-200 bg-white hover:shadow-lg dark:bg-gray-900 dark:border-gray-700'
            }`}>
            {isCurrentPlan && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-max rounded-full bg-green-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                    Current Plan
                </div>
            )}
            {highlight && !isCurrentPlan && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-max rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                    Most Popular
                </div>
            )}

            <div className="p-6">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h3>
                <p className="mt-1 text-base text-gray-500 dark:text-gray-400 line-clamp-1">{description}</p>

                <div className="mt-4">
                    {isFreePeriodActive ? (
                        <>
                            <div className="flex items-baseline">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$0</span>
                                <span className="ml-1 text-base text-gray-500 dark:text-gray-400">/mo</span>
                            </div>
                            <p className="mt-1 text-sm font-semibold text-green-600 dark:text-green-400">
                                Free until {FREE_PERIOD_END_FORMATTED}
                            </p>
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs uppercase font-bold text-gray-400">Then:</p>
                                <div className="flex items-baseline">
                                    <span className="text-base text-gray-400 line-through">${originalPrice}</span>
                                    <span className="ml-2 text-2xl font-bold text-gray-700 dark:text-gray-300">${price}</span>
                                    <span className="ml-1 text-xs text-gray-500">/mo</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-baseline">
                                <span className="text-base text-gray-400 line-through">${originalPrice}</span>
                                <span className="ml-2 text-4xl font-extrabold text-gray-900 dark:text-white">${price}</span>
                                <span className="ml-1 text-base text-gray-500 dark:text-gray-400">/mo</span>
                            </div>
                        </>
                    )}
                </div>

                <button
                    onClick={() => onUpgrade(name)}
                    disabled={loading || isCurrentPlan || !isUpgrade}
                    className={`mt-6 w-full rounded-lg px-4 py-3 text-center text-base font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isCurrentPlan
                        ? 'bg-green-500 text-white cursor-default'
                        : isUpgrade
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                        }`}
                >
                    {loading ? 'Processing...' : isCurrentPlan ? 'Current Plan' : isUpgrade ? 'Upgrade to ' + name : 'Not Available'}
                </button>
            </div>

            <div className="flex-1 bg-gray-50 px-6 py-4 dark:bg-gray-800/50 rounded-b-2xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">What&apos;s included</p>
                <ul className="space-y-2">
                    {features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start text-base">
                            <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default function SubscriptionPanel({ userEmail }: { userEmail: string }) {
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSubscription = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/subscription/current?email=${encodeURIComponent(userEmail)}`);
            const data = await response.json();

            if (data.hasSubscription) {
                setSubscription(data.subscription);
            } else {
                setError('No active subscription found');
            }
        } catch (err) {
            setError('Failed to load subscription');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userEmail) fetchSubscription();
    }, [userEmail]);

    const handleUpgrade = async (planName: string) => {
        if (!subscription) return;

        try {
            setUpgrading(true);
            const response = await fetch('/api/stripe/change-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscriptionId: subscription.stripeSubscriptionId,
                    newPlanName: planName,
                    isAnnual: false
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to upgrade');

            await fetchSubscription();
            alert('Subscription upgraded successfully!');
        } catch (error: any) {
            alert(error.message || 'Failed to upgrade subscription.');
        } finally {
            setUpgrading(false);
        }
    };

    if (loading) return (
        <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500">Loading subscription...</p>
        </div>
    );

    if (error && !subscription) return (
        <div className="py-12 text-center max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Subscription Not Found</h3>
            <p className="text-base text-gray-500 mb-6">{error}</p>
            <a href="https://ozlistings.com/pricing" target="_blank" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm text-base font-medium">
                View Pricing Plans
            </a>
        </div>
    );

    const isFreePeriodActive = subscription?.hasPromoCode && new Date() < FREE_PERIOD_END_DATE;
    const availableTiers = tiers.filter(tier => {
        const tierLevel = PLAN_TIERS[tier.name];
        const currentTierLevel = PLAN_TIERS[subscription?.planName] || 0;
        return tierLevel >= currentTierLevel;
    });

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold mb-2">Upgrade Your Plan</h3>
                <p className="text-base text-gray-500 mb-8">Unlock more features and reach more investors.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {availableTiers.map((tier) => (
                        <PricingCard
                            key={tier.name}
                            tier={tier}
                            isAnnual={false}
                            onUpgrade={handleUpgrade}
                            loading={upgrading}
                            currentPlanName={subscription?.planName}
                            isFreePeriodActive={isFreePeriodActive}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
