'use client';
import { motion } from 'framer-motion';
import { Mail, TrendingUp, Users, FileText, BarChart3, Share2 } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Premium Listings',
    description: 'Showcase your deal in our marketplace with featured placement to reach qualified OZ investors'
  },
  {
    icon: FileText,
    title: 'Professional Deal Packages',
    description: 'We create compelling offering memorandums and marketing materials for your project'
  },
  {
    icon: Mail,
    title: 'Targeted Email Marketing',
    description: 'Direct email campaigns to 60K+ subscribers and family offices actively seeking OZ deals'
  },
  {
    icon: Users,
    title: 'Due Diligence Vault',
    description: 'Secure technical infrastructure for document management and investor due diligence'
  },
  {
    icon: BarChart3,
    title: 'Investor Analytics',
    description: 'Track engagement, views, and interest from qualified investors in real-time'
  },
  {
    icon: Share2,
    title: 'Multi-Channel Promotion',
    description: 'Extended reach through social media, newsletters, and partner networks'
  }
];

export default function MarketingBenefits() {
  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-navy dark:text-white">
            Market Your Deal. Raise Capital.
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to market your Opportunity Zone development and raise capital from qualified investors
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300"
              >
                {/* Gradient accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>
                
                {/* Icon */}
                <div className="relative w-14 h-14 mb-4 rounded-xl bg-primary/20 dark:bg-primary/30 group-hover:bg-primary/30 dark:group-hover:bg-primary/40 transition-all duration-300 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
