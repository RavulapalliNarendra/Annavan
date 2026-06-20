"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, ChevronDown, Check, Sparkles, TrendingUp, Info } from "lucide-react";

export default function Navbar() {
  const { user, loading, loginWithMock } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);

  const handleDemoSwitch = (role: "farmer" | "buyer") => {
    loginWithMock(role);
    setIsDemoDropdownOpen(false);
    // Force a reload or push to dashboard to update all states properly
    window.location.href = "/dashboard";
  };

  const handleDemoLogout = () => {
    localStorage.removeItem("mock_user_session");
    // If real auth is used, we'd log out there too. But for simplicity, we reload
    setIsDemoDropdownOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="fixed w-full z-50 top-0 sm:top-2 px-0 sm:px-4">
      <nav className="max-w-7xl mx-auto rounded-none sm:rounded-full border-b sm:border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm sm:shadow-md transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="relative h-9 w-9">
                  <Image
                    src="/images/logo.png"
                    alt="Annavan Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="font-extrabold text-lg sm:text-xl text-green-700 tracking-tight">
                  ANNAVAN
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-slate-600 hover:text-green-700 font-semibold text-sm transition">
                Home
              </Link>
              <Link href="/market-prices" className="text-slate-600 hover:text-green-700 font-semibold text-sm transition">
                Market Prices
              </Link>
              <Link href="/ai-grader" className="text-slate-600 hover:text-green-700 font-semibold text-sm transition flex items-center gap-1">
                <Sparkles size={14} className="text-green-600" /> AI Grader
              </Link>
              <Link href="/mandi-trends" className="text-slate-600 hover:text-green-700 font-semibold text-sm transition flex items-center gap-1">
                <TrendingUp size={14} className="text-green-600" /> Price Predictor
              </Link>
              <Link href="/about" className="text-slate-600 hover:text-green-700 font-semibold text-sm transition">
                About
              </Link>
            </div>

            {/* Right-side Call-To-Action / Account controls */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Quick Demo Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-full transition flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <Sparkles size={12} className="text-green-600 animate-pulse" />
                  {user ? (user.uid.includes("farmer") ? "Demo: Farmer" : "Demo: Buyer") : "Quick Demo"}
                  <ChevronDown size={12} className="text-slate-500" />
                </button>

                {isDemoDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-slate-800 animate-float-delayed" style={{ animationDuration: "10s" }}>
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Switch Role
                    </div>
                    <button
                      onClick={() => handleDemoSwitch("farmer")}
                      className="w-full text-left px-4 py-2 hover:bg-green-50 text-xs font-semibold text-slate-700 hover:text-green-700 transition flex items-center justify-between"
                    >
                      <span>Demo Farmer</span>
                      {user?.uid.includes("farmer") && <Check size={12} className="text-green-600" />}
                    </button>
                    <button
                      onClick={() => handleDemoSwitch("buyer")}
                      className="w-full text-left px-4 py-2 hover:bg-green-50 text-xs font-semibold text-slate-700 hover:text-green-700 transition flex items-center justify-between"
                    >
                      <span>Demo Buyer</span>
                      {user?.uid.includes("buyer") && <Check size={12} className="text-green-600" />}
                    </button>
                    {user && (
                      <>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={handleDemoLogout}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-xs font-semibold text-red-600 transition"
                        >
                          Reset / Logout
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {!loading && (
                user ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-green-700 font-bold border border-green-200 bg-green-50/50 px-4 py-2 rounded-full hover:bg-green-100/50 transition text-sm shadow-sm"
                  >
                    <User size={16} />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="bg-green-600 text-white px-5 py-2 rounded-full font-bold hover:bg-green-700 transition text-sm shadow-md shadow-green-700/10"
                  >
                    Login
                  </Link>
                )
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-green-700 focus:outline-none p-1 rounded-lg hover:bg-slate-50 transition"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md rounded-b-2xl py-3 px-4 space-y-2.5 shadow-lg">
            <Link
              href="/"
              className="block px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-green-700 hover:bg-green-50/60"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/market-prices"
              className="block px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-green-700 hover:bg-green-50/60"
              onClick={() => setIsMenuOpen(false)}
            >
              Market Prices
            </Link>
            <Link
              href="/ai-grader"
              className="block px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-green-700 hover:bg-green-50/60"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Grader
            </Link>
            <Link
              href="/mandi-trends"
              className="block px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-green-700 hover:bg-green-50/60"
              onClick={() => setIsMenuOpen(false)}
            >
              Price Predictor
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-green-700 hover:bg-green-50/60"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            <div className="border-t border-slate-100 my-2 pt-2.5 space-y-2">
              {/* Quick Demo Switchers for Mobile */}
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4">
                Mobile Quick Demo
              </div>
              <div className="grid grid-cols-2 gap-2 px-2">
                <button
                  onClick={() => {
                    handleDemoSwitch("farmer");
                    setIsMenuOpen(false);
                  }}
                  className="py-2 px-3 bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg text-center"
                >
                  Farmer Demo
                </button>
                <button
                  onClick={() => {
                    handleDemoSwitch("buyer");
                    setIsMenuOpen(false);
                  }}
                  className="py-2 px-3 bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg text-center"
                >
                  Buyer Demo
                </button>
              </div>

              {!loading && (
                user ? (
                  <Link
                    href="/dashboard"
                    className="block w-full text-center px-4 py-2.5 rounded-full font-bold bg-green-50 border border-green-200 text-green-700 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-2.5 rounded-full font-bold bg-green-600 text-white text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
