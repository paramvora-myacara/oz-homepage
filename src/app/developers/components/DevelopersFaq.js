'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqItems = [
  {
    question: 'Is it free to list my project?',
    answer:
      'Yes. You can start your project for free with no credit card required. Listing takes about 5 minutes, and our team will guide you through the rest.',
  },
  {
    question: 'How quickly can I get my listing live?',
    answer:
      'Most listings go live within 24–48 hours after you submit your project information. Our team reviews your materials and publishes your listing once everything is ready.',
  },
  {
    question: 'Is my information secure?',
    answer:
      'Yes. Sensitive documents are stored in our secure deal vault. Investors must agree to confidentiality terms before accessing detailed financials and project documents.',
  },
  {
    question: 'What do I need to get started?',
    answer:
      'You will need basic project information (location, asset type, capital needed), a project description, photos, and your offering documents. Our team can help you fill any gaps during setup.',
  },
  {
    question: 'Can I upgrade or add marketing services later?',
    answer:
      'Yes. After you sign up, our team will follow up by email with optional ways to expand your reach, including premium marketing and add-on services tailored to your project.',
  },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-gray-900 dark:text-white">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-lg text-gray-600 dark:text-gray-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DevelopersFaq() {
  return (
    <section className="relative z-10 w-full px-4 py-12 md:py-24 md:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-brand-black mb-12 text-center text-3xl md:text-4xl text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqItems.map((item) => (
            <FAQItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
