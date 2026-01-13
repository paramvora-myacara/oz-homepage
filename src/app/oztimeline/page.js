import OZTimeline from '../components/Invest/OZTimeline';

export default function OZTimelinePage() {
    return (
        <main className="relative min-h-screen">
            {/* Grid Background */}
            <div className="fixed inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[600px] w-[600px] rounded-full bg-radial-gradient from-blue-500/10 to-transparent blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-[1440px] mx-auto">
               <OZTimeline />
            </div>
        </main>
    );
}
