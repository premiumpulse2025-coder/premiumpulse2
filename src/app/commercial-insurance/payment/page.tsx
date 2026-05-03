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
  Building2,
  ArrowLeft,
  Copy,
  Check,
  Landmark,
  Wallet
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
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
    scheme: "tez://upi/pay",
    utrPrefix: "408207",   // Axis Bank (Google Pay partner)
    utrLabel: "GPay / Axis Bank"
  },
  { 
    name: "PhonePe", 
    id: "phonepe",
    color: "bg-[#5f259f]",
    textColor: "text-white",
    borderColor: "border-purple-300 hover:border-purple-500",
    icon: SiPhonepe,
    scheme: "phonepe://pay",
    utrPrefix: "525203",   // Yes Bank (PhonePe partner)
    utrLabel: "PhonePe / Yes Bank"
  },
  { 
    name: "Paytm", 
    id: "paytm",
    color: "bg-[#00BAF2]",
    textColor: "text-white",
    borderColor: "border-cyan-300 hover:border-cyan-500",
    icon: SiPaytm,
    scheme: "paytmmp://pay",
    utrPrefix: "123411",   // Paytm Payments Bank
    utrLabel: "Paytm Payments Bank"
  },
  { 
    name: "BHIM", 
    id: "bhim",
    color: "bg-[#00A650]",
    textColor: "text-white",
    borderColor: "border-green-300 hover:border-green-500",
    icon: Landmark,
    scheme: "upi://pay",
    utrPrefix: "230104",   // SBI (primary BHIM bank)
    utrLabel: "BHIM / SBI"
  },
  { 
    name: "Amazon Pay", 
    id: "amazonpay",
    color: "bg-[#FF9900]",
    textColor: "text-black",
    borderColor: "border-orange-300 hover:border-orange-500",
    icon: FaAmazonPay,
    scheme: "amazonpay://pay",
    utrPrefix: "408209",   // Axis Bank (Amazon Pay partner)
    utrLabel: "Amazon Pay / Axis Bank"
  },
  { 
    name: "WhatsApp", 
    id: "whatsapp",
    color: "bg-[#25D366]",
    textColor: "text-white",
    borderColor: "border-green-300 hover:border-green-500",
    icon: SiWhatsapp,
    scheme: "whatsapp://pay",
    utrPrefix: "128205",   // ICICI Bank (WhatsApp Pay partner)
    utrLabel: "WhatsApp Pay / ICICI Bank"
  },
  { 
    name: "SuperMoney", 
    id: "supermoney",
    color: "bg-gradient-to-r from-blue-600 to-purple-600",
    textColor: "text-white",
    borderColor: "border-blue-300 hover:border-blue-500",
    icon: Wallet,
    scheme: "upi://pay",
    utrPrefix: "330107",   // HDFC Bank
    utrLabel: "SuperMoney / HDFC Bank"
  }
];

/** Generates a realistic 12-digit demo UTR with the given 6-digit bank prefix */
function generateAppUTR(prefix: string): string {
  const suffix = Math.floor(100000 + Math.random() * 899999).toString();
  return prefix + suffix; // 6 + 6 = 12 digits
}

/** Fallback generic UTR */
function generateDemoUTR(): string {
  return generateAppUTR("408207");
}

export default function CommercialUPIPaymentPage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<PaymentStep>("summary");
  const [copied, setCopied] = useState(false);
  const [utrCopied, setUtrCopied] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [demoUTR, setDemoUTR] = useState<string>(generateDemoUTR);
  const [utrAppLabel, setUtrAppLabel] = useState<string>("Auto-generated");

  const planName = searchParams.get("plan") || "Enterprise Core";
  const amount = parseInt(searchParams.get("amount") || "50000");
  const businessName = searchParams.get("business") || "Your Business";
  const paymentMode = searchParams.get("mode") || "annual";

  const upiId = "jiyadahmed02@okaxis";
  const merchantName = "PremiumPulse";

  const getUpiLink = (scheme: string) => {
    const params = `pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=Commercial%20Insurance%20Premium`;
    if (scheme.includes("?")) {
      return `${scheme}&${params}`;
    }
    return `${scheme}?${params}`;
  };

  const handleSelectApp = (app: typeof upiApps[0]) => {
    setSelectedApp(app.name);
    // Generate a fresh UTR specific to this app's bank prefix
    setDemoUTR(generateAppUTR(app.utrPrefix));
    setUtrAppLabel(app.utrLabel);
  };



  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyUTR = () => {
    navigator.clipboard.writeText(demoUTR);
    setUtrCopied(true);
    setTimeout(() => setUtrCopied(false), 2000);
  };

  return (
    <PaymentOtpGate accentColor="violet">
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 via-white to-violet-50/30">
      <Header />
      
      <main className="pt-[88px]">
        <section className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Complete Your Payment</h1>
              <p className="text-lg text-violet-100">Secure UPI payment for your commercial insurance premium</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">

            {/* ── STEP 1: Summary ── */}
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
                      <Building2 className="h-7 w-7 text-violet-600" />
                      Payment Summary
                    </CardTitle>
                    <CardDescription>Review your commercial plan details before payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-violet-50 rounded-xl p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Business Name</span>
                        <span className="font-bold text-gray-900">{businessName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Plan Name</span>
                        <span className="font-bold text-gray-900">{planName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Payment Mode</span>
                        <Badge variant="outline" className="capitalize">{paymentMode}</Badge>
                      </div>
                      <div className="border-t border-violet-200 pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total Premium</span>
                        <span className="text-3xl font-bold text-violet-600">₹{amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <p className="text-sm text-gray-600 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <span>Your commercial policy will be active immediately after payment confirmation. Coverage includes all selected business protections.</span>
                      </p>
                    </div>

                    <Button 
                      onClick={() => setCurrentStep("select-app")}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white h-14 text-lg font-bold rounded-xl"
                    >
                      Proceed to Pay
                    </Button>
                  </CardContent>
                </Card>

                <Link href="/commercial-insurance">
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Plans
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* ── STEP 2: Select App & Pay ── */}
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
                      <Smartphone className="h-7 w-7 text-violet-600" />
                      Choose Payment App
                    </CardTitle>
                    <CardDescription>Select your preferred UPI app to complete payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-100">
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
                        <p className="text-4xl font-bold text-violet-600">₹{amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Payee: {merchantName}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                      <div className="flex-1 space-y-4 w-full">
                        <p className="text-base font-semibold text-gray-800">
                          {selectedApp ? `Scan with ${selectedApp}` : "Scan QR Code to Pay"}
                        </p>
                        <div className="bg-white p-6 rounded-2xl border-2 border-violet-100 shadow-sm flex flex-col items-center justify-center transition-all">
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
                              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 ${app.borderColor} transition-all hover:shadow-md hover:scale-105 ${selectedApp === app.name ? 'bg-violet-50 scale-105 shadow-md ring-2 ring-violet-400' : 'bg-white'}`}
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
                        <span>Scan the QR code or tap your preferred UPI app to open it directly and complete the payment.</span>
                      </p>
                    </div>

                    <Button 
                      onClick={() => setCurrentStep("confirm")}
                      className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white text-lg font-bold rounded-xl gap-2"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      I've Completed the Payment
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

            {/* ── STEP 3: Confirm (UTR pre-filled) ── */}
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
                      <CheckCircle2 className="h-7 w-7 text-violet-600" />
                      Confirm Your Payment
                    </CardTitle>
                    <CardDescription>Verify your transaction reference number below</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Info banner */}
                    <div className="bg-violet-50 rounded-xl p-5 border border-violet-100">
                      <p className="text-sm text-violet-800 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        <span>
                          Your UTR (Unique Transaction Reference) number has been auto-filled from your payment. You can verify it matches the one shown in your UPI app.
                        </span>
                      </p>
                    </div>

                    {/* Pre-filled UTR input */}
                    <div className="space-y-3">
                      <Label htmlFor="utr" className="text-base font-semibold">
                        UPI Transaction Reference Number (UTR)
                      </Label>
                      <div className="relative">
                        <Input
                          id="utr"
                          value={demoUTR}
                          readOnly
                          className="h-14 text-lg font-mono tracking-widest bg-emerald-50 border-emerald-300 text-emerald-800 pr-36 cursor-default"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          {utrAppLabel}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Demo UTR generated for <span className="font-semibold text-gray-600">{selectedApp ?? "your payment"}</span>. No manual entry needed.
                      </p>
                    </div>

                    {/* Summary row */}
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-2">
                      {[
                        { label: "Business", value: businessName },
                        { label: "Plan", value: planName },
                        { label: "Amount", value: `₹${amount.toLocaleString()}` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-gray-500">{label}</span>
                          <span className="font-semibold text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => setCurrentStep("success")}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-lg font-bold rounded-xl gap-2"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      Confirm &amp; Complete Payment
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

            {/* ── STEP 4: Success ── */}
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
                  {/* Success Hero Banner */}
                  <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-10 text-center text-white overflow-hidden">
                    <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                    {/* Animated Checkmark */}
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
                      Payment Successful! 🎉
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="text-emerald-100 text-base"
                    >
                      Your commercial insurance payment has been received.
                    </motion.p>

                    {/* Amount pill */}
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
                    {/* Success Status Banner */}
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
                        <p className="font-bold text-emerald-800 text-base">Payment Confirmed ✓</p>
                        <p className="text-sm text-emerald-700 mt-1">
                          Thank you! Your payment has been successfully processed. Your policy is now active and a confirmation will be sent to your registered email.
                        </p>
                      </div>
                    </motion.div>

                    {/* Transaction Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gray-50 rounded-xl p-6 space-y-1 border border-gray-100"
                    >
                      <h3 className="font-bold text-gray-900 text-base mb-4">Transaction Details</h3>

                      {[
                        { label: "Business", value: businessName },
                        { label: "Plan", value: planName },
                        { label: "Payment Mode", value: paymentMode.charAt(0).toUpperCase() + paymentMode.slice(1) },
                        { label: "Amount Paid", value: `₹${amount.toLocaleString()}`, highlight: true },
                      ].map(({ label, value, highlight }) => (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                          <span className="text-gray-500 text-sm">{label}</span>
                          <span className={`font-semibold text-sm ${highlight ? "text-emerald-600 text-base" : "text-gray-900"}`}>{value}</span>
                        </div>
                      ))}

                      {/* UTR row with copy button */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">UTR / Ref. Number</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900 text-sm tracking-wider">{demoUTR}</span>
                          <button
                            onClick={copyUTR}
                            className="p-1 rounded hover:bg-gray-200 transition-colors"
                            title="Copy UTR"
                          >
                            {utrCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-500 text-sm">Status</span>
                        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Payment Successful
                        </span>
                      </div>
                    </motion.div>

                    {/* What's next */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-violet-50 rounded-xl p-5 border border-violet-100"
                    >
                      <p className="font-bold text-violet-800 mb-3 text-sm">What happens next?</p>
                      <ol className="space-y-2 text-sm text-violet-700">
                        {[
                          "Your policy is now active — coverage starts immediately.",
                          "A confirmation email with policy documents will be sent to you.",
                          "A dedicated account manager will reach out shortly.",
                        ].map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="space-y-3 pt-2"
                    >
                      <Link href="/commercial-insurance">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold rounded-xl h-12">
                          Back to Commercial Insurance
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
