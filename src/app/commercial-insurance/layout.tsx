"use client";

import { AuthKycWrapper } from "@/components/auth-kyc-wrapper";

export default function CommercialInsuranceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthKycWrapper insuranceType="commercial" accentColor="violet">
      {children}
    </AuthKycWrapper>
  );
}
