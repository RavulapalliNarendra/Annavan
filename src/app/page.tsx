import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, TrendingUp, Users, Sparkles, Cpu, Award } from "lucide-react";

export default function Home() {
  const tickerItems = [
    { name: "Wheat (Sharbati)", rate: "₹28.50/kg", trend: "+2.1%", up: true },
    { name: "Basmati Rice", rate: "₹95.00/kg", trend: "0.0%", stable: true },
    { name: "Gujarat Cotton", rate: "₹62.00/kg", trend: "-1.5%", down: true },
    { name: "Nashik Onion", rate: "₹18.00/kg", trend: "+5.4%", up: true },
    { name: "Agra Potato", rate: "₹12.00/kg", trend: "-2.1%", down: true },
    { name: "Sona Masuri Rice", rate: "₹46.00/kg", trend: "+3.2%", up: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[620px] flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image & Forest Green Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/farm-bg.jpg"
            alt="Farm Background"
            className="w-full h-full object-cover select-none"
          />
          {/* Subtle gradient overlay to blend into the design */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-slate-900" />
        </div>

        {/* Ambient Glowing lights */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "3s" }} />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-400/30 backdrop-blur rounded-full text-green-300 text-xs font-bold uppercase tracking-wider mb-6 animate-float">
            <Leaf size={14} className="text-green-400 animate-pulse" /> Direct Farmer-to-Market Portal
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
            Connecting Farmers Directly with <span className="text-green-400">Trusted Buyers</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Empowering agricultural ecosystems with fair transparent pricing, secure digital escrow payments, and state-of-the-art AI quality inspection.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/login?role=farmer"
              className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-full shadow-lg shadow-green-700/20 hover:shadow-green-600/30 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-98"
            >
              <Leaf size={18} />
              List Crops to Sell
            </Link>
            <Link
              href="/market-prices"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/80 hover:border-white text-white font-bold rounded-full shadow-md hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <TrendingUp size={18} />
              Check Live Mandi Prices
            </Link>
          </div>
        </div>
      </section>

      {/* Live Market Rate Ticker */}
      <div className="bg-slate-900 border-y border-slate-800 py-3 overflow-hidden select-none z-10 relative">
        <div className="w-full flex items-center">
          <div className="bg-green-900 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-r-lg z-20 shadow-lg border-r border-green-800 flex items-center gap-1.5 shrink-0 absolute left-0 h-full top-0">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            Live Mandi Rates
          </div>
          <div className="flex gap-16 pl-44 animate-ticker">
            {/* Render items twice to build a seamless looping effect */}
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-300 font-mono text-xs whitespace-nowrap">
                <span className="font-bold text-white">{item.name}</span>
                <span className="font-semibold text-slate-400">{item.rate}</span>
                <span className={`text-[10px] font-bold ${
                  item.up ? "text-green-400" : item.down ? "text-red-400" : "text-slate-500"
                }`}>
                  {item.up ? "▲" : item.down ? "▼" : "•"} {item.trend}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart/AI Agri-tech Features Showcase */}
      <section className="py-20 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Explore Our <span className="text-green-400">AI-Powered Tools</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Utilize next-generation technologies designed to enhance crop valuation, eliminate disputes, and track real-time trends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Grader card */}
            <div className="glass-card-dark p-8 rounded-3xl border border-white/5 hover:border-green-500/30 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition duration-300">
                  <Cpu size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  AI Crop Health & Quality Grader <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Farmers can instantly evaluate crop grain samples. Our optical analyzer runs spectral assessments for moisture levels, impurity weight, and damage, instantly providing an objective Grade A, B, or C certification.
                </p>
              </div>

              {/* Decorative scan simulation mockup */}
              <div className="relative h-28 bg-slate-950/80 rounded-xl overflow-hidden mb-6 border border-white/5 flex items-center justify-center">
                <img src="/images/farm-bg.jpg" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-green-400 shadow-[0_0_8px_#22c55e] animate-scan" />
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-green-400">
                  [SYSTEM_GRADED: GRADE_A_OPTIMAL]
                </div>
              </div>

              <Link
                href="/ai-grader"
                className="inline-flex items-center gap-1.5 text-green-400 font-bold hover:text-green-300 text-sm group-hover:gap-2.5 transition-all"
              >
                Scan Crop Sample Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Price Predictor card */}
            <div className="glass-card-dark p-8 rounded-3xl border border-white/5 hover:border-yellow-500/30 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition duration-300">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Mandi Price Predictor & Trends
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Leverage machine learning forecasts for the next 30 days. Plan when to sell or buy based on historical mandi rates, local weather fluctuations, soil indices, and storage occupancy models.
                </p>
              </div>

              {/* Decorative chart simulation mockup */}
              <div className="relative h-28 bg-slate-950/80 rounded-xl overflow-hidden mb-6 border border-white/5 p-4 flex flex-col justify-end">
                <svg viewBox="0 0 100 30" className="w-full overflow-visible">
                  <path d="M 0 25 L 20 22 L 40 15 L 60 18 L 80 10 L 100 5" fill="none" stroke="#22c55e" strokeWidth="1.5" />
                  <path d="M 80 10 L 100 5" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="1,1" />
                  <circle cx="80" cy="10" r="1.5" fill="#22c55e" />
                  <circle cx="100" cy="5" r="1.5" fill="#eab308" />
                </svg>
                <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-2">
                  <span>MAR</span>
                  <span>APR</span>
                  <span>MAY</span>
                  <span className="text-yellow-400">JUN (F)</span>
                </div>
              </div>

              <Link
                href="/mandi-trends"
                className="inline-flex items-center gap-1.5 text-yellow-400 font-bold hover:text-yellow-300 text-sm group-hover:gap-2.5 transition-all"
              >
                View Price Outlook <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Core Values Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
              Why Agriculture Chooses <span className="text-green-600">Annavan</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-md mx-auto">
              We replace unstable mediator-dependent deals with modern, automated safeguards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 hover:bg-slate-100/50 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all duration-300 text-center flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 text-green-700 rounded-2xl mb-6 shadow-inner">
                <Users size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Farmer First Direct Sales</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Farmers list their crops and retain full autonomy over their pricing. Buyers deal directly with the source.
              </p>
            </div>

            <div className="p-8 bg-slate-50 hover:bg-slate-100/50 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all duration-300 text-center flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 text-green-700 rounded-2xl mb-6 shadow-inner">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Razorpay Escrow System</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Integrated payment gateways secure funds beforehand. Payouts are made directly into verified bank accounts upon delivery.
              </p>
            </div>

            <div className="p-8 bg-slate-50 hover:bg-slate-100/50 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all duration-300 text-center flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 text-green-700 rounded-2xl mb-6 shadow-inner">
                <Award size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Quality Badges</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Crops with optical grading reports feature visible certificates on the marketplace, ensuring faster buyer commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-950 text-white relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
            Ready to Revolutionize Agri-trading?
          </h2>
          <p className="text-sm sm:text-lg text-green-200/80 mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of verified farmers and commercial buyers leveraging transparency, speed, and AI metrics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login?role=farmer"
              className="px-8 py-4 bg-white text-green-950 font-bold rounded-full hover:bg-green-50 shadow-lg transition duration-200 text-sm"
            >
              Sign Up as Farmer
            </Link>
            <Link
              href="/login?role=buyer"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition duration-200 text-sm"
            >
              Sign Up as Buyer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
