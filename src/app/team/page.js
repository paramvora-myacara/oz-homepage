"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import { 
  User,
  Building,
  Scale,
  Code,
  Megaphone,
  X,
  Linkedin,
  ChevronDown
} from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: "Dr. Jeff Richmond",
    role: "Real Estate",
    department: "Real Estate",
    bio: "Dr. Jeff Richmond — CEO and founding partner of OZ Listings™, the premier marketplace for Opportunity Zone investing. With a decade of experience in real estate, capital strategy, and business development, Jeff bridges the gap between investors, developers, and OZ assets nationwide. His expertise lies in structuring tax-advantaged deals, driving investor engagement, and scaling systems that make OZ investing more transparent and accessible.",
    icon: Building,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    name: "Todd Vitzthum",
    role: "Real Estate",
    department: "Real Estate",
    bio: "Todd Vitzthum — President of ACARA Management and co-founder of OZListings.com. A nationally recognized expert in real estate investment and private equity, Todd has over 20 years of executive leadership experience at firms including CBRE, Cushman & Wakefield, and Greystone. Having closed billions in transactions, he's trusted by family offices and institutional sponsors to structure tax-advantaged equity, optimize capital stacks, and source resilient, high-yield projects across the U.S.",
    icon: Building,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 3,
    name: "Michael Krueger",
    role: "Legal",
    department: "Legal",
    bio: "Michael Krueger — Partner at Lucosky Brookman law firm, and a leading authority on Opportunity Zones. Michael helps investors, developers, and business owners unlock tax-advantaged growth through strategic deal structuring and compliance-driven fund formation. With deep expertise in business transactions, real estate finance, and private equity, Michael is known for turning complex regulations into clear strategies that protect wealth, mitigate IRS risks, and maximize long-term returns.",
    icon: Scale,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 4,
    name: "Param Vora",
    role: "Technology",
    department: "Technology",
    bio: "Param Vora leads the technology team, driving innovation and building scalable platforms that power OZListings. With expertise in full-stack development and system architecture, he ensures our technology infrastructure supports seamless user experiences and robust data management.",
    icon: Code,
    color: "from-green-500 to-green-600"
  },
  {
    id: 5,
    name: "Aryan Jain",
    role: "Technology",
    department: "Technology",
    bio: "Aryan Jain is a technology specialist focused on building cutting-edge solutions for OZListings. With strong foundations in software engineering and modern web technologies, he contributes to platform development, user experience optimization, and technical innovation.",
    icon: Code,
    color: "from-green-500 to-green-600"
  },
  {
    id: 6,
    name: "Karen Sielski",
    role: "Marketing",
    department: "Marketing",
    bio: "Karen Sielski brings over 15 years of experience in marketing and creative services to OZListings. As a marketing leader, she has been instrumental in enhancing the company's online presence, driving growth, and building brand awareness in the Opportunity Zone investment space.",
    icon: Megaphone,
    color: "from-orange-500 to-orange-600"
  },
  {
    id: 7,
    name: "Eric Bleau",
    role: "Marketing",
    department: "Marketing",
    bio: "Eric Bleau is a seasoned real estate investor, marketer, and educator. He leverages innovative growth strategies and marketing expertise to drive engagement, build investor relationships, and expand OZListings' reach in the Opportunity Zone community.",
    icon: Megaphone,
    color: "from-orange-500 to-orange-600"
  },
  {
    id: 8,
    name: "Chris Sielski",
    role: "Marketing",
    department: "Marketing",
    bio: "Chris Sielski is a marketing professional dedicated to creating compelling content and strategic campaigns that connect investors with Opportunity Zone opportunities. With a focus on digital marketing and brand development, he helps drive awareness and engagement.",
    icon: Megaphone,
    color: "from-orange-500 to-orange-600"
  },
];

export default function TeamPage() {
  const { resolvedTheme } = useTheme();
  const [selectedMember, setSelectedMember] = useState(null);

  const openBio = (member) => {
    setSelectedMember(member);
    document.body.style.overflow = 'hidden';
  };

  const closeBio = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'unset';
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OZListings",
    "url": "https://ozlistings.com",
    "logo": "https://ozlistings.com/OZListings-Light-removebg.png",
    "description": "The premier marketplace for Opportunity Zone investments",
    "employee": teamMembers.map(member => ({
      "@type": "Person",
      "name": member.name,
      "jobTitle": member.role,
      "description": member.bio,
      "worksFor": {
        "@type": "Organization",
        "name": "OZListings"
      }
    }))
  };

  return (
    <div className="relative w-full text-gray-900 dark:text-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section - Meet the Team */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/10 overflow-hidden">
        {/* Enhanced Background pattern */}
        <div className="absolute inset-0 opacity-40 dark:opacity-15">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.2) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Geometric pattern background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
                linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
                linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
                linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5)
              `,
              backgroundSize: '80px 140px',
              backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
            }}></div>
          </div>
          {/* Enhanced Radial gradient accents */}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-blue-200/30 via-blue-100/10 to-transparent dark:from-blue-900/20 dark:via-blue-800/10"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-indigo-200/25 via-indigo-100/10 to-transparent dark:from-indigo-900/15 dark:via-indigo-800/8"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/2 bg-gradient-radial from-slate-200/30 via-slate-100/15 to-transparent dark:from-slate-800/20 dark:via-slate-700/10"></div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-[#1e88e5]/10 to-[#42a5f5]/5 dark:from-[#1e88e5]/20 dark:to-[#42a5f5]/10"
              style={{
                width: `${60 + i * 20}px`,
                height: `${60 + i * 20}px`,
                left: `${10 + i * 15}%`,
                top: `${15 + (i % 3) * 30}%`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.3, scale: 1 }}
              viewport={{ once: true }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light leading-tight mb-4 sm:mb-6 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Meet the <span className="font-semibold text-[#1e88e5]">OZListings Team</span>
          </motion.h1>
          
          <motion.p 
            className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto font-light mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A diverse team of experts dedicated to connecting investors with Opportunity Zone opportunities
          </motion.p>

          {/* Decorative line with gradient */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center justify-center gap-4 sm:gap-6"
          >
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#1e88e5]/30"></div>
            <div className="w-2 h-2 rounded-full bg-[#1e88e5]"></div>
            <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-[#1e88e5]/30 via-[#1e88e5]/50 to-[#1e88e5]/30"></div>
            <div className="w-2 h-2 rounded-full bg-[#1e88e5]"></div>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#1e88e5]/30"></div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.p
            className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll to explore
          </motion.p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md ring-1 ring-[#1e88e5]/20 shadow-lg p-2 sm:p-3"
          >
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e88e5] dark:text-[#90caf9]" />
          </motion.div>
        </motion.div>
      </section>

      {/* Team Members Section - Fits Single Viewport */}
      <section className="relative min-h-screen sm:h-screen flex items-center sm:items-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-0">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full sm:flex sm:items-center">
          {/* Compact Grid - 3 columns on large screens, fits in viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.05,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className="group relative bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-5 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-[#1e88e5]/30 dark:hover:border-[#1e88e5]/50 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => openBio(member)}
              >
                {/* Subtle gradient accent on hover */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${member.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Compact Layout */}
                <div className="flex flex-col items-center text-center">
                  {/* Smaller Photo Placeholder */}
                  <div className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-2 sm:mb-3 rounded-xl overflow-hidden bg-gradient-to-br ${member.color} opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
                    <member.icon className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-gray-400 dark:text-gray-500 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-medium bg-white/80 dark:bg-gray-800/80 px-1.5 py-0.5 rounded">Photo</span>
                    </div>
                  </div>

                  {/* Name and Role - Compact */}
                  <div className="w-full">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-[#1e88e5] transition-colors line-clamp-1">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-2 line-clamp-1">
                      {member.role}
                    </p>
                    <div className="flex items-center justify-center text-xs sm:text-sm text-[#1e88e5] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View Bio</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hidden Section for SEO - Team Member Bios */}
      <section 
        className="sr-only"
        aria-label="Team member biographies"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Team Member Biographies</h2>
          <div className="space-y-8">
            {teamMembers.map((member) => (
              <article key={member.id} className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name} - {member.role}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {member.bio}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Department: {member.department}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bio Modal */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
              onClick={closeBio}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={closeBio}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>

                {/* Content */}
                <div className="p-6 sm:p-8 lg:p-10">
                  {/* Photo Placeholder */}
                  <div className={`relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto mb-6 sm:mb-8 rounded-2xl overflow-hidden bg-gradient-to-br ${selectedMember.color} opacity-20 dark:opacity-30 flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
                    <selectedMember.icon className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-400 dark:text-gray-500 relative z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">Photo Coming Soon</span>
                    </div>
                  </div>

                  {/* Name and Role */}
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedMember.name}
                    </h2>
                    <p className="text-lg sm:text-xl text-[#1e88e5] font-medium mb-4">
                      {selectedMember.role}
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                      {selectedMember.bio}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

