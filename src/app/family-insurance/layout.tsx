"use client";

import { AuthKycWrapper } from "@/components/auth-kyc-wrapper";

export default function FamilyInsuranceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthKycWrapper insuranceType="family" accentColor="blue">
      {children}
    </AuthKycWrapper>
  );
}
