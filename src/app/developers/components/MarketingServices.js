'use client';
import { motion } from 'framer-motion';
import { Mail, FileText, Share2, Users, PenTool } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthNavigation } from '../../../lib/auth/useAuthNavigation';
import { trackUserEvent } from '../../../lib/analytics/trackUserEvent';

const services = [
  {
    icon: FileText,
    title: 'Premium Listings',
    description: 'Featured placement in our marketplace with professional project pages optimized for investor conversion',
    features: [
      'Premium listing page design',
      'Featured search placement',
      'Professional photography & renders',
      'SEO-optimized for visibility'
    ]
  },
  {
    icon: PenTool,
    title: 'Deal Package Creation',
    description: 'Professional offering memorandums and marketing materials that showcase your development opportunity',
    features: [
      'Offering memorandum creation',
      'Executive summaries',
      'Financial projections presentation',
      'Professional copywriting & design'
    ]
  },
  {
    icon: Mail,
    title: 'Email Marketing Campaigns',
    description: 'Direct outreach to 60K+ qualified investors and family offices actively seeking OZ investments',
    features: [
      'Dedicated email campaigns',
      'Newsletter feature inclusion',
      'Targeted family office outreach',
      'Engagement tracking & analytics'
    ]
  },
  {
    icon: Users,
    title: 'Due Diligence Vault',
    description: 'Secure, professional infrastructure for document management and investor due diligence process',
    features: [
      'Secure document storage',
      'Investor access management',
      'Document tracking & analytics',
      'Professional presentation'
    ]
  }
];

export default function MarketingServices() {
  const { navigateWithAuth } = useAuthNavigation();
  const router = useRouter();

  const handleScheduleCall = async () => {
    await trackUserEvent("developers_page_cta_clicked", {
      button: "schedule_call",
      location: "marketing_services"
    });
    
    const params = new URLSearchParams({
      userType: "Developer",
      advertise: "true",
      endpoint: "developers_page"
    });
    navigateWithAuth(`/schedule-a-call?${params.toString()}`);
  };

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
            Complete Deal Marketing Platform
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Professional listings, deal packages, and email marketing to help you raise capital faster
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300"
              >
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>
                
                {/* Icon */}
                <div className="relative w-14 h-14 mb-4 rounded-xl bg-primary/20 dark:bg-primary/30 group-hover:bg-primary/30 dark:group-hover:bg-primary/40 transition-all duration-300 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-8 md:p-12 border border-primary/20"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-navy dark:text-white">
            Ready to Market Your Deal?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Schedule a call to learn how we can help you raise capital through professional listings, deal packages, and targeted email marketing
          </p>
          <motion.button
            className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-primary/40 relative overflow-hidden group flex items-center justify-center gap-2 mx-auto"
            onClick={handleScheduleCall}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Schedule a Call
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
