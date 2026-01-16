export interface FamilyMember {
  id: string;
  type: 'father' | 'mother' | 'fatherInLaw' | 'motherInLaw' | 'child' | 'self';
  name: string;
  age: number;
  gender: 'male' | 'female';
  relationship: string;
  city: string;
  state: string;
  country: string;
}

export interface HealthDetails {
  memberId: string;
  height: number;
  weight: number;
  bmi: number;
  smokingStatus: 'never' | 'former' | 'current';
  alcoholConsumption: 'never' | 'occasional' | 'regular';
  preExistingDiseases: string[];
  chronicConditions: boolean;
  ongoingMedications: string;
  pastSurgeries: string;
  familyMedicalHistory: string;
}

export interface AdditionalMedicalInfo {
  recentHospitalizations: string;
  criticalIllnessHistory: string;
  disabilityStatus: string;
  otherRemarks: string;
}

export interface PaymentCapacity {
  monthlyIncomeRange: string;
  preferredPremiumRange: string;
  paymentFrequency: 'monthly' | 'quarterly' | 'annual';
  riskAppetite: 'low' | 'medium' | 'high';
}

export interface PremiumPrediction {
  recommendedPremium: number;
  riskScore: 'low' | 'medium' | 'high';
  confidenceRange: { min: number; max: number };
  factors: PremiumFactor[];
  plans: InsurancePlan[];
  breakdown?: PremiumBreakdown;
}

export interface PremiumBreakdown {
  basePremium: number;
  ageAdjustments: number;
  healthAdjustments: number;
  lifestyleAdjustments: number;
  locationAdjustments: number;
  discounts: number;
}

export interface PremiumFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  type: string;
  coverageAmount: number;
  monthlyPremium: number;
  idealFor: string;
  reason: string;
  premiumExplanation: string;
  features: string[];
}

export interface InsuranceFormData {
  members: FamilyMember[];
  healthDetails: Record<string, HealthDetails>;
  additionalMedicalInfo: AdditionalMedicalInfo;
  paymentCapacity: PaymentCapacity;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  estimatedCost: number;
  breakdown: {
    hospitalCharges: number;
    doctorFees: number;
    medicineCosts: number;
    diagnosticTests: number;
    otherCharges: number;
  };
  hospitalizationDays: number;
  category?: string;
}

export interface SimulationResult {
  scenario: SimulationScenario;
  plans: {
    planId: string;
    planName: string;
    coveredAmount: number;
    outOfPocket: number;
    deductibleApplied: number;
    coPayApplied: number;
    roomRentLimitApplied: boolean;
    claimStatus: 'Approved' | 'Partially Approved' | 'Rejected';
    explanation: string;
  }[];
}
