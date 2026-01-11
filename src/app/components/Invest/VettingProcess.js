import { UserCheck, BarChart3, ShieldCheck } from 'lucide-react';

export default function VettingProcess() {
  const pillars = [
    {
      title: "Sponsor Track Record",
      icon: <UserCheck className="w-8 h-8 text-primary" />,
      desc: "We only partner with developers who have a proven history of exiting similar assets successfully."
    },
    {
      title: "Market Fundamentals",
      icon: <BarChart3 className="w-8 h-8 text-emerald-500" />,
      desc: "We independently validate job growth, population trends, and absorption rates in the target DOZ."
    },
    {
      title: "Conservative Modeling",
      icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />,
      desc: "We stress-test every pro-forma against recessionary scenarios to ensure principal protection."
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-black overflow-hidden">
       <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
             <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-navy dark:text-white">We say "No" so you can say "Yes"</h2>
             <p className="text-lg text-gray-600 dark:text-gray-400">
               Our <span className="text-primary font-bold">53-point diligence framework</span> ensures only top-tier institutional sponsors make the cut.
               <br className="hidden md:block" /> From 100+ deals reviewed, <span className="font-semibold text-navy dark:text-white">less than 5% are accepted.</span>
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
             {pillars.map((pillar, idx) => (
                <div key={idx} className="group">
                   <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-gray-800 shadow-sm inline-block group-hover:scale-110 transition-transform duration-300">
                      {pillar.icon}
                   </div>
                   <h3 className="text-xl font-bold mb-3 text-navy dark:text-white">{pillar.title}</h3>
                   <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {pillar.desc}
                   </p>
                </div>
             ))}
          </div>
       </div>
    </section>
  );
}
