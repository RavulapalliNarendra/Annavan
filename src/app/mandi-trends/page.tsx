"use client";

import React, { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Cloud, CloudRain, Sun, Compass, HelpCircle, ChevronRight, BarChart3 } from "lucide-react";

interface DataPoint {
  month: string;
  price: number;
  isForecast?: boolean;
}

interface CropMandiData {
  cropName: string;
  location: string;
  pricePerKg: number;
  trend: "up" | "down" | "stable";
  weatherImpact: string;
  soilMoisture: number;
  riskLevel: "Low" | "Moderate" | "High";
  historical: DataPoint[];
}

const CROP_MARKET_DATA: Record<string, CropMandiData[]> = {
  Wheat: [
    {
      cropName: "Wheat (Sharbati)",
      location: "Madhya Pradesh",
      pricePerKg: 28.5,
      trend: "up",
      weatherImpact: "Late rains delayed harvesting slightly, leading to lower immediate supply and rising prices.",
      soilMoisture: 42,
      riskLevel: "Low",
      historical: [
        { month: "Jan", price: 25.1 },
        { month: "Feb", price: 25.9 },
        { month: "Mar", price: 26.8 },
        { month: "Apr", price: 27.5 },
        { month: "May", price: 28.5 },
        { month: "Jun (F)", price: 29.8, isForecast: true },
      ],
    },
    {
      cropName: "Wheat (Kalyansona)",
      location: "Punjab",
      pricePerKg: 26.2,
      trend: "stable",
      weatherImpact: "Record crop yields in Punjab offset transportation bottlenecks, stabilizing local prices.",
      soilMoisture: 48,
      riskLevel: "Low",
      historical: [
        { month: "Jan", price: 25.5 },
        { month: "Feb", price: 25.7 },
        { month: "Mar", price: 26.0 },
        { month: "Apr", price: 26.2 },
        { month: "May", price: 26.2 },
        { month: "Jun (F)", price: 26.5, isForecast: true },
      ],
    },
  ],
  Rice: [
    {
      cropName: "Basmati Rice (1121)",
      location: "Punjab",
      pricePerKg: 95.0,
      trend: "stable",
      weatherImpact: "Export demands remain strong. Steady water availability via canal networks keeps crop prospects reliable.",
      soilMoisture: 65,
      riskLevel: "Low",
      historical: [
        { month: "Jan", price: 92.0 },
        { month: "Feb", price: 93.5 },
        { month: "Mar", price: 94.5 },
        { month: "Apr", price: 95.0 },
        { month: "May", price: 95.0 },
        { month: "Jun (F)", price: 96.2, isForecast: true },
      ],
    },
    {
      cropName: "Rice (Sona Masuri)",
      location: "Andhra Pradesh",
      pricePerKg: 46.0,
      trend: "up",
      weatherImpact: "Uneven monsoon initiation raised irrigation costs, creating an upward pressure on prices.",
      soilMoisture: 38,
      riskLevel: "Moderate",
      historical: [
        { month: "Jan", price: 41.5 },
        { month: "Feb", price: 42.8 },
        { month: "Mar", price: 44.0 },
        { month: "Apr", price: 45.2 },
        { month: "May", price: 46.0 },
        { month: "Jun (F)", price: 48.5, isForecast: true },
      ],
    },
  ],
  Cotton: [
    {
      cropName: "Cotton (Long Staple)",
      location: "Gujarat",
      pricePerKg: 62.0,
      trend: "down",
      weatherImpact: "Higher global ending stocks and reduced yarn mill demand has dampened domestic cotton valuations.",
      soilMoisture: 35,
      riskLevel: "Moderate",
      historical: [
        { month: "Jan", price: 68.0 },
        { month: "Feb", price: 66.5 },
        { month: "Mar", price: 64.0 },
        { month: "Apr", price: 63.2 },
        { month: "May", price: 62.0 },
        { month: "Jun (F)", price: 60.5, isForecast: true },
      ],
    },
  ],
  Onion: [
    {
      cropName: "Onion (Red)",
      location: "Maharashtra (Nashik)",
      pricePerKg: 18.0,
      trend: "up",
      weatherImpact: "Unseasonal summer rains in storage zones caused bulb decay, contracting supply volumes.",
      soilMoisture: 30,
      riskLevel: "High",
      historical: [
        { month: "Jan", price: 14.5 },
        { month: "Feb", price: 15.0 },
        { month: "Mar", price: 16.2 },
        { month: "Apr", price: 17.0 },
        { month: "May", price: 18.0 },
        { month: "Jun (F)", price: 21.5, isForecast: true },
      ],
    },
  ],
  Potato: [
    {
      cropName: "Potato (Jyoti)",
      location: "Uttar Pradesh (Agra)",
      pricePerKg: 12.0,
      trend: "down",
      weatherImpact: "Bumper harvest and high cold storage occupancy rates keep wholesale pricing constrained.",
      soilMoisture: 52,
      riskLevel: "Low",
      historical: [
        { month: "Jan", price: 15.0 },
        { month: "Feb", price: 14.2 },
        { month: "Mar", price: 13.0 },
        { month: "Apr", price: 12.5 },
        { month: "May", price: 12.0 },
        { month: "Jun (F)", price: 11.2, isForecast: true },
      ],
    },
  ],
};

export default function MandiTrendsPage() {
  const [selectedCrop, setSelectedCrop] = useState<string>("Wheat");
  const [selectedMandiIndex, setSelectedMandiIndex] = useState<number>(0);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: DataPoint } | null>(null);

  const availableMandis = CROP_MARKET_DATA[selectedCrop] || [];
  const currentData = availableMandis[selectedMandiIndex] || availableMandis[0];

  if (!currentData) return <div className="p-12 text-center text-slate-500">Error loading trends.</div>;

  // Calculate drawing coordinates for the SVG chart
  const historyPoints = currentData.historical;
  const pricesOnly = historyPoints.map((h) => h.price);
  const maxPrice = Math.max(...pricesOnly) * 1.1;
  const minPrice = Math.max(0, Math.min(...pricesOnly) * 0.9);
  const priceRange = maxPrice - minPrice;

  // Chart layout config
  const chartWidth = 550;
  const chartHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 30;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const points = historyPoints.map((d, index) => {
    const x = paddingLeft + (index / (historyPoints.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - ((d.price - minPrice) / priceRange) * innerHeight;
    return { x, y, data: d };
  });

  // Line paths
  // 1. Solid history line (first 5 points, indexes 0 to 4)
  const historyPath = points
    .slice(0, 5)
    .reduce((path, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`), "");

  // 2. Dashed forecast line (connecting index 4 and 5)
  const forecastPath = `M ${points[4].x} ${points[4].y} L ${points[5].x} ${points[5].y}`;

  // Area under history line
  const historyAreaPath = `${historyPath} L ${points[4].x} ${paddingTop + innerHeight} L ${points[0].x} ${paddingTop + innerHeight} Z`;

  return (
    <div className="relative min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-green-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-float">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 border border-yellow-200 text-yellow-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
            <Compass size={14} className="animate-spin" style={{ animationDuration: "12s" }} /> Smart Mandi Analytics
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight mb-4">
            Crop Price Predictor & Trends
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Analyze historical crop rates and view simulated 30-day price predictions based on seasonal monsoons, storage capacity, and local soil indicators.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Panel: Selector & Metrics */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="glass-card p-6 rounded-2xl shadow-xl flex-grow">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="text-green-600" /> Filter Market Data
              </h2>

              <div className="space-y-4">
                {/* Crop Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Crop Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(CROP_MARKET_DATA).map((crop) => (
                      <button
                        key={crop}
                        onClick={() => {
                          setSelectedCrop(crop);
                          setSelectedMandiIndex(0);
                        }}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                          selectedCrop === crop
                            ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-600/15"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mandi/Location Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Available Mandis / Market Hubs</label>
                  <div className="space-y-2">
                    {availableMandis.map((m, idx) => (
                      <button
                        key={m.cropName + m.location}
                        onClick={() => setSelectedMandiIndex(idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs flex justify-between items-center transition-all ${
                          selectedMandiIndex === idx
                            ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{m.cropName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{m.location}</p>
                        </div>
                        <ChevronRight size={14} className={selectedMandiIndex === idx ? "text-emerald-600" : "text-slate-400"} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mini Stats Panel */}
              <div className="mt-8 border-t border-slate-100 pt-6 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Wholesale Rate:</span>
                  <span className="font-bold text-slate-900 text-sm">₹{currentData.pricePerKg.toFixed(2)}/kg</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">30-Day Outlook:</span>
                  <span className={`font-semibold flex items-center gap-1 py-0.5 px-2 rounded-full text-[10px] ${
                    currentData.trend === "up" ? "bg-green-100 text-green-700" :
                    currentData.trend === "down" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {currentData.trend === "up" && <TrendingUp size={12} />}
                    {currentData.trend === "down" && <TrendingDown size={12} />}
                    {currentData.trend === "stable" && <Minus size={12} />}
                    {currentData.trend.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Price Volatility Risk:</span>
                  <span className={`font-bold uppercase text-[10px] py-0.5 px-2.5 rounded-md ${
                    currentData.riskLevel === "High" ? "bg-red-50 text-red-600 border border-red-100" :
                    currentData.riskLevel === "Moderate" ? "bg-yellow-50 text-yellow-600 border border-yellow-100" :
                    "bg-green-50 text-green-600 border border-green-100"
                  }`}>
                    {currentData.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Visualization & Environmental Data */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            {/* SVG Chart Container */}
            <div className="glass-card p-6 rounded-2xl shadow-xl bg-white relative">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{currentData.cropName} Price Trend</h3>
                  <p className="text-xs text-slate-400">Hub: {currentData.location}</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-green-600" /> Historical Mandi Rate
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 border-t-2 border-dashed border-yellow-500" /> AI Forecast
                  </div>
                </div>
              </div>

              {/* Chart Graphics */}
              <div className="relative">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-auto overflow-visible select-none"
                >
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = paddingTop + ratio * innerHeight;
                    const priceVal = maxPrice - ratio * priceRange;
                    return (
                      <g key={ratio}>
                        <line
                          x1={paddingLeft}
                          y1={y}
                          x2={chartWidth - paddingRight}
                          y2={y}
                          stroke="#f1f5f9"
                          strokeWidth="1.5"
                        />
                        <text
                          x={paddingLeft - 10}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-slate-400 text-[10px] font-mono font-medium"
                        >
                          ₹{priceVal.toFixed(0)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Shaded Area under history curve */}
                  <path
                    d={historyAreaPath}
                    fill="url(#chartGrad)"
                    className="transition-all duration-300"
                  />

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Historical path line */}
                  <path
                    d={historyPath}
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />

                  {/* Forecast path line (dashed) */}
                  <path
                    d={forecastPath}
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="3.5"
                    strokeDasharray="5,5"
                    className="transition-all duration-300"
                  />

                  {/* Interactive Nodes */}
                  {points.map((p, index) => (
                    <g
                      key={index}
                      onMouseEnter={(e) => {
                        const target = e.currentTarget.getBoundingClientRect();
                        setHoveredPoint({ x: p.x, y: p.y, val: p.data });
                      }}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="6"
                        className={`transition-all ${
                          p.data.isForecast
                            ? "fill-white stroke-yellow-500 stroke-2 group-hover:r-8"
                            : "fill-white stroke-green-600 stroke-2 group-hover:r-8"
                        }`}
                      />
                      <text
                        x={p.x}
                        y={chartHeight - 8}
                        textAnchor="middle"
                        className="fill-slate-400 text-[9px] font-bold"
                      >
                        {p.data.month}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Tooltip Overlay */}
                {hoveredPoint && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                      top: `${(hoveredPoint.y / chartHeight) * 100 - 20}%`,
                      transform: "translate(-50%, -100%)",
                    }}
                    className="bg-slate-900 text-white text-[10px] font-mono rounded px-2.5 py-1.5 shadow-md pointer-events-none z-20 min-w-[90px] text-center border border-slate-700 font-bold"
                  >
                    <div className="text-slate-400 font-semibold">{hoveredPoint.val.month}</div>
                    <div className="text-yellow-400 mt-0.5">₹{hoveredPoint.val.price.toFixed(2)}/kg</div>
                    {hoveredPoint.val.isForecast && (
                      <span className="text-[8px] text-yellow-300 font-sans tracking-wide">FORECAST</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Weather & Soil Conditions Indicator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Climate Index */}
              <div className="glass-card p-5 rounded-2xl shadow-md bg-white">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <CloudRain className="text-blue-500" /> Environmental Indexes
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600">Simulated Soil Moisture</span>
                      <span className="text-blue-600">{currentData.soilMoisture}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${currentData.soilMoisture}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600">Monsoon Departure Rate</span>
                      <span className="text-emerald-600">+4.2% (Surplus)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: "68%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Market advisory */}
              <div className="glass-card p-5 rounded-2xl shadow-md bg-white flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sun className="text-yellow-600" /> Agronomist Advisory
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {currentData.weatherImpact}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 mt-4 border-t border-slate-100 pt-2 font-mono flex items-center gap-1">
                  <span>Advisory Ref: ANNA-ADV-{currentData.cropName.slice(0, 3).toUpperCase()}-08</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
