import { BusinessProfile, CoverageSelection, CommercialPremiumBreakdown, RiskAssessment } from '@/types/commercial';

export function calculateRiskAssessment(profile: BusinessProfile): RiskAssessment {
  let score = 0;
  
  // Property Risk
  const propertyRisk = profile.type === 'Warehouse' || profile.type === 'Manufacturing' ? 'high' : 
                      profile.assetsValue > 1000000 ? 'medium' : 'low';
  
  // Liability Risk
  const liabilityRisk = profile.type === 'Manufacturing' || profile.type === 'IT Services' ? 'high' : 
                       profile.annualTurnover > 5000000 ? 'medium' : 'low';
  
  // Employee Risk
  const employeeRisk = profile.employeeCount > 100 ? 'high' : 
                      profile.employeeCount > 20 ? 'medium' : 'low';
  
  // Cyber Risk
  const cyberRisk = profile.type === 'IT Services' || profile.type === 'Startup' ? 'high' : 'medium';
  
  // Score mapping
  const riskMap = { low: 1, medium: 2, high: 3 };
  score = (riskMap[propertyRisk] + riskMap[liabilityRisk] + riskMap[employeeRisk] + riskMap[cyberRisk]) / 4;

  return {
    propertyRisk,
    liabilityRisk,
    employeeRisk,
    cyberRisk,
    operationalRisk: profile.riskExposure,
    overallScore: score
  };
}

export function calculateCommercialPremium(
  profile: BusinessProfile,
  coverages: CoverageSelection[]
): CommercialPremiumBreakdown {
  const risk = calculateRiskAssessment(profile);
  
  // Base Premium starting point
  let basePremium = 5000;
  
  // Size Adjustment (Turnover based)
  const sizeAdjustment = (profile.annualTurnover / 100000) * 50;
  
  // Risk Adjustment
  const riskAdjustment = basePremium * (risk.overallScore * 0.25);
  
    // Coverage Adjustment
    let coverageAdjustment = 0;
    coverages.forEach(c => {
      if (c.selected) {
        const limitCost = (c.limit / 1000) * 0.5;
        const deductibleDiscount = (c.deductible / 1000) * 20; // $20 discount per $1000 deductible
        coverageAdjustment += Math.max(limitCost - deductibleDiscount, 100); // Minimum $100 per coverage
      }
    });
  
  // Employee Benefit Cost
  const employeeBenefitCost = profile.employeeCount * 1200;
  
  const total = basePremium + sizeAdjustment + riskAdjustment + coverageAdjustment + employeeBenefitCost;

  return {
    basePremium,
    sizeAdjustment,
    riskAdjustment,
    coverageAdjustment,
    employeeBenefitCost,
    total: Math.round(total)
  };
}
