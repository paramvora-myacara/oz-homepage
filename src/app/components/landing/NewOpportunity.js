'use client';
import { motion } from 'framer-motion';

export default function NewOpportunity() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-[40px] font-extrabold text-navy mb-16"
                >
                    Real Estate Investing Has Evolved.
                </motion.h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left Column: Old vs New */}
                    <div className="space-y-12">

                        {/* The Old Way */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative pl-8 border-l-4 border-[#FAE6E6]"
                        >
                            <h3 className="text-2xl font-bold text-navy/50 mb-4">The Old Way</h3>
                            <p className="text-lg text-navy/70 leading-relaxed">
                                Relying on fragmented spreadsheets, expensive consultants, and hoping the tax code works in your favor.
                            </p>
                        </motion.div>

                        {/* The OZ Listings Way */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative pl-8 border-l-4 border-primary"
                        >
                            <h3 className="text-2xl font-bold text-primary mb-4">The OZ Listings Way</h3>
                            <p className="text-lg text-navy leading-relaxed">
                                Precision. We turn &quot;Capital Gains&quot; into a strategic asset, allowing you to compound wealth tax-free for a decade.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Column: Abstract Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-[#F8F9FA] rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-center gap-8"
                    >
                        {/* Tax Bill */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-24 h-24 bg-[#FAE6E6] rounded-lg flex items-center justify-center text-[#C62828] text-4xl font-bold">
                                $
                            </div>
                            <span className="text-xs font-bold text-[#C62828] tracking-widest uppercase">Tax Bill</span>
                        </div>

                        {/* Arrow */}
                        <div className="text-navy">
                            <svg width="40" height="24" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M0 12H38M28 2L38 12L28 22" />
                            </svg>
                        </div>

                        {/* Growth Asset */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-24 h-32 bg-primary rounded-lg relative overflow-hidden flex items-center justify-center">
                                <div className="absolute top-3 left-3 w-4 h-4 bg-white/30 rounded-sm"></div>
                                <div className="absolute top-3 right-3 w-4 h-4 bg-white/30 rounded-sm"></div>
                                <div className="absolute top-10 left-3 w-4 h-4 bg-white/30 rounded-sm"></div>
                                <div className="absolute top-10 right-3 w-4 h-4 bg-white/30 rounded-sm"></div>

                                <svg width="40" height="40" viewBox="0 0 24 24" fill="white" className="opacity-90">
                                    <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
                                </svg>
                            </div>
                            <span className="text-xs font-bold text-primary tracking-widest uppercase">Growth Asset</span>
                        </div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
}
