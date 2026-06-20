"use client";

import React, { useState } from "react";
import { auth } from "../../lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Cpu, ShieldAlert, Key, Phone, CheckCircle, ArrowRight, UserCheck } from "lucide-react";

export default function LoginPage() {
  const { loginWithMock } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirm, setConfirm] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!phone) {
      alert("Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    try {
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
          size: "invisible",
        });
      }

      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirm(result);
      alert("OTP Sent Successfully to " + phone);
    } catch (error: any) {
      console.error(error);
      alert("Error sending OTP: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      if (confirm) {
        await confirm.confirm(otp);
        alert("Login Successful!");
        window.location.href = "/dashboard"; // Redirect after successful login
      }
    } catch (error) {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = (role: "farmer" | "buyer") => {
    loginWithMock(role);
    alert(`Logged in as Demo ${role === "farmer" ? "Farmer" : "Buyer"}`);
    window.location.href = "/dashboard";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="/images/login-bg-modern.png"
          alt="Login Background"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/login-bg.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="glass-card-dark p-8 rounded-3xl shadow-2xl border border-white/10 text-white">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black tracking-tight text-white">
              Welcome to <span className="text-green-400">Annavan</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Direct Farmer to Market Trading</p>
          </div>

          {/* Verification Method Tabs */}
          <div className="space-y-4">
            {/* Phone/OTP verification */}
            <div className="bg-slate-950/40 border border-white/5 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Phone size={14} /> Secure Phone OTP Login
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="+91 Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none text-white text-sm placeholder-slate-500 font-semibold"
                />

                <button
                  onClick={sendOtp}
                  disabled={loading || !!confirm}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md shadow-green-700/10 transition active:scale-98 disabled:scale-100 flex items-center justify-center gap-1.5"
                >
                  {loading ? "Please wait..." : confirm ? "OTP Sent ✔" : "Send OTP"}
                </button>

                {confirm && (
                  <div className="pt-2 space-y-3">
                    <input
                      type="text"
                      placeholder="6-Digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none text-white text-sm placeholder-slate-500 font-mono tracking-widest text-center"
                    />

                    <button
                      onClick={verifyOtp}
                      disabled={loading}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md transition active:scale-98"
                    >
                      {loading ? "Verifying..." : "Verify & Login"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Demo Access (Crucial for local testing) */}
            <div className="bg-slate-950/60 border border-white/10 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Cpu size={14} /> Quick Demo Access (One-Click)
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal mb-4">
                Bypass phone authentication for instant feature testing on local development environment.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleMockLogin("farmer")}
                  className="py-3 px-4 bg-slate-900 border border-white/10 hover:border-green-400 hover:bg-green-500/10 rounded-xl text-xs font-bold text-slate-200 hover:text-green-400 transition flex items-center justify-center gap-1.5"
                >
                  <UserCheck size={14} /> Farmer Demo
                </button>
                <button
                  onClick={() => handleMockLogin("buyer")}
                  className="py-3 px-4 bg-slate-900 border border-white/10 hover:border-yellow-400 hover:bg-yellow-500/10 rounded-xl text-xs font-bold text-slate-200 hover:text-yellow-400 transition flex items-center justify-center gap-1.5"
                >
                  <UserCheck size={14} /> Buyer Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="recaptcha"></div>
      </div>
    </div>
  );
}
