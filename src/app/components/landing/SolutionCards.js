'use client';
import { motion } from 'framer-motion';

const cards = [
    {
        title: "Institutional Access",
        description: "Access deals previously reserved for closed-door networks. Multi-family, industrial, and development.",
        iconColor: "bg-[#E5F9F1]", // Greenish
        delay: 0
    },
    {
        title: "The After-Tax Lens",
        description: "We don't just show you the property; we show the MATH. Visualize how tax incentives impact your bottom line.",
        iconColor: "bg-[#F8F9FA]", // Grayish
        delay: 0.1
    },
    {
        title: "Direct Connection",
        description: "No middlemen. No broker fees. We provide the data platform; you connect directly with sponsors.",
        iconColor: "bg-[#FAE6E6]", // Reddish
        delay: 0.2
    }
];

export default function SolutionCards() {
    return (
        <section className="py-24 bg-[#F8F9FA]">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
                <h2 className="text-3xl sm:text-[40px] font-extrabold text-center text-navy mb-16">
                    One Platform. Complete Clarity.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: card.delay }}
                            className="bg-white rounded-lg p-8 shadow-[0_10px_40px_-10px_rgba(33,44,56,0.08)] hover:shadow-[0_20px_60px_-10px_rgba(33,44,56,0.12)] transition-shadow duration-300"
                        >
                            <div className={`w-14 h-14 rounded-full ${card.iconColor} mb-8 flex items-center justify-center`}>
                                {/* Abstract Icons based on color */}
                                <div className="w-6 h-6 bg-navy/10 rounded-full"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-navy mb-4">{card.title}</h3>
                            <p className="text-base text-navy/80 leading-relaxed font-normal">
                                {card.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
