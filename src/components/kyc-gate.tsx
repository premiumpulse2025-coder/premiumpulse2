"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield, User, FileText, CheckCircle2, AlertCircle, Loader2,
  Camera, Upload, IdCard, MapPin, ArrowRight, ArrowLeft, Sparkles, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";

interface KycGateProps {
  insuranceType: "individual" | "family" | "commercial";
  onVerified: () => void;
  accentColor?: string;
}

type KycStep = "intro" | "personal" | "otp" | "identity" | "address" | "documents" | "processing" | "success";

const STEPS: KycStep[] = ["intro", "personal", "otp", "identity", "address", "documents", "processing", "success"];

const INDIAN_STATES = [
  "Andhra Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi",
  "Gujarat", "Rajasthan", "West Bengal", "Kerala", "Telangana",
  "Uttar Pradesh", "Madhya Pradesh", "Bihar", "Punjab", "Haryana"
];

export function KycGate({ insuranceType, onVerified, accentColor = "violet" }: KycGateProps) {
  const [currentStep, setCurrentStep] = useState<KycStep>("intro");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [personal, setPersonal] = useState({ fullName: "", dob: "", gender: "male", phone: "" });
  const [otpValue, setOtpValue] = useState("");
  const [identity, setIdentity] = useState({ panNumber: "", aadhaarNumber: "" });
  const [address, setAddress] = useState({ address: "", city: "", state: "", pincode: "" });
  const [docStatus, setDocStatus] = useState({
    selfie: false, pan: false, aadhaar: false, addressDoc: false
  });

  const accent = {
    violet: { bg: "bg-violet-600", hover: "hover:bg-violet-700", light: "bg-violet-50", ring: "ring-violet-500", text: "text-violet-600", border: "border-violet-200", badge: "bg-violet-100 text-violet-700" },
    emerald: { bg: "bg-emerald-600", hover: "hover:bg-emerald-700", light: "bg-emerald-50", ring: "ring-emerald-500", text: "text-emerald-600", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
    blue: { bg: "bg-blue-600", hover: "hover:bg-blue-700", light: "bg-blue-50", ring: "ring-blue-500", text: "text-blue-600", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
  }[accentColor] || { bg: "bg-violet-600", hover: "hover:bg-violet-700", light: "bg-violet-50", ring: "ring-violet-500", text: "text-violet-600", border: "border-violet-200", badge: "bg-violet-100 text-violet-700" };

  const insuranceLabel = insuranceType === "individual" ? "Individual" : insuranceType === "family" ? "Family" : "Commercial";

  const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
  const validateAadhaar = (a: string) => /^\d{12}$/.test(a.replace(/\s/g, ""));

  const handleSimulateDocUpload = (doc: keyof typeof docStatus) => {
    setDocStatus(prev => ({ ...prev, [doc]: true }));
  };

  const handleSubmitKyc = async () => {
    setError("");
    setSubmitting(true);
    setCurrentStep("processing");

    try {
      const res = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          insuranceType,
          fullName: personal.fullName,
          dob: personal.dob,
          panNumber: identity.panNumber.toUpperCase(),
          aadhaarNumber: identity.aadhaarNumber.replace(/\s/g, ""),
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "KYC submission failed");
        setCurrentStep("documents");
        return;
      }
      // Simulate processing animation for 2.5s
      setTimeout(() => {
        setCurrentStep("success");
        setSubmitting(false);
      }, 2500);
    } catch {
      setError("Submission failed. Please try again.");
      setCurrentStep("documents");
      setSubmitting(false);
    }
  };

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = currentStep === "processing" || currentStep === "success" ? 100 : Math.round((stepIndex / 6) * 100);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header badge */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 ${accent.badge} px-4 py-2 rounded-full text-sm font-semibold mb-4`}>
            <Shield className="h-4 w-4" />
            KYC Verification Required — {insuranceLabel} Insurance
          </div>
        </div>

        {/* Progress bar */}
        {currentStep !== "intro" && currentStep !== "processing" && currentStep !== "success" && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Verification Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${accent.bg} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* INTRO */}
          {currentStep === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-0 shadow-2xl overflow-hidden">
                <div className={`${accent.bg} p-8 text-white text-center`}>
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-10 w-10" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Identity Verification (KYC)</h2>
                  <p className="text-white/80 text-sm">As required by IRDAI regulations</p>
                </div>
                <CardContent className="p-8 space-y-5">
                  <p className="text-gray-600 text-center">To activate your <strong>{insuranceLabel} Insurance</strong> plan, we need to verify your identity. This is a one-time process.</p>

                  <div className="space-y-3">
                    {[
                      { icon: User, label: "Personal Details", desc: "Name, DOB, Gender" },
                      { icon: IdCard, label: "Identity Documents", desc: "PAN Card & Aadhaar" },
                      { icon: MapPin, label: "Address Details", desc: "Current residential address" },
                      { icon: Camera, label: "Document Upload", desc: "Selfie + document scans (demo)" },
                    ].map(({ icon: Icon, label, desc }) => (
                      <div key={label} className={`flex items-center gap-4 p-4 rounded-xl ${accent.light} border ${accent.border}`}>
                        <div className={`w-10 h-10 ${accent.bg} rounded-lg flex items-center justify-center shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{label}</p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                        <CheckCircle2 className={`h-5 w-5 ${accent.text} ml-auto opacity-60`} />
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>Demo Mode:</strong> KYC is auto-approved instantly. No real documents are verified.
                    </p>
                  </div>

                  <Button
                    onClick={() => setCurrentStep("personal")}
                    className={`w-full h-12 ${accent.bg} ${accent.hover} text-white font-bold rounded-xl`}
                  >
                    Start KYC Verification <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* PERSONAL */}
          {currentStep === "personal" && (
            <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className={`h-6 w-6 ${accent.text}`} /> Personal Details
                  </CardTitle>
                  <CardDescription>Step 1 of 4 — Enter your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="kyc-fullname">Full Name (as on ID)</Label>
                    <Input id="kyc-fullname" value={personal.fullName} onChange={e => setPersonal(p => ({ ...p, fullName: e.target.value }))} placeholder="Rahul Kumar Sharma" className="h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kyc-dob">Date of Birth</Label>
                      <Input id="kyc-dob" type="date" value={personal.dob} onChange={e => setPersonal(p => ({ ...p, dob: e.target.value }))} className="h-12" max={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kyc-phone">Phone Number</Label>
                      <Input id="kyc-phone" type="tel" value={personal.phone} onChange={e => setPersonal(p => ({ ...p, phone: e.target.value }))} placeholder="98765 43210" className="h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["male", "female", "other"].map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setPersonal(p => ({ ...p, gender: g }))}
                          className={`py-2.5 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${personal.gender === g ? `${accent.bg} text-white border-transparent` : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setCurrentStep("intro")} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                    <Button
                      onClick={() => {
                        if (!personal.fullName || !personal.dob || !personal.phone) { setError("Please fill all required fields"); return; }
                        setError(""); setCurrentStep("otp");
                      }}
                      className={`${accent.bg} ${accent.hover} text-white gap-2`}
                    >
                      Next <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {error && <p className="text-sm text-red-600 flex gap-2"><AlertCircle className="h-4 w-4" />{error}</p>}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* OTP */}
          {currentStep === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className={`h-6 w-6 ${accent.text}`} /> Phone Verification
                  </CardTitle>
                  <CardDescription>Enter the 6-digit OTP sent to {personal.phone}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-4 py-4">
                    <InputOTP 
                      maxLength={6} 
                      value={otpValue}
                      onChange={(val) => setOtpValue(val)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-gray-500">
                      Didn't receive the code? <button className={`font-semibold ${accent.text} hover:underline`}>Resend</button>
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>Demo Mode:</strong> You can enter any 6-digit code to proceed.
                    </p>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setCurrentStep("personal")} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                    <Button
                      onClick={() => {
                        if (otpValue.length !== 6) { setError("Please enter a 6-digit OTP"); return; }
                        setError(""); setCurrentStep("identity");
                      }}
                      className={`${accent.bg} ${accent.hover} text-white gap-2`}
                    >
                      Verify <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {error && <p className="text-sm text-red-600 flex gap-2"><AlertCircle className="h-4 w-4" />{error}</p>}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* IDENTITY */}
          {currentStep === "identity" && (
            <motion.div key="identity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IdCard className={`h-6 w-6 ${accent.text}`} /> Identity Documents
                  </CardTitle>
                  <CardDescription>Step 2 of 4 — Enter your PAN and Aadhaar numbers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="kyc-pan">PAN Card Number</Label>
                    <Input
                      id="kyc-pan"
                      value={identity.panNumber}
                      onChange={e => setIdentity(p => ({ ...p, panNumber: e.target.value.toUpperCase() }))}
                      placeholder="ABCDE1234F"
                      className={`h-12 font-mono uppercase ${identity.panNumber && !validatePAN(identity.panNumber) ? "border-red-300" : ""}`}
                      maxLength={10}
                    />
                    {identity.panNumber && !validatePAN(identity.panNumber) && (
                      <p className="text-xs text-red-500">Invalid PAN format (e.g. ABCDE1234F)</p>
                    )}
                    {identity.panNumber && validatePAN(identity.panNumber) && (
                      <p className="text-xs text-green-600 flex gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid PAN format</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kyc-aadhaar">Aadhaar Number</Label>
                    <Input
                      id="kyc-aadhaar"
                      value={identity.aadhaarNumber}
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
                        const fmt = raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
                        setIdentity(p => ({ ...p, aadhaarNumber: fmt }));
                      }}
                      placeholder="1234 5678 9012"
                      className="h-12 font-mono"
                      maxLength={14}
                    />
                    {identity.aadhaarNumber && !validateAadhaar(identity.aadhaarNumber) && (
                      <p className="text-xs text-red-500">Aadhaar must be 12 digits</p>
                    )}
                    {identity.aadhaarNumber && validateAadhaar(identity.aadhaarNumber) && (
                      <p className="text-xs text-green-600 flex gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid Aadhaar format</p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex gap-3">
                    <Lock className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500">Your data is encrypted and stored securely. We comply with all IRDAI and data protection regulations.</p>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setCurrentStep("otp")} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                    <Button
                      onClick={() => {
                        if (!identity.panNumber || !validatePAN(identity.panNumber)) { setError("Enter a valid PAN number"); return; }
                        if (!validateAadhaar(identity.aadhaarNumber)) { setError("Enter a valid 12-digit Aadhaar number"); return; }
                        setError(""); setCurrentStep("address");
                      }}
                      className={`${accent.bg} ${accent.hover} text-white gap-2`}
                    >
                      Next <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {error && <p className="text-sm text-red-600 flex gap-2"><AlertCircle className="h-4 w-4" />{error}</p>}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ADDRESS */}
          {currentStep === "address" && (
            <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className={`h-6 w-6 ${accent.text}`} /> Address Details
                  </CardTitle>
                  <CardDescription>Step 3 of 4 — Current residential address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="kyc-address">Street Address</Label>
                    <Input id="kyc-address" value={address.address} onChange={e => setAddress(p => ({ ...p, address: e.target.value }))} placeholder="123, MG Road, Bandra West" className="h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kyc-city">City</Label>
                      <Input id="kyc-city" value={address.city} onChange={e => setAddress(p => ({ ...p, city: e.target.value }))} placeholder="Mumbai" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kyc-pincode">Pincode</Label>
                      <Input id="kyc-pincode" value={address.pincode} onChange={e => setAddress(p => ({ ...p, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))} placeholder="400001" className="h-12 font-mono" maxLength={6} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                      {INDIAN_STATES.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setAddress(p => ({ ...p, state: s }))}
                          className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all ${address.state === s ? `${accent.bg} text-white border-transparent` : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setCurrentStep("identity")} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                    <Button
                      onClick={() => {
                        if (!address.city || !address.state || !address.pincode) { setError("Please fill all address fields"); return; }
                        setError(""); setCurrentStep("documents");
                      }}
                      className={`${accent.bg} ${accent.hover} text-white gap-2`}
                    >
                      Next <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {error && <p className="text-sm text-red-600 flex gap-2"><AlertCircle className="h-4 w-4" />{error}</p>}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* DOCUMENTS */}
          {currentStep === "documents" && (
            <motion.div key="documents" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className={`h-6 w-6 ${accent.text}`} /> Document Upload
                  </CardTitle>
                  <CardDescription>Step 4 of 4 — Upload required documents (demo simulation)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">In demo mode, click each button to simulate a document upload. No real files are required.</p>
                  </div>

                  {[
                    { key: "selfie" as const, icon: Camera, label: "Live Selfie", desc: "Take or upload a clear photo of your face" },
                    { key: "pan" as const, icon: IdCard, label: "PAN Card Photo", desc: "Front side of PAN card" },
                    { key: "aadhaar" as const, icon: IdCard, label: "Aadhaar Card Photo", desc: "Front & back of Aadhaar card" },
                    { key: "addressDoc" as const, icon: MapPin, label: "Address Proof", desc: "Utility bill / Bank statement" },
                  ].map(({ key, icon: Icon, label, desc }) => (
                    <div
                      key={key}
                      onClick={() => handleSimulateDocUpload(key)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${docStatus[key] ? `bg-green-50 border-green-300` : `border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50`}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${docStatus[key] ? "bg-green-100" : `${accent.light}`}`}>
                        {docStatus[key] ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <Icon className={`h-6 w-6 ${accent.text}`} />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                      {docStatus[key] ? (
                        <Badge className="bg-green-100 text-green-700 border-0">Uploaded</Badge>
                      ) : (
                        <Upload className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  ))}

                  {error && (
                    <div className="bg-red-50 text-red-700 rounded-lg p-3 flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />{error}
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setCurrentStep("address")} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                    <Button
                      onClick={handleSubmitKyc}
                      disabled={submitting}
                      className={`${accent.bg} ${accent.hover} text-white gap-2 font-bold`}
                    >
                      {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <>Submit KYC <ArrowRight className="h-4 w-4" /></>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* PROCESSING */}
          {currentStep === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <Card className="border-0 shadow-2xl">
                <CardContent className="py-20 text-center space-y-6">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className={`w-24 h-24 ${accent.light} rounded-full flex items-center justify-center`}>
                      <Shield className={`h-12 w-12 ${accent.text}`} />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className={`absolute inset-0 rounded-full border-4 border-t-transparent ${accent.bg.replace("bg-", "border-")}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Verifying Your Identity</h3>
                    <p className="text-gray-500">Running KYC checks against UIDAI & NSDL databases...</p>
                  </div>
                  <div className="space-y-3 max-w-xs mx-auto text-left">
                    {["Validating PAN Card", "Verifying Aadhaar", "Address confirmation", "Risk assessment"].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.4 }}
                        className="flex items-center gap-3 text-sm"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.4 + 0.2 }}
                        >
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </motion.div>
                        <span className="text-gray-700">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* SUCCESS */}
          {currentStep === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-0 shadow-2xl overflow-hidden">
                <div className={`${accent.bg} py-12 text-white text-center`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="h-14 w-14" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">KYC Verified!</h2>
                  <p className="text-white/80">Your identity has been successfully verified</p>
                </div>
                <CardContent className="p-8 space-y-5">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: "Full Name", value: personal.fullName },
                      { label: "PAN Number", value: identity.panNumber },
                      { label: "Aadhaar", value: `XXXX XXXX ${identity.aadhaarNumber.slice(-4)}` },
                      { label: "Location", value: `${address.city}, ${address.state}` },
                    ].map(({ label, value }) => (
                      <div key={label} className={`p-3 rounded-xl ${accent.light} border ${accent.border}`}>
                        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                        <p className="font-semibold text-gray-900 truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800 text-sm">Verification Complete</p>
                      <p className="text-xs text-green-700">Auto-approved in demo mode. You now have full access.</p>
                    </div>
                  </div>
                  <Button
                    onClick={onVerified}
                    className={`w-full h-12 ${accent.bg} ${accent.hover} text-white font-bold rounded-xl`}
                  >
                    Continue to {insuranceLabel} Insurance <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
