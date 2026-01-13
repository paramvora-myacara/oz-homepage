import OZMapVisualization from '../components/OZMapVisualization';

export default function OZMapPage() {
    return (
        <main className="relative min-h-screen">
            {/* Grid Background */}
            <div className="fixed inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[600px] w-[600px] rounded-full bg-radial-gradient from-blue-500/10 to-transparent blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 pt-24 pb-12 px-4 sm:px-8 max-w-[1440px] mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-navy text-center tracking-tight">Opportunity Zone Map</h1>
                <div className="h-[600px] w-full relative">
                    <OZMapVisualization />
                </div>
            </div>
        </main>
    );
}
