"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  AlertCircle, 
  Smartphone,
  Upload,
  Clock,
  Users,
  ArrowLeft,
  Copy,
  Check,
  Landmark,
  Wallet
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SiGooglepay, SiPhonepe, SiPaytm, SiWhatsapp } from "react-icons/si";
import { FaAmazonPay } from "react-icons/fa";
import QRCode from "react-qr-code";
import { PaymentOtpGate } from "@/components/payment-otp-gate";

type PaymentStep = "summary" | "select-app" | "confirm" | "success";

const upiApps = [
  { 
    name: "Google Pay", 
    id: "gpay",
    color: "bg-white",
    textColor: "text-gray-800",
    borderColor: "border-gray-200 hover:border-blue-400",
    icon: SiGooglepay,
    scheme: "tez://upi/pay"
  },
  { 
    name: "PhonePe", 
    id: "phonepe",
    color: "bg-[#5f259f]",
    textColor: "text-white",
    borderColor: "border-purple-300 hover:border-purple-500",
    icon: SiPhonepe,
    scheme: "phonepe://pay"
  },
  { 
    name: "Paytm", 
    id: "paytm",
    color: "bg-[#00BAF2]",
    textColor: "text-white",
    borderColor: "border-cyan-300 hover:border-cyan-500",
    icon: SiPaytm,
    scheme: "paytmmp://pay"
  },
  { 
    name: "BHIM", 
    id: "bhim",
    color: "bg-[#00A650]",
    textColor: "text-white",
    borderColor: "border-green-300 hover:border-green-500",
    icon: Landmark,
    scheme: "upi://pay"
  },
  { 
    name: "Amazon Pay", 
    id: "amazonpay",
    color: "bg-[#FF9900]",
    textColor: "text-black",
    borderColor: "border-orange-300 hover:border-orange-500",
    icon: FaAmazonPay,
    scheme: "amazonpay://pay"
  },
  { 
    name: "WhatsApp", 
    id: "whatsapp",
    color: "bg-[#25D366]",
    textColor: "text-white",
    borderColor: "border-green-300 hover:border-green-500",
    icon: SiWhatsapp,
    scheme: "whatsapp://pay"
  },
  { 
    name: "SuperMoney", 
    id: "supermoney",
    color: "bg-gradient-to-r from-blue-600 to-purple-600",
    textColor: "text-white",
    borderColor: "border-blue-300 hover:border-blue-500",
    icon: Wallet,
    scheme: "upi://pay"
  }
];

export default function FamilyUPIPaymentPage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<PaymentStep>("summary");
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const planName = searchParams.get("plan") || "Family Health Insurance";
  const amount = parseInt(searchParams.get("amount") || "25000");
  const coverage = searchParams.get("coverage") || "₹10,00,000";
  const members = searchParams.get("members") || "4";

  const upiId = "jiyadahmed02@okaxis";
  const merchantName = "PremiumPulse";

  const getUpiLink = (scheme: string) => {
    const params = `pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=Family%20Insurance%20Premium`;
    if (scheme.includes("?")) {
      return `${scheme}&${params}`;
    }
    return `${scheme}?${params}`;
  };

  const validateUTR = (value: string): boolean => {
    const cleanValue = value.replace(/\s/g, "");
    if (!/^\d+$/.test(cleanValue)) {
      setUtrError("UTR must contain only numbers");
      return false;
    }
    if (cleanValue.length < 12 || cleanValue.length > 16) {
      setUtrError("UTR should be 12-16 digits");
      return false;
    }
    setUtrError("");
    return true;
  };

  const handleUTRChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUtr(value);
    if (value.length > 0) {
      validateUTR(value);
    } else {
      setUtrError("");
    }
  };

  const handleSelectApp = (app: typeof upiApps[0]) => {
    setSelectedApp(app.name);
    // QR code updates automatically — user scans with their phone
  };

  const handleConfirmPayment = () => {
    if (!utr) {
      setUtrError("Please enter the UTR number");
      return;
    }
    if (!validateUTR(utr)) {
      return;
    }
    setCurrentStep("success");
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PaymentOtpGate accentColor="blue">
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30">
      <Header />
      
      <main className="pt-[88px]">
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Complete Your Payment</h1>
              <p className="text-lg text-blue-100">Secure UPI payment for your family insurance premium</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
            {currentStep === "summary" && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Users className="h-7 w-7 text-blue-600" />
                      Payment Summary
                    </CardTitle>
                    <CardDescription>Review your family plan details before payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-blue-50 rounded-xl p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Plan Name</span>
                        <span className="font-bold text-gray-900">{planName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Family Members</span>
                        <span className="font-bold text-gray-900">{members} Members</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Coverage Amount</span>
                        <span className="font-bold text-gray-900">{coverage}</span>
                      </div>
                      <div className="border-t border-blue-200 pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total Premium</span>
                        <span className="text-3xl font-bold text-blue-600">₹{amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <p className="text-sm text-gray-600 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <span>This is a one-time annual premium payment. Your family policy will be active immediately after payment confirmation.</span>
                      </p>
                    </div>

                    <Button 
                      onClick={() => setCurrentStep("select-app")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-bold rounded-xl"
                    >
                      Proceed to Pay
                    </Button>
                  </CardContent>
                </Card>

                <Link href="/family-insurance">
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Plans
                  </Button>
                </Link>
              </motion.div>
            )}

            {currentStep === "select-app" && (
              <motion.div
                key="select-app"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Smartphone className="h-7 w-7 text-blue-600" />
                      Choose Payment App
                    </CardTitle>
                    <CardDescription>Select your preferred UPI app to complete payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                          <span className="text-gray-600 text-sm">UPI ID:</span>
                          <span className="font-mono font-bold text-gray-900">{upiId}</span>
                          <button 
                            onClick={copyUpiId}
                            className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                          </button>
                        </div>
                        <p className="text-4xl font-bold text-blue-600">₹{amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Payee: {merchantName}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                      <div className="flex-1 space-y-4 w-full">
                        <p className="text-base font-semibold text-gray-800">
                          {selectedApp ? `Scan with ${selectedApp}` : "Scan QR Code to Pay"}
                        </p>
                        <div className="bg-white p-6 rounded-2xl border-2 border-blue-100 shadow-sm flex flex-col items-center justify-center transition-all">
                          <QRCode 
                            value={getUpiLink(upiApps.find(a => a.name === selectedApp)?.scheme || "upi://pay")}
                            size={200}
                            level="H"
                          />
                          <p className="text-sm text-gray-500 mt-4 font-medium text-center">
                            {selectedApp ? `Open ${selectedApp} to scan` : "Scan with any UPI app on your phone"}
                          </p>
                        </div>
                      </div>

                      <div className="hidden md:flex flex-col items-center justify-center h-full pt-12">
                        <div className="h-20 w-px bg-gray-200"></div>
                        <span className="text-gray-400 font-medium py-2">OR</span>
                        <div className="h-20 w-px bg-gray-200"></div>
                      </div>
                      <div className="md:hidden flex items-center justify-center w-full">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-gray-400 font-medium px-4">OR</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>

                      <div className="flex-1 space-y-4 w-full">
                        <p className="text-base font-semibold text-gray-800">Open UPI App on Device</p>
                        <div className="grid grid-cols-2 gap-3">
                          {upiApps.map((app) => (
                            <button
                              key={app.id}
                              onClick={() => handleSelectApp(app)}
                              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 ${app.borderColor} transition-all hover:shadow-md hover:scale-105 ${selectedApp === app.name ? 'bg-blue-50 scale-105 shadow-md ring-2 ring-blue-400' : 'bg-white'}`}
                            >
                              <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center mb-2 overflow-hidden p-2`}>
                                <app.icon className={`w-8 h-8 ${app.textColor}`} />
                              </div>
                              <span className="text-xs font-semibold text-gray-800">{app.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                      <p className="text-sm text-amber-800 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        <span>Click on your preferred app to open it directly. Complete the payment and return here to confirm.</span>
                      </p>
                    </div>

                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep("confirm")}
                      className="w-full h-12 text-blue-700 border-blue-200 hover:bg-blue-50"
                    >
                      I've Already Completed Payment
                    </Button>
                  </CardContent>
                </Card>

                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentStep("summary")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Summary
                </Button>
              </motion.div>
            )}

            {currentStep === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <CheckCircle2 className="h-7 w-7 text-blue-600" />
                      Confirm Your Payment
                    </CardTitle>
                    <CardDescription>Enter your transaction details to verify payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                      <p className="text-sm text-blue-800 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        <span>Find the UTR/Transaction Reference Number in your UPI app's transaction history or payment confirmation screen.</span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="utr" className="text-base font-semibold">
                        UPI Transaction Reference Number (UTR)
                      </Label>
                      <Input
                        id="utr"
                        value={utr}
                        onChange={handleUTRChange}
                        placeholder="Enter 12-16 digit UTR number"
                        className={`h-14 text-lg font-mono ${utrError ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                      {utrError && (
                        <p className="text-sm text-red-600 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {utrError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        Upload Payment Screenshot (Optional)
                      </Label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors cursor-pointer">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </div>

                    <Button 
                      onClick={handleConfirmPayment}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-bold rounded-xl"
                      disabled={!utr}
                    >
                      Confirm Payment
                    </Button>
                  </CardContent>
                </Card>

                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentStep("select-app")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to App Selection
                </Button>
              </motion.div>
            )}

            {currentStep === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 180, damping: 18 }}
                className="space-y-6"
              >
                <Card className="border-0 shadow-2xl overflow-hidden">
                  {/* Success Hero */}
                  <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-10 text-center text-white overflow-hidden">
                    <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 16 }}
                      className="relative w-24 h-24 mx-auto mb-5"
                    >
                      <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: "2s" }} />
                      <div className="relative w-24 h-24 bg-white/25 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="h-14 w-14 text-white drop-shadow-md" />
                      </div>
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="text-3xl font-extrabold mb-2 tracking-tight"
                    >
                      Payment Successful & Verified! 🎉
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="text-emerald-100 text-base"
                    >
                      Your family insurance payment has been confirmed.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                      className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mt-4"
                    >
                      <span className="text-white/80 text-sm font-medium">Amount Paid</span>
                      <span className="text-white text-xl font-bold">₹{amount.toLocaleString()}</span>
                    </motion.div>
                  </div>

                  <CardContent className="p-8 space-y-6">
                    {/* Verified banner */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-800 text-base">Payment Verified ✓</p>
                        <p className="text-sm text-emerald-700 mt-1">
                          Your payment has been successfully processed and verified. Your family policy is now active and details will be emailed to you.
                        </p>
                      </div>
                    </motion.div>

                    {/* Transaction Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-1"
                    >
                      <h3 className="font-bold text-gray-900 text-base mb-4">Transaction Details</h3>
                      {[
                        { label: "Plan", value: planName },
                        { label: "Members Covered", value: `${members} Members` },
                        { label: "Coverage", value: coverage },
                        { label: "UTR Number", value: utr, mono: true },
                      ].map(({ label, value, mono }) => (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                          <span className="text-gray-500 text-sm">{label}</span>
                          <span className={`font-semibold text-gray-900 text-sm ${mono ? "font-mono" : ""}`}>{value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-500 text-sm">Status</span>
                        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Payment Successful & Verified
                        </span>
                      </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-3 pt-2"
                    >
                      <Link href="/family-insurance">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-12">
                          Back to Family Insurance
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button variant="outline" className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
                          Go to Homepage
                        </Button>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
    </div>
    </PaymentOtpGate>
  );
}
