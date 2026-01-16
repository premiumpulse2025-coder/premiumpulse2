export type BusinessType = 'MSME' | 'Startup' | 'Enterprise' | 'Warehouse' | 'Retail' | 'Manufacturing' | 'IT Services' | 'Other';

export interface BusinessProfile {
  name: string;
  type: BusinessType;
  industry: string;
  annualTurnover: number;
  employeeCount: number;
  location: string;
  assetsValue: number;
  riskExposure: 'low' | 'medium' | 'high';
}

export type CoverageType = 
  | 'property' 
  | 'liability' 
  | 'employee_health' 
  | 'cyber' 
  | 'business_interruption';

export interface CoverageSelection {
  type: CoverageType;
  limit: number;
  deductible: number;
  selected: boolean;
}

export interface RiskAssessment {
  propertyRisk: 'low' | 'medium' | 'high';
  liabilityRisk: 'low' | 'medium' | 'high';
  employeeRisk: 'low' | 'medium' | 'high';
  cyberRisk: 'low' | 'medium' | 'high';
  operationalRisk: 'low' | 'medium' | 'high';
  overallScore: number;
}

export interface CommercialPremiumBreakdown {
  basePremium: number;
  sizeAdjustment: number;
  riskAdjustment: number;
  coverageAdjustment: number;
  employeeBenefitCost: number;
  total: number;
}

export interface CommercialPlan {
  id: string;
  name: string;
  premium: number;
  coverages: CoverageType[];
  benefits: string[];
  exclusions: string[];
  claimLimit: number;
}
