'use client';
import { motion } from 'framer-motion';
import { Calendar, FileText, Sparkles, Megaphone, Handshake } from 'lucide-react';
import React from 'react';

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
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A simple, streamlined process to get your project in front of qualified investors
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
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
                  <motion.div
                    animate={{
                      borderColor: isActive ? '#1e88e5' : 'rgba(229, 231, 235, 0.5)',
                      boxShadow: isActive ? '0 20px 25px -5px rgb(30 136 229 / 0.1), 0 8px 10px -6px rgb(30 136 229 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                    }}
                    transition={{ duration: 0.5 }}
                    className={`bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-md border-2 transition-all duration-300 h-full flex flex-col ${isActive ? 'z-10' : 'z-0 border-gray-100 dark:border-gray-700'}`}
                  >
                    {/* Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isActive ? 'bg-primary text-white' : 'bg-primary/20 dark:bg-primary/30 text-primary'}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
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
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Arrow (Desktop, between steps) - Positioned relative to the grid slot, not the scaled card */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-full w-8 items-center justify-center text-primary z-20 pointer-events-none"
                    >
                      <svg className="w-full h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 flex justify-center"
          >
            <button
              onClick={() => window.location.href = '/check-oz'}
              className="px-10 py-5 bg-primary text-white rounded-2xl font-bold text-xl hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 flex items-center gap-3 group"
            >
              Check if your Development is in an OZ
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
