"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  FileText, 
  Mail, 
  Building2, 
  ArrowRight,
  Sparkles,
  Shield,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const planName = searchParams.get("plan");
  const businessName = searchParams.get("business");
  const paymentMode = searchParams.get("mode");

  const [isLoading, setIsLoading] = useState(true);
  const [policyNumber, setPolicyNumber] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generatePolicy = () => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      setPolicyNumber(`POL-COM-${randomNum}`);
      setIsLoading(false);
    };

    const timer = setTimeout(generatePolicy, 2000);
    return () => clearTimeout(timer);
  }, [paymentId]);

  const handleCopyPolicyNumber = () => {
    navigator.clipboard.writeText(policyNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {isLoading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-violet-100 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-10 w-10 text-violet-600" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Issuing Your Policy...</h2>
          <p className="text-gray-500">Please wait while we finalize your insurance policy</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center"
            >
              <CheckCircle2 className="h-14 w-14 text-emerald-600" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
            <p className="text-lg text-gray-600">
              Your commercial insurance policy has been issued successfully.
            </p>
          </div>

          <Card className="mb-8 border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <Shield className="h-6 w-6" />
                <span className="font-semibold">Policy Details</span>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500">Policy Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-violet-600 text-lg">{policyNumber}</span>
                    <button
                      onClick={handleCopyPolicyNumber}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Copy policy number"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500">Status</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </span>
                </div>
                {planName && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-500">Plan</span>
                    <span className="font-medium text-gray-900">{planName}</span>
                  </div>
                )}
                {businessName && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-500">Business</span>
                    <span className="font-medium text-gray-900">{businessName}</span>
                  </div>
                )}
                {paymentMode && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-500">Payment Type</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {paymentMode === "annual" ? "One-time Annual" : "Monthly Subscription"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500">Effective Date</span>
                  <span className="font-medium text-gray-900">
                    {new Date().toLocaleDateString("en-US", { 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 mb-10">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Policy Document</h3>
                  <p className="text-sm text-gray-500 mb-2">Your policy is ready for download</p>
                  <Button variant="link" className="p-0 h-auto text-violet-600 text-sm">
                    Download PDF →
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Confirmation Email</h3>
                  <p className="text-sm text-gray-500 mb-2">Sent to your registered email</p>
                  <span className="text-sm text-emerald-600 font-medium">✓ Delivered</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-10 border-violet-200 bg-violet-50/50">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-600" />
                What happens next?
              </h3>
              <ol className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center shrink-0">1</span>
                  <span>Your policy documents will be emailed within 24 hours</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center shrink-0">2</span>
                  <span>A dedicated account manager will contact you shortly</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center shrink-0">3</span>
                  <span>Access your dashboard to manage policies and file claims</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/commercial-insurance/dashboard">
              <Button 
                size="lg" 
                className="bg-violet-600 hover:bg-violet-700 text-white px-8 gap-2"
              >
                <Building2 className="h-5 w-5" />
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-violet-200 text-violet-700 hover:bg-violet-50 px-8"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 via-white to-violet-50/30">
      <Header />
      
      <main className="pt-[72px]">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Suspense fallback={
              <div className="max-w-2xl mx-auto text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-violet-100 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-violet-600 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
              </div>
            }>
              <SuccessContent />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
