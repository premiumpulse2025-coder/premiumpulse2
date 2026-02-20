"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { KycGate } from "@/components/kyc-gate";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { Loader2 } from "lucide-react";

interface AuthKycWrapperProps {
  children: React.ReactNode;
  insuranceType: "individual" | "family" | "commercial";
  accentColor?: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface KycRecord {
  status: string;
  insurance_type: string;
}

type PageState = "loading" | "unauthenticated" | "needs-kyc" | "ready";

export function AuthKycWrapper({ children, insuranceType, accentColor }: AuthKycWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [user, setUser] = useState<User | null>(null);

  const checkAuthAndKyc = async () => {
    // Check auth
    const authRes = await fetch("/api/auth/me");
    const authData = await authRes.json();
    if (!authData.user) {
      setPageState("unauthenticated");
      return;
    }
    setUser(authData.user);

    // Check KYC
    const kycRes = await fetch(`/api/kyc?type=${insuranceType}`);
    const kycData = await kycRes.json();
    const kyc: KycRecord | null = kycData.kyc;

    if (kyc && kyc.status === "approved") {
      setPageState("ready");
    } else {
      setPageState("needs-kyc");
    }
  };

  useEffect(() => {
    checkAuthAndKyc();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (pageState === "unauthenticated") {
    // Redirect to login
    router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (pageState === "needs-kyc") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50/40 via-white to-violet-50/20 flex flex-col">
        <Header />
        <main className="pt-[88px] flex-1">
          <KycGate
            insuranceType={insuranceType}
            accentColor={accentColor}
            onVerified={() => setPageState("ready")}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // ready - show children with user context
  return <>{children}</>;
}
