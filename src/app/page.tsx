"use client";

import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { 
  Users, 
  User, 
  Building2, 
  Shield, 
  Brain, 
  ChartBar, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Heart,
  TrendingUp,
  Activity,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

const insuranceCategories = [
  {
    id: "family",
    title: "Family Insurance",
    description: "Comprehensive health coverage for your entire family with AI-powered premium prediction",
    icon: Users,
    href: "/family-insurance",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50",
    features: ["Coverage for parents & children", "Family floater plans", "Maternity benefits"],
    available: true
  },
  {
    id: "individual",
    title: "Individual Insurance",
    description: "Personalized health insurance plans tailored to your unique health profile",
    icon: User,
    href: "/individual-insurance",
    color: "from-fuchsia-500 to-purple-500",
    bgColor: "bg-fuchsia-50",
    features: ["Personal health cover", "Critical illness add-on", "No-claim bonus"],
    available: true
  },
  {
    id: "commercial",
    title: "Commercial Insurance",
    description: "Business and group insurance solutions for startups, MSMEs, and enterprises",
    icon: Building2,
    href: "/commercial-insurance",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    features: ["Employee group health", "Liability & Property", "Cyber insurance"],
    available: true
  }
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Predictions",
    description: "Advanced ML models including XGBoost and Linear Regression for accurate premium estimates"
  },
  {
    icon: Shield,
    title: "Transparent Pricing",
    description: "Clear explanations for every factor that influences your premium calculation"
  },
  {
    icon: ChartBar,
    title: "Risk Assessment",
    description: "Comprehensive health risk analysis based on demographics and medical history"
  },
  {
    icon: Heart,
    title: "Personalized Plans",
    description: "Tailored insurance plan suggestions based on your family's unique needs"
  }
];

const steps = [
  { step: 1, title: "Select Members", description: "Choose family members to insure" },
  { step: 2, title: "Enter Details", description: "Provide personal & health information" },
  { step: 3, title: "Get Prediction", description: "Receive AI-powered premium estimate" },
  { step: 4, title: "Choose Plan", description: "Select from recommended plans" }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        <section className="relative overflow-hidden py-32 lg:py-48">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-violet-100" />
          <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/40 to-fuchsia-400/30 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-10 left-10 w-[700px] h-[700px] bg-gradient-to-tr from-violet-400/30 to-indigo-400/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-[200px]" />
          
          <div className="container mx-auto px-6 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative inline-block"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl" />
                <h1 className="relative text-6xl lg:text-8xl font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight drop-shadow-sm">
                  Insurance simplified
                  <span className="block bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-lg">
                    with AI & ML
                  </span>
                </h1>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-slate-600 font-semibold mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Coverage that understands you — intelligent premiums, full clarity, and protection built around real lives.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <Link href="/family-insurance">
                  <Button size="lg" className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 text-white h-16 px-10 text-xl font-bold rounded-2xl transition-all hover:scale-105 shadow-[0_20px_50px_-12px_rgba(147,51,234,0.5)] hover:shadow-[0_25px_60px_-12px_rgba(147,51,234,0.6)]">
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    Start Your Quote
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="bg-white/70 backdrop-blur-md border-2 border-purple-200/50 text-slate-700 hover:bg-white hover:border-purple-300 h-16 px-10 text-xl font-bold rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_50px_-15px_rgba(147,51,234,0.3)] transition-all">
                  View Case Studies
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-24"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Our Coverage Ecosystem
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                Discover specialized insurance solutions designed for every stage of life and business.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
              {insuranceCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`group relative h-full flex flex-col overflow-hidden border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 rounded-3xl ${!category.available && 'opacity-75'}`}>
                    <CardHeader className={`${category.bgColor} pb-10 pt-10 px-8 transition-colors group-hover:bg-opacity-80`}>
                      <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 shadow-xl transform transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                        <category.icon className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-slate-900 mb-3">{category.title}</CardTitle>
                      <CardDescription className="text-slate-600 text-lg leading-relaxed">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-10 px-8 pb-10 flex-1 flex flex-col">
                      <ul className="space-y-4 mb-10">
                        {category.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                            <div className={`rounded-full p-1 ${category.available ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link href={category.href} className="mt-auto">
                        <Button 
                          className={`w-full h-14 text-lg font-bold rounded-xl transition-all ${category.available ? `bg-slate-900 text-white hover:bg-purple-600` : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                          disabled={!category.available}
                        >
                          {category.available ? 'Explore Plan' : 'Coming Soon'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

          <section className="py-32 bg-white">
            <div className="container mx-auto px-6">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1 mb-6">
                      New Feature
                    </Badge>
                    <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight tracking-tight">
                      Simulate your <br />
                      <span className="text-emerald-600">Hospital Bill</span> impact
                    </h2>
                    <p className="text-slate-600 text-xl leading-relaxed mb-10 font-medium">
                      Don't let hospital bills surprise you. Use our AI-powered engine to simulate realistic costs across 50+ medical conditions and see exactly how your insurance plan performs.
                    </p>
                    
                    <div className="space-y-6 mb-12">
                      {[
                        "Predict out-of-pocket expenses realistically",
                        "Compare coverage across multiple plans",
                        "Understand sub-limits and co-payment rules",
                        "ML-based cost estimation for 50+ conditions"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 text-slate-700 font-bold">
                          <div className="bg-emerald-100 text-emerald-600 rounded-full p-1">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          {item}
                        </div>
                      ))}
                    </div>

                    <Link href="/bill-simulator">
                      <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl shadow-emerald-200 h-16 px-10 text-xl font-bold rounded-2xl transition-all hover:scale-105">
                        Try Simulator
                        <Activity className="ml-3 h-6 w-6" />
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-emerald-200/20 rounded-[3rem] blur-3xl -z-10" />
                    <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-slate-900 text-white">
                      <div className="p-10">
                        <div className="flex justify-between items-center mb-10">
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                          </div>
                          <Badge variant="outline" className="border-white/20 text-white">Live Simulation</Badge>
                        </div>
                        
                        <div className="space-y-8">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                              <span>Heart Attack (CABG)</span>
                              <span>₹6,50,000</span>
                            </div>
                            <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className="h-full bg-emerald-500" 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Insurance Pays</p>
                              <p className="text-2xl font-black text-emerald-400">₹6,12,000</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">You Pay</p>
                              <p className="text-2xl font-black text-rose-400">₹38,000</p>
                            </div>
                          </div>

                          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                              <ShieldCheck className="h-5 w-5" />
                              <span className="font-bold">Optimization Alert</span>
                            </div>
                            <p className="text-sm text-slate-300 font-medium">
                              Switching to "Gold Care" plan reduces out-of-pocket by ₹25,000 for this procedure.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-32 bg-slate-50/50">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-24"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 bg-clip-text text-transparent">
                Why Premium Pulse Insurance?
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                We combine human empathy with machine precision to deliver the best coverage.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow border border-slate-100"
                >
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-8">
                    <feature.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-24"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Simple 4-Step Process
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Get your custom-built insurance profile in minutes.
              </p>
            </motion.div>

            <div className="max-w-6xl mx-auto relative">
              <div className="grid md:grid-cols-4 gap-12">
                {steps.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative z-10"
                  >
                    <div className="text-center group">
                      <div className="w-20 h-20 rounded-[2rem] bg-white border-2 border-slate-100 flex items-center justify-center mx-auto mb-8 text-purple-600 font-black text-2xl shadow-sm transition-all group-hover:border-purple-500 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-slate-100 -z-0" />
            </div>
          </div>
        </section>

        <section className="py-32">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto bg-gradient-to-br from-purple-600 to-violet-700 rounded-[3rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full -ml-48 -mb-48 blur-3xl" />
              
              <TrendingUp className="h-16 w-16 mx-auto mb-8 text-purple-200" />
              <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
                Ready to Secure <br />Your Future?
              </h2>
              <p className="text-purple-100 mb-12 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Join thousands of families and businesses who trust Premium Pulse for their insurance needs.
              </p>
              <Link href="/family-insurance">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 shadow-2xl h-16 px-12 text-xl font-bold rounded-2xl transition-transform hover:scale-105">
                  Get Started Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
