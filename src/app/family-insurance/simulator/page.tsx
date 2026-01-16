"use client";

import { useState } from "react";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Stethoscope, 
  Hospital, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  RefreshCcw,
  UserPlus,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { FamilyMember, SimulationScenario, SimulationResult } from "@/types/insurance";

const SCENARIOS: SimulationScenario[] = [
  // --- Critical & High-Cost ---
  {
    id: "sc-heart-attack",
    name: "Heart Attack (Myocardial Infarction)",
    category: "Critical & High-Cost",
    description: "Emergency ICU admission, stabilization, and monitoring after a heart attack.",
    estimatedCost: 250000,
    breakdown: { hospitalCharges: 100000, doctorFees: 60000, medicineCosts: 40000, diagnosticTests: 30000, otherCharges: 20000 },
    hospitalizationDays: 5
  },
  {
    id: "sc-cabg",
    name: "Coronary Artery Bypass Surgery (CABG)",
    category: "Critical & High-Cost",
    description: "Major open-heart surgery to restore blood flow to the heart.",
    estimatedCost: 650000,
    breakdown: { hospitalCharges: 250000, doctorFees: 200000, medicineCosts: 80000, diagnosticTests: 70000, otherCharges: 50000 },
    hospitalizationDays: 10
  },
  {
    id: "sc-angioplasty",
    name: "Cardiac Angioplasty (Stent)",
    category: "Critical & High-Cost",
    description: "Procedure to open blocked heart arteries using a stent.",
    estimatedCost: 350000,
    breakdown: { hospitalCharges: 150000, doctorFees: 100000, medicineCosts: 50000, diagnosticTests: 30000, otherCharges: 20000 },
    hospitalizationDays: 3
  },
  {
    id: "sc-stroke",
    name: "Ischemic / Hemorrhagic Stroke",
    category: "Critical & High-Cost",
    description: "Emergency treatment and rehabilitation for brain stroke.",
    estimatedCost: 400000,
    breakdown: { hospitalCharges: 180000, doctorFees: 90000, medicineCosts: 60000, diagnosticTests: 50000, otherCharges: 20000 },
    hospitalizationDays: 7
  },
  {
    id: "sc-cancer",
    name: "Cancer (Surgery & Chemotherapy)",
    category: "Critical & High-Cost",
    description: "Combined treatment involving tumor removal surgery and initial chemo cycles.",
    estimatedCost: 800000,
    breakdown: { hospitalCharges: 300000, doctorFees: 200000, medicineCosts: 150000, diagnosticTests: 100000, otherCharges: 50000 },
    hospitalizationDays: 12
  },

  // --- Chronic & Lifestyle ---
  {
    id: "sc-diabetes-comp",
    name: "Diabetes Complications",
    category: "Chronic & Lifestyle",
    description: "Hospitalization for diabetic ketoacidosis or severe foot ulcer treatment.",
    estimatedCost: 120000,
    breakdown: { hospitalCharges: 50000, doctorFees: 25000, medicineCosts: 25000, diagnosticTests: 10000, otherCharges: 10000 },
    hospitalizationDays: 5
  },
  {
    id: "sc-hypertension",
    name: "Hypertension Crisis",
    category: "Chronic & Lifestyle",
    description: "Emergency management of extremely high blood pressure.",
    estimatedCost: 70000,
    breakdown: { hospitalCharges: 30000, doctorFees: 15000, medicineCosts: 10000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 3
  },
  {
    id: "sc-copd",
    name: "COPD / Severe Asthma",
    category: "Chronic & Lifestyle",
    description: "In-patient care for respiratory distress and oxygen support.",
    estimatedCost: 95000,
    breakdown: { hospitalCharges: 40000, doctorFees: 20000, medicineCosts: 20000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 4
  },

  // --- General Medical ---
  {
    id: "sc-pneumonia",
    name: "Severe Pneumonia",
    category: "General Medical",
    description: "Treatment for lung infection requiring IV antibiotics and support.",
    estimatedCost: 110000,
    breakdown: { hospitalCharges: 45000, doctorFees: 25000, medicineCosts: 25000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 5
  },
  {
    id: "sc-dengue",
    name: "Dengue Fever (Severe)",
    category: "General Medical",
    description: "Hospitalization for low platelet count and fluid management.",
    estimatedCost: 85000,
    breakdown: { hospitalCharges: 35000, doctorFees: 15000, medicineCosts: 15000, diagnosticTests: 10000, otherCharges: 10000 },
    hospitalizationDays: 5
  },
  {
    id: "sc-typhoid",
    name: "Typhoid Fever",
    category: "General Medical",
    description: "Prolonged high fever treatment with IV fluids and antibiotics.",
    estimatedCost: 65000,
    breakdown: { hospitalCharges: 25000, doctorFees: 15000, medicineCosts: 15000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 6
  },

  // --- Surgical Procedures ---
  {
    id: "sc-appendicitis",
    name: "Appendectomy (Laparoscopic)",
    category: "Surgical Procedures",
    description: "Emergency removal of the appendix.",
    estimatedCost: 150000,
    breakdown: { hospitalCharges: 60000, doctorFees: 40000, medicineCosts: 20000, diagnosticTests: 15000, otherCharges: 15000 },
    hospitalizationDays: 3
  },
  {
    id: "sc-cholecystectomy",
    name: "Gallbladder Removal",
    category: "Surgical Procedures",
    description: "Surgery for gallbladder stone removal.",
    estimatedCost: 180000,
    breakdown: { hospitalCharges: 70000, doctorFees: 50000, medicineCosts: 30000, diagnosticTests: 15000, otherCharges: 15000 },
    hospitalizationDays: 3
  },
  {
    id: "sc-hernia",
    name: "Hernia Repair",
    category: "Surgical Procedures",
    description: "Surgical correction of inguinal or abdominal hernia.",
    estimatedCost: 140000,
    breakdown: { hospitalCharges: 50000, doctorFees: 40000, medicineCosts: 25000, diagnosticTests: 15000, otherCharges: 10000 },
    hospitalizationDays: 2
  },

  // --- Maternity & Child Care ---
  {
    id: "sc-normal-delivery",
    name: "Normal Delivery",
    category: "Maternity & Child Care",
    description: "Standard maternity care and delivery with 2 days stay.",
    estimatedCost: 80000,
    breakdown: { hospitalCharges: 40000, doctorFees: 20000, medicineCosts: 10000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 2
  },
  {
    id: "sc-c-section",
    name: "C-Section Delivery",
    category: "Maternity & Child Care",
    description: "Cesarean section delivery requiring longer hospital stay.",
    estimatedCost: 150000,
    breakdown: { hospitalCharges: 70000, doctorFees: 40000, medicineCosts: 20000, diagnosticTests: 10000, otherCharges: 10000 },
    hospitalizationDays: 4
  },
  {
    id: "sc-nicu",
    name: "Neonatal ICU (NICU) Care",
    category: "Maternity & Child Care",
    description: "Specialized care for newborns requiring intensive monitoring.",
    estimatedCost: 300000,
    breakdown: { hospitalCharges: 150000, doctorFees: 60000, medicineCosts: 50000, diagnosticTests: 25000, otherCharges: 15000 },
    hospitalizationDays: 10
  },

  // --- Elderly-Specific ---
  {
    id: "sc-knee-replacement",
    name: "Total Knee Replacement",
    category: "Elderly-Specific",
    description: "Joint replacement surgery for chronic arthritis.",
    estimatedCost: 450000,
    breakdown: { hospitalCharges: 200000, doctorFees: 120000, medicineCosts: 60000, diagnosticTests: 40000, otherCharges: 30000 },
    hospitalizationDays: 7
  },
  {
    id: "sc-hip-fracture",
    name: "Hip Fracture Surgery",
    category: "Elderly-Specific",
    description: "Emergency surgery for hip bone fracture and stabilization.",
    estimatedCost: 380000,
    breakdown: { hospitalCharges: 180000, doctorFees: 100000, medicineCosts: 50000, diagnosticTests: 30000, otherCharges: 20000 },
    hospitalizationDays: 8
  },

  // --- Mental Health ---
  {
    id: "sc-depression-hosp",
    name: "Severe Depression / Crisis",
    category: "Mental Health & Neurology",
    description: "In-patient care for mental health crisis management.",
    estimatedCost: 150000,
    breakdown: { hospitalCharges: 80000, doctorFees: 40000, medicineCosts: 15000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 10
  },
  {
    id: "sc-epilepsy",
    name: "Epileptic Seizures (Emergency)",
    category: "Mental Health & Neurology",
    description: "Emergency management of status epilepticus.",
    estimatedCost: 90000,
    breakdown: { hospitalCharges: 40000, doctorFees: 20000, medicineCosts: 15000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 3
  },

  // --- Day Care ---
  {
    id: "sc-cataract",
    name: "Cataract Surgery",
    category: "Day Care & OPD",
    description: "Lens replacement procedure (Day Care).",
    estimatedCost: 50000,
    breakdown: { hospitalCharges: 15000, doctorFees: 20000, medicineCosts: 5000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 1
  },
  {
    id: "sc-lithotripsy",
    name: "Kidney Stone Lithotripsy",
    category: "Day Care & OPD",
    description: "Non-invasive kidney stone treatment (Day Care).",
    estimatedCost: 75000,
    breakdown: { hospitalCharges: 30000, doctorFees: 20000, medicineCosts: 10000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 1
  },
  {
    id: "sc-dialysis",
    name: "Dialysis Session",
    category: "Day Care & OPD",
    description: "Single session of hemodialysis for kidney failure.",
    estimatedCost: 15000,
    breakdown: { hospitalCharges: 5000, doctorFees: 3000, medicineCosts: 4000, diagnosticTests: 2000, otherCharges: 1000 },
    hospitalizationDays: 1
  }
];

const PLANS = [
  { id: "basic", name: "Basic Shield", deductible: 10000, coPay: 20, roomLimit: 3000 },
  { id: "gold", name: "Gold Care", deductible: 0, coPay: 10, roomLimit: 7000 },
  { id: "platinum", name: "Platinum Elite", deductible: 0, coPay: 0, roomLimit: 15000 }
];

export default function InsuranceSimulatorPage() {
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: "1", type: "self", name: "Primary Member", age: 35, gender: "male", relationship: "Self", city: "Mumbai", state: "Maharashtra", country: "India" }
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResult[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("all");

  const categories = ["All Categories", ...Array.from(new Set(SCENARIOS.map(s => s.category).filter(Boolean)))];
  
  const filteredScenarios = SCENARIOS.filter(s => {
    const categoryMatch = selectedCategory === "All Categories" || s.category === selectedCategory;
    const scenarioMatch = selectedScenarioId === "all" || s.id === selectedScenarioId;
    return categoryMatch && scenarioMatch;
  });

  const addMember = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setMembers([...members, { id, type: "child", name: "", age: 10, gender: "male", relationship: "Child", city: "Mumbai", state: "Maharashtra", country: "India" }]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const updateMember = (id: string, field: string, value: any) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setResults(null);

    // Simulate delay for AI engine
    setTimeout(() => {
      const scenariosToSimulate = selectedScenarioId !== "all" 
        ? SCENARIOS.filter(s => s.id === selectedScenarioId)
        : (selectedCategory !== "All Categories" 
            ? SCENARIOS.filter(s => s.category === selectedCategory)
            : SCENARIOS.slice(0, 5)); // Limit to 5 if "All" is selected to avoid overwhelming

      const simulationResults: SimulationResult[] = scenariosToSimulate.map(scenario => {
        const planResults = PLANS.map(plan => {
          let coveredAmount = scenario.estimatedCost;
          let outOfPocket = 0;
          let explanation = "";

          // 1. Deductible
          if (plan.deductible > 0) {
            coveredAmount -= plan.deductible;
            outOfPocket += plan.deductible;
            explanation += `Applied ₹${plan.deductible} deductible. `;
          }

          // 2. Room Rent Limit (Simplified simulation)
          const roomDays = scenario.hospitalizationDays;
          const estimatedRoomRent = scenario.breakdown.hospitalCharges / roomDays;
          if (estimatedRoomRent > plan.roomLimit) {
            const excess = (estimatedRoomRent - plan.roomLimit) * roomDays;
            coveredAmount -= excess;
            outOfPocket += excess;
            explanation += `Room rent exceeded limit by ₹${excess.toFixed(0)}. `;
          }

          // 3. Co-pay
          if (plan.coPay > 0) {
            const coPayAmount = coveredAmount * (plan.coPay / 100);
            coveredAmount -= coPayAmount;
            outOfPocket += coPayAmount;
            explanation += `${plan.coPay}% co-pay applied. `;
          }

          return {
            planId: plan.id,
            planName: plan.name,
            coveredAmount: Math.max(0, coveredAmount),
            outOfPocket: outOfPocket,
            deductibleApplied: plan.deductible,
            coPayApplied: plan.coPay,
            roomRentLimitApplied: estimatedRoomRent > plan.roomLimit,
            claimStatus: coveredAmount > 0 ? (coveredAmount === scenario.estimatedCost ? "Approved" : "Partially Approved") : "Rejected",
            explanation: explanation || "Full coverage applied."
          };
        });

        return {
          scenario,
          plans: planResults
        };
      });

      setResults(simulationResults);
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-24 pb-12 container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
              <Activity className="h-10 w-10 text-blue-600" />
              Health Cost Simulator
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Simulate real-world hospital expenses and see how different insurance plans protect your family's finances.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Family Profile</CardTitle>
                  <CardDescription>Configure your family members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {members.map((member, index) => (
                    <div key={member.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="bg-white">Member {index + 1}</Badge>
                        {members.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Relationship</Label>
                          <Select 
                            value={member.type} 
                            onValueChange={(val) => updateMember(member.id, "type", val)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="self">Self</SelectItem>
                              <SelectItem value="mother">Mother</SelectItem>
                              <SelectItem value="father">Father</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Age</Label>
                          <Input 
                            type="number" 
                            className="h-9" 
                            value={member.age} 
                            onChange={(e) => updateMember(member.id, "age", parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button 
                    variant="outline" 
                    className="w-full border-dashed" 
                    onClick={addMember}
                  >
                    <UserPlus className="mr-2 h-4 w-4" /> Add Family Member
                  </Button>

                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Category</Label>
                      <Select 
                        value={selectedCategory} 
                        onValueChange={(val) => {
                          setSelectedCategory(val);
                          setSelectedScenarioId("all");
                        }}
                      >
                        <SelectTrigger className="h-10 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Scenario</Label>
                      <Select 
                        value={selectedScenarioId} 
                        onValueChange={setSelectedScenarioId}
                      >
                        <SelectTrigger className="h-10 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {selectedCategory === "All Categories" ? "Top 5 Scenarios" : `All ${selectedCategory}`}
                          </SelectItem>
                          {SCENARIOS.filter(s => selectedCategory === "All Categories" || s.category === selectedCategory).map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200" 
                    onClick={runSimulation}
                    disabled={isSimulating}
                  >
                    {isSimulating ? (
                      <><RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> Simulating...</>
                    ) : (
                      <><Activity className="mr-2 h-4 w-4" /> Run Simulation</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-blue-600 text-white">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Stethoscope className="h-6 w-6 shrink-0" />
                    <div>
                      <p className="font-semibold">AI Insights</p>
                      <p className="text-sm text-blue-100">
                        Based on your profile, we will simulate the top 3 most common hospitalization scenarios in your region.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-8">
              {!results && !isSimulating && (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <Hospital className="h-16 w-16 text-slate-300 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900">Ready to simulate?</h3>
                  <p className="text-slate-500 max-w-sm">
                    Configure your family profile and click "Run Simulation" to see the cost breakdown.
                  </p>
                </div>
              )}

              {isSimulating && (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse border-0 shadow-md">
                      <div className="h-48 bg-slate-100 rounded-xl" />
                    </Card>
                  ))}
                </div>
              )}

              <AnimatePresence>
                {results && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {results.map((res) => (
                      <Card key={res.scenario.id} className="border-0 shadow-xl overflow-hidden">
                        <div className="bg-slate-900 text-white p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <Badge className="bg-blue-600 mb-2">Simulation Scenario</Badge>
                              <h3 className="text-2xl font-bold">{res.scenario.name}</h3>
                              <p className="text-slate-400 text-sm">{res.scenario.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-slate-400 text-sm">Estimated Total Cost</p>
                              <p className="text-3xl font-bold text-blue-400">₹{res.scenario.estimatedCost.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <CardContent className="p-6">
                          <div className="grid md:grid-cols-3 gap-6">
                            {res.plans.map((planRes) => (
                              <div key={planRes.planId} className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-bold text-slate-900">{planRes.planName}</h4>
                                  <Badge className={
                                    planRes.claimStatus === 'Approved' ? 'bg-green-100 text-green-700' : 
                                    planRes.claimStatus === 'Partially Approved' ? 'bg-amber-100 text-amber-700' : 
                                    'bg-red-100 text-red-700'
                                  }>
                                    {planRes.claimStatus}
                                  </Badge>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-slate-500">Plan Coverage</span>
                                      <span className="font-semibold text-green-600">₹{planRes.coveredAmount.toLocaleString()}</span>
                                    </div>
                                    <Progress value={(planRes.coveredAmount / res.scenario.estimatedCost) * 100} className="h-2 bg-slate-200" />
                                  </div>

                                  <div className="p-3 bg-white rounded-lg border border-slate-100 space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" /> Out of Pocket
                                      </span>
                                      <span className="text-sm font-bold text-red-600">₹{planRes.outOfPocket.toLocaleString()}</span>
                                    </div>
                                  </div>

                                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                    {planRes.explanation}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-blue-600" />
                              Why the cost varies?
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="flex gap-3 items-start p-3 bg-amber-50 rounded-xl">
                                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 leading-relaxed">
                                  <strong>Room Rent Limits:</strong> Basic plans often cap room rent at 1% of sum insured. Choosing a luxury room results in significant out-of-pocket costs.
                                </p>
                              </div>
                              <div className="flex gap-3 items-start p-3 bg-blue-50 rounded-xl">
                                <DollarSign className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800 leading-relaxed">
                                  <strong>Co-payment:</strong> Many plans require you to pay 10-20% of the claim amount. Our Platinum Elite plan waives this for maximum peace of mind.
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
