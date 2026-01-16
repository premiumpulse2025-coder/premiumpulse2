"use client";

import { useState, useCallback } from "react";
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
  Plus, 
  Minus,
  AlertCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  MinusCircle,
  Shield,
  Sparkles,
  Activity
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { 
  FamilyMember, 
  HealthDetails, 
  AdditionalMedicalInfo, 
  PaymentCapacity, 
  PremiumPrediction,
  InsurancePlan
} from "@/types/insurance";

const TOTAL_STEPS = 6;

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

interface MemberSelection {
  father: boolean;
  mother: boolean;
  fatherInLaw: boolean;
  motherInLaw: boolean;
  childrenCount: number;
}

export default function FamilyInsurancePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [memberSelection, setMemberSelection] = useState<MemberSelection>({
    father: false,
    mother: false,
    fatherInLaw: false,
    motherInLaw: false,
    childrenCount: 0
  });
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [healthDetails, setHealthDetails] = useState<Record<string, HealthDetails>>({});
  const [currentHealthIndex, setCurrentHealthIndex] = useState(0);
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

  const totalSelectedMembers = 
    (memberSelection.father ? 1 : 0) +
    (memberSelection.mother ? 1 : 0) +
    (memberSelection.fatherInLaw ? 1 : 0) +
    (memberSelection.motherInLaw ? 1 : 0) +
    memberSelection.childrenCount;

  const generateMembersList = useCallback(() => {
    const newMembers: FamilyMember[] = [];
    
    if (memberSelection.father) {
      newMembers.push({
        id: "father",
        type: "father",
        name: "",
        age: 55,
        gender: "male",
        relationship: "Father",
        city: "",
        state: "",
        country: "India"
      });
    }
    if (memberSelection.mother) {
      newMembers.push({
        id: "mother",
        type: "mother",
        name: "",
        age: 52,
        gender: "female",
        relationship: "Mother",
        city: "",
        state: "",
        country: "India"
      });
    }
    if (memberSelection.fatherInLaw) {
      newMembers.push({
        id: "fatherInLaw",
        type: "fatherInLaw",
        name: "",
        age: 58,
        gender: "male",
        relationship: "Father-in-Law",
        city: "",
        state: "",
        country: "India"
      });
    }
    if (memberSelection.motherInLaw) {
      newMembers.push({
        id: "motherInLaw",
        type: "motherInLaw",
        name: "",
        age: 55,
        gender: "female",
        relationship: "Mother-in-Law",
        city: "",
        state: "",
        country: "India"
      });
    }
    for (let i = 0; i < memberSelection.childrenCount; i++) {
      newMembers.push({
        id: `child-${i}`,
        type: "child",
        name: "",
        age: 10,
        gender: "male",
        relationship: `Child ${i + 1}`,
        city: "",
        state: "",
        country: "India"
      });
    }
    
    return newMembers;
  }, [memberSelection]);

  const initializeHealthDetails = useCallback((membersList: FamilyMember[]) => {
    const newHealthDetails: Record<string, HealthDetails> = {};
    membersList.forEach(member => {
      newHealthDetails[member.id] = {
        memberId: member.id,
        height: 165,
        weight: 65,
        bmi: 23.9,
        smokingStatus: "never",
        alcoholConsumption: "never",
        preExistingDiseases: [],
        chronicConditions: false,
        ongoingMedications: "",
        pastSurgeries: "",
        familyMedicalHistory: ""
      };
    });
    return newHealthDetails;
  }, []);

  const calculateBMI = (height: number, weight: number) => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const updateMember = (index: number, field: keyof FamilyMember, value: string | number) => {
    setMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateHealthDetail = (memberId: string, field: keyof HealthDetails, value: unknown) => {
    setHealthDetails(prev => {
      const updated = { ...prev };
      const current = updated[memberId];
      updated[memberId] = { ...current, [field]: value };
      
      if (field === "height" || field === "weight") {
        const height = field === "height" ? value as number : current.height;
        const weight = field === "weight" ? value as number : current.weight;
        updated[memberId].bmi = calculateBMI(height, weight);
      }
      
      return updated;
    });
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (totalSelectedMembers === 0) {
        setError("Please select at least one family member");
        return;
      }
      const membersList = generateMembersList();
      setMembers(membersList);
      setHealthDetails(initializeHealthDetails(membersList));
      setCurrentMemberIndex(0);
      setCurrentHealthIndex(0);
    }
    
    if (currentStep === 2 && currentMemberIndex < members.length - 1) {
      setCurrentMemberIndex(prev => prev + 1);
      return;
    }
    
    if (currentStep === 3 && currentHealthIndex < members.length - 1) {
      setCurrentHealthIndex(prev => prev + 1);
      return;
    }
    
    if (currentStep === 5) {
      await predictPremium();
    }
    
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    if (currentStep === 2 && currentMemberIndex > 0) {
      setCurrentMemberIndex(prev => prev - 1);
      return;
    }
    
    if (currentStep === 3 && currentHealthIndex > 0) {
      setCurrentHealthIndex(prev => prev - 1);
      return;
    }
    
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
          members,
          healthDetails,
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
    "Select Members",
    "Personal Details",
    "Health Details",
    "Medical History",
    "Payment Capacity",
    "Results"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30">
      <Header />
      
      <main className="pt-[72px]">
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold">Family Insurance Quote</h1>
                <Link href="/family-insurance/simulator">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <Activity className="mr-2 h-4 w-4" /> Try Cost Simulator
                  </Button>
                </Link>
              </div>
              <p className="text-blue-100 mb-6">Complete the form to get your AI-powered premium prediction</p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Step {currentStep} of {TOTAL_STEPS}: {stepTitles[currentStep - 1]}</span>
                  <span className="text-sm">{Math.round(progressPercentage)}% Complete</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-white/20" />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
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
                        <User className="h-6 w-6 text-blue-600" />
                        Select Family Members
                      </CardTitle>
                      <CardDescription>
                        Choose the family members you want to insure. At least one member must be selected.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label className="text-base font-medium">Parents</Label>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                              <Checkbox 
                                checked={memberSelection.father}
                                onCheckedChange={(checked) => setMemberSelection(prev => ({ ...prev, father: !!checked }))}
                              />
                              <span>Father</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                              <Checkbox 
                                checked={memberSelection.mother}
                                onCheckedChange={(checked) => setMemberSelection(prev => ({ ...prev, mother: !!checked }))}
                              />
                              <span>Mother</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label className="text-base font-medium">In-Laws (Optional)</Label>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                              <Checkbox 
                                checked={memberSelection.fatherInLaw}
                                onCheckedChange={(checked) => setMemberSelection(prev => ({ ...prev, fatherInLaw: !!checked }))}
                              />
                              <span>Father-in-Law</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                              <Checkbox 
                                checked={memberSelection.motherInLaw}
                                onCheckedChange={(checked) => setMemberSelection(prev => ({ ...prev, motherInLaw: !!checked }))}
                              />
                              <span>Mother-in-Law</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base font-medium">Children</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setMemberSelection(prev => ({ ...prev, childrenCount: Math.max(0, prev.childrenCount - 1) }))}
                            disabled={memberSelection.childrenCount === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-2xl font-semibold w-12 text-center">{memberSelection.childrenCount}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setMemberSelection(prev => ({ ...prev, childrenCount: Math.min(5, prev.childrenCount + 1) }))}
                            disabled={memberSelection.childrenCount >= 5}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <span className="text-gray-500 text-sm">(Maximum 5 children)</span>
                        </div>
                      </div>

                      <div className="bg-amber-50 rounded-lg p-4">
                        <p className="text-blue-900 font-medium">
                          Total members selected: {totalSelectedMembers}
                        </p>
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

              {currentStep === 2 && members.length > 0 && (
                <motion.div
                  key={`step2-${currentMemberIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-6 w-6 text-blue-600" />
                            Personal Details - {members[currentMemberIndex].relationship}
                          </CardTitle>
                          <CardDescription>
                            Enter personal information for {members[currentMemberIndex].relationship}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                          {currentMemberIndex + 1} of {members.length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={members[currentMemberIndex].name}
                            onChange={(e) => updateMember(currentMemberIndex, "name", e.target.value)}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            min={0}
                            max={100}
                            value={members[currentMemberIndex].age}
                            onChange={(e) => updateMember(currentMemberIndex, "age", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={members[currentMemberIndex].gender}
                            onValueChange={(value) => updateMember(currentMemberIndex, "gender", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Select
                            value={members[currentMemberIndex].state}
                            onValueChange={(value) => {
                              updateMember(currentMemberIndex, "state", value);
                              updateMember(currentMemberIndex, "city", "");
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {INDIAN_STATES.map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Select
                            value={members[currentMemberIndex].city}
                            onValueChange={(value) => updateMember(currentMemberIndex, "city", value)}
                            disabled={!members[currentMemberIndex].state}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                              {(CITIES[members[currentMemberIndex].state] || CITIES["default"]).map(city => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={members[currentMemberIndex].country}
                            disabled
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {currentStep === 3 && members.length > 0 && (
                <motion.div
                  key={`step3-${currentHealthIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Heart className="h-6 w-6 text-blue-600" />
                            Health Details - {members[currentHealthIndex].relationship}
                          </CardTitle>
                          <CardDescription>
                            Enter health information for {members[currentHealthIndex].name || members[currentHealthIndex].relationship}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                          {currentHealthIndex + 1} of {members.length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {healthDetails[members[currentHealthIndex].id] && (
                        <>
                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="height">Height (cm)</Label>
                              <Input
                                id="height"
                                type="number"
                                min={100}
                                max={250}
                                value={healthDetails[members[currentHealthIndex].id].height}
                                onChange={(e) => updateHealthDetail(members[currentHealthIndex].id, "height", parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="weight">Weight (kg)</Label>
                              <Input
                                id="weight"
                                type="number"
                                min={20}
                                max={200}
                                value={healthDetails[members[currentHealthIndex].id].weight}
                                onChange={(e) => updateHealthDetail(members[currentHealthIndex].id, "weight", parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>BMI (Auto-calculated)</Label>
                              <div className="h-10 px-3 py-2 bg-gray-100 rounded-md flex items-center">
                                <span className={`font-medium ${
                                  healthDetails[members[currentHealthIndex].id].bmi < 18.5 || healthDetails[members[currentHealthIndex].id].bmi > 24.9 
                                    ? 'text-blue-700' 
                                    : 'text-green-600'
                                }`}>
                                  {healthDetails[members[currentHealthIndex].id].bmi}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label>Smoking Status</Label>
                              <Select
                                value={healthDetails[members[currentHealthIndex].id].smokingStatus}
                                onValueChange={(value) => updateHealthDetail(members[currentHealthIndex].id, "smokingStatus", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="never">Never Smoked</SelectItem>
                                  <SelectItem value="former">Former Smoker</SelectItem>
                                  <SelectItem value="current">Current Smoker</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Alcohol Consumption</Label>
                              <Select
                                value={healthDetails[members[currentHealthIndex].id].alcoholConsumption}
                                onValueChange={(value) => updateHealthDetail(members[currentHealthIndex].id, "alcoholConsumption", value)}
                              >
                                <SelectTrigger>
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

                          <div className="space-y-3">
                            <Label>Pre-existing Diseases</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {PRE_EXISTING_DISEASES.map(disease => (
                                <label 
                                  key={disease.value}
                                  className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                                >
                                  <Checkbox
                                    checked={healthDetails[members[currentHealthIndex].id].preExistingDiseases.includes(disease.value)}
                                    onCheckedChange={(checked) => {
                                      const current = healthDetails[members[currentHealthIndex].id].preExistingDiseases;
                                      if (checked) {
                                        if (disease.value === "none") {
                                          updateHealthDetail(members[currentHealthIndex].id, "preExistingDiseases", ["none"]);
                                        } else {
                                          updateHealthDetail(members[currentHealthIndex].id, "preExistingDiseases", [...current.filter(d => d !== "none"), disease.value]);
                                        }
                                      } else {
                                        updateHealthDetail(members[currentHealthIndex].id, "preExistingDiseases", current.filter(d => d !== disease.value));
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{disease.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-center gap-3">
                              <Checkbox
                                checked={healthDetails[members[currentHealthIndex].id].chronicConditions}
                                onCheckedChange={(checked) => updateHealthDetail(members[currentHealthIndex].id, "chronicConditions", !!checked)}
                              />
                              <span>Has chronic conditions requiring ongoing treatment</span>
                            </label>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="medications">Ongoing Medications</Label>
                              <Textarea
                                id="medications"
                                value={healthDetails[members[currentHealthIndex].id].ongoingMedications}
                                onChange={(e) => updateHealthDetail(members[currentHealthIndex].id, "ongoingMedications", e.target.value)}
                                placeholder="List any ongoing medications"
                                rows={2}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="surgeries">Past Surgeries</Label>
                              <Textarea
                                id="surgeries"
                                value={healthDetails[members[currentHealthIndex].id].pastSurgeries}
                                onChange={(e) => updateHealthDetail(members[currentHealthIndex].id, "pastSurgeries", e.target.value)}
                                placeholder="List any past surgeries"
                                rows={2}
                              />
                            </div>
                          </div>
                        </>
                      )}
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
                        <FileText className="h-6 w-6 text-blue-600" />
                        Additional Medical Information
                      </CardTitle>
                      <CardDescription>
                        Provide any additional medical disclosures for accurate assessment
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="hospitalizations">Recent Hospitalizations (Last 2-3 years)</Label>
                        <Textarea
                          id="hospitalizations"
                          value={additionalMedicalInfo.recentHospitalizations}
                          onChange={(e) => setAdditionalMedicalInfo(prev => ({ ...prev, recentHospitalizations: e.target.value }))}
                          placeholder="Describe any hospitalizations in the last 2-3 years"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="criticalIllness">Critical Illness History</Label>
                        <Textarea
                          id="criticalIllness"
                          value={additionalMedicalInfo.criticalIllnessHistory}
                          onChange={(e) => setAdditionalMedicalInfo(prev => ({ ...prev, criticalIllnessHistory: e.target.value }))}
                          placeholder="Any history of critical illnesses (cancer, heart attack, stroke, etc.)"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="disability">Disability Status</Label>
                        <Textarea
                          id="disability"
                          value={additionalMedicalInfo.disabilityStatus}
                          onChange={(e) => setAdditionalMedicalInfo(prev => ({ ...prev, disabilityStatus: e.target.value }))}
                          placeholder="Any existing disabilities or physical limitations"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="remarks">Other Medical Remarks</Label>
                        <Textarea
                          id="remarks"
                          value={additionalMedicalInfo.otherRemarks}
                          onChange={(e) => setAdditionalMedicalInfo(prev => ({ ...prev, otherRemarks: e.target.value }))}
                          placeholder="Any other relevant medical information"
                          rows={3}
                        />
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
                >
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                        Payment Capacity & Preferences
                      </CardTitle>
                      <CardDescription>
                        Help us understand your budget to recommend suitable plans
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Monthly Income Range</Label>
                          <Select
                            value={paymentCapacity.monthlyIncomeRange}
                            onValueChange={(value) => setPaymentCapacity(prev => ({ ...prev, monthlyIncomeRange: value }))}
                          >
                            <SelectTrigger>
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
                        <div className="space-y-2">
                          <Label>Preferred Premium Range (Annual)</Label>
                          <Select
                            value={paymentCapacity.preferredPremiumRange}
                            onValueChange={(value) => setPaymentCapacity(prev => ({ ...prev, preferredPremiumRange: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select premium range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="below-10k">Below ₹10,000</SelectItem>
                              <SelectItem value="10k-25k">₹10,000 - ₹25,000</SelectItem>
                              <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
                              <SelectItem value="50k-1l">₹50,000 - ₹1,00,000</SelectItem>
                              <SelectItem value="above-1l">Above ₹1,00,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Payment Frequency</Label>
                          <Select
                            value={paymentCapacity.paymentFrequency}
                            onValueChange={(value: "monthly" | "quarterly" | "annual") => setPaymentCapacity(prev => ({ ...prev, paymentFrequency: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Risk Appetite</Label>
                          <Select
                            value={paymentCapacity.riskAppetite}
                            onValueChange={(value: "low" | "medium" | "high") => setPaymentCapacity(prev => ({ ...prev, riskAppetite: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low - Prefer comprehensive coverage</SelectItem>
                              <SelectItem value="medium">Medium - Balanced coverage & cost</SelectItem>
                              <SelectItem value="high">High - Minimal coverage, lower premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {currentStep === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {isLoading ? (
                    <Card className="border-0 shadow-xl">
                      <CardContent className="py-16">
                        <div className="text-center">
                          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                          <p className="text-lg text-gray-600">Calculating your premium...</p>
                          <p className="text-sm text-gray-500 mt-2">Our AI models are analyzing your data</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : error ? (
                    <Card className="border-0 shadow-xl border-red-200">
                      <CardContent className="py-8">
                        <div className="text-center text-red-600">
                          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                          <p className="text-lg font-medium">{error}</p>
                          <Button onClick={predictPremium} className="mt-4">
                            Try Again
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : prediction && (
                    <>
                      <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-indigo-50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-2xl">
                            <Sparkles className="h-7 w-7 text-blue-600" />
                            Your Premium Estimate
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                              <p className="text-sm text-gray-500 mb-1">Recommended Annual Premium</p>
                              <p className="text-4xl font-bold text-blue-700">
                                ₹{prediction.recommendedPremium.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Range: ₹{prediction.confidenceRange.min.toLocaleString()} - ₹{prediction.confidenceRange.max.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                              <p className="text-sm text-gray-500 mb-1">Risk Score</p>
                              <Badge className={`text-lg px-4 py-2 ${
                                prediction.riskScore === 'low' ? 'bg-green-100 text-green-700' :
                                prediction.riskScore === 'medium' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {prediction.riskScore.charAt(0).toUpperCase() + prediction.riskScore.slice(1)}
                              </Badge>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                              <p className="text-sm text-gray-500 mb-1">Family Members</p>
                              <p className="text-4xl font-bold text-gray-800">{members.length}</p>
                              <p className="text-xs text-gray-400 mt-1">Covered under this plan</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {prediction.breakdown && (
                        <Card className="border-0 shadow-xl">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CreditCard className="h-6 w-6 text-blue-600" />
                              Why This Premium? - Cost Breakdown
                            </CardTitle>
                            <CardDescription>A transparent look at how your personalized premium is calculated</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 py-2 border-b">
                                <span className="text-gray-600">Base Protection Cost</span>
                                <span className="text-right font-medium">₹{prediction.breakdown.basePremium.toLocaleString()}</span>
                              </div>
                              <div className="grid grid-cols-2 py-2 border-b">
                                <span className="text-gray-600">Age-based Risk Adjustment</span>
                                <span className="text-right font-medium text-blue-700">+₹{prediction.breakdown.ageAdjustments.toLocaleString()}</span>
                              </div>
                              <div className="grid grid-cols-2 py-2 border-b">
                                <span className="text-gray-600">Health Profile Loading</span>
                                <span className="text-right font-medium text-blue-700">+₹{prediction.breakdown.healthAdjustments.toLocaleString()}</span>
                              </div>
                              <div className="grid grid-cols-2 py-2 border-b">
                                <span className="text-gray-600">Lifestyle & Habits Factor</span>
                                <span className="text-right font-medium text-blue-700">+₹{prediction.breakdown.lifestyleAdjustments.toLocaleString()}</span>
                              </div>
                              <div className="grid grid-cols-2 py-2 border-b">
                                <span className="text-gray-600">Regional Healthcare Index</span>
                                <span className="text-right font-medium text-blue-700">+₹{prediction.breakdown.locationAdjustments.toLocaleString()}</span>
                              </div>
                              <div className="grid grid-cols-2 py-2 border-b bg-green-50/50 -mx-6 px-6">
                                <span className="text-green-700 font-medium">Family Bundle Discounts</span>
                                <span className="text-right font-bold text-green-600">-₹{prediction.breakdown.discounts.toLocaleString()}</span>
                              </div>
                              <div className="grid grid-cols-2 pt-4">
                                <span className="text-lg font-bold">Total Annual Premium</span>
                                <span className="text-right text-lg font-bold text-blue-700">₹{prediction.recommendedPremium.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="mt-6 p-4 bg-amber-50 rounded-lg text-sm text-blue-900">
                              <p className="flex gap-2">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <span>
                                  Our AI analyzes 20+ variables including your BMI, city-specific medical costs, and pre-existing conditions to ensure your premium is fair and accurately reflects your family&apos;s unique health profile.
                                </span>
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Card className="border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle>Premium Factors Explanation</CardTitle>
                          <CardDescription>Understanding what influences your premium</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {prediction.factors.map((factor, index) => (
                              <div 
                                key={index}
                                className={`flex items-start gap-4 p-4 rounded-lg ${
                                  factor.impact === 'positive' ? 'bg-green-50' :
                                  factor.impact === 'negative' ? 'bg-red-50' :
                                  'bg-gray-50'
                                }`}
                              >
                                {factor.impact === 'positive' ? (
                                  <TrendingDown className="h-6 w-6 text-green-600 mt-0.5" />
                                ) : factor.impact === 'negative' ? (
                                  <TrendingUp className="h-6 w-6 text-red-600 mt-0.5" />
                                ) : (
                                  <MinusCircle className="h-6 w-6 text-gray-600 mt-0.5" />
                                )}
                                <div>
                                  <p className={`font-medium ${
                                    factor.impact === 'positive' ? 'text-green-800' :
                                    factor.impact === 'negative' ? 'text-red-800' :
                                    'text-gray-800'
                                  }`}>
                                    {factor.factor}
                                  </p>
                                  <p className="text-sm text-gray-600">{factor.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-blue-600" />
                            Recommended Insurance Plans
                          </CardTitle>
                          <CardDescription>Plans tailored to your family&apos;s needs</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-6">
                            {prediction.plans.map((plan) => (
                              <div 
                                key={plan.id}
                                className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="font-semibold text-lg text-gray-900">{plan.name}</h3>
                                    <Badge variant="outline" className="mt-1">{plan.type}</Badge>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-700">
                                      ₹{plan.monthlyPremium.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500">/year</p>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  <span className="font-medium">Coverage:</span> ₹{(plan.coverageAmount / 100000).toFixed(0)} Lakhs
                                </p>
                                <p className="text-sm text-blue-800 bg-amber-50 p-2 rounded mb-3">
                                  <span className="font-medium">Ideal for:</span> {plan.idealFor}
                                </p>
                                <p className="text-sm text-gray-600 mb-4">{plan.reason}</p>
                                
                                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 mb-4">
                                  <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">Why this premium?</p>
                                  <p className="text-sm text-blue-700 leading-relaxed">
                                    {plan.premiumExplanation}
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  {plan.features.slice(0, 4).map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      {feature}
                                    </div>
                                  ))}
                                </div>
                                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                  onClick={() => {
                                    const params = new URLSearchParams({
                                      plan: plan.name,
                                      amount: plan.monthlyPremium.toString(),
                                      coverage: `₹${(plan.coverageAmount / 100000).toFixed(0)} Lakhs`,
                                      members: members.length.toString()
                                    });
                                    router.push(`/family-insurance/payment?${params.toString()}`);
                                  }}
                                >
                                  Pay via UPI
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-lg bg-gray-50">
                        <CardContent className="py-6">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-700 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600 leading-relaxed">
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

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              {currentStep < 6 && (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white gap-2"
                  disabled={isLoading}
                >
                  {currentStep === 5 ? "Get Premium Estimate" : "Next"}
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              )}
              
              {currentStep === 6 && (
                <Button
                  onClick={() => {
                    setCurrentStep(1);
                    setMemberSelection({ father: false, mother: false, fatherInLaw: false, motherInLaw: false, childrenCount: 0 });
                    setMembers([]);
                    setHealthDetails({});
                    setPrediction(null);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white gap-2"
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
