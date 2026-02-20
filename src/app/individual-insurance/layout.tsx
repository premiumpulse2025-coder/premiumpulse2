"use client";

import { AuthKycWrapper } from "@/components/auth-kyc-wrapper";

export default function IndividualInsuranceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthKycWrapper insuranceType="individual" accentColor="emerald">
      {children}
    </AuthKycWrapper>
  );
}
