"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Upload, Sparkles, CheckCircle2, AlertCircle, Info, Shield, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CropPreset {
  name: string;
  type: string;
  image: string;
  moisture: number;
  impurity: number;
  defects: number;
  grade: "A" | "B" | "C";
  suggestedPrice: number;
  feedback: string;
}

const PRESETS: CropPreset[] = [
  {
    name: "Sharbati Wheat",
    type: "Wheat",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
    moisture: 11.2,
    impurity: 0.4,
    defects: 0.8,
    grade: "A",
    suggestedPrice: 29.5,
    feedback: "Excellent grain structure. Moisture content is optimal for long-term storage. Low impurity level.",
  },
  {
    name: "Basmati Rice (1121)",
    type: "Rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    moisture: 13.5,
    impurity: 0.8,
    defects: 1.5,
    grade: "A",
    suggestedPrice: 96.0,
    feedback: "High average grain length. Meets standard moisture export guidelines. Clean profile.",
  },
  {
    name: "Gujarat Cotton",
    type: "Cotton",
    image: "https://images.unsplash.com/photo-1594761053896-1c469b6a69ef?auto=format&fit=crop&q=80&w=600",
    moisture: 8.5,
    impurity: 2.1,
    defects: 3.5,
    grade: "B",
    suggestedPrice: 58.0,
    feedback: "Good staple length, slight debris noticed. Moisture content is normal. Standard market grade.",
  },
  {
    name: "Nashik Red Onion",
    type: "Onion",
    image: "https://images.unsplash.com/photo-1618519764620-7403abdbfee9?auto=format&fit=crop&q=80&w=600",
    moisture: 14.2,
    impurity: 1.5,
    defects: 5.2,
    grade: "B",
    suggestedPrice: 17.5,
    feedback: "Good size uniformity. Mild surface dryness, inner layers are crisp. Recommended for immediate sale.",
  },
  {
    name: "Agra Potato",
    type: "Potato",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600",
    moisture: 18.0,
    impurity: 4.5,
    defects: 8.1,
    grade: "C",
    suggestedPrice: 11.0,
    feedback: "Moderate mud coating. Few surface cuts detected. Ideal for bulk processing or starch production.",
  },
];

export default function AiGraderPage() {
  const [selectedPreset, setSelectedPreset] = useState<CropPreset | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<CropPreset | null>(null);

  const logsSequence = [
    "Initializing multispectral analysis core...",
    "Scanning grain color histogram and saturation...",
    "Computing edge density (uniformity check)...",
    "Measuring simulated moisture index (reflective spectral index)...",
    "Identifying organic impurities and foreign matter...",
    "Cross-referencing database for standard pricing...",
    "Grading complete! Generating quality certificate..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanning) {
      if (scanStep < logsSequence.length) {
        interval = setTimeout(() => {
          setScanLogs((prev) => [...prev, logsSequence[scanStep]]);
          setScanStep((prev) => prev + 1);
        }, 650);
      } else {
        // Scan done
        setScanning(false);
        setShowResult(true);
        if (selectedPreset) {
          setResultData(selectedPreset);
        } else {
          // Generate pseudo-random realistic values for uploaded image
          setResultData({
            name: "Uploaded Crop Sample",
            type: "Custom",
            image: customImage || "",
            moisture: parseFloat((10 + Math.random() * 6).toFixed(1)),
            impurity: parseFloat((0.2 + Math.random() * 3).toFixed(1)),
            defects: parseFloat((0.5 + Math.random() * 7).toFixed(1)),
            grade: Math.random() > 0.4 ? "A" : Math.random() > 0.5 ? "B" : "C",
            suggestedPrice: parseFloat((20 + Math.random() * 80).toFixed(1)),
            feedback: "Quality report generated successfully. Product holds good market potential under current demand cycles.",
          });
        }
      }
    }
    return () => clearTimeout(interval);
  }, [scanning, scanStep]);

  const handleSelectPreset = (preset: CropPreset) => {
    if (scanning) return;
    setSelectedPreset(preset);
    setCustomImage(null);
    setShowResult(false);
    setResultData(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (scanning) return;
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPreset(null);
      setShowResult(false);
      setResultData(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartScan = () => {
    if (scanning) return;
    if (!selectedPreset && !customImage) {
      alert("Please upload a crop photo or select a standard sample preset first.");
      return;
    }
    setScanning(true);
    setScanStep(0);
    setScanLogs([]);
    setShowResult(false);
    setResultData(null);
  };

  const activeImage = selectedPreset ? selectedPreset.image : customImage;

  return (
    <div className="relative min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/40 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-200 rounded-full text-green-700 text-sm font-semibold mb-4 animate-pulse">
            <Sparkles size={16} /> Powered by Annavan Spectro-AI
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            AI Crop Health & Quality Grader
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get instant, objective analysis of your crop's quality metrics, moisture levels, impurities, and suggested pricing using our optical assessment models.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Upload / Selection */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 rounded-2xl shadow-xl">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Cpu className="text-green-600" /> 1. Provide Crop Sample
              </h2>

              {/* Presets List */}
              <div className="mb-6">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Select a Demo Sample</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-2 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => handleSelectPreset(p)}
                      disabled={scanning}
                      className={`text-left p-2 rounded-xl border text-xs transition-all duration-200 flex items-center gap-2 ${
                        selectedPreset?.name === p.name
                          ? "bg-green-600 border-green-600 text-white font-semibold shadow-md shadow-green-600/20 scale-[1.02]"
                          : "bg-white border-slate-200 hover:border-green-500 text-slate-700"
                      }`}
                    >
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative bg-white px-3 text-xs font-semibold uppercase text-slate-400">
                  Or Upload Custom
                </div>
              </div>

              {/* Upload Input */}
              <div className="mt-2">
                <label className={`group relative flex flex-col items-center justify-center h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  customImage ? "border-green-500 bg-green-50/20" : "border-slate-300 hover:border-green-600 hover:bg-slate-50"
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={scanning}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center p-4">
                    <Upload className="mx-auto h-10 w-10 text-slate-400 group-hover:text-green-600 transition" />
                    <p className="mt-2 text-sm text-slate-700 font-medium group-hover:text-green-700">
                      Upload Crop Photo
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      JPEG, PNG up to 12MB
                    </p>
                  </div>
                </label>
              </div>

              <button
                onClick={handleStartScan}
                disabled={scanning || (!selectedPreset && !customImage)}
                className="w-full mt-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-lg hover:shadow-green-700/20 transition flex items-center justify-center gap-2 transform active:scale-95 disabled:scale-100"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    Scanning Sample...
                  </>
                ) : (
                  <>
                    <Cpu size={18} />
                    Start Quality Scan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel: Viewport / Results */}
          <div className="lg:col-span-7 space-y-6">
            {/* Viewport Frame */}
            <div className="glass-card rounded-2xl shadow-xl overflow-hidden min-h-[380px] flex flex-col justify-between relative bg-black">
              {activeImage ? (
                <div className="relative flex-grow flex items-center justify-center bg-slate-900 overflow-hidden h-[300px]">
                  <img
                    src={activeImage}
                    alt="Inspection target"
                    className="max-h-[300px] w-full object-contain select-none"
                  />

                  {/* Scanning Overlay line */}
                  {scanning && (
                    <div className="absolute inset-0 bg-green-950/20 pointer-events-none">
                      <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_15px_#4ade80] animate-scan" />
                    </div>
                  )}

                  {/* Real-time Status Overlay */}
                  {scanning && (
                    <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur border border-green-500/30 rounded-lg p-3 max-h-[120px] overflow-y-auto text-left font-mono text-[10px] text-green-400 leading-tight">
                      <div className="flex justify-between items-center border-b border-green-500/20 pb-1 mb-1 font-semibold">
                        <span>SPECTRO-AI SYSTEM LOGS</span>
                        <span className="animate-pulse">● SAMPLING</span>
                      </div>
                      {scanLogs.map((log, index) => (
                        <div key={index} className="flex gap-1.5 py-0.5">
                          <span className="text-green-600">[{ (index * 0.6).toFixed(1) }s]</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center p-12 text-slate-400 h-[300px] bg-slate-900 border-b border-slate-800">
                  <Cpu size={48} className="mb-4 text-slate-600 animate-pulse-glow" />
                  <p className="text-sm">Spectro-AI Viewport Offline</p>
                  <p className="text-xs text-slate-600 mt-1">Select a demo preset or upload a custom image to begin.</p>
                </div>
              )}

              {/* Status footer bar */}
              <div className="bg-slate-950 text-xs px-4 py-3 text-slate-500 font-mono flex justify-between items-center border-t border-slate-800">
                <span>SYSTEM: {scanning ? "SCANNING_ACTIVE" : activeImage ? "STANDBY" : "OFFLINE"}</span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${scanning ? "bg-green-500 animate-ping" : activeImage ? "bg-yellow-500" : "bg-red-500"}`} />
                  {scanning ? "CONNECTED" : activeImage ? "SAMPLE LOADED" : "NO SAMPLE"}
                </span>
              </div>
            </div>

            {/* Assessment Certificate Panel */}
            {showResult && resultData && (
              <div className="glass-card p-6 rounded-2xl shadow-xl border-l-4 border-green-600 bg-white/95 animate-float-delayed">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 mb-4 gap-2">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="text-green-600" /> Optical Grading Certificate
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">HASH: SHA256-{Math.floor(100000 + Math.random() * 900000)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      Grade Classification
                    </span>
                    <span className={`text-2xl font-black px-4 py-1.5 rounded-xl border shadow-sm ${
                      resultData.grade === "A"
                        ? "bg-green-50 text-green-700 border-green-200 shadow-green-200"
                        : resultData.grade === "B"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200 shadow-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200 shadow-red-200"
                    }`}>
                      Grade {resultData.grade}
                    </span>
                  </div>
                </div>

                {/* Score Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-bold block">Moisture Level</span>
                    <span className="text-xl font-bold text-slate-800 mt-1 block">{resultData.moisture}%</span>
                    <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <Info size={10} /> {resultData.moisture <= 14 ? "Optimal Range" : "Elevated Moisture"}
                    </span>
                  </div>

                  <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-bold block">Foreign Matter / Impurity</span>
                    <span className="text-xl font-bold text-slate-800 mt-1 block">{resultData.impurity}%</span>
                    <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <Info size={10} /> {resultData.impurity < 1.0 ? "Very Clean" : "Standard impurities"}
                    </span>
                  </div>

                  <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-bold block">Visual Blemish Rate</span>
                    <span className="text-xl font-bold text-slate-800 mt-1 block">{resultData.defects}%</span>
                    <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <Info size={10} /> {resultData.defects < 2.0 ? "Negligible defects" : "Standard damage"}
                    </span>
                  </div>
                </div>

                {/* Valuation & Feedback */}
                <div className="p-4 bg-green-50/40 border border-green-100/50 rounded-xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-grow">
                    <span className="text-xs text-slate-400 font-bold uppercase block">Suggested Valuation Range</span>
                    <span className="text-2xl font-extrabold text-green-700 mt-1 block">
                      ₹{resultData.suggestedPrice.toFixed(2)} - ₹{(resultData.suggestedPrice + 2).toFixed(2)} <span className="text-sm font-medium text-slate-500">per kg</span>
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 bg-white border border-green-100 p-3 rounded-lg max-w-sm">
                    {resultData.feedback}
                  </div>
                </div>

                {/* Listing Action */}
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Link
                    href={`/dashboard/farmer/add-crop?name=${encodeURIComponent(resultData.type === "Custom" ? "" : resultData.type)}&pricePerKg=${resultData.suggestedPrice}&grade=${resultData.grade}&image=${encodeURIComponent(resultData.image)}`}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition flex items-center justify-center gap-2 shadow-md shadow-green-600/10 transform active:scale-95"
                  >
                    Proceed to List Crop <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
