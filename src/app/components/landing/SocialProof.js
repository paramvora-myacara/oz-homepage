'use client';
import { motion } from 'framer-motion';

const testimonials = [
    {
        quote: "I had a significant exit and didn't know where to park the capital. OZ Listings made the math simple.",
        author: "James T., Investor",
        delay: 0
    },
    {
        quote: "A necessary tool for our deal flow. It cuts our initial research time in half.",
        author: "Sarah Jenkins, CIO",
        delay: 0.1
    },
    {
        quote: "The best platform for getting our projects in front of serious, educated capital.",
        author: "Apex Development Group",
        delay: 0.2
    }
];

export default function SocialProof() {
    return (
        <section className="py-24 bg-[#F8F9FA]">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
                <h2 className="text-3xl sm:text-[40px] font-extrabold text-center text-navy mb-16">
                    Trusted by The Modern Real Estate Community
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: t.delay }}
                            className="bg-white border border-[#E9ECEF] rounded-lg p-8 relative"
                        >
                            <div className="text-[#1E88E5] text-6xl font-serif leading-none mb-4">“</div>
                            <p className="text-lg text-navy leading-relaxed mb-8 relative z-10">
                                {t.quote}
                            </p>
                            <p className="font-bold text-navy">
                                — {t.author}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
