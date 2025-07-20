"use client";
import { useRouter } from "next/navigation";

export default function JoinCommunityPage() {
  const router = useRouter();

  return (
    <div className="mt-10 flex min-h-screen flex-col items-center justify-center bg-white px-4 py-16 dark:bg-black">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-[#1e88e5] dark:text-[#60a5fa]">
          Join the OZ Listings Community
        </h1>
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Unlock an exclusive gateway to the world of Opportunity Zone real
          estate.
        </h2>
        <p className="mb-8 text-center text-lg text-gray-700 dark:text-gray-300">
          Step inside the most trusted, members-only network for Opportunity
          Zone property owners, developers, and multifamily investors. OZ
          Listings isn't just a marketplace—it's your passport to a high-caliber
          community where every member is focused on maximizing returns and
          making an impact.
        </p>
        <h2 className="mb-4 text-center text-xl font-semibold text-gray-800 dark:text-gray-200">
          Why Join the OZ Listings Community?
        </h2>
        <ul className="mb-8 space-y-4">
          <li>
            <span className="font-semibold text-[#1e88e5] dark:text-[#60a5fa]">
              Exclusive Access:
            </span>{" "}
            Be the first to discover premium Opportunity Zone listings and
            off-market deals—shared only with our community members.
          </li>
          <li>
            <span className="font-semibold text-[#1e88e5] dark:text-[#60a5fa]">
              White-Glove Service:
            </span>{" "}
            Enjoy concierge-level support from our dedicated OZ experts. From
            initial deal discovery to closing, our team is here to guide you
            every step of the way.
          </li>
          <li>
            <span className="font-semibold text-[#1e88e5] dark:text-[#60a5fa]">
              Curated Opportunities:
            </span>{" "}
            Receive early notifications for high-potential projects tailored to
            your investment criteria, so you never miss a deal that matches your
            goals.
          </li>
          <li>
            <span className="font-semibold text-[#1e88e5] dark:text-[#60a5fa]">
              Insider Insights:
            </span>{" "}
            Tap into expert analysis, detailed market reports, and industry
            trends delivered directly to you. Make smarter, more confident
            investment decisions with data and guidance trusted by the pros.
          </li>
          <li>
            <span className="font-semibold text-[#1e88e5] dark:text-[#60a5fa]">
              Direct Connections:
            </span>{" "}
            Build real relationships with vetted investors, developers, and
            industry leaders through private networking events, mastermind
            sessions, and our active members-only forum.
          </li>
          <li>
            <span className="font-semibold text-[#1e88e5] dark:text-[#60a5fa]">
              VIP Invitations:
            </span>{" "}
            Get exclusive invites to webinars, roundtables, and live events
            featuring top voices in Opportunity Zone investing.
          </li>
        </ul>
        <h2 className="mb-4 text-center text-xl font-semibold text-gray-800 dark:text-gray-200">
          Who Is the Community For?
        </h2>
        <p className="mb-8 text-center text-base text-gray-700 dark:text-gray-300">
          Whether you're an experienced investor looking to scale or new to
          Opportunity Zones and eager to learn from the best, the OZ Listings
          Community is designed for you. Join a thriving ecosystem where
          knowledge, capital, and opportunity come together.
        </p>
        <div className="mb-8">
          <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-gray-100">
            Ready to elevate your Opportunity Zone investing?
          </h3>
          <p className="mt-2 text-center text-base text-gray-700 dark:text-gray-300">
            Join OZ Listings today and access the deals, insights, and support
            you need to thrive.
          </p>
        </div>
        <div className="flex justify-center">
          <button
            className="rounded-lg bg-[#1e88e5] px-8 py-3 text-lg font-semibold text-white shadow transition-all duration-300 hover:bg-[#1669bb] focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 focus:outline-none dark:bg-[#60a5fa] dark:hover:bg-[#2563eb] dark:focus:ring-[#60a5fa]"
            onClick={() => router.push("/auth/login")}
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
}
