'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import OZMapVisualization from '../OZMapVisualization';

export default function Hero() {
    return (
        <section className="bg-[#F8F9FA] relative min-h-screen flex flex-col justify-center pt-[70px] lg:pt-[90px] overflow-hidden">
            {/* Grid Background */}
            <div
                className="absolute inset-0 z-0 opacity-[0.6]"
                style={{
                    backgroundImage: `linear-gradient(#D1D5DB 1px, transparent 1px), linear-gradient(90deg, #D1D5DB 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse at center, black, transparent 60%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 60%)'
                }}
            />

            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

                {/* Left Content */}
                <div className="lg:col-span-6 xl:col-span-5 flex flex-col max-w-xl md:max-w-4xl lg:max-w-xl items-center lg:items-start text-center lg:text-left mx-auto lg:mx-0 mt-12 lg:mt-0">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[40px] sm:text-[56px] font-extrabold leading-[1.1] tracking-tight text-navy mb-6"
                    >
                        A Smarter Way to Evaluate <span className="text-primary">Opportunity Zone Investments</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg sm:text-xl text-navy/80 mb-10 leading-relaxed font-normal"
                    >
                        OZ Listings is the premier marketplace for sourcing, accessing, and evaluating investment opportunities for the biggest tax break in US taxing history.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-10"
                    >
                        <Link
                            href="/listings"
                            className="inline-flex h-[60px] px-8 items-center justify-center gap-2 rounded bg-primary text-white font-semibold text-lg hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                        >
                            Active Deals
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </motion.div>

                    {/* FUD Reducers */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap gap-8 mb-12 justify-center lg:justify-start"
                    >
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1E88E5" strokeWidth="2">
                                <path d="M5 10L8 13L15 6" />
                            </svg>
                            <span className="text-navy font-medium">One Click Sign Up</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1E88E5" strokeWidth="2">
                                <path d="M5 10L8 13L15 6" />
                            </svg>
                            <span className="text-navy font-medium">Vetted Sponsors</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1E88E5" strokeWidth="2">
                                <path d="M5 10L8 13L15 6" />
                            </svg>
                            <span className="text-navy font-medium">Free Tools</span>
                        </div>
                    </motion.div>

                    {/* Social Proof 1 - Deal Volume */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className=""
                    >
                        <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-4">
                            Used by investors to deploy over $100M in deal volume
                        </p>
                    </motion.div>

                    {/* Social Proof 2 - As Seen On (HIDDEN) */}
                    {/* 
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-4">
                            As seen on
                        </p>
                        <div className="flex gap-8 opacity-40 grayscale items-center">
                            <span className="text-xl font-bold font-serif text-navy">NYTimes</span>
                            <span className="text-xl font-bold font-sans tracking-tighter text-navy">TechCrunch</span>
                            <span className="text-xl font-bold font-mono text-navy">WIRED</span>
                        </div>
                    </motion.div>
                    */}
                </div>

                {/* Right Content - Map */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-6 xl:col-span-7 relative h-[400px] lg:h-[800px] w-full lg:-mr-20 mb-24 lg:mb-0"
                >
                    <div className="absolute inset-0">
                        <OZMapVisualization />
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
