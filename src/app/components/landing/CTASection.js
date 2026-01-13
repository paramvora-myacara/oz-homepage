'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTASection() {
    const ctas = [
        { label: "For Investors", href: "/invest", primary: false },
        { label: "Check Tax Savings", href: "/tax-calculator", primary: false },
        { label: "See OZ Listings", href: "/listings", primary: true },
        { label: "Join the Community", href: "/community", primary: false },
        { label: "Speak to the Team", href: "/schedule-a-call", primary: false },
    ];

    return (
        <section className="pt-24 pb-48 bg-white">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
                        Take the Next Step in Your Opportunity Zone Journey
                    </h2>
                    <p className="text-lg text-navy/70 max-w-2xl mx-auto">
                        Whether you're looking to invest, promote a project, or learn more, we have the tools you need.
                    </p>
                </motion.div>

                <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap justify-center items-center gap-4 sm:gap-6 lg:gap-8">
                    {ctas.map((cta, idx) => (
                        <Link
                            key={idx}
                            href={cta.href}
                            className={`
                                w-full sm:w-auto px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-lg text-center whitespace-nowrap
                                ${cta.primary
                                    ? 'bg-primary text-white hover:bg-primary-600 scale-105 hover:scale-110 ring-4 ring-primary/20'
                                    : 'bg-white text-navy border-2 border-slate-200 hover:border-primary hover:text-primary hover:bg-primary/5'
                                }
                            `}
                        >
                            {cta.label}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
