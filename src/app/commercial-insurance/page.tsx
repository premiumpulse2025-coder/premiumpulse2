import Link from "next/link";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { CommercialForm } from "@/components/commercial-form";
import { Building2, ShieldCheck, TrendingUp } from "lucide-react";

export default function CommercialInsurancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 via-white to-violet-50/30">
      <Header />
      
      <main className="pt-[72px]">
        <section className="py-12 bg-violet-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-4 backdrop-blur-sm">
                <Building2 className="h-3 w-3" />
                Enterprise Solutions
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Commercial Insurance</h1>
              <p className="text-violet-100 text-lg mb-8">
                Protect your business assets, employees, and liability with AI-driven risk assessment and competitive premiums.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/commercial-insurance/policy-evolution" className="inline-flex items-center gap-2 bg-white text-violet-600 px-6 py-3 rounded-xl font-bold hover:bg-violet-50 transition-all shadow-lg shadow-black/10">
                  <TrendingUp className="h-5 w-5" />
                  Policy Auto-Evolution
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 -mt-8 relative z-10 pb-20">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <CommercialForm />
            </div>
            
            <div className="hidden lg:block space-y-6 py-12">
              <div className="p-6 rounded-2xl bg-white shadow-xl shadow-violet-100 border border-violet-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-violet-600" />
                  Key Benefits
                </h3>
                <ul className="space-y-4">
                  {[
                    "AI-Powered Risk Analysis",
                    "Custom Coverage Limits",
                    "Digital Doc Validation",
                    "Instant Policy Issuance",
                    "Dedicated Claim Support"
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl shadow-violet-200">
                <TrendingUp className="h-8 w-8 mb-4 opacity-80" />
                <h3 className="font-bold mb-2">Lower Your Risk</h3>
                <p className="text-xs text-violet-100 leading-relaxed mb-4">
                  Businesses with active safety certifications and cyber security protocols receive up to 15% lower premium rates through our AI assessment.
                </p>
                <div className="text-xs font-medium bg-white/20 py-2 px-3 rounded-lg inline-block">
                  Tip: Upload ISO 27001 docs
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
