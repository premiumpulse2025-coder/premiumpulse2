"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
  Check
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type PaymentStep = "summary" | "select-app" | "confirm" | "success";

const upiApps = [
  { 
    name: "Google Pay", 
    id: "gpay",
    color: "bg-white",
    textColor: "text-gray-800",
    borderColor: "border-gray-200 hover:border-blue-400",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png",
    scheme: "tez://upi/pay"
  },
  { 
    name: "PhonePe", 
    id: "phonepe",
    color: "bg-[#5f259f]",
    textColor: "text-white",
    borderColor: "border-purple-300 hover:border-purple-500",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PhonePe.svg/512px-PhonePe.svg.png",
    scheme: "phonepe://pay"
  },
  { 
    name: "Paytm", 
    id: "paytm",
    color: "bg-[#00BAF2]",
    textColor: "text-white",
    borderColor: "border-cyan-300 hover:border-cyan-500",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png",
    scheme: "paytmmp://pay"
  },
  { 
    name: "BHIM", 
    id: "bhim",
    color: "bg-[#00A650]",
    textColor: "text-white",
    borderColor: "border-green-300 hover:border-green-500",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png",
    scheme: "upi://pay"
  },
  { 
    name: "Amazon Pay", 
    id: "amazonpay",
    color: "bg-[#FF9900]",
    textColor: "text-black",
    borderColor: "border-orange-300 hover:border-orange-500",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Amazon_Pay_logo.svg/512px-Amazon_Pay_logo.svg.png",
    scheme: "amazonpay://pay"
  },
  { 
    name: "WhatsApp", 
    id: "whatsapp",
    color: "bg-[#25D366]",
    textColor: "text-white",
    borderColor: "border-green-300 hover:border-green-500",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png",
    scheme: "whatsapp://pay"
  },
  { 
    name: "SuperMoney", 
    id: "supermoney",
    color: "bg-gradient-to-r from-blue-600 to-purple-600",
    textColor: "text-white",
    borderColor: "border-blue-300 hover:border-blue-500",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png",
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

  const upiId = "insurance@upi";
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
    const upiLink = getUpiLink(app.scheme);
    window.location.href = upiLink;
    setTimeout(() => setCurrentStep("confirm"), 500);
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
            {currentStep === "summary" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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

                    <div className="space-y-4">
                      <p className="text-base font-semibold text-gray-800">Select your UPI App:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {upiApps.map((app) => (
                          <button
                            key={app.id}
                            onClick={() => handleSelectApp(app)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 ${app.borderColor} transition-all hover:shadow-lg hover:scale-105 bg-white`}
                          >
                            <div className={`w-14 h-14 rounded-xl ${app.color} flex items-center justify-center mb-3 overflow-hidden p-2`}>
                              <Image 
                                src={app.icon} 
                                alt={app.name}
                                width={40}
                                height={40}
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-800">{app.name}</span>
                          </button>
                        ))}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <Card className="border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Payment Submitted!</h2>
                    <p className="text-blue-100">Your payment confirmation is being processed</p>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                      <div className="flex items-start gap-3">
                        <Clock className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-800">Payment Pending Verification</p>
                          <p className="text-sm text-amber-700 mt-1">
                            Our team will verify your payment within 24-48 hours. You will receive a confirmation email once verified.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <h3 className="font-bold text-gray-900">Transaction Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plan</span>
                          <span className="font-medium">{planName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Members Covered</span>
                          <span className="font-medium">{members}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount Paid</span>
                          <span className="font-bold text-blue-600">₹{amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">UTR Number</span>
                          <span className="font-mono font-medium">{utr}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending Verification</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Link href="/family-insurance">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12">
                          Back to Family Insurance
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button variant="outline" className="w-full h-12">
                          Go to Homepage
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
