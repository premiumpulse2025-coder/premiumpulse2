"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Heart, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  MinusCircle,
  Shield,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { 
  FamilyMember, 
  HealthDetails, 
  AdditionalMedicalInfo, 
  PaymentCapacity, 
  PremiumPrediction
} from "@/types/insurance";

const TOTAL_STEPS = 5;

const PRE_EXISTING_DISEASES = [
  { value: "diabetes", label: "Diabetes" },
  { value: "hypertension", label: "Hypertension" },
  { value: "heart_disease", label: "Heart Disease" },
  { value: "asthma", label: "Asthma" },
  { value: "thyroid", label: "Thyroid Disorder" },
  { value: "cancer_history", label: "Cancer History" },
  { value: "kidney_disease", label: "Kidney Disease" },
  { value: "liver_disease", label: "Liver Disease" },
  { value: "obesity", label: "Obesity" },
  { value: "none", label: "None" }
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi",
  "Gujarat", "Rajasthan", "West Bengal", "Kerala", "Telangana",
  "Uttar Pradesh", "Madhya Pradesh", "Bihar", "Punjab", "Haryana"
];

const CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
  "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli-Dharwad", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Noida"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior", "Jabalpur", "Ujjain"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Yamunanagar"],
  "default": ["Other"]
};

export default function IndividualInsurancePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [member, setMember] = useState<FamilyMember>({
    id: "self",
    type: "self",
    name: "",
    age: 30,
    gender: "male",
    relationship: "Self",
    city: "",
    state: "",
    country: "India"
  });
  const [healthDetails, setHealthDetails] = useState<HealthDetails>({
    memberId: "self",
    height: 170,
    weight: 70,
    bmi: 24.2,
    smokingStatus: "never",
    alcoholConsumption: "never",
    preExistingDiseases: [],
    chronicConditions: false,
    ongoingMedications: "",
    pastSurgeries: "",
    familyMedicalHistory: ""
  });
  const [additionalMedicalInfo, setAdditionalMedicalInfo] = useState<AdditionalMedicalInfo>({
    recentHospitalizations: "",
    criticalIllnessHistory: "",
    disabilityStatus: "",
    otherRemarks: ""
  });
  const [paymentCapacity, setPaymentCapacity] = useState<PaymentCapacity>({
    monthlyIncomeRange: "",
    preferredPremiumRange: "",
    paymentFrequency: "annual",
    riskAppetite: "medium"
  });
  const [prediction, setPrediction] = useState<PremiumPrediction | null>(null);
  const [disclaimer, setDisclaimer] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateBMI = (height: number, weight: number) => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  useEffect(() => {
    const bmi = calculateBMI(healthDetails.height, healthDetails.weight);
    if (bmi !== healthDetails.bmi) {
      setHealthDetails(prev => ({ ...prev, bmi }));
    }
  }, [healthDetails.height, healthDetails.weight, healthDetails.bmi]);

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!member.name || !member.state || !member.city) {
        setError("Please fill in all personal details");
        return;
      }
    }
    
    if (currentStep === 4) {
      await predictPremium();
    }
    
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const predictPremium = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/predict-premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          members: [member],
          healthDetails: { "self": healthDetails },
          paymentCapacity
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to predict premium");
      }
      
      setPrediction(data.prediction);
      setDisclaimer(data.disclaimer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  const stepTitles = [
    "Personal Details",
    "Health Details",
    "Medical History",
    "Payment Capacity",
    "Results"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-emerald-50/30">
      <Header />
      
      <main className="pt-[88px]">
        <section className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">Individual Insurance Quote</h1>
              <p className="text-xl text-emerald-50/90 mb-10">Get your personalized AI-powered premium prediction</p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">Step {currentStep} of {TOTAL_STEPS}: {stepTitles[currentStep - 1]}</span>
                  <span className="text-sm">{Math.round(progressPercentage)}% Complete</span>
                </div>
                <Progress value={progressPercentage} className="h-2.5 bg-white/20" />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-6 w-6 text-emerald-500" />
                        Personal Details
                      </CardTitle>
                      <CardDescription>
                        Enter your personal information for an accurate assessment
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-10">
                      <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={member.name}
                            onChange={(e) => setMember(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your full name"
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            min={18}
                            max={100}
                            value={member.age}
                            onChange={(e) => setMember(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={member.gender}
                            onValueChange={(value: 'male' | 'female') => setMember(prev => ({ ...prev, gender: value }))}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="state">State</Label>
                          <Select
                            value={member.state}
                            onValueChange={(value) => {
                              setMember(prev => ({ ...prev, state: value, city: "" }));
                            }}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {INDIAN_STATES.map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="city">City</Label>
                          <Select
                            value={member.city}
                            onValueChange={(value) => setMember(prev => ({ ...prev, city: value }))}
                            disabled={!member.state}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                              {(CITIES[member.state] || CITIES["default"]).map(city => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={member.country}
                            disabled
                            className="h-12 bg-gray-50"
                          />
                        </div>
                      </div>
                      {error && (
                        <div className="bg-red-50 text-red-600 rounded-lg p-4 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          {error}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-6 w-6 text-emerald-500" />
                        Health Details
                      </CardTitle>
                      <CardDescription>
                        Your physical health markers significantly influence your premium
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-10">
                      <div className="grid md:grid-cols-3 gap-10">
                        <div className="space-y-3">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            min={100}
                            max={250}
                            value={healthDetails.height}
                            onChange={(e) => setHealthDetails(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            min={20}
                            max={200}
                            value={healthDetails.weight}
                            onChange={(e) => setHealthDetails(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label>BMI (Auto-calculated)</Label>
                          <div className="h-12 px-3 py-2 bg-gray-100 rounded-md flex items-center">
                            <span className={`font-medium ${
                              healthDetails.bmi < 18.5 || healthDetails.bmi > 24.9 
                                ? 'text-amber-600' 
                                : 'text-green-600'
                            }`}>
                              {healthDetails.bmi}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <Label>Smoking Status</Label>
                          <Select
                            value={healthDetails.smokingStatus}
                            onValueChange={(value: 'never' | 'former' | 'current') => setHealthDetails(prev => ({ ...prev, smokingStatus: value }))}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="never">Never Smoked</SelectItem>
                              <SelectItem value="former">Former Smoker</SelectItem>
                              <SelectItem value="current">Current Smoker</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label>Alcohol Consumption</Label>
                          <Select
                            value={healthDetails.alcoholConsumption}
                            onValueChange={(value: 'never' | 'occasional' | 'regular') => setHealthDetails(prev => ({ ...prev, alcoholConsumption: value }))}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="never">Never</SelectItem>
                              <SelectItem value="occasional">Occasional</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <Label className="text-base font-semibold">Pre-existing Diseases</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                          {PRE_EXISTING_DISEASES.map(disease => (
                            <label 
                              key={disease.value}
                              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 cursor-pointer transition-all hover:bg-emerald-50/30"
                            >
                              <Checkbox
                                checked={healthDetails.preExistingDiseases.includes(disease.value)}
                                onCheckedChange={(checked) => {
                                  const current = healthDetails.preExistingDiseases;
                                  if (checked) {
                                    if (disease.value === "none") {
                                      setHealthDetails(prev => ({ ...prev, preExistingDiseases: ["none"] }));
                                    } else {
                                      setHealthDetails(prev => ({ ...prev, preExistingDiseases: [...current.filter(d => d !== "none"), disease.value] }));
                                    }
                                  } else {
                                    setHealthDetails(prev => ({ ...prev, preExistingDiseases: current.filter(d => d !== disease.value) }));
                                  }
                                }}
                              />
                              <span className="text-sm font-medium">{disease.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-center gap-4 p-4 rounded-xl bg-amber-50/50 border border-amber-100 cursor-pointer">
                          <Checkbox
                            checked={healthDetails.chronicConditions}
                            onCheckedChange={(checked) => setHealthDetails(prev => ({ ...prev, chronicConditions: !!checked }))}
                          />
                          <span className="text-sm font-medium text-amber-900">I have a chronic condition requiring ongoing treatment</span>
                        </label>
                      </div>

                      <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <Label htmlFor="medications">Ongoing Medications</Label>
                          <Textarea
                            id="medications"
                            value={healthDetails.ongoingMedications}
                            onChange={(e) => setHealthDetails(prev => ({ ...prev, ongoingMedications: e.target.value }))}
                            placeholder="List any ongoing medications"
                            rows={3}
                            className="resize-none"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="surgeries">Past Surgeries</Label>
                          <Textarea
                            id="surgeries"
                            value={healthDetails.pastSurgeries}
                            onChange={(e) => setHealthDetails(prev => ({ ...prev, pastSurgeries: e.target.value }))}
                            placeholder="List any past surgeries"
                            rows={3}
                            className="resize-none"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-emerald-500" />
                        Additional Medical Information
                      </CardTitle>
                      <CardDescription>
                        Transparency helps our AI provide more accurate premium predictions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-10">
                      <div className="space-y-4">
                        <Label htmlFor="hospitalizations">Recent Hospitalizations (Last 2-3 years)</Label>
                        <Textarea
                          id="hospitalizations"
                          value={additionalMedicalInfo.recentHospitalizations}
                          onChange={(e) => setAdditionalMedicalInfo(prev => ({ ...prev, recentHospitalizations: e.target.value }))}
                          placeholder="Describe any hospitalizations"
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="criticalIllness">Critical Illness History</Label>
                        <Textarea
                          id="criticalIllness"
                          value={additionalMedicalInfo.criticalIllnessHistory}
                          onChange={(e) => setAdditionalMedicalInfo(prev => ({ ...prev, criticalIllnessHistory: e.target.value }))}
                          placeholder="Any history of serious illnesses"
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="disability">Disability Status</Label>
                        <Textarea
                          id="disability"
                          value={additionalMedicalInfo.disabilityStatus}
                          onChange={(e) => setAdditionalMedicalInfo(prev => ({ ...prev, disabilityStatus: e.target.value }))}
                          placeholder="Any existing disabilities"
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-6 w-6 text-emerald-500" />
                        Budget & Preferences
                      </CardTitle>
                      <CardDescription>
                        We'll tailor plan recommendations to match your financial goals
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-10">
                      <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <Label>Monthly Income Range</Label>
                          <Select
                            value={paymentCapacity.monthlyIncomeRange}
                            onValueChange={(value) => setPaymentCapacity(prev => ({ ...prev, monthlyIncomeRange: value }))}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select income range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="below-25k">Below ₹25,000</SelectItem>
                              <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
                              <SelectItem value="50k-1l">₹50,000 - ₹1,00,000</SelectItem>
                              <SelectItem value="1l-2l">₹1,00,000 - ₹2,00,000</SelectItem>
                              <SelectItem value="above-2l">Above ₹2,00,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label>Preferred Annual Premium</Label>
                          <Select
                            value={paymentCapacity.preferredPremiumRange}
                            onValueChange={(value) => setPaymentCapacity(prev => ({ ...prev, preferredPremiumRange: value }))}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select premium range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="below-5k">Below ₹5,000</SelectItem>
                              <SelectItem value="5k-15k">₹5,000 - ₹15,000</SelectItem>
                              <SelectItem value="15k-30k">₹15,000 - ₹30,000</SelectItem>
                              <SelectItem value="above-30k">Above ₹30,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label>Payment Frequency</Label>
                          <Select
                            value={paymentCapacity.paymentFrequency}
                            onValueChange={(value: "monthly" | "quarterly" | "annual") => setPaymentCapacity(prev => ({ ...prev, paymentFrequency: value }))}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label>Risk Appetite</Label>
                          <Select
                            value={paymentCapacity.riskAppetite}
                            onValueChange={(value: "low" | "medium" | "high") => setPaymentCapacity(prev => ({ ...prev, riskAppetite: value }))}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low - Maximum coverage focus</SelectItem>
                              <SelectItem value="medium">Medium - Balanced cost & cover</SelectItem>
                              <SelectItem value="high">High - Budget focused</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {isLoading ? (
                    <Card className="border-0 shadow-xl">
                      <CardContent className="py-24">
                        <div className="text-center">
                          <Loader2 className="h-16 w-16 animate-spin text-emerald-500 mx-auto mb-6" />
                          <p className="text-xl text-gray-600">Generating your personal quote...</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : error ? (
                    <Card className="border-0 shadow-xl border-red-200">
                      <CardContent className="py-12">
                        <div className="text-center text-red-600">
                          <AlertCircle className="h-16 w-16 mx-auto mb-6" />
                          <p className="text-xl font-medium">{error}</p>
                          <Button onClick={predictPremium} className="mt-8 bg-emerald-600 px-8 h-12">
                            Try Again
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : prediction && (
                    <>
                      <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
                        <CardHeader className="pb-8 pt-10 px-10">
                          <CardTitle className="flex items-center gap-3 text-3xl">
                            <Sparkles className="h-8 w-8 text-emerald-500" />
                            Individual Premium Estimate
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-10 pb-10">
                          <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100/50">
                              <p className="text-sm font-medium text-gray-500 mb-2">Recommended Annual Premium</p>
                              <p className="text-5xl font-bold text-emerald-600 tracking-tight">
                                ₹{prediction.recommendedPremium.toLocaleString()}
                              </p>
                              <p className="text-xs font-medium text-gray-400 mt-2">
                                Base Plan + AI Risk Loading
                              </p>
                            </div>
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100/50 flex flex-col justify-center">
                              <p className="text-sm font-medium text-gray-500 mb-3">Health Risk Profile</p>
                              <Badge className={`text-xl px-6 py-2.5 w-fit ${
                                prediction.riskScore === 'low' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                prediction.riskScore === 'medium' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                                'bg-red-100 text-red-700 hover:bg-red-100'
                              }`}>
                                {prediction.riskScore.charAt(0).toUpperCase() + prediction.riskScore.slice(1)}
                              </Badge>
                            </div>
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100/50">
                              <p className="text-sm font-medium text-gray-500 mb-2">Confidence Interval</p>
                              <p className="text-2xl font-bold text-gray-800">
                                ₹{prediction.confidenceRange.min.toLocaleString()} - ₹{prediction.confidenceRange.max.toLocaleString()}
                              </p>
                              <p className="text-xs font-medium text-gray-400 mt-2">AI Prediction Range</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {prediction.breakdown && (
                        <Card className="border-0 shadow-xl">
                          <CardHeader className="pt-10 px-10">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                              <CreditCard className="h-7 w-7 text-emerald-500" />
                              Why This Premium? - Cost Breakdown
                            </CardTitle>
                            <CardDescription className="text-base">How your specific data influenced the final price</CardDescription>
                          </CardHeader>
                          <CardContent className="px-10 pb-10">
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 py-4 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Standard Base Premium</span>
                                <span className="text-right font-bold">₹{prediction.breakdown.basePremium.toLocaleString()}</span>
                              </div>
                              <div className="grid grid-cols-2 py-4 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Age Risk Factor ({member.age} years)</span>
                                <span className="text-right font-bold text-emerald-600">+₹{prediction.breakdown.ageAdjustments.toLocaleString()}</span>
                              </div>
                              <div className="grid grid-cols-2 py-4 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Health Profile Loading (BMI, Pre-existing)</span>
                                <span className="text-right font-bold text-emerald-600">+₹{prediction.breakdown.healthAdjustments.toLocaleString()}</span>
                              </div>
                              <div className="grid grid-cols-2 py-4 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Lifestyle Habits Adjustment</span>
                                <span className="text-right font-bold text-emerald-600">+₹{prediction.breakdown.lifestyleAdjustments.toLocaleString()}</span>
                              </div>
                              <div className="grid grid-cols-2 py-4 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Location Medical Index ({member.city})</span>
                                <span className="text-right font-bold text-emerald-600">+₹{prediction.breakdown.locationAdjustments.toLocaleString()}</span>
                              </div>
                              
                              <div className="grid grid-cols-2 pt-8">
                                <span className="text-2xl font-bold text-gray-900">Total Annual Premium</span>
                                <span className="text-right text-3xl font-bold text-emerald-600">₹{prediction.recommendedPremium.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="mt-10 p-6 bg-emerald-50 rounded-2xl text-base text-emerald-800 border border-emerald-100">
                              <p className="flex gap-4">
                                <Shield className="h-6 w-6 shrink-0 text-emerald-600" />
                                <span>
                                  Your individual premium is lower than family plans but more sensitive to personal health markers. Our AI has verified your BMI and medical history to ensure this rate is specifically optimized for you.
                                </span>
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Card className="border-0 shadow-xl">
                        <CardHeader className="pt-10 px-10">
                          <CardTitle className="text-2xl">Impact Factors</CardTitle>
                          <CardDescription className="text-base">Key reasons for your calculated premium</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 pb-10">
                          <div className="space-y-6">
                            {prediction.factors.map((factor, index) => (
                              <div 
                                key={index}
                                className={`flex items-start gap-5 p-6 rounded-2xl border ${
                                  factor.impact === 'positive' ? 'bg-green-50 border-green-100' :
                                  factor.impact === 'negative' ? 'bg-red-50 border-red-100' :
                                  'bg-gray-50 border-gray-100'
                                }`}
                              >
                                {factor.impact === 'positive' ? (
                                  <TrendingDown className="h-7 w-7 text-green-600 mt-0.5" />
                                ) : factor.impact === 'negative' ? (
                                  <TrendingUp className="h-7 w-7 text-red-600 mt-0.5" />
                                ) : (
                                  <MinusCircle className="h-7 w-7 text-gray-600 mt-0.5" />
                                )}
                                <div>
                                  <p className={`text-lg font-bold ${
                                    factor.impact === 'positive' ? 'text-green-800' :
                                    factor.impact === 'negative' ? 'text-red-800' :
                                    'text-gray-800'
                                  }`}>
                                    {factor.factor}
                                  </p>
                                  <p className="text-gray-600 mt-1">{factor.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid md:grid-cols-2 gap-10">
                        {prediction.plans.map((plan) => (
                          <Card key={plan.id} className="border-0 shadow-xl hover:shadow-2xl transition-all border-t-8 border-emerald-500 rounded-2xl overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                                  <Badge variant="secondary" className="px-3 py-1 font-semibold">{plan.type}</Badge>
                                </div>
                                <div className="text-right">
                                  <p className="text-3xl font-bold text-emerald-600">₹{plan.monthlyPremium.toLocaleString()}</p>
                                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">/year</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-8">
                              <p className="text-gray-600 leading-relaxed font-medium">{plan.reason}</p>
                              
                              <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
                                <p className="text-xs font-bold text-emerald-800 uppercase mb-2 tracking-widest">Premium Insights</p>
                                <p className="text-emerald-700 font-medium">{plan.premiumExplanation}</p>
                              </div>

                              <ul className="space-y-4">
                                {plan.features.slice(0, 4).map((feature, idx) => (
                                  <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              <Button 
                                onClick={() => {
                                  const params = new URLSearchParams({
                                    plan: plan.name,
                                    amount: plan.monthlyPremium.toString(),
                                    coverage: plan.features[0] || "₹5,00,000"
                                  });
                                  router.push(`/individual-insurance/payment?${params.toString()}`);
                                }}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-lg font-bold rounded-xl shadow-lg shadow-emerald-200"
                              >
                                Pay via UPI - ₹{plan.monthlyPremium.toLocaleString()}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <Card className="border-0 shadow-lg bg-gray-50 rounded-2xl">
                        <CardContent className="p-8">
                          <div className="flex items-start gap-4">
                            <AlertCircle className="h-6 w-6 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <p className="text-base text-gray-600 leading-relaxed font-medium italic">
                              {disclaimer}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-16">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
                className="gap-3 h-12 px-6 rounded-xl font-semibold border-gray-200"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Button>
              
              {currentStep < 5 && (
                <Button
                  onClick={handleNext}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-3 h-12 px-8 rounded-xl font-bold shadow-lg shadow-emerald-100"
                  disabled={isLoading}
                >
                  {currentStep === 4 ? "Generate Individual Quote" : "Next"}
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                </Button>
              )}
              
              {currentStep === 5 && !isLoading && (
                <Button
                  onClick={() => {
                    setCurrentStep(1);
                    setPrediction(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-3 h-12 px-8 rounded-xl font-bold shadow-lg shadow-emerald-100"
                >
                  Start New Quote
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
