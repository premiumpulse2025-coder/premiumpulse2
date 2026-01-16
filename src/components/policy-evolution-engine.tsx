"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Briefcase, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Plus,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

type ChangeType = "revenue" | "workforce" | "locations" | "assets" | "claims";

interface BusinessChange {
  type: ChangeType;
  value: string;
  description: string;
  timestamp: string;
}

interface Recommendation {
  id: string;
  title: string;
  change: string;
  recommendation: string;
  reasoning: string;
  impact: "Property" | "Liability" | "Health" | "Operational";
  priority: "High" | "Medium" | "Low";
  status: "Suggested" | "Applied" | "Ignored";
}

export function PolicyEvolutionEngine() {
  const [changes, setChanges] = useState<BusinessChange[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form state
  const [selectedType, setSelectedType] = useState<ChangeType>("revenue");
  const [inputValue, setInputValue] = useState("");
  const [description, setDescription] = useState("");

  const handleAddChange = () => {
    if (!inputValue) return;

    const newChange: BusinessChange = {
      type: selectedType,
      value: inputValue,
      description: description || `Reported ${selectedType} change`,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChanges([newChange, ...changes]);
    setInputValue("");
    setDescription("");
    analyzeChanges([...changes, newChange]);
  };

  const analyzeChanges = async (allChanges: BusinessChange[]) => {
    setIsAnalyzing(true);
    // Simulate ML processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const latest = allChanges[0];
    let newRec: Recommendation | null = null;

    if (latest.type === "workforce") {
      const count = parseInt(latest.value);
      if (count > 20) {
        newRec = {
          id: Math.random().toString(36).substr(2, 9),
          title: "Workforce Expansion detected",
          change: `Your workforce increased by ${latest.value}%, increasing employee health risk.`,
          recommendation: "We recommend increasing group health coverage by ₹50L and adding employee accident cover.",
          reasoning: "This recommendation is based on similar businesses that experienced higher claim frequency after workforce expansion. Larger teams statistically correlate with increased workplace liability.",
          impact: "Health",
          priority: "High",
          status: "Suggested"
        };
      }
    } else if (latest.type === "revenue") {
      newRec = {
        id: Math.random().toString(36).substr(2, 9),
        title: "Revenue Growth Update",
        change: `Annual revenue increased by ${latest.value}%.`,
        recommendation: "Increase Professional Indemnity limits and Business Interruption coverage.",
        reasoning: "Higher revenue targets increase the financial impact of operational disruptions. AI analysis shows your current limits cover only 60% of projected daily revenue loss.",
        impact: "Operational",
        priority: "Medium",
        status: "Suggested"
      };
    } else if (latest.type === "locations") {
      newRec = {
        id: Math.random().toString(36).substr(2, 9),
        title: "New Location Operational",
        change: `New facility added at ${latest.value}.`,
        recommendation: "Add Public Liability extension for the new site and update Fire & Allied Perils schedule.",
        reasoning: "New physical assets require immediate property protection. Geographical risk analysis indicates moderate seismic activity in the new location's zone.",
        impact: "Property",
        priority: "High",
        status: "Suggested"
      };
    } else if (latest.type === "assets") {
      newRec = {
        id: Math.random().toString(36).substr(2, 9),
        title: "Asset Value Increase",
        change: `Equipment/Asset value grew by ${latest.value}.`,
        recommendation: "Update Machinery Breakdown and Electronic Equipment Insurance riders.",
        reasoning: "Current policy caps asset value at previous levels. Under-insurance risk detected: 25% gap between market value and sum insured.",
        impact: "Property",
        priority: "Medium",
        status: "Suggested"
      };
    }

    if (newRec) {
      setRecommendations([newRec, ...recommendations]);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-violet-100 text-violet-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Policy Auto-Evolution</h1>
            <p className="text-slate-500 font-medium">AI-driven real-time coverage optimization</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-6 border-violet-100 shadow-xl shadow-violet-50/50 rounded-3xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5 text-violet-600" />
              Report Business Change
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Event Type</Label>
                <Select value={selectedType} onValueChange={(v) => setSelectedType(v as ChangeType)}>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="Select change type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue Growth</SelectItem>
                    <SelectItem value="workforce">Workforce Expansion</SelectItem>
                    <SelectItem value="locations">New Location</SelectItem>
                    <SelectItem value="assets">Asset Value Change</SelectItem>
                    <SelectItem value="claims">Claim Frequency Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Value / Change Details</Label>
                <Input 
                  placeholder={selectedType === "workforce" ? "e.g. 35" : "e.g. 20% or Address"} 
                  className="rounded-xl border-slate-200"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Notes (Optional)</Label>
                <Input 
                  placeholder="Additional context..." 
                  className="rounded-xl border-slate-200"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleAddChange}
                disabled={isAnalyzing || !inputValue}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-violet-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isAnalyzing ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <>Process Change <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Recent Events</h4>
            <div className="space-y-3">
              <AnimatePresence>
                {changes.length === 0 && (
                  <p className="text-xs text-slate-400 italic px-2">No changes reported yet.</p>
                )}
                {changes.map((change, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
                        {change.type === "workforce" ? <Users className="h-4 w-4" /> : 
                         change.type === "revenue" ? <TrendingUp className="h-4 w-4" /> :
                         <Briefcase className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 capitalize">{change.type}</p>
                        <p className="text-xs text-slate-500">{change.value} • {change.timestamp}</p>
                      </div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500" />
              Evolution Recommendations
            </h3>
            {isAnalyzing && (
              <div className="flex items-center gap-2 text-violet-600 text-sm font-bold">
                <RefreshCw className="h-4 w-4 animate-spin" />
                ML Engine Analyzing...
              </div>
            )}
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {recommendations.length === 0 && !isAnalyzing && (
                <div className="py-20 text-center space-y-4 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
                  <div className="bg-white w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                    <Info className="h-8 w-8 text-slate-300" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <p className="text-slate-900 font-bold">Waiting for Business Changes</p>
                    <p className="text-slate-500 text-sm">Report a business event to trigger the AI risk re-evaluation engine.</p>
                  </div>
                </div>
              )}
              
              {recommendations.map((rec) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="overflow-hidden border-violet-100 shadow-xl shadow-violet-100/20 rounded-[32px]">
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                          {rec.impact} Impact
                        </span>
                        <div className="flex items-center gap-2 bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <AlertTriangle className="h-3 w-3" />
                          {rec.priority} Priority
                        </div>
                      </div>
                      <h4 className="text-xl font-black mb-2">{rec.title}</h4>
                      <p className="text-violet-100 font-medium text-sm leading-relaxed">
                        “{rec.change}”
                      </p>
                    </div>
                    
                    <div className="p-8 bg-white space-y-6">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recommendation</h5>
                          <p className="text-slate-900 font-bold leading-relaxed">
                            {rec.recommendation}
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">AI Reasoning</h5>
                          <p className="text-slate-600 text-sm leading-relaxed font-medium">
                            {rec.reasoning}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="text-xs font-bold text-slate-500">ML Model Confidence: 94%</span>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                            Dismiss
                          </Button>
                          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold px-6">
                            Update Policy <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
