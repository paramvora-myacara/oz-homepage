"use client";
import { motion } from "framer-motion";
import {
  FaUserCheck,
  FaMapMarkedAlt,
  FaComments,
  FaPhone,
} from "react-icons/fa";
import OZMapVisualization from "./components/OZMapVisualization";
import OZListingsCarousel from "./components/OZListingsCarousel";
import OZListingsFooter from "./components/OZListingsFooter";

const gold = "text-[#C2A059]";

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] text-[#212C38]">
      {/* HERO SECTION */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* D3 OZ Map */}
        <div className="absolute inset-0 z-0">
          {/* Add a subtle slow zoom animation using framer-motion */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.045 }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="h-full w-full"
          >
            <OZMapVisualization />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#f8f9fb] to-transparent" />
        </div>
        {/* Overlay content */}
        <motion.div
          className="relative z-20 flex flex-col items-center pt-40 pb-24 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1
            className="mb-4 text-5xl font-bold md:text-6xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Discover Opportunity in Every Zone
          </h1>
          <p className="mb-8 max-w-2xl text-xl font-light md:text-2xl">
            Exclusive multifamily deals. Actionable market intelligence.
            <br />
            <span className={gold}>
              For accredited investors, developers, and brokers.
            </span>
          </p>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <button className="rounded-full border-2 border-[#1A2B4B] bg-white px-8 py-3 text-lg font-semibold text-[#1A2B4B] shadow-lg transition-all duration-200 hover:bg-[#1A2B4B] hover:text-white focus:outline-none">
              View Investment Deals
            </button>
            <button className="rounded-full border-2 border-[#C2A059] bg-[#C2A059] px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#A58947] focus:outline-none">
              Explore Market Insights
            </button>
          </div>
        </motion.div>
      </section>

      {/* CONTENT CAROUSEL */}
      <OZListingsCarousel />

      {/* WHY/WHAT/WHEN/HOW OZ SECTION */}
      <section className="w-full bg-[#f5f7fa] py-20">
        <motion.div
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            {
              title: "Why OZ?",
              desc: "Unlock powerful tax incentives and access a high-growth real estate market—Opportunity Zones provide unique advantages for qualified investors.",
            },
            {
              title: "What OZ?",
              desc: "Special census tracts nationwide offering capital gains tax deferral, reduction, and exclusion for eligible investments.",
            },
            {
              title: "When OZ?",
              desc: "There’s a window of opportunity—key benefits phase out after 2026. Early movers gain the most.",
            },
            {
              title: "How OZ?",
              desc: "Qualify as an accredited investor, choose your deal, and track progress—all with OZ Listings.",
            },
          ].map(({ title, desc }, idx) => (
            <motion.div
              key={title}
              className="flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-lg"
              style={{ minHeight: "280px" }}
              custom={idx}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: (i) => ({
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.1 + i * 0.1, duration: 0.7 },
                }),
              }}
            >
              <div className="mb-2 text-2xl font-bold">
                {title}
              </div>
              <div className="text-lg font-light">{desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* DIRECT ACTION SECTION */}
      <section className="w-full bg-white py-20">
        <motion.div
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            {
              icon: <FaUserCheck size={42} className={gold} />,
              title: "Qualify as an Investor",
              subtitle: "See if you’re eligible for exclusive OZ deals.",
              cta: "Get Started",
            },
            {
              icon: <FaMapMarkedAlt size={42} className={gold} />,
              title: "Check Your Development",
              subtitle:
                "See if your project is located in an Opportunity Zone.",
              cta: "Check Now",
            },
            {
              icon: <FaComments size={42} className={gold} />,
              title: "Talk to Ozzie (AI)",
              subtitle: "Ask our smart assistant about OZ investments.",
              cta: "Chat Now",
            },
            {
              icon: <FaPhone size={42} className={gold} />,
              title: "Speak to the Team",
              subtitle: "Connect with OZ experts for personalized support.",
              cta: "Contact Us",
            },
          ].map(({ icon, title, subtitle, cta }) => (
            <motion.div
              key={title}
              className="flex flex-col items-center gap-3 rounded-2xl bg-[#F7F8FA] p-8 text-center shadow-lg"
              variants={fadeInUp}
            >
              <div className="mb-2">{icon}</div>
              <div className="mb-1 text-xl font-bold">
                {title}
              </div>
              <div className="mb-3 text-base text-gray-700">{subtitle}</div>
              <button className="rounded-full border-2 border-[#1A2B4B] bg-white px-7 py-2 font-semibold text-[#1A2B4B] transition-all duration-200 hover:bg-[#1A2B4B] hover:text-white">
                {cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FOOTER */}
      <OZListingsFooter />
    </div>
  );
}
