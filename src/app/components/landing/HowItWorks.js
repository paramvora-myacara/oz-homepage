'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
        desc: "Engage directly with sponsors and deploy capital effectively."
    }
];

const developerSteps = [
    {
        icon: Building2,
        title: "Project Planning",
        desc: "Identify an OZ-qualified project or fund structure. Your project is already planned and ready."
    },
    {
        icon: BarChart3,
        title: "List & Promote",
        desc: "We create state-of-the-art loan packages and deal vaults to put your best foot forward."
    },
    {
        icon: Users,
        title: "Connect",
        desc: "Gain visibility with family offices and HNI investors around the country."
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
        <section className="py-24 bg-[#F8F9FA] relative overflow-hidden">
            {/* Grid Background */}
            <div
                className="absolute inset-0 z-0 opacity-[0.6]"
                style={{
                    backgroundImage: `linear-gradient(#D1D5DB 1px, transparent 1px), linear-gradient(90deg, #D1D5DB 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
                }}
            />
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">

                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                            How it Works
                        </h2>
                        <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
                    </motion.div>
                    <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
                        A unified ecosystem connecting tax-advantaged capital with transformative projects using state-of-the-art design and security practises.
                    </p>
                </div>

                <div className="relative">
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-center relative">

                        {/* INVESTOR SIDE (Left Column) */}
                        <div className="lg:col-span-4 flex flex-col gap-6 items-end">
                            <h3 className="text-xl font-bold text-blue-600 uppercase tracking-widest mb-4 w-full text-right hidden lg:block">For Investors</h3>
                            <h3 className="text-xl font-bold text-blue-600 uppercase tracking-widest mb-4 lg:hidden">Investor Path</h3>
                            {investorSteps.map((step, idx) => ({ ...step, type: 'investor' })).map((step, idx) => (
                                <motion.div
                                    key={`investor-${idx}-${activeStep === 3 ? 'all' : 'single'}`}
                                    variants={cardVariant(activeStep === idx || activeStep === 3)}
                                    animate="animate"
                                    className="relative flex items-center p-6 bg-white rounded-xl border-2 border-slate-200 w-full max-w-[350px] text-right z-10 gap-4 flex-row-reverse lg:flex-row"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                                        <p className="text-sm text-slate-500 leading-snug">{step.desc}</p>
                                    </div>
                                    <div className={`p-3 rounded-full flex-shrink-0 ${activeStep === idx ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <step.icon size={24} />
                                    </div>
                                    
                                    {/* Connection Lines (Rightwards to Center) */}
                                    <div className={`absolute left-full top-1/2 h-[2px] bg-slate-200 hidden lg:block z-0 transform -translate-y-1/2 origin-left
                                        ${idx === 0 ? 'w-48 rotate-[30deg] mt-2' : idx === 2 ? 'w-48 -rotate-[30deg] -mt-2' : 'w-24'}
                                    `} />
                                    {(activeStep === idx || activeStep === 3) && (
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: idx === 0 || idx === 2 ? '12rem' : '6rem', opacity: 1 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={`absolute left-full top-1/2 h-[2px] bg-blue-500 hidden lg:block z-10 transform -translate-y-1/2 shadow-[0_0_8px_rgba(59,130,246,0.8)] origin-left
                                                ${idx === 0 ? 'rotate-[30deg] mt-2' : idx === 2 ? '-rotate-[30deg] -mt-2' : ''}
                                            `}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* CENTER HUB */}
                        <div className="lg:col-span-2 flex flex-col items-center justify-center relative py-8 lg:py-0">
                            {/* Vertical Line through center */}
                            <div className="absolute top-0 bottom-0 w-1 bg-gray-100 -z-10 hidden lg:block" />

                            <motion.div
                                variants={centerVariant(activeStep === 3)}
                                animate="animate"
                                className="w-48 h-48 rounded-full flex flex-col items-center justify-center bg-navy border-8 border-white ring-4 ring-slate-100 shadow-2xl z-20 relative overflow-hidden"
                            >
                                <div className="relative w-32 h-16">
                                    <Image 
                                        src="/OZListings-Dark.png" 
                                        alt="OZL" 
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* DEVELOPER SIDE (Right Column) */}
                        <div className="lg:col-span-4 flex flex-col gap-6 items-start">
                            <h3 className="text-xl font-bold text-orange-600 uppercase tracking-widest mb-4 w-full text-left hidden lg:block">For Developers</h3>
                            <h3 className="text-xl font-bold text-orange-600 uppercase tracking-widest mb-4 lg:hidden">Sponsor Path</h3>
                            {developerSteps.map((step, idx) => ({ ...step, type: 'developer' })).map((step, idx) => (
                                <motion.div
                                    key={`developer-${idx}-${activeStep === 3 ? 'all' : 'single'}`}
                                    variants={cardVariant(activeStep === idx || activeStep === 3)}
                                    animate="animate"
                                    className="relative flex items-center p-6 bg-white rounded-xl border-2 border-slate-200 w-full max-w-md text-left z-10 gap-4"
                                >
                                    <div className={`p-3 rounded-full flex-shrink-0 ${activeStep === idx ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <step.icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                                        <p className="text-sm text-slate-500 leading-snug">{step.desc}</p>
                                    </div>

                                    {/* Connection Lines (Leftwards to Center) */}
                                    <div className={`absolute right-full top-1/2 h-[2px] bg-slate-200 hidden lg:block z-0 transform -translate-y-1/2 origin-right
                                        ${idx === 0 ? 'w-48 -rotate-[30deg] mt-2' : idx === 2 ? 'w-48 rotate-[30deg] -mt-2' : 'w-24'}
                                    `} />
                                    {(activeStep === idx || activeStep === 3) && (
                                        <motion.div
                                            initial={{ scaleX: 0, opacity: 0 }}
                                            animate={{ scaleX: 1, opacity: 1 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            style={{ originX: 1 }}
                                            className={`absolute right-full top-1/2 h-[2px] bg-orange-500 hidden lg:block z-10 transform -translate-y-1/2 shadow-[0_0_8px_rgba(249,115,22,0.8)] origin-right
                                                ${idx === 0 ? '-rotate-[30deg] mt-2 w-48' : idx === 2 ? 'rotate-[30deg] -mt-2 w-48' : 'w-24'}
                                            `}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
