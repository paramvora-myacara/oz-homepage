"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import {
	BookOpen,
	Shield,
	Target,
	Layers,
	CheckCircle,
	Info,
	ClipboardList,
	Activity,
} from 'lucide-react';

export default function BestPracticesPage() {
	const { resolvedTheme } = useTheme();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const handleAnchorClick = async (slug) => {
		await trackUserEvent("best_practices_toc_click", {
			section: slug,
			action: "jump_to_section",
			timestamp: new Date().toISOString(),
		});
		document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	return (
		<div className="relative w-full text-gray-900 dark:text-white">
			{/* Header - Neutral Gradient (no image) */}
			<section className="relative pt-16 sm:pt-20 lg:pt-24">
				<div className="relative w-full">
					{/* Neutral base similar to community page */}
					<Image src="/images/ConstructionBanner.jpg" alt="Construction banner" fill priority className="object-cover contrast-110 saturate-110" />

					{/* Removed overlays per request */}
					
					<div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
						<div className="block w-full rounded-2xl bg-white/60 dark:bg-black/60 backdrop-blur-xl p-4 sm:p-6 ring-1 ring-black/10 dark:ring-white/10">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="w-full"
						>
							<h1 className="text-2xl sm:text-4xl lg:text-5xl font-light leading-tight text-gray-900 dark:text-white mb-3 text-center">
								A practical guide to <span className="text-[#1e88e5]">Opportunity Zone</span> investing
							</h1>
							<p className="text-gray-800 dark:text-white/90 text-xs sm:text-sm lg:text-base text-center">By OZ Listings • Updated {new Date().toLocaleDateString()}</p>
							<p className="text-gray-800 dark:text-white/90 text-sm sm:text-lg lg:text-xl mt-4 max-w-5xl mx-auto font-light text-center">
								Plain‑English for family offices: what to look for, cut risk, and run a durable, compliant OZ program.
							</p>
						</motion.div>
						</div>
					</div>
				</div>
			</section>

			{/* Article Layout with Sticky TOC */}
			<section className="relative bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 lg:py-16">
				<div className="absolute inset-0 opacity-30 dark:opacity-10">
					<div className="absolute inset-0" style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
						backgroundSize: '40px 40px'
					}}></div>
				</div>
				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
						{/* Sticky TOC */}
						<aside className="hidden lg:block lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
							<div className="lg:sticky lg:top-24">
								<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5 shadow-lg">
									<div className="flex items-center gap-2 mb-3">
										<BookOpen className="w-5 h-5 text-[#1e88e5]" />
										<h2 className="text-base sm:text-lg font-semibold">Contents</h2>
									</div>
									<nav className="space-y-2 text-base sm:text-lg">
										{[
											{ id: 'sponsor', label: '1. Sponsor & Alignment' },
											{ id: 'thesis', label: '2. Market, Thesis & Community' },
											{ id: 'underwriting', label: '3. Underwriting' },
											{ id: 'capital-stack', label: '4. Capital Stack' },
											{ id: 'risk', label: '5. Project & Construction Risk' },
											{ id: 'oz', label: '6. OZ Done Right' },
											{ id: 'operations', label: '7. Operating Excellence' },
											{ id: 'governance', label: '8. Reporting & Governance' },
										].map(item => (
											<button key={item.id} onClick={() => handleAnchorClick(item.id)} className="block w-full text-left text-[#1e88e5] hover:underline">
												{item.label}
											</button>
										))}
									</nav>
								</div>
							</div>
						</aside>

						{/* Article */}
						<div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
							{/* Executive Summary Card */}
							<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-lg mb-6">
								<div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-white">
									<Activity className="w-6 h-6 text-[#1e88e5]" />
									<h3 className="text-lg sm:text-xl font-semibold">Executive Summary for Investment Committees</h3>
								</div>
								<ul className="text-base sm:text-lg text-gray-700 dark:text-gray-300 grid sm:grid-cols-2 gap-x-6 gap-y-2">
									<li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-[#1e88e5] mt-1" />Make sure the QOF/QOZB structure, 70%/90% tests, and the working‑capital plan match the project timeline.</li>
									<li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-[#1e88e5] mt-1" />Check eligible gain sources and 180‑day election windows (incl. K‑1 timing) before capital calls.</li>
									<li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-[#1e88e5] mt-1" />Underwrite as if there were no tax benefit. OZ should strengthen a good deal—not rescue a weak one.</li>
									<li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-[#1e88e5] mt-1" />Use a simple compliance calendar (Form 8996, testing dates, safe‑harbor updates) and keep monthly reporting tight.</li>
								</ul>
							</div>

							{/* Pass/Proceed directly after Executive Summary */}
							<section id="thresholds" className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">
								<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1e88e5]/10 via-transparent to-[#1e88e5]/10" />
								<div className="relative flex items-center justify-between gap-4 mb-3">
									<div className="flex items-center gap-2">
										<ClipboardList className="w-6 h-6 text-[#1e88e5]" />
										<h3 className="text-lg sm:text-xl font-semibold tracking-tight">Simple pass/proceed guide</h3>
									</div>
									<span className="hidden sm:inline-flex text-xs px-2 py-1 rounded-full bg-[#1e88e5]/10 text-[#1e88e5]">Quick screen</span>
								</div>
								<ul className="relative list-disc pl-5 text-base sm:text-lg text-gray-700 dark:text-gray-300 space-y-1">
									<li><b>Sponsor</b>: 5–10% GP co‑invest, solid references, realized DPI history</li>
									<li><b>Construction</b>: permits in sight; ≥ 7–10% contingency; credible GC and bonding</li>
									<li><b>Underwriting</b>: LTC ≤ 65%, DSCR ≥ 1.30x, stress cases clear base covenants</li>
									<li><b>Governance</b>: top‑tier admin, audit, quarterly look‑through, on‑time K‑1s</li>
									<li><b>OZ</b>: a written safe‑harbor plan and calendar; counsel letter on structure/testing</li>
								</ul>
								<div className="relative mt-4 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200">
									<p className="text-sm sm:text-base leading-relaxed"><b>Bottom line:</b> Aim for durability over drama. If a deal only works in the base case, it doesn’t work. The best portfolios are built with repeatable processes, aligned partners, and structures that survive the ordinary messiness of building and operating real assets.</p>
								</div>
							</section>

							<div className="block lg:hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5 shadow-lg mb-6">
								<div className="flex items-center gap-2 mb-3">
									<BookOpen className="w-5 h-5 text-[#1e88e5]" />
									<h2 className="text-base sm:text-lg font-semibold">Contents</h2>
								</div>
								<nav className="space-y-2 text-base sm:text-lg">
									{[
										{ id: 'sponsor', label: '1. Sponsor & Alignment' },
										{ id: 'thesis', label: '2. Market, Thesis & Community' },
										{ id: 'underwriting', label: '3. Underwriting' },
										{ id: 'capital-stack', label: '4. Capital Stack' },
										{ id: 'risk', label: '5. Project & Construction Risk' },
																					{ id: 'oz', label: '6. OZ Done Right' },
											{ id: 'operations', label: '7. Operating Excellence' },
											{ id: 'governance', label: '8. Reporting & Governance' },
									].map(item => (
										<button key={item.id} onClick={() => handleAnchorClick(item.id)} className="block w-full text-left text-[#1e88e5] hover:underline">
											{item.label}
										</button>
									))}
								</nav>
							</div>
							{/* Sections as cards */}
							<div className="space-y-6">
								{/* Sponsor */}
								<section id="sponsor" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-lg">
									<div className="flex items-center gap-2 mb-2 text-[#1e88e5] text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider">1. Sponsor & Alignment</div>
									<article className="prose prose-gray sm:prose-lg dark:prose-invert max-w-none">
										<p>
											Focus on the people who will deliver the plan—not just the presentation. Look for sponsors who’ve
											built the same type of project in similar markets and cycles. For family offices, seek alignment beyond
											marketing: real GP cash at risk, sensible fees in softer markets, and references from lenders and prior LPs.
										</p>
										<ul className="list-disc pl-5">
											<li><b>Track record</b>: realized DPI/TVPI by deal, loss ratio, 5+ similar projects in the last 5–7 years<br/><i>Watch for</i>: few realized exits, big performance swings, a story without data</li>
											<li><b>Team</b>: clear bios and roles, coverage for key people, a real bench<br/><i>Watch for</i>: one person holding the plan together; frequent turnover</li>
											<li><b>Alignment</b>: GP co‑invest around 5–10% of equity; simple fees and waterfalls<br/><i>Watch for</i>: low GP capital; fees that load up front</li>
											<li><b>Reputation</b>: lender/LP/GC references, litigation and regulatory checks<br/><i>Watch for</i>: open disputes; past liens without resolution</li>
											<li><b>OZ experience</b>: prior QOZB projects and a clean compliance record<br/><i>Watch for</i>: missed tests; no written safe‑harbor plans</li>
										</ul>
									</article>
									<div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 not-prose my-4">
										<div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-medium mb-2"><Shield className="w-5 h-5" />Family Office Lens</div>
										<ul className="text-base sm:text-lg text-blue-900/90 dark:text-blue-200/90 space-y-1">
											<li>Ask for 5–10% GP cash equity and a sponsor who knows OZ compliance.</li>
											<li>Confirm prior Form 8996 filings and 90% tests; identify the compliance lead.</li>
											<li>Use fee step‑downs and promote deferrals tied to delivery and testing milestones.</li>
										</ul>
									</div>
									<ul className="list-disc pl-5 text-base sm:text-lg text-gray-700 dark:text-gray-300">
										<li>References from lenders, contractors, and prior LPs.</li>
										<li>Clear role definition across development, construction, asset management, and leasing.</li>
										<li>Simple promotes tied to realized performance, not pro formas.</li>
									</ul>
								</section>

								{/* Thesis */}
								<section id="thesis" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-lg">
									<div className="flex items-center gap-2 mb-2 text-[#1e88e5] text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider">2. Market, Thesis & Community</div>
									<article className="prose prose-gray sm:prose-lg dark:prose-invert max-w-none">
										<p>
											Begin with the basics: jobs, incomes, household formation, and the precise location. Check that your
											rent basis lines up with true peers on finished quality—not just the address. Be cautious with plans
											that only work if everything goes perfectly.
										</p>
									</article>
									{/* Recolored from purple to blue */}
									<div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 not-prose my-4">
										<div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-medium mb-2"><Target className="w-5 h-5" />Quick IC checklist</div>
										<ul className="text-base sm:text-lg text-blue-900/90 dark:text-blue-200/90 space-y-1">
											<li>Walk the comp set and document it; log broker and PM calls.</li>
											<li>Price to quality: target rents at ~90–95% of best‑in‑class peers.</li>
											<li>Keep upside as optionality; the deal should work without it.</li>
										</ul>
									</div>
								</section>

								{/* Underwriting */}
								<section id="underwriting" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-lg">
									<div className="flex items-center gap-2 mb-2 text-[#1e88e5] text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider">3. Underwriting</div>
									<article className="prose prose-gray sm:prose-lg dark:prose-invert max-w-none">
										<p>
											Model the cash flows first, then layer in the story. Assume real‑world friction (permits, supply chains,
											wage pressure). Stress the downside before the upside, and ask whether the return still justifies the risk.
											Make sure the schedule fits the 31/62‑month safe harbors and expected placed‑in‑service dates.
										</p>
										<ul className="list-disc pl-5">
											<li>Use conservative rent growth and a realistic lease‑up pace.</li>
											<li>Detail CapEx to the unit scope and keep a real contingency.</li>
											<li>Assume exit cap ≥ entry cap unless evidence says otherwise.</li>
											<li><b>Leverage discipline</b>: target LTC ≤ 65% (dev), DSCR ≥ 1.30x at stabilize<br/><i>Watch for</i>: maxed LTC; a thin interest reserve</li>
											<li><b>Market comps</b>: rent, vacancy, absorption, sales; use third‑party studies/appraisals<br/><i>Watch for</i>: rent growth above market; stale comps</li>
											<li><b>Stress cases</b>: test exit cap +150–200 bps, +6–9 mo delay, +5–10% cost overrun<br/><i>Watch for</i>: a base case that breaks on modest shocks</li>
											<li><b>Exit plan</b>: sale vs. refi, buyer universe, and clear cap‑rate logic</li>
										</ul>
									</article>
									<div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4 not-prose my-4">
										<div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">OZ timing checks</div>
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-base">
											<div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">31/62‑month plan mapped to construction draw schedule</div>
											<div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">Substantial improvement timeline vs. basis documented</div>
											<div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">QOF testing dates vs. capital call cadence</div>
										</div>
									</div>
								</section>

								{/* Capital Stack */}
								<section id="capital-stack" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-lg">
									<div className="flex items-center gap-2 mb-2 text-[#1e88e5] text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider">4. Capital Stack</div>
									<article className="prose prose-gray sm:prose-lg dark:prose-invert max-w-none">
										<p>
											Prefer simple, durable structures. Moderate leverage, amortization where it helps, and terms that keep
											everyone aligned when conditions get choppy.
										</p>
										<ul className="list-disc pl-5">
											<li>Sources/Uses should include all‑in costs and an interest reserve that fits the schedule.</li>
											<li>Size LTV and DSCR to hold up in downside cases—not just the base.</li>
											<li>Use preferred equity sparingly and know the intercreditor dynamics.</li>
											<li>Define cure rights and who decides what when milestones slip.</li>
										</ul>
									</article>
									<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 not-prose my-4">
										<div className="flex items-center gap-2 text-green-900 dark:text-green-200 font-medium mb-2"><Layers className="w-5 h-5" />Terms we like to see</div>
										<ul className="text-base sm:text-lg text-green-900/90 dark:text-green-200/90 space-y-1">
											<li>Hard debt sizing at DSCR ≥ 1.35x on stress case.</li>
											<li>Promote crystallization only on realized events.</li>
											<li>Cash sweep triggers tied to coverage and schedule slippage.</li>
										</ul>
									</div>
								</section>

								{/* Risk */}
								<section id="risk" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-lg">
									<div className="flex items-center gap-2 mb-2 text-[#1e88e5] text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider">5. Project & Construction Risk</div>
									<article className="prose prose-gray sm:prose-lg dark:prose-invert max-w-none">
										<p>
											Protect the downside with clear documents and coverage. Permits, GMP contracts, performance bonds,
											and builder’s risk insurance are far cheaper than a recap.
										</p>
										<ul className="list-disc pl-5">
											<li><b>Entitlements & permits</b>: zoning, site plan, and building permits in hand—or a dated path to issuance<br/><i>Watch for</i>: contingent approvals; active appeals</li>
											<li><b>Budget & contingency</b>: a detailed GMP or cost‑plus and ≥ 7–10% hard‑cost contingency<br/><i>Watch for</i>: thin contingency; missing items (MEP, sitework)</li>
											<li><b>Schedule & milestones</b>: clear critical path, long‑lead procurement, baseline plus float<br/><i>Watch for</i>: no schedule logic; no room for delays</li>
											<li><b>Counterparty strength</b>: GC backlog/financials, bonding, sub coverage, lien waiver process<br/><i>Watch for</i>: undercapitalized GC; uninsured subs</li>
											<li><b>Site diligence</b>: survey, geotech, Phase I/II, flood/hazard checks, utility letters<br/><i>Watch for</i>: unresolved environmental items; unbudgeted remediation</li>
											<li><b>Insurance & risk</b>: builder’s risk, GL, wrap; performance/payment bonds where needed<br/><i>Watch for</i>: gaps in coverage; tough exclusions (water, earth movement)</li>
										</ul>
									</article>
								</section>

								{/* OZ Done Right */}
								<section id="oz" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-lg">
									<div className="flex items-center gap-2 mb-2 text-[#1e88e5] text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider">6. OZ Done Right</div>
									<article className="prose prose-gray sm:prose-lg dark:prose-invert max-w-none">
										<p>
											Think of OZ as a wrapper—not the engine. The deal should pencil before any tax benefit. Then focus on
											timing, basis, original use/substantial improvement, and a credible 10+ year path to value creation.
										</p>
										<ul className="list-disc pl-5">
											<li>Simple org chart: Investor → QOF → QOZB → Project</li>
											<li>Check eligible gain timing (trade date vs. K‑1 boxes) and the 180‑day windows.</li>
											<li>Plan for QOF 90% asset tests and QOZB 70% tangible property tests.</li>
											<li>Keep a dated 31/62‑month working‑capital plan with milestones and updates.</li>
											<li>Document original use vs. substantial improvement as needed.</li>
											<li>Get counsel notes on structure, related‑party rules, and prohibited businesses.</li>
										</ul>
										<p className="mt-2"><i>Red flags</i>: missing written plans; hand‑wavy compliance.</p>
									</article>
									<div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 not-prose my-4">
										<div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-medium mb-2"><Info className="w-5 h-5" />Avoid these OZ pitfalls</div>
										<ul className="list-disc pl-5 text-base sm:text-lg text-blue-900/90 dark:text-blue-200/90 space-y-1">
											<li>Miscounting land or purchase price allocation toward substantial improvement.</li>
											<li>Missing 180‑day windows for partnership gains or not tracking shareholder elections.</li>
											<li>Working‑capital plans without dated milestones or draw schedules.</li>
										</ul>
									</div>
								</section>

								{/* Operations */}
								<section id="operations" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-lg">
									<div className="flex items-center gap-2 mb-2 text-[#1e88e5] text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider">7. Operating Excellence</div>
									<article className="prose prose-gray sm:prose-lg dark:prose-invert max-w-none">
										<p>
											Operations create durable value. Watch leasing velocity, renewals, expense discipline, and tenant
											experience. Short, weekly KPI reviews help prevent quarterly surprises.
										</p>
										<ul className="list-disc pl-5">
											<li>Track the lead‑to‑lease funnel; assign ownership of cost per signed lease.</li>
											<li>Use data and SLAs to manage energy, maintenance, and turns.</li>
											<li>Engage owner’s reps who can read both budgets and schedules.</li>
										</ul>
									</article>
								</section>

								{/* Governance */}
								<section id="governance" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-lg">
									<div className="flex items-center gap-2 mb-2 text-[#1e88e5] text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider">8. Reporting & Governance</div>
									<article className="prose prose-gray sm:prose-lg dark:prose-invert max-w-none">
										<p>
											Clear reporting builds trust. Share monthly updates, explain variance, and record key decisions.
											Board‑quality packages speed decisions when conditions change.
										</p>
										<ul className="list-disc pl-5">
											<li><b>Admin & audit</b>: top‑tier administrator, annual audit, clear NAV/K‑1 SLAs<br/><i>Watch for</i>: DIY admin; late K‑1s</li>
											<li><b>Quarterly dashboard</b>: occupancy/pre‑leasing, DSCR, LTC/LTV, <b>budget‑to‑actual</b>, contingency burn, schedule variance, change‑orders, procurement status<br/><i>Watch for</i>: no look‑through; unexplained metric drift</li>
											<li><b>Valuation policy</b>: methods, frequency, and third‑party inputs</li>
											<li><b>Investor docs</b>: PPM, LPA/LLC, fee table, side letters, co‑invest rights</li>
											<li><b>K‑1 timing & state</b>: multi‑state filing guide and conformity notes</li>
											<li>Keep a plain‑English risk register with owners and dates; tie decisions to OZ milestones.</li>
										</ul>
										
									</article>
								</section>
																{/* Sections as cards continued */}
								<section id="what-we-do" className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-xl">
									<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-emerald-400/10" />
									<div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
										<h3 className="text-lg sm:text-xl font-semibold tracking-tight">Ready to proceed?</h3>
										<div className="flex gap-3">
											<a href="/listings" className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium bg-[#1e88e5] text-white hover:bg-[#1875c4] transition-colors">View listings</a>
											<a href="/schedule-a-call" className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium border border-[#1e88e5] text-[#1e88e5] hover:bg-[#1e88e5]/10 transition-colors">Schedule a call</a>
										</div>
									</div>
								</section>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
} 