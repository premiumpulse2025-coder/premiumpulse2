"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X, Calculator, TrendingUp } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-purple-100 shadow-sm">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-20">
            <div className="flex flex-col">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-sans font-black bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight uppercase">
                  premiumpulse
                </span>
              </Link>
              <span className="text-[10px] text-slate-500/80 font-extrabold tracking-[0.2em] uppercase">Security for Every Tomorrow.</span>
            </div>

            <nav className="hidden xl:flex items-center gap-10">
              <Link href="/bill-simulator" className="group relative flex items-center gap-2 bg-gradient-to-br from-rose-500 to-rose-600 text-white px-8 py-3 rounded-xl text-base font-black hover:from-rose-600 hover:to-rose-700 transition-all tracking-tight hover:-translate-y-1 active:translate-y-0.5 shadow-[0_4px_0_0_#9f1239] hover:shadow-[0_6px_20px_-6px_rgba(225,29,72,0.6)] border border-rose-400/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                <Calculator className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span>Bill Simulator</span>
              </Link>
              <Link href="/family-insurance" className="text-base font-extrabold text-slate-900 hover:text-indigo-600 transition-colors tracking-tight px-4 py-2 hover:bg-slate-50 rounded-lg">
                Family
              </Link>
              <Link href="/individual-insurance" className="text-base font-extrabold text-slate-900 hover:text-emerald-600 transition-colors tracking-tight px-4 py-2 hover:bg-slate-50 rounded-lg">
                Individual
              </Link>
                <Link href="/commercial-insurance" className="text-base font-extrabold text-slate-900 hover:text-blue-600 transition-colors tracking-tight px-4 py-2 hover:bg-slate-50 rounded-lg">
                  Commercial
                </Link>
                <Link href="/commercial-insurance/policy-evolution" className="text-base font-extrabold text-violet-600 hover:text-violet-700 transition-colors tracking-tight px-4 py-2 bg-violet-50 rounded-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  AI Evolution
                </Link>
              </nav>

          <div className="hidden xl:flex items-center gap-8">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Phone className="h-4 w-4 text-purple-600" />
              <span>1800-123-4567</span>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 px-8 h-12 rounded-xl font-bold transition-all hover:scale-105 active:scale-95">
              Get Quote
            </Button>
          </div>

          <button
            className="xl:hidden p-2 text-slate-600 hover:bg-purple-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

            {mobileMenuOpen && (
              <div className="xl:hidden py-8 border-t border-purple-100 animate-in slide-in-from-top-4 duration-300">
                <nav className="flex flex-col gap-8 px-4">
                    <Link href="/bill-simulator" className="group relative flex items-center justify-center gap-3 bg-gradient-to-br from-rose-500 to-rose-600 text-white px-6 py-4 rounded-xl text-xl font-black hover:from-rose-600 hover:to-rose-700 transition-all tracking-tight hover:-translate-y-1 active:translate-y-0.5 shadow-[0_6px_0_0_#9f1239] border border-rose-400/20 overflow-hidden text-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                      <Calculator className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                      <span>Bill Simulator</span>
                    </Link>
                  <Link href="/family-insurance" className="text-xl font-extrabold text-slate-900 hover:text-indigo-600 transition-colors tracking-tight">
                  Family
                </Link>
                <Link href="/individual-insurance" className="text-xl font-extrabold text-slate-900 hover:text-emerald-600 transition-colors tracking-tight">
                  Individual
                </Link>
                <Link href="/commercial-insurance" className="text-xl font-extrabold text-slate-900 hover:text-blue-600 transition-colors tracking-tight">
                  Commercial
                </Link>
                <div className="h-px bg-purple-50 my-2" />
                <div className="flex items-center gap-3 text-slate-600 font-medium mb-2">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <span>1800-123-4567</span>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full h-14 rounded-xl font-bold text-lg shadow-lg shadow-purple-100">
                  Get Quote
                </Button>
              </nav>
            </div>
          )}
      </div>
    </header>
  );
}
