"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff, UserPlus, Shield, Check } from "lucide-react";
import { motion } from "framer-motion";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, fullName: form.fullName, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!form.password) return null;
    if (form.password.length < 6) return { label: "Weak", color: "text-red-500" };
    if (form.password.length < 10) return { label: "Fair", color: "text-amber-500" };
    return { label: "Strong", color: "text-green-600" };
  };

  const strength = passwordStrength();

  return (
    <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <Card className="border-0 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <UserPlus className="h-6 w-6 text-violet-600" />
                  Create Account
                </CardTitle>
                <CardDescription>Fill in your details to register</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Rahul Sharma"
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number <span className="text-gray-400 text-xs">(optional)</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Min 6 characters"
                        className="h-12 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {strength && (
                      <p className={`text-xs font-medium ${strength.color}`}>Password strength: {strength.label}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        className="h-12 pr-10"
                        required
                      />
                      {form.confirmPassword && form.password === form.confirmPassword && (
                        <Check className="absolute right-3 top-3.5 h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-700 rounded-lg p-3 flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="text-violet-600 font-semibold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </section>
    );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 via-white to-violet-50/30">
      <Header />
      <main className="pt-[88px]">
        <section className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-3 bg-white/20 px-5 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" /> Create Account
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Get Started</h1>
            <p className="text-violet-100 text-lg">Create your PremiumPulse account to access insurance plans</p>
          </div>
        </section>
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-violet-600 border-t-transparent rounded-full" /></div>}>
          <RegisterForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
