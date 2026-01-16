
"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Activity, 
  Stethoscope, 
  Hospital, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCcw,
  Search,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Info,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SCENARIOS, 
  HOSPITAL_TYPES, 
  CITY_TIERS, 
  PLANS, 
  estimateBill 
} from "@/lib/simulation-data";

export default function BillSimulatorPage() {
  const [patient, setPatient] = useState({
    age: 35,
    gender: "male" as const,
    cityTier: "tier2",
    existingConditions: [] as string[]
  });

  const [simulation, setSimulation] = useState({
    scenarioId: SCENARIOS[0].id,
    hospitalType: "private",
    icuRequired: false,
    stayLength: SCENARIOS[0].hospitalizationDays
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredScenarios = useMemo(() => {
    return SCENARIOS.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const categories = useMemo(() => {
    return Array.from(new Set(SCENARIOS.map(s => s.category)));
  }, []);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    
    // ML-based cost estimation simulation delay
    setTimeout(() => {
      const billData = estimateBill(
        simulation.scenarioId,
        simulation.hospitalType,
        patient.cityTier,
        simulation.icuRequired,
        simulation.stayLength
      );

      if (!billData) {
        setIsSimulating(false);
        return;
      }

      const planComparisons = PLANS.map(plan => {
        let covered = billData.total;
        let outOfPocket = 0;
        let reasons: string[] = [];

        // 1. Deductible
        if (plan.deductible > 0) {
          outOfPocket += plan.deductible;
          covered -= plan.deductible;
          reasons.push(`Initial deductible of ₹${plan.deductible.toLocaleString()} paid by you.`);
        }

        // 2. Room Rent Limit
        const roomDays = simulation.stayLength;
        const estimatedRoomRent = billData.breakdown.hospitalCharges / roomDays;
        if (estimatedRoomRent > plan.roomRentLimit) {
          const excess = (estimatedRoomRent - plan.roomRentLimit) * roomDays;
          outOfPocket += excess;
          covered -= excess;
          reasons.push(`Room rent (₹${Math.round(estimatedRoomRent).toLocaleString()}/day) exceeded plan limit (₹${plan.roomRentLimit.toLocaleString()}/day).`);
        }

        // 3. Sub-limits (Simplified)
        const scenario = billData.originalScenario;
        if (scenario.category === "Maternity & Child Care" && plan.subLimits.maternity) {
          if (billData.total > plan.subLimits.maternity) {
            const excess = billData.total - plan.subLimits.maternity;
            // This is a rough estimation as it's already deducted or will be
          }
        }

        // 4. Co-pay
        if (plan.coPay > 0) {
          const coPayAmount = covered * (plan.coPay / 100);
          outOfPocket += coPayAmount;
          covered -= coPayAmount;
          reasons.push(`${plan.coPay}% co-payment applied on the admissible claim amount.`);
        }

        return {
          ...plan,
          covered: Math.max(0, Math.round(covered)),
          outOfPocket: Math.round(outOfPocket),
          reasons
        };
      });

      setResults({
        bill: billData,
        comparisons: planComparisons
      });
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <header className="mb-12 text-center">
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1">
                AI-Powered Insurance Engine
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                Hospital Bill <span className="text-emerald-600">Simulator</span>
              </h1>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Predict realistic medical expenses and see exactly how much your insurance will cover before you even step into a hospital.
              </p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Configuration Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="border-none shadow-xl shadow-slate-200/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-emerald-500" />
                      Simulation Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Disease Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700">Medical Condition</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          placeholder="Search condition..." 
                          className="pl-9 bg-slate-50 border-slate-200"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select 
                        value={simulation.scenarioId} 
                        onValueChange={(val) => {
                          const s = SCENARIOS.find(x => x.id === val);
                          setSimulation(prev => ({ 
                            ...prev, 
                            scenarioId: val,
                            stayLength: s?.hospitalizationDays || 1
                          }));
                        }}
                      >
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {categories.map(cat => (
                            <div key={cat}>
                              <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase bg-slate-50">
                                {cat}
                              </div>
                              {SCENARIOS.filter(s => s.category === cat).map(s => (
                                <SelectItem key={s.id} value={s.id}>
                                  {s.name}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Hospital Config */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-slate-500">Hospital Type</Label>
                        <Select 
                          value={simulation.hospitalType} 
                          onValueChange={(val) => setSimulation(prev => ({ ...prev, hospitalType: val }))}
                        >
                          <SelectTrigger className="h-9 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {HOSPITAL_TYPES.map(t => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-slate-500">City Tier</Label>
                        <Select 
                          value={patient.cityTier} 
                          onValueChange={(val) => setPatient(prev => ({ ...prev, cityTier: val }))}
                        >
                          <SelectTrigger className="h-9 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CITY_TIERS.map(t => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium">ICU Requirement</Label>
                          <p className="text-[11px] text-slate-500">Includes intensive monitoring</p>
                        </div>
                        <Checkbox 
                          checked={simulation.icuRequired}
                          onCheckedChange={(checked) => setSimulation(prev => ({ ...prev, icuRequired: !!checked }))}
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label className="text-sm font-medium">Length of Stay</Label>
                          <span className="text-sm font-bold text-emerald-600">{simulation.stayLength} Days</span>
                        </div>
                        <Input 
                          type="range" 
                          min={1} 
                          max={30} 
                          value={simulation.stayLength}
                          onChange={(e) => setSimulation(prev => ({ ...prev, stayLength: parseInt(e.target.value) }))}
                          className="h-2 accent-emerald-500"
                        />
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl shadow-lg shadow-slate-200"
                      onClick={handleRunSimulation}
                      disabled={isSimulating}
                    >
                      {isSimulating ? (
                        <><RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> Calculating...</>
                      ) : (
                        <><Activity className="mr-2 h-5 w-5" /> Simulate Bill Impact</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <div className="p-5 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-200">
                  <TrendingUp className="h-8 w-8 mb-4 opacity-80" />
                  <h3 className="font-bold text-lg mb-2">Cost Optimization</h3>
                  <p className="text-emerald-50 text-sm leading-relaxed">
                    Switching from a Premium to a Private Standard hospital in a Tier 2 city can reduce your total bill by up to 45%.
                  </p>
                </div>
              </div>

              {/* Simulation Results Area */}
              <div className="lg:col-span-8">
                {!results && !isSimulating ? (
                  <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                      <Hospital className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to see the impact?</h3>
                    <p className="text-slate-500 max-w-sm mb-8">
                      Select a medical condition and hospital type to generate a realistic bill simulation.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {["Heart Attack", "Maternity", "Cancer Care", "Surgery"].map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer" onClick={() => setSearchTerm(tag)}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : isSimulating ? (
                  <div className="space-y-6">
                    <Card className="border-none shadow-md animate-pulse">
                      <div className="h-64 bg-slate-100 rounded-3xl" />
                    </Card>
                    <div className="grid md:grid-cols-3 gap-6">
                      {[1, 2, 3].map(i => (
                        <Card key={i} className="border-none shadow-md animate-pulse">
                          <div className="h-40 bg-slate-50 rounded-2xl" />
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Bill Overview */}
                    <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden rounded-[32px]">
                      <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-emerald-500/20 text-emerald-300 border-none">Realistic Simulation</Badge>
                              <span className="text-xs text-slate-400">| {results.bill.originalScenario.category}</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight mb-1">{results.bill.originalScenario.name}</h2>
                            <p className="text-slate-400 text-sm max-w-md">{results.bill.originalScenario.description}</p>
                          </div>
                          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                            <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1">Total Estimated Bill</p>
                            <p className="text-4xl font-bold text-emerald-400">₹{results.bill.total.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {[
                            { label: "Hosp. Charges", value: results.bill.breakdown.hospitalCharges },
                            { label: "Doctor Fees", value: results.bill.breakdown.doctorFees },
                            { label: "Medicines", value: results.bill.breakdown.medicineCosts },
                            { label: "Diagnostics", value: results.bill.breakdown.diagnosticTests },
                            { label: "Others", value: results.bill.breakdown.otherCharges }
                          ].map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                              <p className="text-sm font-semibold text-slate-700">₹{item.value.toLocaleString()}</p>
                              <Progress value={(item.value / results.bill.total) * 100} className="h-1 bg-slate-100" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Plan Comparisons */}
                    <div className="grid md:grid-cols-3 gap-6">
                      {results.comparisons.map((plan: any) => (
                        <Card key={plan.id} className="border-none shadow-xl hover:shadow-2xl transition-all rounded-[32px] group">
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-center mb-1">
                              <CardTitle className="text-base font-bold">{plan.name}</CardTitle>
                              <CreditCard className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Badge variant="outline" className="text-[10px] border-slate-200">SI: ₹{(plan.sumInsured/100000).toFixed(0)}L</Badge>
                              {plan.coPay > 0 && <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-100">{plan.coPay}% Co-pay</Badge>}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-slate-500">You Pay</span>
                                <span className="text-lg font-bold text-red-600">₹{plan.outOfPocket.toLocaleString()}</span>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-bold">
                                  <span className="text-emerald-600">Covered: ₹{plan.covered.toLocaleString()}</span>
                                  <span className="text-slate-400">{Math.round((plan.covered/results.bill.total)*100)}%</span>
                                </div>
                                <Progress value={(plan.covered / results.bill.total) * 100} className="h-2 bg-slate-200" />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Info className="h-3 w-3" /> Cost Breakdown
                              </p>
                              <div className="space-y-1.5">
                                {plan.reasons.length > 0 ? (
                                  plan.reasons.map((r: string, i: number) => (
                                    <p key={i} className="text-[11px] text-slate-600 leading-snug flex gap-2">
                                      <span className="text-amber-500 shrink-0">•</span> {r}
                                    </p>
                                  ))
                                ) : (
                                  <p className="text-[11px] text-emerald-600 font-medium flex gap-2">
                                    <ShieldCheck className="h-3 w-3 shrink-0" /> Full coverage for this scenario.
                                  </p>
                                )}
                              </div>
                            </div>

                            <Button className="w-full bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 h-10 rounded-xl transition-all border-none text-xs font-bold">
                              Select This Plan <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                      {/* Educational Insights */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-lg">
                          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Why out-of-pocket costs differ?
                          </h4>
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-700 leading-relaxed border border-slate-100 italic">
                              "For this treatment, {results.comparisons[0].name} results in an out-of-pocket expense of ₹{results.comparisons[0].outOfPocket.toLocaleString()}, while {results.comparisons[1].name} results in ₹{results.comparisons[1].outOfPocket.toLocaleString()} due to stricter sub-limits and co-payment rules."
                            </div>
                            <div className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-amber-600">01</span>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                <strong>Sub-limits:</strong> Many plans cap specific treatments (like maternity or cataract) even if your total sum insured is high.
                              </p>
                            </div>
                            <div className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-emerald-600">02</span>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                <strong>Room Selection:</strong> Upgrading to a suite when your plan only covers a twin-sharing room leads to "proportionate deduction" across your whole bill.
                              </p>
                            </div>
                          </div>
                        </div>

                      <div className="bg-slate-900 p-6 rounded-[32px] text-white shadow-xl">
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-emerald-400" />
                          The "Gold Care" Advantage
                        </h4>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                          In this specific scenario, Gold Care offers the best balance of premium cost vs. coverage. It avoids the room rent trap which usually accounts for 30% of out-of-pocket expenses.
                        </p>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Savings Potential</p>
                            <p className="text-xl font-bold text-emerald-400">₹38,000 Saved</p>
                          </div>
                          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">
                            Compare Plans
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
