'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    Search,
    Users,
    Building2,
    BarChart3,
    Handshake,
    CheckCircle2
} from 'lucide-react';

const investorSteps = [
    {
        icon: TrendingUp,
        title: "Capital Gain Event",
        desc: "Realize gains from stock, property, or business sale."
    },
    {
        icon: Search,
        title: "Discover & Analyze",
        desc: "Browse vetted OZ projects and calculate tax savings."
    },
    {
        icon: Handshake,
        title: "Connect",
        desc: "Engage directly with sponsors to finalize terms."
    }
];

const developerSteps = [
    {
        icon: Building2,
        title: "Project Planning",
        desc: "Identify an OZ-qualified project or fund structure."
    },
    {
        icon: BarChart3,
        title: "List & Promote",
        desc: "Showcase propery/fund to a nationwide network."
    },
    {
        icon: Users,
        title: "Connect",
        desc: "Network with family offices and accredited investors."
    }
];

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);
    const totalSteps = 4; // 0, 1, 2, 3 (Center)

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % totalSteps);
        }, 2500); // Change step every 2.5 seconds
        return () => clearInterval(timer);
    }, [totalSteps]);

    // Framer Motion variants for highlights
    const cardVariant = (isActive) => ({
        animate: {
            scale: isActive ? 1.05 : 1,
            borderColor: isActive ? '#3B82F6' : 'rgba(229, 231, 235, 1)', // blue-500 vs gray-200
            backgroundColor: isActive ? '#EFF6FF' : '#FFFFFF', // blue-50 vs white
            boxShadow: isActive ? '0 10px 15px -3px rgba(59, 130, 246, 0.2)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: { duration: 0.5 }
        }
    });

    const centerVariant = (isActive) => ({
        animate: {
            scale: isActive ? 1.1 : 1,
            backgroundColor: isActive ? '#1E3A8A' : '#1E293B', // navy vs slate-800
            boxShadow: isActive ? '0 20px 25px -5px rgba(30, 58, 138, 0.4)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: { duration: 0.5 }
        }
    });

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8">

                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                            From Capital Gain to Closed Deal
                        </h2>
                        <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
                    </motion.div>
                    <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
                        A unified ecosystem connecting tax-advantaged capital with transformative projects.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Lines (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 -z-10" />

                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 items-center">

                        {/* INVESTOR SIDE (Left) */}
                        <div className="lg:col-span-3 flex flex-col gap-6 lg:flex-row lg:gap-4 justify-end">
                            {investorSteps.map((step, idx) => (
                                <motion.div
                                    key={`investor-${idx}`}
                                    variants={cardVariant(activeStep === idx)}
                                    animate="animate"
                                    className="relative flex flex-col items-center p-6 bg-white rounded-xl border-2 border-slate-200 min-w-[200px] text-center z-10"
                                >
                                    <div className={`p-3 rounded-full mb-4 ${activeStep === idx ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <step.icon size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-sm text-slate-500 leading-snug">{step.desc}</p>

                                    {/* Label for Mobile Context */}
                                    {idx === 0 && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-green-200">
                                            Investor Path
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* CENTER HUB */}
                        <div className="lg:col-span-1 flex justify-center z-20 my-8 lg:my-0">
                            <motion.div
                                variants={centerVariant(activeStep === 3)}
                                animate="animate"
                                className="w-40 h-40 rounded-full flex flex-col items-center justify-center text-white border-4 border-white ring-4 ring-slate-100/50 shadow-xl"
                            >
                                <CheckCircle2 size={40} className="mb-2" />
                                <span className="font-bold text-center text-lg leading-none">Deal Closed</span>
                                <span className="text-xs text-blue-200 mt-1 uppercase tracking-wider">OZ Listings</span>
                            </motion.div>
                        </div>

                        {/* DEVELOPER SIDE (Right) */}
                        <div className="lg:col-span-3 flex flex-col gap-6 lg:flex-row-reverse lg:gap-4 justify-end">
                            {developerSteps.map((step, idx) => (
                                <motion.div
                                    key={`developer-${idx}`}
                                    variants={cardVariant(activeStep === idx)}
                                    animate="animate"
                                    className="relative flex flex-col items-center p-6 bg-white rounded-xl border-2 border-slate-200 min-w-[200px] text-center z-10"
                                >
                                    <div className={`p-3 rounded-full mb-4 ${activeStep === idx ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <step.icon size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-sm text-slate-500 leading-snug">{step.desc}</p>

                                    {/* Label for Mobile Context */}
                                    {idx === 0 && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-orange-200">
                                            Sponsor Path
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                    </div>

                    {/* Mobile Labels (if grid stacks vertically, these headers help separate sections) */}
                    <div className="lg:hidden flex flex-col items-center justify-center gap-2 mt-8 opacity-50">
                        <p className="text-xs uppercase tracking-widest text-slate-400">Converging at OZ Listings</p>
                    </div>

                </div>
            </div>
        </section>
    );
}
