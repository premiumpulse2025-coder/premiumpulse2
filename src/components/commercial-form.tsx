"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  CreditCard,
  BarChart3,
  Laptop,
  Sparkles,
  Calendar,
  Wallet,
  Loader2,
  Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { BusinessProfile, BusinessType, CoverageSelection, RiskAssessment, CommercialPremiumBreakdown } from "@/types/commercial";
import { calculateRiskAssessment, calculateCommercialPremium } from "@/lib/ml/commercial-calculator";

const steps = [
  { id: 1, title: "Business Profile" },
  { id: 2, title: "Risk Assessment" },
  { id: 3, title: "Coverage Selection" },
  { id: 4, title: "Premium Quote" },
  { id: 5, title: "Compliance" },
  { id: 6, title: "Plan Selection" },
  { id: 7, title: "Checkout" }
];

export function CommercialForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [profile, setProfile] = useState<BusinessProfile>({
      name: "",
      type: "Startup",
      industry: "",
      annualTurnover: 0,
      employeeCount: 0,
      location: "",
      assetsValue: 0,
      riskExposure: "medium"
    });

    const [coverages, setCoverages] = useState<CoverageSelection[]>([
      { type: 'property', limit: 1000000, deductible: 5000, selected: true },
      { type: 'liability', limit: 500000, deductible: 2000, selected: true },
      { type: 'employee_health', limit: 300000, deductible: 1000, selected: true },
      { type: 'cyber', limit: 250000, deductible: 5000, selected: false },
      { type: 'business_interruption', limit: 500000, deductible: 5000, selected: false },
    ]);

    const [risk, setRisk] = useState<RiskAssessment | null>(null);
    const [premium, setPremium] = useState<CommercialPremiumBreakdown | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null);
    const [paymentMode, setPaymentMode] = useState<"annual" | "monthly">("annual");
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const [documents, setDocuments] = useState<{label: string, icon: any, status: 'pending' | 'uploading' | 'completed', file: string | null}[]>([
      { label: "GST Certificate", icon: FileText, status: 'pending', file: null },
      { label: "Business Registration", icon: Building2, status: 'pending', file: null },
      { label: "Employee Data (CSV/Excel)", icon: Users, status: 'pending', file: null },
      { label: "Asset Valuation Report", icon: Target, status: 'pending', file: null },
    ]);

    const handleFileUpload = (index: number) => {
      const newDocs = [...documents];
      newDocs[index].status = 'uploading';
      setDocuments(newDocs);

      setTimeout(() => {
        const validatedDocs = [...newDocs];
        validatedDocs[index].status = 'completed';
        validatedDocs[index].file = "doc_uploaded.pdf";
        setDocuments(validatedDocs);
      }, 1500);
    };

    const isComplianceComplete = documents.every(doc => doc.status === 'completed');

    const nextStep = () => {
    if (currentStep === 1) {
      setRisk(calculateRiskAssessment(profile));
    }
    if (currentStep === 3) {
      setPremium(calculateCommercialPremium(profile, coverages));
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handlePlanSelection = (plan: { name: string; price: number }) => {
      setSelectedPlan(plan);
      setPaymentError(null);
      const params = new URLSearchParams({
        plan: plan.name,
        amount: (paymentMode === "annual" ? Math.round(plan.price * 0.9) : plan.price).toString(),
        business: profile.name || "Your Business",
        mode: paymentMode
      });
      router.push(`/commercial-insurance/payment?${params.toString()}`);
    };

    const handlePaymentSuccess = useCallback((paymentId: string) => {
      const params = new URLSearchParams({
        payment_id: paymentId,
        plan: selectedPlan?.name || "",
        business: profile.name,
        mode: paymentMode,
      });
      router.push(`/commercial-insurance/success?${params.toString()}`);
    }, [selectedPlan, profile.name, paymentMode, router]);

    const handlePaymentError = useCallback((error: string) => {
      setPaymentError(error);
    }, []);

    const plans = [
      {
        name: "Starter Business",
        price: premium ? Math.round(premium.total * 0.8) : 0,
        features: ["Property Protection", "Basic Liability", "10 Employees Max"],
        exclusions: ["Cyber Attacks", "Natural Disasters", "International Claims"],
        claimLimit: premium ? Math.round(premium.total * 50) : 500000,
        benefits: ["24/7 Support", "Email Policy"],
        color: "bg-blue-500"
      },
      {
        name: "Enterprise Core",
        price: premium?.total || 0,
        features: ["All Risk Protection", "Comprehensive Liability", "Unlimited Employees", "Cyber Shield"],
        exclusions: ["Nuclear War", "Intentional Damage"],
        claimLimit: premium ? Math.round(premium.total * 100) : 1000000,
        benefits: ["Dedicated Account Manager", "Risk Consulting", "Legal Defense"],
        color: "bg-violet-600",
        recommended: true
      },
      {
        name: "Platinum Global",
        price: premium ? Math.round(premium.total * 1.5) : 0,
        features: ["Global Operations", "Zero Deductible", "Elite Cyber Defense", "Legal Support"],
        exclusions: ["None (All-Risk)"],
        claimLimit: premium ? Math.round(premium.total * 500) : 5000000,
        benefits: ["Worldwide Coverage", "Crisis Management", "Business Continuity Plan"],
        color: "bg-gray-900"
      }
    ];

    const getPaymentAmount = () => {
      if (!selectedPlan) return { total: 0, monthly: 0, discount: 0 };
      const discount = paymentMode === "annual" ? Math.round(selectedPlan.price * 0.1) : 0;
      const total = paymentMode === "annual" ? selectedPlan.price - discount : selectedPlan.price;
      const monthly = Math.round(total / 12);
      return { total, monthly, discount };
    };

    const paymentDetails = getPaymentAmount();

    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-sm font-medium text-violet-600 mb-1">Step {currentStep} of {steps.length}</h2>
              <h1 className="text-2xl font-bold text-gray-900">{steps[currentStep - 1].title}</h1>
            </div>
            <span className="text-sm text-gray-500 font-medium">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2 bg-violet-100" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tell us about your business</CardTitle>
                  <CardDescription>This helps us analyze your risk profile accurately</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Business Name</Label>
                      <Input 
                        placeholder="Acme Corp" 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Business Type</Label>
                      <Select value={profile.type} onValueChange={(value: BusinessType) => setProfile({...profile, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MSME">MSME</SelectItem>
                          <SelectItem value="Startup">Startup</SelectItem>
                          <SelectItem value="Enterprise">Enterprise</SelectItem>
                          <SelectItem value="Warehouse">Warehouse</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="IT Services">IT Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Annual Turnover (USD)</Label>
                      <Input 
                        type="number" 
                        value={profile.annualTurnover || ""}
                        onChange={(e) => setProfile({...profile, annualTurnover: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Employees</Label>
                      <Input 
                        type="number"
                        value={profile.employeeCount || ""}
                        onChange={(e) => setProfile({...profile, employeeCount: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input 
                        placeholder="City, Country"
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Assets Value (USD)</Label>
                      <Input 
                        type="number"
                        value={profile.assetsValue || ""}
                        onChange={(e) => setProfile({...profile, assetsValue: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && risk && (
              <div className="space-y-6">
                <Card className="border-violet-200 bg-violet-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-violet-600" />
                      AI Risk Analysis
                    </CardTitle>
                    <CardDescription>Based on your business profile, here is our assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { label: "Property Risk", value: risk.propertyRisk, icon: Building2 },
                        { label: "Liability Risk", value: risk.liabilityRisk, icon: ShieldCheck },
                        { label: "Employee Risk", value: risk.employeeRisk, icon: Users },
                        { label: "Cyber Risk", value: risk.cyberRisk, icon: Laptop },
                        { label: "Operational Risk", value: risk.operationalRisk, icon: TrendingUp },
                      ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 mb-2 text-gray-600 text-sm">
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </div>
                          <div className={`text-lg font-bold capitalize ${
                            item.value === 'high' ? 'text-red-600' : 
                            item.value === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {item.value} Risk
                          </div>
                        </div>
                      ))}
                      <div className="p-4 rounded-xl bg-violet-600 text-white shadow-lg md:col-span-2 lg:col-span-1">
                        <div className="text-violet-100 text-sm mb-1">Overall Risk Score</div>
                        <div className="text-3xl font-bold">{risk.overallScore.toFixed(1)} / 3.0</div>
                        <div className="text-xs text-violet-200 mt-2">Lower score means better premium rates</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Your Coverage</CardTitle>
                  <CardDescription>Customize your policy with these coverage types, limits, and deductibles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {coverages.map((coverage, idx) => (
                    <div key={coverage.type} className={`p-6 rounded-2xl border transition-all ${coverage.selected ? 'border-violet-500 bg-violet-50/30 shadow-sm' : 'border-gray-200 hover:border-violet-200'}`}>
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Checkbox 
                              id={`cv-${coverage.type}`}
                              checked={coverage.selected} 
                              onCheckedChange={(checked) => {
                                const newCoverages = [...coverages];
                                newCoverages[idx].selected = !!checked;
                                setCoverages(newCoverages);
                              }}
                            />
                            <Label htmlFor={`cv-${coverage.type}`} className="cursor-pointer">
                              <h3 className="font-bold text-gray-900 capitalize text-lg">{coverage.type.replace(/_/g, ' ')}</h3>
                              <p className="text-sm text-gray-500">Comprehensive protection for your business {coverage.type.split('_')[0]}</p>
                            </Label>
                          </div>
                        </div>

                        {coverage.selected && (
                          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-violet-100">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold">Coverage Limit</Label>
                                <span className="text-violet-600 font-bold">${coverage.limit.toLocaleString()}</span>
                              </div>
                              <Select 
                                value={coverage.limit.toString()} 
                                onValueChange={(val) => {
                                  const newCoverages = [...coverages];
                                  newCoverages[idx].limit = Number(val);
                                  setCoverages(newCoverages);
                                }}
                              >
                                <SelectTrigger className="bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[100000, 250000, 500000, 1000000, 2500000, 5000000].map(val => (
                                    <SelectItem key={val} value={val.toString()}>${val.toLocaleString()}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold">Deductible</Label>
                                <span className="text-violet-600 font-bold">${coverage.deductible.toLocaleString()}</span>
                              </div>
                              <Select 
                                value={coverage.deductible.toString()} 
                                onValueChange={(val) => {
                                  const newCoverages = [...coverages];
                                  newCoverages[idx].deductible = Number(val);
                                  setCoverages(newCoverages);
                                }}
                              >
                                <SelectTrigger className="bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[0, 500, 1000, 2500, 5000, 10000].map(val => (
                                    <SelectItem key={val} value={val.toString()}>${val.toLocaleString()}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-amber-900">Add-on: Business Interruption Extension</div>
                      <p className="text-xs text-amber-700">Add coverage for up to 12 months of lost revenue during recovery (included in Enterprise plans).</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && premium && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Sparkles className="h-4 w-4" />
                    AI Prediction Ready
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Your Annual Premium</h2>
                  <div className="text-5xl font-extrabold text-violet-600 mt-2">
                    ${premium.total.toLocaleString()}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Premium Breakup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Base Premium</span>
                        <span className="font-medium">${premium.basePremium.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Business Size Adj.</span>
                        <span className="font-medium text-emerald-600">+${premium.sizeAdjustment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Risk Factor Adj.</span>
                        <span className="font-medium text-amber-600">+${premium.riskAdjustment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Coverage Selection</span>
                        <span className="font-medium text-emerald-600">+${premium.coverageAdjustment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Employee Benefits</span>
                        <span className="font-medium text-violet-600">+${premium.employeeBenefitCost.toLocaleString()}</span>
                      </div>
                      <div className="pt-3 border-t border-dashed flex justify-between font-bold text-lg">
                        <span>Total Annual</span>
                        <span>${premium.total.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg">Why this premium?</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-4 text-violet-100">
                      <p>
                        Our ML model analyzed <span className="text-white font-medium">{profile.employeeCount} employees</span> and <span className="text-white font-medium">{profile.type}</span> business model.
                      </p>
                      <p>
                        The <span className="text-white font-medium">{risk?.overallScore.toFixed(1)} risk score</span> indicates a stable operational environment, resulting in a competitive rate.
                      </p>
                      <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
                        <TrendingUp className="h-5 w-5 mt-0.5" />
                        <div>
                          <div className="font-medium text-white">Savings Tip</div>
                          <p className="text-xs">Increasing your cyber security protocols could lower your cyber risk score and reduce premium by up to 12%.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Compliance & Documentation</CardTitle>
                  <CardDescription>Upload necessary business documents for digital validation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {documents.map((doc, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      doc.status === 'completed' ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-dashed border-gray-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          doc.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-white border border-gray-200 text-gray-400'
                        }`}>
                          {doc.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : <doc.icon className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{doc.label}</div>
                          {doc.status === 'completed' ? (
                            <div className="text-xs text-emerald-600 font-medium">Validated & Verified</div>
                          ) : (
                            <div className="text-xs text-gray-500">Max size 5MB • PDF/PNG/JPG</div>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant={doc.status === 'completed' ? "ghost" : "outline"} 
                        size="sm" 
                        className={doc.status === 'completed' ? "text-emerald-600" : "bg-white"}
                        onClick={() => handleFileUpload(i)}
                        disabled={doc.status !== 'pending'}
                      >
                        {doc.status === 'pending' && "Upload"}
                        {doc.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin" />}
                        {doc.status === 'completed' && "Replace"}
                      </Button>
                    </div>
                  ))}
                  
                  {!isComplianceComplete && (
                    <div className="p-4 rounded-xl bg-violet-50 border border-violet-100 flex items-start gap-3 mt-4">
                      <Sparkles className="h-5 w-5 text-violet-600 mt-0.5" />
                      <div className="text-xs text-violet-700">
                        Our AI system validates your documents in real-time. Please ensure all documents are clear and valid to avoid processing delays.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 6 && (
              <div className="space-y-8">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare Our Plans</h2>
                  <p className="text-gray-600">Choose the level of protection that matches your business scale and risk tolerance.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan, i) => (
                    <Card key={i} className={`relative overflow-hidden flex flex-col ${plan.recommended ? 'ring-2 ring-violet-500 scale-105 z-10' : 'border-gray-200'}`}>
                      {plan.recommended && (
                        <div className="absolute top-0 right-0 bg-violet-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                          Best Value
                        </div>
                      )}
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="flex flex-col items-center mt-4">
                          <div className="text-4xl font-extrabold text-gray-900">${plan.price.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">per year</div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-6 pt-4">
                        <div className="space-y-3">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Features</div>
                          <ul className="space-y-2">
                            {plan.features.map((f, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Benefits</div>
                          <ul className="space-y-2">
                            {plan.benefits.map((b, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                            <span>CLAIM LIMIT</span>
                            <span className="text-gray-900 font-extrabold">${plan.claimLimit.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="text-xs font-bold text-red-400 uppercase tracking-wider">Exclusions</div>
                          <ul className="space-y-1">
                            {plan.exclusions.map((e, idx) => (
                              <li key={idx} className="text-xs text-gray-500 flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-red-400" />
                                {e}
                              </li>
                            ))}
                          </ul>
                        </div>

                          <Button 
                            className={`w-full mt-4 ${plan.color} text-white hover:opacity-90 shadow-lg`}
                            onClick={() => handlePlanSelection(plan)}
                          >
                            Pay via UPI - ${plan.price.toLocaleString()}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

