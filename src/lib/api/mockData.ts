import {
  Company,
  CompanyOverview,
  NewsArticle,
  Competitor,
  Forecast,
  ExecutiveSummary,
  Product,
  FinancialStatement,
  SentimentData,
  SavedReport
} from "./types";

// 1. Initial Ingested Companies
export const MOCK_COMPANIES: Record<string, Company> = {
  nvidia: {
    id: "co_nvidia",
    name: "NVIDIA Corporation",
    ticker: "NVDA",
    slug: "nvidia",
    industry: "Semiconductors & AI Hardware",
    headquarters: "Santa Clara, California",
    ceo: "Jensen Huang",
    founded: 1993,
    marketCap: "$3.12 Trillion",
    status: "Ingested"
  },
  tesla: {
    id: "co_tesla",
    name: "Tesla, Inc.",
    ticker: "TSLA",
    slug: "tesla",
    industry: "Automotive & Clean Energy",
    headquarters: "Austin, Texas",
    ceo: "Elon Musk",
    founded: 2003,
    marketCap: "$820.5 Billion",
    status: "Ingested"
  },
  microsoft: {
    id: "co_microsoft",
    name: "Microsoft Corporation",
    ticker: "MSFT",
    slug: "microsoft",
    industry: "Software & Cloud Computing",
    headquarters: "Redmond, Washington",
    ceo: "Satya Nadella",
    founded: 1975,
    marketCap: "$3.28 Trillion",
    status: "Ingested"
  },
  apple: {
    id: "co_apple",
    name: "Apple Inc.",
    ticker: "AAPL",
    slug: "apple",
    industry: "Consumer Electronics & Tech",
    headquarters: "Cupertino, California",
    ceo: "Tim Cook",
    founded: 1976,
    marketCap: "$3.43 Trillion",
    status: "Ingested"
  }
};

// 2. SWOT & Company Overviews
export const MOCK_OVERVIEWS: Record<string, CompanyOverview> = {
  nvidia: {
    companyId: "co_nvidia",
    summary: "NVIDIA Corporation is the pioneer of GPU-accelerated computing. The company has evolved from a graphics-card manufacturer into a full-stack computing provider, capturing a dominant share of the global artificial intelligence chip market. NVIDIA's CUDA programming platform acts as a significant moat, locking in developers and enterprise customers.",
    strengths: [
      "Dominant market share (80%+) in AI accelerators and training chips.",
      "CUDA programming ecosystem creates a massive developer lock-in moat.",
      "Exceptional pricing power and gross margin profile (~75%).",
      "Pioneering expertise in graphics pipelines and real-time ray tracing."
    ],
    weaknesses: [
      "Heavy reliance on TSMC for semiconductor fabrication (geo-risk).",
      "Highly cyclical nature of semiconductor industry.",
      "Complex supply chain bottlenecks (CoWoS packaging capacity).",
      "Concentration of revenue in a few major hyper-scaler cloud clients."
    ],
    opportunities: [
      "Explosive growth in generative AI, LLM training, and real-time inference.",
      "Expanding presence in autonomous driving systems (NVIDIA DRIVE).",
      "Growth of digital twins and industrial simulation via NVIDIA Omniverse.",
      "Expansion into custom silicon designs for bespoke hyperscaler clouds."
    ],
    threats: [
      "Intensifying competition from AMD (MI300 series) and Intel (Gaudi).",
      "Internal custom chip development by top clients (Google TPU, AWS Trainium, Meta MTIA).",
      "Geopolitical export restrictions restricting sales to key markets like China.",
      "Potential bubble risk or cooling demand in generative AI infrastructure spend."
    ]
  },
  tesla: {
    companyId: "co_tesla",
    summary: "Tesla, Inc. designs, develops, manufactures, sells, and leases fully electric vehicles, energy generation systems, and storage solutions. Tesla is a leader in EV manufacturing efficiency and is heavily investing in machine learning, full self-driving (FSD) neural networks, and humanoid robotics (Optimus).",
    strengths: [
      "Industry-leading manufacturing margins and Gigafactory operational scale.",
      "Strong vertical integration, including battery pack design and direct sales channel.",
      "Massive real-world driving database for FSD autopilot training.",
      "Unrivaled global Supercharger charging network."
    ],
    weaknesses: [
      "Volatility and public relations risks surrounding CEO communication.",
      "Limited vehicle lineup compared to legacy automotive brands.",
      "Slower-than-expected deployment timelines for next-generation platforms.",
      "Relatively high reliance on regulatory carbon credits for net margin padding."
    ],
    opportunities: [
      "Licensing Full Self-Driving (FSD) software to other automotive manufacturers.",
      "Commercialization of autonomous Robotaxi network and ride-hailing app.",
      "Utility-scale battery storage expansion (Megapack grid projects).",
      "Mass production of Optimus humanoid robots for industrial manufacturing."
    ],
    threats: [
      "Fierce pricing competition from Chinese EV makers (BYD, Geely, Xiaomi).",
      "Slowing global EV adoption rate and rising hybrid vehicle consumer interest.",
      "Regulatory investigations into Autopilot and FSD safety incidents.",
      "Lithium supply chain volatility and raw material pricing pressure."
    ]
  },
  microsoft: {
    companyId: "co_microsoft",
    summary: "Microsoft Corporation is a global technology powerhouse. It has successfully transitioned into a cloud-first company through Azure. With its partnership with OpenAI, Microsoft has positioned itself at the forefront of the generative AI boom, integrating Copilot across its massive enterprise software suite (Office, Windows, GitHub).",
    strengths: [
      "Azure is the primary commercial cloud choice for global Fortune 500 enterprises.",
      "High-margin recurring revenue stream from Office 365, Windows, and LinkedIn.",
      "Exclusive commercial partnership and major equity stake in OpenAI.",
      "Unrivaled enterprise distribution channels and developer ecosystem."
    ],
    weaknesses: [
      "Perceived high legacy overhead and slow execution in consumer markets.",
      "Vulnerability to high-profile security breaches (Exchange, cloud infrastructure).",
      "Complex integration of massive acquisitions (Activision Blizzard, LinkedIn).",
      "Rising CAPEX spending required to build out GPU data centers."
    ],
    opportunities: [
      "Copilot integration driving higher average revenue per user (ARPU).",
      "Accelerated cloud migration of legacy on-premises databases to Azure.",
      "Gaming expansion via Xbox Game Pass and mobile titles.",
      "Expanding productivity tools with low-code AI automation agents."
    ],
    threats: [
      "Antitrust scrutiny from US and EU regulators regarding OpenAI partnership.",
      "Aggressive cloud competition from Amazon Web Services (AWS) and Google Cloud.",
      "Rapid shifts in AI technology that could disrupt traditional Office software.",
      "Cybersecurity regulatory audits and reputation loss from critical exploits."
    ]
  },
  apple: {
    companyId: "co_apple",
    summary: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories. Apple is renowned for its premium hardware-software integration, massive ecosystem lock-in, and high-margin Services division (App Store, iCloud, Apple Pay).",
    strengths: [
      "Unrivaled brand loyalty and massive ecosystem lock-in (iOS, macOS, watchOS).",
      "Premium hardware pricing power and superior industrial design.",
      "Massive cash flow generation and solid balance sheet cushion.",
      "High-margin Services division growing faster than hardware sales."
    ],
    weaknesses: [
      "High dependency on iPhone sales (approx. 50% of total revenue).",
      "Slower market introduction of native generative AI (Apple Intelligence).",
      "Concentrated supply chain fabrication in China and Taiwan.",
      "Closed ecosystem under heavy regulatory threat globally."
    ],
    opportunities: [
      "Apple Intelligence integration driving a massive hardware upgrade cycle.",
      "Expansion into spatial computing and augmented reality (Vision Pro).",
      "Growth of financial services (Apple Card, Apple Pay) in global markets.",
      "Expanding health tech tracking via wearable hardware sensor suites."
    ],
    threats: [
      "Antitrust lawsuits challenging App Store commission fees and defaults.",
      "Geopolitical tensions between US and China impacting sales/manufacturing.",
      "Hardware saturation in developed smartphone markets.",
      "Disruption from open-source AI models bypasses App Store Gatekeeper status."
    ]
  }
};

// 3. News Articles
export const MOCK_NEWS: Record<string, NewsArticle[]> = {
  nvidia: [
    {
      id: "news_nvda_1",
      title: "NVIDIA Blackwell B200 Chips Hit Full Production in Shipments",
      source: "Reuters",
      url: "https://reuters.com",
      publishedAt: "2 hours ago",
      summary: "NVIDIA's next-generation Blackwell architecture has cleared tape-out bugs and is now entering high-volume fabrication at TSMC. Major hyperscalers report immediate orders for AI clusters.",
      sentiment: "positive",
      impactScore: 9
    },
    {
      id: "news_nvda_2",
      title: "US Regulator Launches Antitrust Probe into GPU Distribution Moats",
      source: "Wall Street Journal",
      url: "https://wsj.com",
      publishedAt: "1 day ago",
      summary: "The DOJ is investigating whether NVIDIA leverages its developer platform CUDA or bundle allocations to penalize enterprise clients who purchase competitor AI hardware.",
      sentiment: "negative",
      impactScore: 7
    },
    {
      id: "news_nvda_3",
      title: "Google Announces Custom TPU v6, Claims Better Price-to-Performance",
      source: "TechCrunch",
      url: "https://techcrunch.com",
      publishedAt: "3 days ago",
      summary: "Google has unveiled its latest Custom Tensor Processing Unit, demonstrating significant training efficiency. The silicon represents Google's attempt to cut dependency on NVIDIA hardware.",
      sentiment: "neutral",
      impactScore: 5
    }
  ],
  tesla: [
    {
      id: "news_tsla_1",
      title: "Tesla Cybercab Unveiled with Inductive Charging and No Steering Wheel",
      source: "Bloomberg",
      url: "https://bloomberg.com",
      publishedAt: "4 hours ago",
      summary: "Elon Musk revealed Tesla's dedicated Robotaxi, targeting a price tag below $30,000. Autonomous operations are scheduled to begin with Model 3 and Y in Texas and California next year.",
      sentiment: "positive",
      impactScore: 8
    },
    {
      id: "news_tsla_2",
      title: "European EV Inregistrations Drop 12% as Subsidies Phase Out",
      source: "Financial Times",
      url: "https://ft.com",
      publishedAt: "1 day ago",
      summary: "Tesla Model Y deliveries recorded a drop in Germany and France following the abrupt end of federal electric vehicle incentives, forcing Tesla to offer temporary interest-rate cuts.",
      sentiment: "negative",
      impactScore: 6
    }
  ],
  microsoft: [
    {
      id: "news_msft_1",
      title: "Microsoft and OpenAI Plan $100B Stargate Supercomputer Project",
      source: "The Information",
      url: "https://theinformation.com",
      publishedAt: "1 day ago",
      summary: "The tech giant is planning a massive data center project that would house millions of GPU chips to train GPT-6, pushing Azure's infrastructure capability to unprecedented scale.",
      sentiment: "positive",
      impactScore: 8
    },
    {
      id: "news_msft_2",
      title: "EU Regulators Prepare Charges Against Microsoft Teams Bundling",
      source: "CNBC",
      url: "https://cnbc.com",
      publishedAt: "2 days ago",
      summary: "Despite unbundling Office and Teams globally, Microsoft faces impending formal antitrust charges in Europe following complaints from collaboration software competitor Slack.",
      sentiment: "negative",
      impactScore: 5
    }
  ],
  apple: [
    {
      id: "news_aapl_1",
      title: "iPhone 17 Pro Production to Leverage TSMC 2nm Process Nodes",
      source: "DigiTimes",
      url: "https://digitimes.com",
      publishedAt: "3 hours ago",
      summary: "Supply chain updates confirm Apple has secured TSMC's entire initial production run of 2nm processor nodes to power Apple Intelligence cores on next year's flagship hardware line.",
      sentiment: "positive",
      impactScore: 9
    },
    {
      id: "news_aapl_2",
      title: "DOJ Accuses Apple of Monopolizing Smartphone Markets in Landmark Case",
      source: "Associated Press",
      url: "https://apnews.com",
      publishedAt: "2 days ago",
      summary: "The US Justice Department filed a sweeping antitrust lawsuit, claiming Apple blocks cloud gaming apps, limits third-party smartwatches, and suppresses cross-platform messaging APIs.",
      sentiment: "negative",
      impactScore: 8
    }
  ]
};

// 4. Competitors (Comparison Data)
export const MOCK_COMPETITORS: Record<string, Competitor[]> = {
  nvidia: [
    { name: "NVIDIA (Target)", marketCap: "$3.12T", peRatio: "65.4", revenueGrowth: "115.0%", operatingMargin: "62.1%", rdIntensity: "12.4%", debtToEquity: "0.15", isTargetCompany: true },
    { name: "AMD", marketCap: "$240.2B", peRatio: "110.2", revenueGrowth: "15.2%", operatingMargin: "14.8%", rdIntensity: "19.5%", debtToEquity: "0.08" },
    { name: "Intel Corp.", marketCap: "$130.5B", peRatio: "95.1", revenueGrowth: "-2.1%", operatingMargin: "4.5%", rdIntensity: "30.2%", debtToEquity: "0.45" },
    { name: "Qualcomm", marketCap: "$180.8B", peRatio: "22.3", revenueGrowth: "8.4%", operatingMargin: "28.5%", rdIntensity: "14.2%", debtToEquity: "0.35" }
  ],
  tesla: [
    { name: "Tesla (Target)", marketCap: "$820.5B", peRatio: "58.2", revenueGrowth: "10.5%", operatingMargin: "12.1%", rdIntensity: "4.8%", debtToEquity: "0.05", isTargetCompany: true },
    { name: "BYD Auto", marketCap: "$120.4B", peRatio: "18.4", revenueGrowth: "28.5%", operatingMargin: "6.8%", rdIntensity: "5.4%", debtToEquity: "0.22" },
    { name: "Ford Motor", marketCap: "$48.2B", peRatio: "11.2", revenueGrowth: "4.1%", operatingMargin: "3.2%", rdIntensity: "2.1%", debtToEquity: "1.85" },
    { name: "General Motors", marketCap: "$52.1B", peRatio: "5.4", revenueGrowth: "5.2%", operatingMargin: "4.5%", rdIntensity: "2.3%", debtToEquity: "1.60" }
  ],
  microsoft: [
    { name: "Microsoft (Target)", marketCap: "$3.28T", peRatio: "35.1", revenueGrowth: "16.2%", operatingMargin: "43.5%", rdIntensity: "13.1%", debtToEquity: "0.28", isTargetCompany: true },
    { name: "Amazon (AWS)", marketCap: "$1.95T", peRatio: "42.5", revenueGrowth: "12.5%", operatingMargin: "18.5%", rdIntensity: "11.2%", debtToEquity: "0.38" },
    { name: "Alphabet (Google)", marketCap: "$2.15T", peRatio: "25.2", revenueGrowth: "14.8%", operatingMargin: "31.2%", rdIntensity: "14.5%", debtToEquity: "0.09" }
  ],
  apple: [
    { name: "Apple (Target)", marketCap: "$3.43T", peRatio: "31.2", revenueGrowth: "6.4%", operatingMargin: "30.5%", rdIntensity: "7.8%", debtToEquity: "1.45", isTargetCompany: true },
    { name: "Samsung Electronics", marketCap: "$360.5B", peRatio: "15.4", revenueGrowth: "4.2%", operatingMargin: "10.2%", rdIntensity: "9.2%", debtToEquity: "0.10" },
    { name: "Alphabet", marketCap: "$2.15T", peRatio: "25.2", revenueGrowth: "14.8%", operatingMargin: "31.2%", rdIntensity: "14.5%", debtToEquity: "0.09" }
  ]
};

// 5. ML Forecast Data
export const MOCK_FORECASTS: Record<string, Forecast[]> = {
  nvidia: [
    { year: "2024", revenue: 96.3, growth: 112.5, ebitda: 55.4, scenario: "Base" },
    { year: "2025 (Proj)", revenue: 145.2, growth: 50.7, ebitda: 88.2, scenario: "Base" },
    { year: "2026 (Proj)", revenue: 182.5, growth: 25.6, ebitda: 112.0, scenario: "Base" },
    { year: "2027 (Proj)", revenue: 215.4, growth: 18.0, ebitda: 134.5, scenario: "Base" },
    { year: "2028 (Proj)", revenue: 245.0, growth: 13.7, ebitda: 155.0, scenario: "Base" },
    // Optimistic
    { year: "2025 (Proj)", revenue: 165.0, growth: 71.3, ebitda: 102.0, scenario: "Optimistic" },
    { year: "2026 (Proj)", revenue: 220.0, growth: 33.3, ebitda: 140.0, scenario: "Optimistic" },
    { year: "2027 (Proj)", revenue: 275.0, growth: 25.0, ebitda: 180.0, scenario: "Optimistic" },
    { year: "2028 (Proj)", revenue: 320.0, growth: 16.3, ebitda: 212.0, scenario: "Optimistic" },
    // Pessimistic
    { year: "2025 (Proj)", revenue: 120.0, growth: 24.6, ebitda: 70.0, scenario: "Pessimistic" },
    { year: "2026 (Proj)", revenue: 140.0, growth: 16.6, ebitda: 82.0, scenario: "Pessimistic" },
    { year: "2027 (Proj)", revenue: 155.0, growth: 10.7, ebitda: 90.0, scenario: "Pessimistic" },
    { year: "2028 (Proj)", revenue: 165.0, growth: 6.4, ebitda: 95.0, scenario: "Pessimistic" }
  ],
  tesla: [
    { year: "2024", revenue: 98.4, growth: 1.5, ebitda: 14.2, scenario: "Base" },
    { year: "2025 (Proj)", revenue: 112.5, growth: 14.3, ebitda: 17.8, scenario: "Base" },
    { year: "2026 (Proj)", revenue: 132.0, growth: 17.3, ebitda: 22.1, scenario: "Base" },
    { year: "2027 (Proj)", revenue: 160.5, growth: 21.5, ebitda: 28.5, scenario: "Base" },
    { year: "2028 (Proj)", revenue: 195.0, growth: 21.4, ebitda: 36.0, scenario: "Base" },
    // Optimistic
    { year: "2025 (Proj)", revenue: 125.0, growth: 27.0, ebitda: 20.5, scenario: "Optimistic" },
    { year: "2026 (Proj)", revenue: 162.0, growth: 29.6, ebitda: 28.2, scenario: "Optimistic" },
    { year: "2027 (Proj)", revenue: 210.0, growth: 29.6, ebitda: 38.5, scenario: "Optimistic" },
    { year: "2028 (Proj)", revenue: 270.0, growth: 28.5, ebitda: 52.0, scenario: "Optimistic" },
    // Pessimistic
    { year: "2025 (Proj)", revenue: 102.0, growth: 3.6, ebitda: 13.0, scenario: "Pessimistic" },
    { year: "2026 (Proj)", revenue: 108.0, growth: 5.8, ebitda: 14.1, scenario: "Pessimistic" },
    { year: "2027 (Proj)", revenue: 114.0, growth: 5.5, ebitda: 15.0, scenario: "Pessimistic" },
    { year: "2028 (Proj)", revenue: 120.0, growth: 5.2, ebitda: 15.8, scenario: "Pessimistic" }
  ]
};

// 6. LangGraph Executive Summaries
export const MOCK_SUMMARIES: Record<string, ExecutiveSummary> = {
  nvidia: {
    companyId: "co_nvidia",
    compiledAt: "Jul 4, 2026",
    compiledBy: "LangGraph Agent - Orchestrator v1.8",
    briefing: "NVIDIA Corporation has cemented its position as the engine of the AI Revolution. Our multi-agent crawling network has scanned 1,200 data points across SEC Edgar filings, developer forums, and logistics spreadsheets. Our core thesis: NVIDIA's CUDA software framework remains an impenetrable moat, preventing immediate market-share erosion despite AMD's hardware catching up in raw flops. The biggest operational risk is supply chain packaging concentration at TSMC (CoWoS capacity). Financial metrics indicate extremely strong free cash flow yield, which mitigates long-term chip cycles.",
    riskScore: 28, // Low to moderate risk due to strong financial positioning
    recommendations: [
      "Monitor TSMC CoWoS capacity monthly updates to identify manufacturing supply line caps.",
      "Track Google/AWS/Meta internal TPU/custom silicon development roadmaps to detect hyper-scaler substitution rates.",
      "Overweight NVIDIA DRIVE platforms as a long-term enterprise growth hedge to compute hardware cyclicality."
    ],
    signatures: [
      { name: "Alpha_Crawler_Agent", role: "SEC Document Parser" },
      { name: "Synthesis_Review_Agent", role: "Lead Reasoning Model" }
    ]
  },
  tesla: {
    companyId: "co_tesla",
    compiledAt: "Jul 4, 2026",
    compiledBy: "LangGraph Agent - Orchestrator v1.8",
    briefing: "Tesla, Inc. is undergoing a transformation from a high-volume EV manufacturer to an AI and robotics company. FSD Autopilot compute expansion represents a significant long-term growth driver, with hardware clusters now exceeding 100,000 H100 GPUs. Short-term headwinds include pricing contraction from Chinese competitors like BYD. Core thesis: Tesla's valuation depends entirely on FSD licensing, Robotaxi networks, and Optimus commercialization. Traditional EV delivery metrics represent a trailing indicator.",
    riskScore: 48, // Moderate-high risk due to high valuation multiples and regulatory dependency
    recommendations: [
      "Perform monthly validation checks of FSD neural network safety metrics in California and Texas regulatory registries.",
      "Benchmark BYD and Xiaomi product specifications to monitor competitive EV pricing pressures in European markets.",
      "Track Megapack battery grid installation metrics as a growing high-margin stabilizer."
    ],
    signatures: [
      { name: "Scraper_Agent_12", role: "Regulatory Registry Parser" },
      { name: "Synthesis_Review_Agent", role: "Lead Reasoning Model" }
    ]
  }
};

// 7. Products and Segment Revenue Data
export const MOCK_PRODUCTS: Record<string, Product[]> = {
  nvidia: [
    { id: "prod_nvda_1", name: "HGX & DGX H100/H200 Accelerators", description: "Compute clusters for hyperscaler data centers and LLM training pipelines.", marketShare: 82, revenueSegment: "Data Center Compute" },
    { id: "prod_nvda_2", name: "Blackwell GB200 NVL72", description: "Liquid-cooled cabinet architecture linking 72 GPUs with NVLink switches.", marketShare: 90, revenueSegment: "Data Center Compute" },
    { id: "prod_nvda_3", name: "GeForce RTX 4090/4080 GPU", description: "Premium consumer graphics cards for gaming, creators, and local AI developers.", marketShare: 78, revenueSegment: "Gaming Graphics" },
    { id: "prod_nvda_4", name: "NVIDIA DRIVE Thor", description: "Centralized computing platform for autonomous driving systems and advanced driver assistance.", marketShare: 35, revenueSegment: "Automotive AI" }
  ],
  tesla: [
    { id: "prod_tsla_1", name: "Model Y & Model 3 Vehicles", description: "Electric crossover and sedan lines representing bulk automotive unit shipments.", marketShare: 45, revenueSegment: "Automotive Sales" },
    { id: "prod_tsla_2", name: "Full Self-Driving (FSD) Beta", description: "Neural network-based driver assistance subscription package.", marketShare: 32, revenueSegment: "Software Services" },
    { id: "prod_tsla_3", name: "Megapack & Powerwall Systems", description: "Utility-scale and residential battery storage cells.", marketShare: 24, revenueSegment: "Energy Storage" }
  ]
};

// 8. Financial Statements
export const MOCK_FINANCIALS: Record<string, FinancialStatement> = {
  nvidia: {
    companyId: "co_nvidia",
    years: ["FY 2023", "FY 2024", "FY 2025"],
    incomeStatement: [
      { label: "Total Revenue", bold: true, values: [27.0, 60.9, 96.3] },
      { label: "Cost of Revenue", bold: false, values: [11.6, 16.6, 24.1] },
      { label: "Gross Profit", bold: true, values: [15.4, 44.3, 72.2] },
      { label: "Research & Development (R&D)", bold: false, values: [7.3, 8.6, 12.0] },
      { label: "Selling, General & Admin (SG&A)", bold: false, values: [2.4, 2.7, 3.8] },
      { label: "Operating Income", bold: true, values: [5.7, 33.0, 56.4] },
      { label: "Net Income", bold: true, values: [4.4, 29.8, 50.1] }
    ],
    balanceSheet: [
      { label: "Cash & Equivalents", bold: true, values: [13.3, 26.0, 34.5] },
      { label: "Total Assets", bold: true, values: [41.2, 65.7, 85.0] },
      { label: "Total Liabilities", bold: true, values: [19.1, 22.8, 26.5] },
      { label: "Shareholders Equity", bold: true, values: [22.1, 42.9, 58.5] }
    ],
    cashFlow: [
      { label: "Operating Cash Flow", bold: true, values: [5.6, 28.1, 46.8] },
      { label: "Capital Expenditures", bold: false, values: [-1.8, -2.5, -3.2] },
      { label: "Free Cash Flow", bold: true, values: [3.8, 25.6, 43.6] }
    ]
  },
  tesla: {
    companyId: "co_tesla",
    years: ["FY 2023", "FY 2024", "FY 2025"],
    incomeStatement: [
      { label: "Total Revenue", bold: true, values: [96.7, 98.4, 112.5] },
      { label: "Cost of Revenue", bold: false, values: [79.1, 80.5, 91.2] },
      { label: "Gross Profit", bold: true, values: [17.6, 17.9, 21.3] },
      { label: "Research & Development (R&D)", bold: false, values: [3.9, 4.2, 4.8] },
      { label: "Selling, General & Admin (SG&A)", bold: false, values: [4.8, 5.1, 5.5] },
      { label: "Operating Income", bold: true, values: [8.9, 8.6, 11.0] },
      { label: "Net Income", bold: true, values: [15.0, 13.4, 15.6] }
    ],
    balanceSheet: [
      { label: "Cash & Equivalents", bold: true, values: [29.1, 31.0, 34.2] },
      { label: "Total Assets", bold: true, values: [104.5, 108.2, 118.0] },
      { label: "Total Liabilities", bold: true, values: [43.0, 41.5, 43.8] },
      { label: "Shareholders Equity", bold: true, values: [61.5, 66.7, 74.2] }
    ],
    cashFlow: [
      { label: "Operating Cash Flow", bold: true, values: [13.2, 14.2, 17.8] },
      { label: "Capital Expenditures", bold: false, values: [-8.9, -9.2, -9.8] },
      { label: "Free Cash Flow", bold: true, values: [4.3, 5.0, 8.0] }
    ]
  }
};

// 9. Sentiment Data
export const MOCK_SENTIMENTS: Record<string, SentimentData> = {
  nvidia: {
    companyId: "co_nvidia",
    positive: 74,
    neutral: 18,
    negative: 8,
    socialSentiment: { score: 82, label: "Strong Bullish" },
    earningsCallSentiment: { score: 68, label: "Favorable (Focus on Scale)" },
    employeeSentiment: { score: 91, label: "Exceptional (Top-Tier CEO Rating)" }
  },
  tesla: {
    companyId: "co_tesla",
    positive: 52,
    neutral: 24,
    negative: 24,
    socialSentiment: { score: 12, label: "Mixed Volatility" },
    earningsCallSentiment: { score: 45, label: "Cautious Optimism" },
    employeeSentiment: { score: 72, label: "Good (High Innovation Interest)" }
  }
};

// 10. Saved Reports
export const MOCK_REPORTS: SavedReport[] = [
  {
    id: "rep_nvda_1",
    title: "NVIDIA Q2 Intelligence Profile",
    companyId: "co_nvidia",
    companyName: "NVIDIA Corporation",
    meta: "PDF • 2.4MB • Synthesized by Alex Mercer",
    date: "Jul 2, 2026"
  },
  {
    id: "rep_tsla_1",
    title: "Tesla vs BYD Competitor Analysis",
    companyId: "co_tesla",
    companyName: "Tesla, Inc.",
    meta: "PDF • 1.8MB • Synthesized by Alex Mercer",
    date: "Jun 28, 2026"
  }
];
