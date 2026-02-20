"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X, Calculator, TrendingUp, LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthUser {
  id: string;
  email: string;
  full_name: string;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user || null)).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setProfileOpen(false);
    router.push("/");
    router.refresh();
  };

  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

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

          <div className="hidden xl:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Phone className="h-4 w-4 text-purple-600" />
              <span>1800-123-4567</span>
            </div>

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-xl transition-colors border border-violet-100"
                >
                  <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 max-w-[100px] truncate">{user.full_name}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-violet-50 border-b border-violet-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="font-semibold text-gray-800 text-sm truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/individual-insurance" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 font-medium">
                        <User className="h-4 w-4 text-emerald-500" /> Individual Insurance
                      </Link>
                      <Link href="/family-insurance" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 font-medium">
                        <User className="h-4 w-4 text-blue-500" /> Family Insurance
                      </Link>
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 font-medium"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="outline" className="h-10 px-5 border-violet-200 text-violet-700 hover:bg-violet-50 font-semibold gap-2">
                    <LogIn className="h-4 w-4" /> Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 px-6 h-10 rounded-xl font-bold transition-all hover:scale-105 active:scale-95">
                    Get Quote
                  </Button>
                </Link>
              </div>
            )}
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
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl">
                      <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.full_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 gap-2">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-12 border-violet-200 text-violet-700 gap-2">
                        <LogIn className="h-4 w-4" /> Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full h-14 rounded-xl font-bold text-lg shadow-lg shadow-purple-100">
                        Get Quote
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
      </div>
    </header>
  );
}
