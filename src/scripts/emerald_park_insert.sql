INSERT INTO oz_projects (
    project_id,
    project_slug, 
    project_name, 
    projected_irr_10yr, 
    equity_multiple_10yr, 
    minimum_investment, 
    executive_summary, 
    property_type, 
    construction_type, 
    status, 
    fund_type, 
    property_class, 
    state
) VALUES (
    gen_random_uuid()::text,
    'emerald-park-ca', 
    'Emerald Park', 
    40.7, 
    5.0, 
    250000, 
    'Emerald Park is uniquely positioned to become the leading provider for this underserved population in the Bay Area, answering an urgent humanitarian need with an elite investment structure.

The property, acquired in 1997, is a Qualified Opportunity Zone (QOZ) project approved for the development of a 426-bed Assisted Living and Memory Care facility. This project is specifically designed to serve low-income seniors who rely on state-funded healthcare programs, a demographic currently facing a growing crisis. As of April 2025, California has approximately 12,000 low-income seniors on waitlists for assisted living beds, yet no comparable facilities in the Bay Area are currently serving this population and no new developments are underway to address it.

With the incoming ''Silver Tsunami'' driving demand primarily among low-income seniors, Emerald Park is positioned for exceptional financial performance. The project offers compelling investor returns including a 40.7% LP IRR and a 5.0x Equity Multiple over a 10-year hold. Conservative projections indicate that investors will receive their initial capital back within just 3 years of operation, while maintaining annual distributions. The operational model is designed to stabilize after 2 years of operation at a conservative 90% occupancy rate.

As a QOZ project, Emerald Park provides three layers of tax incentives: immediate capital gains deferral, depreciation write-offs to offset income, and 100% tax-free gains upon sale. This structure, combined with the inelastic demand for senior care, makes Emerald Park a recession-resilient asset that elevates the aging experience while maximizing asset value. Upon stabilization, the facility becomes a prime target for purchase by Real Estate Investment Trusts (REITs) or large Senior Healthcare Providers looking to expand in Northern California.

Emerald Park represents a rare convergence of high-impact social value, recession-resilient demand, and superior risk-adjusted returns for accredited investors.', 
    'Senior Living', 
    'Ground Up', 
    'Fundraising', 
    'Single-Asset', 
    'class-A', 
    'CA'
);
