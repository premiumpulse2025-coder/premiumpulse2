import type { FamilyMember, HealthDetails, PaymentCapacity, PremiumPrediction, PremiumFactor, InsurancePlan, PremiumBreakdown } from "@/types/insurance";

const BASE_PREMIUM = 5000;
const AGE_FACTOR = 150;
const BMI_NORMAL_RANGE = { min: 18.5, max: 24.9 };
const SMOKING_MULTIPLIER = { never: 1, former: 1.2, current: 1.5 };
const ALCOHOL_MULTIPLIER = { never: 1, occasional: 1.05, regular: 1.15 };

const CITY_RISK_INDEX: Record<string, number> = {
  "mumbai": 1.2,
  "delhi": 1.15,
  "bangalore": 1.1,
  "chennai": 1.1,
  "kolkata": 1.05,
  "hyderabad": 1.08,
  "pune": 1.05,
  "default": 1.0
};

const PRE_EXISTING_WEIGHTS: Record<string, number> = {
  "diabetes": 0.25,
  "hypertension": 0.2,
  "heart_disease": 0.4,
  "asthma": 0.15,
  "thyroid": 0.1,
  "cancer_history": 0.5,
  "kidney_disease": 0.35,
  "liver_disease": 0.3,
  "obesity": 0.2,
  "none": 0
};

function calculateLinearRegressionPremium(
  members: FamilyMember[],
  healthDetails: Record<string, HealthDetails>,
  paymentCapacity: PaymentCapacity
): { total: number; breakdown: PremiumBreakdown } {
  let totalPremium = 0;
  const breakdown: PremiumBreakdown = {
    basePremium: BASE_PREMIUM * members.length,
    ageAdjustments: 0,
    healthAdjustments: 0,
    lifestyleAdjustments: 0,
    locationAdjustments: 0,
    discounts: 0
  };

  for (const member of members) {
    const health = healthDetails[member.id];
    if (!health) continue;

    let memberBase = BASE_PREMIUM;
    
    // Age adjustment
    const ageAdj = (member.age - 30) * AGE_FACTOR;
    breakdown.ageAdjustments += ageAdj;
    
    let runningPremium = memberBase + ageAdj;
    const preHealthPremium = runningPremium;

    // BMI adjustment
    if (health.bmi < BMI_NORMAL_RANGE.min || health.bmi > BMI_NORMAL_RANGE.max) {
      const bmiDeviation = health.bmi < BMI_NORMAL_RANGE.min 
        ? BMI_NORMAL_RANGE.min - health.bmi 
        : health.bmi - BMI_NORMAL_RANGE.max;
      runningPremium += bmiDeviation * 100;
    }

    // Disease adjustments
    for (const disease of health.preExistingDiseases) {
      const weight = PRE_EXISTING_WEIGHTS[disease] || 0.1;
      runningPremium *= (1 + weight);
    }

    if (health.chronicConditions) {
      runningPremium *= 1.15;
    }

    breakdown.healthAdjustments += (runningPremium - preHealthPremium);
    const preLifestylePremium = runningPremium;

    // Lifestyle adjustments
    runningPremium *= SMOKING_MULTIPLIER[health.smokingStatus];
    runningPremium *= ALCOHOL_MULTIPLIER[health.alcoholConsumption];
    breakdown.lifestyleAdjustments += (runningPremium - preLifestylePremium);

    const preLocationPremium = runningPremium;

    // Location adjustment
    const cityKey = member.city.toLowerCase();
    const cityRisk = CITY_RISK_INDEX[cityKey] || CITY_RISK_INDEX["default"];
    runningPremium *= cityRisk;
    breakdown.locationAdjustments += (runningPremium - preLocationPremium);

    totalPremium += runningPremium;
  }

  // Discounts
  if (members.length > 2) {
    const discount = totalPremium * 0.05;
    totalPremium -= discount;
    breakdown.discounts += discount;
  }
  if (members.length > 4) {
    const discount = totalPremium * 0.07;
    totalPremium -= discount;
    breakdown.discounts += discount;
  }

  return { total: totalPremium, breakdown };
}

function calculateXGBoostPremium(
  members: FamilyMember[],
  healthDetails: Record<string, HealthDetails>,
  paymentCapacity: PaymentCapacity
): number {
  let baseScore = 0;
  
  const avgAge = members.reduce((sum, m) => sum + m.age, 0) / members.length;
  baseScore += Math.pow(avgAge / 50, 2) * 3000;

  let totalHealthRisk = 0;
  for (const member of members) {
    const health = healthDetails[member.id];
    if (!health) continue;

    let riskScore = 0;
    
    if (member.age > 60) riskScore += 2;
    if (member.age > 50) riskScore += 1;
    
    if (health.bmi > 30) riskScore += 2;
    else if (health.bmi > 27) riskScore += 1;
    else if (health.bmi < 18) riskScore += 1;

    if (health.smokingStatus === 'current') riskScore += 3;
    else if (health.smokingStatus === 'former') riskScore += 1;

    riskScore += health.preExistingDiseases.length * 1.5;
    if (health.chronicConditions) riskScore += 2;

    totalHealthRisk += riskScore;
  }

  baseScore += totalHealthRisk * 800;

  baseScore *= (1 + Math.log(members.length) * 0.3);

  const riskAppetiteMultiplier = {
    low: 1.1,
    medium: 1.0,
    high: 0.9
  };
  baseScore *= riskAppetiteMultiplier[paymentCapacity.riskAppetite];

  return baseScore + BASE_PREMIUM * members.length;
}

function identifyPremiumFactors(
  members: FamilyMember[],
  healthDetails: Record<string, HealthDetails>
): PremiumFactor[] {
  const factors: PremiumFactor[] = [];

  const avgAge = members.reduce((sum, m) => sum + m.age, 0) / members.length;
  if (avgAge > 55) {
    factors.push({
      factor: "Average Age",
      impact: "negative",
      description: `Higher average age (${avgAge.toFixed(0)} years) increases health risk`
    });
  } else if (avgAge < 40) {
    factors.push({
      factor: "Average Age",
      impact: "positive",
      description: `Lower average age (${avgAge.toFixed(0)} years) reduces premium`
    });
  }

  factors.push({
    factor: members.length > 1 ? "Family Size" : "Plan Type",
    impact: members.length > 2 ? "positive" : "neutral",
    description: members.length > 1 
      ? `${members.length} members - ${members.length > 2 ? "Family discount applied" : "Standard family rate"}`
      : "Individual coverage - personalized risk assessment"
  });

  let hasSmokingRisk = false;
  let hasPreExisting = false;
  let hasBMIRisk = false;

  for (const member of members) {
    const health = healthDetails[member.id];
    if (!health) continue;

    if (health.smokingStatus === 'current' && !hasSmokingRisk) {
      hasSmokingRisk = true;
      factors.push({
        factor: "Smoking Status",
        impact: "negative",
        description: "Active smoker(s) in family significantly increase premium"
      });
    }

    if (health.preExistingDiseases.length > 0 && !hasPreExisting) {
      hasPreExisting = true;
      factors.push({
        factor: "Pre-existing Conditions",
        impact: "negative",
        description: `${health.preExistingDiseases.join(", ")} detected - affects risk assessment`
      });
    }

    if ((health.bmi > 30 || health.bmi < 18) && !hasBMIRisk) {
      hasBMIRisk = true;
      factors.push({
        factor: "BMI",
        impact: "negative",
        description: "BMI outside healthy range increases health risk"
      });
    }
  }

  if (!hasSmokingRisk) {
    factors.push({
      factor: "Lifestyle",
      impact: "positive",
      description: "No active smokers - healthy lifestyle discount"
    });
  }

  return factors;
}

function generatePlanSuggestions(
  premium: number,
  riskScore: 'low' | 'medium' | 'high',
  memberCount: number
): InsurancePlan[] {
  const plans: InsurancePlan[] = [];

  plans.push({
    id: "basic",
    name: "Essential Health Cover",
    type: "Basic Health Cover",
    coverageAmount: 500000,
    monthlyPremium: Math.round(premium * 0.8),
    idealFor: "Young families with good health",
    reason: "Affordable coverage for essential medical needs",
    premiumExplanation: "This premium is calculated for fundamental protection. It focuses on the most likely medical expenses, keeping costs low while ensuring you aren't left without support during emergencies.",
    features: [
      "Hospitalization coverage",
      "Day care procedures",
      "Pre & post hospitalization",
      "Ambulance charges"
    ]
  });

  plans.push({
    id: "floater",
    name: memberCount > 1 ? "Family Floater Plus" : "Individual Comprehensive",
    type: memberCount > 1 ? "Family Floater Plan" : "Individual Health Plan",
    coverageAmount: 1000000,
    monthlyPremium: Math.round(premium),
    idealFor: memberCount > 1 ? `Families with ${memberCount} members` : "Individuals seeking personal cover",
    reason: memberCount > 1 ? "Shared coverage pool maximizes value for families" : "Complete protection with high coverage limits",
    premiumExplanation: memberCount > 1 
      ? "This price reflects a balanced strategy for families. By sharing a single large coverage pool among all members, you get significantly more protection for each rupee spent compared to individual plans."
      : "This premium covers a wide range of medical expenses with higher limits. It's priced to ensure that you have access to the best healthcare facilities without worrying about out-of-pocket costs.",
    features: [
      memberCount > 1 ? "Shared sum insured for all members" : "Dedicated sum insured",
      "No-claim bonus up to 50%",
      memberCount > 1 ? "Maternity coverage" : "OPD consultation benefits",
      memberCount > 1 ? "Newborn baby coverage" : "Mental health support",
      "Annual health checkup"
    ]
  });

  if (riskScore !== 'low') {
    plans.push({
      id: "critical",
      name: "Critical Shield",
      type: "Critical Illness Add-on",
      coverageAmount: 2000000,
      monthlyPremium: Math.round(premium * 1.3),
      idealFor: "Families with health concerns",
      reason: "Extended coverage for serious illnesses based on your risk profile",
      premiumExplanation: "The premium is higher here because it provides a dedicated financial safety net for serious, life-altering illnesses. It's designed to give you peace of mind and lump-sum support when you need it most.",
      features: [
        "Coverage for 30+ critical illnesses",
        "Lump sum payout on diagnosis",
        "Income protection",
        "Second medical opinion",
        "Worldwide coverage"
      ]
    });
  }

  plans.push({
    id: "topup",
    name: "Super Top-up Shield",
    type: "Top-up / Super Top-up Plans",
    coverageAmount: 3000000,
    monthlyPremium: Math.round(premium * 0.4),
    idealFor: "Cost-conscious families wanting higher coverage",
    reason: "Affordable way to enhance your existing coverage",
    premiumExplanation: "This exceptionally low premium is possible because it acts as an 'overflow' layer. It only kicks in after a certain initial amount, allowing us to offer massive additional coverage at a fraction of the standard cost.",
    features: [
      "Deductible-based coverage",
      "Works with existing policies",
      "Lower premiums for high coverage",
      "No sub-limits"
    ]
  });

  return plans;
}

export function predictPremium(
  members: FamilyMember[],
  healthDetails: Record<string, HealthDetails>,
  paymentCapacity: PaymentCapacity
): PremiumPrediction {
  const { total: linearPremium, breakdown } = calculateLinearRegressionPremium(members, healthDetails, paymentCapacity);
  const xgboostPremium = calculateXGBoostPremium(members, healthDetails, paymentCapacity);
  
  const ensemblePremium = (linearPremium * 0.4 + xgboostPremium * 0.6);
  
  const roundedPremium = Math.round(ensemblePremium / 500) * 500;

  // Scale breakdown to match rounded ensemble premium
  const scale = roundedPremium / linearPremium;
  const scaledBreakdown: PremiumBreakdown = {
    basePremium: Math.round(breakdown.basePremium * scale),
    ageAdjustments: Math.round(breakdown.ageAdjustments * scale),
    healthAdjustments: Math.round(breakdown.healthAdjustments * scale),
    lifestyleAdjustments: Math.round(breakdown.lifestyleAdjustments * scale),
    locationAdjustments: Math.round(breakdown.locationAdjustments * scale),
    discounts: Math.round(breakdown.discounts * scale)
  };

  let totalRiskScore = 0;
  for (const member of members) {
    const health = healthDetails[member.id];
    if (!health) continue;
    
    if (member.age > 60) totalRiskScore += 3;
    else if (member.age > 50) totalRiskScore += 2;
    else if (member.age > 40) totalRiskScore += 1;
    
    if (health.smokingStatus === 'current') totalRiskScore += 3;
    totalRiskScore += health.preExistingDiseases.length;
    if (health.chronicConditions) totalRiskScore += 2;
  }

  const avgRiskScore = totalRiskScore / members.length;
  const riskScore: 'low' | 'medium' | 'high' = 
    avgRiskScore < 3 ? 'low' : avgRiskScore < 6 ? 'medium' : 'high';

  const factors = identifyPremiumFactors(members, healthDetails);
  const plans = generatePlanSuggestions(roundedPremium, riskScore, members.length);

  return {
    recommendedPremium: roundedPremium,
    riskScore,
    confidenceRange: {
      min: Math.round(roundedPremium * 0.85),
      max: Math.round(roundedPremium * 1.15)
    },
    factors,
    plans,
    breakdown: scaledBreakdown
  };
}
