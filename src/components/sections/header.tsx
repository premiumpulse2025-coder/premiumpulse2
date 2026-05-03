"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X, Calculator, TrendingUp, LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface AuthUser {
  id: string;
  email: string;
  full_name: string;
}

const navLinks = [
  { href: "/family-insurance", label: "Family", hoverColor: "hover:text-indigo-600" },
  { href: "/individual-insurance", label: "Individual", hoverColor: "hover:text-emerald-600" },
  { href: "/commercial-insurance", label: "Commercial", hoverColor: "hover:text-blue-600" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user || null)).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/90 backdrop-blur-xl border-b border-purple-100/80 shadow-md shadow-purple-50"
        : "bg-white/80 backdrop-blur-sm border-b border-purple-100/50"
    }`}>
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center group">
              <span className="text-2xl font-sans font-black bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight uppercase transition-opacity group-hover:opacity-80">
                premiumpulse
              </span>
            </Link>
            <span className="text-[10px] text-slate-500/80 font-extrabold tracking-[0.2em] uppercase">Security for Every Tomorrow.</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-8">
            <Link
              href="/bill-simulator"
              className="group relative flex items-center gap-2 bg-gradient-to-br from-rose-500 to-rose-600 text-white px-7 py-2.5 rounded-xl text-sm font-black hover:from-rose-600 hover:to-rose-700 transition-all tracking-tight hover:-translate-y-0.5 active:translate-y-0 shadow-[0_3px_0_0_#9f1239] hover:shadow-[0_5px_18px_-4px_rgba(225,29,72,0.5)] border border-rose-400/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              <Calculator className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span>Bill Simulator</span>
            </Link>

            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-extrabold tracking-tight px-3 py-1.5 rounded-lg transition-all ${
                  pathname.startsWith(link.href)
                    ? "text-purple-700 bg-purple-50"
                    : `text-slate-900 ${link.hoverColor} hover:bg-slate-50`
                }`}
              >
                {link.label}
                {pathname.startsWith(link.href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-purple-600 rounded-full"
                  />
                )}
              </Link>
            ))}

            <Link
              href="/commercial-insurance/policy-evolution"
              className={`text-sm font-extrabold tracking-tight px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                pathname === "/commercial-insurance/policy-evolution"
                  ? "text-violet-700 bg-violet-100"
                  : "text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              AI Evolution
            </Link>
          </nav>

          {/* Desktop Right */}
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
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {initials}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 max-w-[100px] truncate">{user.full_name}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 bg-violet-50 border-b border-violet-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="font-semibold text-gray-800 text-sm truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link href="/individual-insurance" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors">
                          <User className="h-4 w-4 text-emerald-500" /> Individual Insurance
                        </Link>
                        <Link href="/family-insurance" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors">
                          <User className="h-4 w-4 text-blue-500" /> Family Insurance
                        </Link>
                      </div>
                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 font-medium transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="outline" className="h-10 px-5 border-violet-200 text-violet-700 hover:bg-violet-50 font-semibold gap-2 transition-all hover:scale-105">
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

          {/* Mobile Hamburger */}
          <button
            className="xl:hidden p-2 text-slate-600 hover:bg-purple-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-6 w-6" />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="xl:hidden overflow-hidden border-t border-purple-100"
            >
              <nav className="flex flex-col gap-6 px-4 py-8">
                <Link href="/bill-simulator" className="group relative flex items-center justify-center gap-3 bg-gradient-to-br from-rose-500 to-rose-600 text-white px-6 py-4 rounded-xl text-lg font-black hover:from-rose-600 hover:to-rose-700 transition-all shadow-[0_4px_0_0_#9f1239] border border-rose-400/20 overflow-hidden text-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                  <Calculator className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  <span>Bill Simulator</span>
                </Link>

                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xl font-extrabold tracking-tight transition-colors py-1 ${
                      pathname.startsWith(link.href) ? "text-purple-700" : `text-slate-900 ${link.hoverColor}`
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="h-px bg-purple-50" />
                <div className="flex items-center gap-3 text-slate-600 font-medium">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <span>1800-123-4567</span>
                </div>

                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow">
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
                    <Link href="/auth/login">
                      <Button variant="outline" className="w-full h-12 border-violet-200 text-violet-700 gap-2">
                        <LogIn className="h-4 w-4" /> Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full h-14 rounded-xl font-bold text-lg shadow-lg shadow-purple-100">
                        Get Quote
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
