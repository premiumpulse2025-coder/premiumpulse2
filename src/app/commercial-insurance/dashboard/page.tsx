"use client";

import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { 
  Building2, 
  ShieldCheck, 
  RefreshCw, 
  FileText, 
  Download, 
  PlusCircle, 
  History, 
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  PieChart,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function CommercialDashboard() {
  const activePolicy = {
    id: "POL-7729-XC",
    type: "Enterprise Core",
    status: "Active",
    premium: 12500,
    renewalDate: "Oct 12, 2025",
    coverage: ["Property", "Liability", "Cyber", "Employee Health"]
  };

  const recentClaims = [
    { id: "CLM-001", type: "Property Damage", amount: 4500, status: "In Review", date: "Feb 15, 2024" },
    { id: "CLM-002", type: "Cyber Incident", amount: 1200, status: "Settled", date: "Jan 10, 2024" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="pt-[72px] pb-20">
        <section className="bg-violet-600 pt-12 pb-24 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 text-violet-200 mb-2">
                  <Building2 className="h-4 w-4" />
                  Commercial Dashboard
                </div>
                <h1 className="text-3xl font-bold">Acme Solutions Inc.</h1>
                <p className="text-violet-100 mt-1">Policy Number: {activePolicy.id}</p>
              </div>
              <div className="flex gap-3">
                <Button className="bg-white text-violet-600 hover:bg-violet-50">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Initiate Claim
                </Button>
                <Button variant="outline" className="border-violet-400 text-white hover:bg-violet-500">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Renew Policy
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 -mt-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Stats and Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-500">Status</div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">Fully Protected</div>
                    <div className="text-xs text-gray-400 mt-1">4 Active Coverages</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-violet-100 rounded-lg">
                        <Clock className="h-5 w-5 text-violet-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-500">Renewal</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">234 Days</div>
                    <div className="text-xs text-gray-400 mt-1">Remaining in term</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <PieChart className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-500">Risk Score</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">1.2 / 3.0</div>
                    <div className="text-xs text-gray-400 mt-1">Low Exposure</div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="policy" className="w-full">
                <TabsList className="bg-white p-1 rounded-xl shadow-sm border mb-6">
                  <TabsTrigger value="policy" className="rounded-lg">Policy Details</TabsTrigger>
                  <TabsTrigger value="claims" className="rounded-lg">Claims Tracking</TabsTrigger>
                  <TabsTrigger value="documents" className="rounded-lg">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="policy" className="space-y-6">
                  <Card className="border-0 shadow-xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b">
                      <CardTitle>Active Coverages</CardTitle>
                      <CardDescription>Comprehensive protection breakdown</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {activePolicy.coverage.map((item, i) => (
                          <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                                {item === 'Cyber' ? <Clock className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{item} Insurance</h4>
                                <p className="text-sm text-gray-500">Limit: $1,000,000 • Deductible: $5,000</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-violet-600">
                              Modify
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="claims" className="space-y-6">
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle>Recent Claims</CardTitle>
                      <CardDescription>History and real-time tracking</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {recentClaims.map((claim, i) => (
                          <div key={i} className="relative pl-8 pb-8 last:pb-0">
                            {i < recentClaims.length - 1 && (
                              <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-100" />
                            )}
                            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center ${
                              claim.status === 'Settled' ? 'border-emerald-500' : 'border-amber-500'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                claim.status === 'Settled' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`} />
                            </div>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-xs text-gray-400 font-medium uppercase mb-1">{claim.date}</div>
                                <h4 className="font-bold text-gray-900">{claim.type}</h4>
                                <p className="text-sm text-gray-500 mt-1">Claim ID: {claim.id}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900">${claim.amount.toLocaleString()}</div>
                                <div className={`text-xs font-medium px-2 py-1 rounded-full mt-1 inline-block ${
                                  claim.status === 'Settled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {claim.status}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: "Policy Schedule", size: "2.4 MB", date: "Jan 12, 2024" },
                      { name: "Risk Assessment Report", size: "1.1 MB", date: "Jan 12, 2024" },
                      { name: "Payment Receipt", size: "450 KB", date: "Jan 12, 2024" },
                      { name: "Endorsement Letter", size: "890 KB", date: "Feb 02, 2024" },
                    ].map((doc, i) => (
                      <Card key={i} className="border-0 shadow-md group hover:shadow-lg transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-violet-600 transition-colors">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">{doc.name}</div>
                              <div className="text-[10px] text-gray-500">{doc.date} • {doc.size}</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-violet-600">
                            <Download className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column: Insights and Support */}
            <div className="space-y-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Risk Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white/10 rounded-xl">
                    <TrendingUp className="h-5 w-5 mt-0.5 text-emerald-300" />
                    <div>
                      <div className="font-medium">Industry Benchmark</div>
                      <p className="text-xs text-violet-100 mt-1">Your risk score is 20% lower than similar IT startups.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/10 rounded-xl">
                    <Users className="h-5 w-5 mt-0.5 text-amber-300" />
                    <div>
                      <div className="font-medium">Employee Wellness</div>
                      <p className="text-xs text-violet-100 mt-1">Adding mental health cover could improve employee retention.</p>
                    </div>
                  </div>
                  <Button className="w-full bg-white text-violet-600 hover:bg-violet-50 font-bold mt-2">
                    View Full Analysis
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Need Assistance?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs font-bold">
                        JD
                      </div>
                      <div>
                        <div className="text-sm font-bold">James Dorsey</div>
                        <div className="text-[10px] text-gray-500 uppercase font-medium tracking-wider">Relationship Manager</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full text-xs h-8 border-violet-100 text-violet-600 hover:bg-violet-50">
                      Chat Now
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Avg. response: 2m
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      Online
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm">Policy Notice</h4>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                      Please update your asset valuation report by next month to maintain your property coverage limits.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-xs font-bold text-amber-900 mt-2 hover:no-underline">
                      Upload Now →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
