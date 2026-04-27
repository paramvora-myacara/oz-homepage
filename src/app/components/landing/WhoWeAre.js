'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const leadership = [
  {
    name: 'Dr. Jeff Richmond',
    title: 'CEO and Co-Founder of OZ Listings',
    imageSrc: '/images/Jeff.png',
    bio:
      'With a decade of experience in real estate, capital strategy and business development, Jeff has been a connector across the private real estate ecosystem. He focuses on helping investors and sponsors align around disciplined underwriting and scalable execution.',
  },
  {
    name: 'Todd Vitzthum',
    title: 'Co-Founder of OZ Listings and President of ACARA Management',
    imageSrc: '/images/webinar/ToddBio/Todd.png',
    bio:
      'A nationally recognized expert in real estate investment and private equity, Todd has over 20 years of executive leadership experience at firms including CBRE, Cushman & Wakefield, and Greystone.',
  },
];

export default function WhoWeAre() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Grid Background (match landing style) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(#D1D5DB 1px, transparent 1px), linear-gradient(90deg, #D1D5DB 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black, transparent 70%)',
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
              Who We Are
            </h2>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 text-xl lg:text-2xl text-navy/70 max-w-2xl mx-auto"
          >
            Meet Our Leadership
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {leadership.map((person, idx) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-md flex-shrink-0 bg-slate-100">
                    <Image
                      src={person.imageSrc}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 112px, 128px"
                      priority={idx === 0}
                    />
                  </div>

                  <div className="text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-extrabold text-navy">
                      {person.name}
                    </div>
                    <div className="mt-1 text-sm sm:text-base font-semibold text-primary leading-snug min-h-[3rem] flex items-start">
                      {person.title}
                    </div>
                    <p className="mt-4 text-base sm:text-lg text-navy/75 leading-relaxed">
                      {person.bio}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

