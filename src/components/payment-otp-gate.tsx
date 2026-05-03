"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Phone, CheckCircle2, AlertCircle, Lock, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type GateStep = "kyc-check" | "phone" | "otp" | "verified";

// Generate a random 6-digit demo OTP
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

interface PaymentOtpGateProps {
  accentColor?: string; // e.g. "emerald", "blue", "violet"
  children: React.ReactNode;
}

// Simple colour mappings so each insurance type keeps its brand colour
function useAccentClasses(color = "emerald") {
  const map: Record<string, { bg: string; ring: string; btn: string; light: string; text: string; border: string }> = {
    emerald: {
      bg: "from-emerald-500 to-teal-500",
      ring: "ring-emerald-400",
      btn: "bg-emerald-600 hover:bg-emerald-700",
      light: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    blue: {
      bg: "from-blue-500 to-indigo-500",
      ring: "ring-blue-400",
      btn: "bg-blue-600 hover:bg-blue-700",
      light: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    violet: {
      bg: "from-violet-500 to-purple-600",
      ring: "ring-violet-400",
      btn: "bg-violet-600 hover:bg-violet-700",
      light: "bg-violet-50",
      text: "text-violet-600",
      border: "border-violet-200",
    },
  };
  return map[color] ?? map.emerald;
}

export function PaymentOtpGate({ accentColor = "emerald", children }: PaymentOtpGateProps) {
  const [step, setStep] = useState<GateStep>("kyc-check");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [demoOtp] = useState<string>(() => generateOtp());
  const c = useAccentClasses(accentColor);

  const validatePhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length !== 10) { setPhoneError("Please enter a valid 10-digit mobile number"); return false; }
    if (!/^[6-9]/.test(digits)) { setPhoneError("Mobile number must start with 6, 7, 8, or 9"); return false; }
    setPhoneError("");
    return true;
  };

  const handleSendOtp = async () => {
    if (!validatePhone(phone)) return;
    setSendingOtp(true);
    // Simulate OTP send (replace with real API call)
    await new Promise(r => setTimeout(r, 1200));
    setSendingOtp(false);
    setOtpSent(true);
    setStep("otp");
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { setOtpError("Please enter the complete 6-digit OTP"); return; }
    setVerifyingOtp(true);
    await new Promise(r => setTimeout(r, 1200));
    setVerifyingOtp(false);
    if (otp !== demoOtp) {
      setOtpError(`Invalid OTP. Use the demo code: ${demoOtp}`);
      return;
    }
    setOtpError("");
    setStep("verified");
  };

  // Already verified — render the actual payment page
  if (step === "verified") {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col">
      {/* Top banner */}
      <div className={`bg-gradient-to-r ${c.bg} py-10 px-4`}>
        <div className="max-w-xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Lock className="h-4 w-4" />
            Secure Payment Verification
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Verify Your Identity Before Payment</h1>
          <p className="text-white/80 text-sm">We verify your phone number to keep your payment safe and prevent fraud.</p>
        </div>
      </div>

      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">

            {/* ── Step 1: KYC info screen ── */}
            {step === "kyc-check" && (
              <motion.div key="kyc-check" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                  <div className={`bg-gradient-to-br ${c.bg} p-6 text-white`}>
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold mb-1">KYC Verified ✓</h2>
                    <p className="text-white/80 text-sm">Your identity has been verified. One last step — verify your phone number to proceed to payment.</p>
                  </div>
                  <CardContent className="p-6 space-y-5">
                    <div className="space-y-3">
                      {[
                        "Your KYC documents have been verified",
                        "Phone OTP adds an extra layer of payment security",
                        "Your payment details are end-to-end encrypted",
                      ].map((text, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`${c.light} rounded-full p-1 mt-0.5 shrink-0`}>
                            <CheckCircle2 className={`h-4 w-4 ${c.text}`} />
                          </div>
                          <p className="text-sm text-gray-600 font-medium">{text}</p>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => setStep("phone")}
                      className={`w-full h-12 font-bold rounded-xl text-white ${c.btn} shadow-lg transition-all hover:scale-[1.02]`}
                    >
                      Continue to Phone Verification
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ── Step 2: Phone entry ── */}
            {step === "phone" && (
              <motion.div key="phone" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 ${c.light} rounded-xl flex items-center justify-center mb-3`}>
                      <Phone className={`h-6 w-6 ${c.text}`} />
                    </div>
                    <CardTitle className="text-xl">Enter Mobile Number</CardTitle>
                    <CardDescription>We'll send a 6-digit OTP to verify your phone</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-semibold">Mobile Number</Label>
                      <div className="flex gap-2">
                        <span className={`inline-flex items-center px-3 rounded-lg border ${c.border} ${c.light} text-sm font-bold ${c.text}`}>+91</span>
                        <Input
                          id="phone"
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setPhoneError(""); }}
                          placeholder="9876543210"
                          className={`h-12 text-lg font-mono flex-1 ${phoneError ? "border-red-400" : ""}`}
                        />
                      </div>
                      {phoneError && (
                        <p className="text-sm text-red-600 flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 shrink-0" /> {phoneError}
                        </p>
                      )}
                    </div>

                    <div className={`${c.light} rounded-xl p-4 border ${c.border}`}>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">
                        📱 <strong>Demo Mode:</strong> Any valid 10-digit number will work.
                      </p>
                    </div>

                    <Button
                      onClick={handleSendOtp}
                      disabled={sendingOtp || phone.length < 10}
                      className={`w-full h-12 font-bold rounded-xl text-white ${c.btn} shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100`}
                    >
                      {sendingOtp ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending OTP…</>
                      ) : (
                        <>Send OTP <ArrowRight className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ── Step 3: OTP verification ── */}
            {step === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 ${c.light} rounded-xl flex items-center justify-center mb-3`}>
                      <Lock className={`h-6 w-6 ${c.text}`} />
                    </div>
                    <CardTitle className="text-xl">Enter OTP</CardTitle>
                    <CardDescription>
                      A 6-digit code was sent to{" "}
                      <span className="font-bold text-gray-800">+91 {phone}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={val => { setOtp(val); setOtpError(""); }}>
                        <InputOTPGroup className="gap-2">
                          {[0, 1, 2, 3, 4, 5].map(i => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className={`h-14 w-12 text-xl font-bold rounded-xl border-2 ${otp.length > i ? `border-current ${c.text}` : "border-gray-200"}`}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {/* Demo OTP hint */}
                    <div className={`${c.light} rounded-xl p-4 border ${c.border} flex items-center justify-between`}>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">🔑 Demo OTP Code</p>
                        <p className={`text-2xl font-black tracking-[0.3em] ${c.text} mt-0.5`}>{demoOtp}</p>
                      </div>
                      <button
                        onClick={() => { setOtp(demoOtp); setOtpError(""); }}
                        className={`text-xs font-bold ${c.text} border ${c.border} px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity`}
                      >
                        Auto-fill
                      </button>
                    </div>

                    {otpError && (
                      <p className="text-sm text-red-600 flex items-center justify-center gap-1.5">
                        <AlertCircle className="h-4 w-4 shrink-0" /> {otpError}
                      </p>
                    )}

                    <Button
                      onClick={handleVerifyOtp}
                      disabled={verifyingOtp || otp.length < 6}
                      className={`w-full h-12 font-bold rounded-xl text-white ${c.btn} shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100`}
                    >
                      {verifyingOtp ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying…</>
                      ) : (
                        <>Verify & Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        onClick={() => setStep("phone")}
                        className={`text-sm ${c.text} font-semibold hover:underline`}
                      >
                        ← Change number / Resend OTP
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Step indicator dots */}
          <div className="flex justify-center gap-2 mt-6">
            {(["kyc-check", "phone", "otp"] as GateStep[]).map((s, i) => (
              <motion.div
                key={s}
                animate={{
                  width: step === s ? 24 : 8,
                  backgroundColor: step === s ? "#6d28d9" : "#d1d5db",
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
