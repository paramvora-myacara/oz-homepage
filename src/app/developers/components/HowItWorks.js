'use client';
import { motion } from 'framer-motion';
import { Calendar, FileText, Sparkles, Megaphone, Handshake } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Calendar,
    title: ['Schedule', 'a Call'],
    description: 'Book a time with our team to discuss your project and marketing needs'
  },
  {
    number: '02',
    icon: FileText,
    title: 'Submit Project Details',
    description: 'Share your Opportunity Zone project information and materials'
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'We Create Your Listing',
    description: 'Our team creates a premium listing page with professional copywriting'
  },
  {
    number: '04',
    icon: Megaphone,
    title: 'We Market Your Project',
    description: 'We promote your project via emails, listings, and social media channels'
  },
  {
    number: '05',
    icon: Handshake,
    title: 'Connect with Investors',
    description: 'Qualified investors discover and engage with your Opportunity Zone project'
  }
];

export default function HowItWorks() {
  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-navy dark:text-white">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A simple, streamlined process to get your project in front of qualified investors
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 origin-left"
          ></motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Step Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    {/* Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-16 h-16 rounded-2xl bg-primary/20 dark:bg-primary/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {Array.isArray(step.title) ? (
                        <>
                          {step.title[0]}
                          <br />
                          {step.title[1]}
                        </>
                      ) : (
                        step.title
                      )}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
                      {step.description}
                    </p>

                    {/* Arrow (Desktop, between steps) */}
                    {index < steps.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                        className="hidden lg:flex absolute top-24 -translate-y-1/2 left-full w-6 md:w-8 items-center justify-center text-primary z-10"
                      >
                        <svg className="w-full h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
