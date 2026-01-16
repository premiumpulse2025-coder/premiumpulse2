
import { SimulationScenario } from "@/types/insurance";

export const SCENARIOS: SimulationScenario[] = [
  // --- Critical & High-Cost ---
  {
    id: "sc-heart-attack",
    name: "Heart Attack (Myocardial Infarction)",
    category: "Critical & High-Cost",
    description: "Emergency ICU admission, stabilization, and monitoring after a heart attack.",
    estimatedCost: 250000,
    breakdown: { hospitalCharges: 100000, doctorFees: 60000, medicineCosts: 40000, diagnosticTests: 30000, otherCharges: 20000 },
    hospitalizationDays: 5
  },
  {
    id: "sc-cabg",
    name: "Coronary Artery Bypass Surgery (CABG)",
    category: "Critical & High-Cost",
    description: "Major open-heart surgery to restore blood flow to the heart.",
    estimatedCost: 650000,
    breakdown: { hospitalCharges: 250000, doctorFees: 200000, medicineCosts: 80000, diagnosticTests: 70000, otherCharges: 50000 },
    hospitalizationDays: 10
  },
  {
    id: "sc-angioplasty",
    name: "Angioplasty",
    category: "Critical & High-Cost",
    description: "Procedure to open blocked heart arteries using a stent.",
    estimatedCost: 350000,
    breakdown: { hospitalCharges: 150000, doctorFees: 100000, medicineCosts: 50000, diagnosticTests: 30000, otherCharges: 20000 },
    hospitalizationDays: 3
  },
  {
    id: "sc-stroke",
    name: "Stroke (Ischemic / Hemorrhagic)",
    category: "Critical & High-Cost",
    description: "Emergency treatment and rehabilitation for brain stroke.",
    estimatedCost: 400000,
    breakdown: { hospitalCharges: 180000, doctorFees: 90000, medicineCosts: 60000, diagnosticTests: 50000, otherCharges: 20000 },
    hospitalizationDays: 7
  },
  {
    id: "sc-cancer",
    name: "Cancer (Chemotherapy / Radiation / Surgery)",
    category: "Critical & High-Cost",
    description: "Comprehensive cancer treatment including surgery and initial therapy.",
    estimatedCost: 800000,
    breakdown: { hospitalCharges: 300000, doctorFees: 200000, medicineCosts: 150000, diagnosticTests: 100000, otherCharges: 50000 },
    hospitalizationDays: 12
  },
  {
    id: "sc-kidney-failure",
    name: "Kidney failure (Dialysis / Transplant evaluation)",
    category: "Critical & High-Cost",
    description: "Treatment for end-stage renal disease and evaluation for transplant.",
    estimatedCost: 500000,
    breakdown: { hospitalCharges: 200000, doctorFees: 100000, medicineCosts: 100000, diagnosticTests: 60000, otherCharges: 40000 },
    hospitalizationDays: 15
  },
  {
    id: "sc-liver-cirrhosis",
    name: "Liver cirrhosis complications",
    category: "Critical & High-Cost",
    description: "Management of portal hypertension, ascites, or hepatic encephalopathy.",
    estimatedCost: 300000,
    breakdown: { hospitalCharges: 120000, doctorFees: 80000, medicineCosts: 50000, diagnosticTests: 30000, otherCharges: 20000 },
    hospitalizationDays: 8
  },
  {
    id: "sc-brain-tumor",
    name: "Brain tumor surgery",
    category: "Critical & High-Cost",
    description: "Neurosurgical procedure for tumor removal and post-op care.",
    estimatedCost: 700000,
    breakdown: { hospitalCharges: 280000, doctorFees: 220000, medicineCosts: 100000, diagnosticTests: 60000, otherCharges: 40000 },
    hospitalizationDays: 14
  },
  {
    id: "sc-organ-transplant",
    name: "Organ transplant pre/post care",
    category: "Critical & High-Cost",
    description: "Intensive care and immunosuppressant management for transplant patients.",
    estimatedCost: 1200000,
    breakdown: { hospitalCharges: 500000, doctorFees: 300000, medicineCosts: 250000, diagnosticTests: 100000, otherCharges: 50000 },
    hospitalizationDays: 20
  },
  {
    id: "sc-severe-trauma",
    name: "Severe trauma / road accident injuries",
    category: "Critical & High-Cost",
    description: "Emergency surgeries and intensive care for multiple injuries.",
    estimatedCost: 600000,
    breakdown: { hospitalCharges: 250000, doctorFees: 150000, medicineCosts: 100000, diagnosticTests: 60000, otherCharges: 40000 },
    hospitalizationDays: 10
  },

  // --- Chronic & Lifestyle ---
  {
    id: "sc-diabetes-comp",
    name: "Diabetes complications",
    category: "Chronic & Lifestyle Diseases",
    description: "Hospitalization for diabetic ketoacidosis or severe foot ulcer.",
    estimatedCost: 120000,
    breakdown: { hospitalCharges: 50000, doctorFees: 25000, medicineCosts: 25000, diagnosticTests: 10000, otherCharges: 10000 },
    hospitalizationDays: 5
  },
  {
    id: "sc-hypertension-hosp",
    name: "Hypertension-related hospitalization",
    category: "Chronic & Lifestyle Diseases",
    description: "Emergency management of hypertensive urgency or related organ damage.",
    estimatedCost: 80000,
    breakdown: { hospitalCharges: 35000, doctorFees: 15000, medicineCosts: 15000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 3
  },
  {
    id: "sc-ckd",
    name: "Chronic kidney disease (CKD)",
    category: "Chronic & Lifestyle Diseases",
    description: "In-patient management of CKD progression and complications.",
    estimatedCost: 150000,
    breakdown: { hospitalCharges: 60000, doctorFees: 30000, medicineCosts: 30000, diagnosticTests: 20000, otherCharges: 10000 },
    hospitalizationDays: 7
  },
  {
    id: "sc-copd",
    name: "Chronic obstructive pulmonary disease (COPD)",
    category: "Chronic & Lifestyle Diseases",
    description: "Treatment for acute exacerbation of COPD.",
    estimatedCost: 90000,
    breakdown: { hospitalCharges: 40000, doctorFees: 20000, medicineCosts: 15000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 4
  },
  {
    id: "sc-asthma-severe",
    name: "Asthma (severe attack)",
    category: "Chronic & Lifestyle Diseases",
    description: "Emergency treatment for status asthmaticus.",
    estimatedCost: 60000,
    breakdown: { hospitalCharges: 25000, doctorFees: 15000, medicineCosts: 10000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 3
  },
  {
    id: "sc-thyroid-disorder",
    name: "Thyroid disorders",
    category: "Chronic & Lifestyle Diseases",
    description: "Management of thyroid storm or severe myxedema.",
    estimatedCost: 70000,
    breakdown: { hospitalCharges: 30000, doctorFees: 15000, medicineCosts: 15000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 4
  },
  {
    id: "sc-obesity-comp",
    name: "Obesity-related complications",
    category: "Chronic & Lifestyle Diseases",
    description: "Treatment for sleep apnea, metabolic syndrome, or joint issues.",
    estimatedCost: 110000,
    breakdown: { hospitalCharges: 45000, doctorFees: 25000, medicineCosts: 20000, diagnosticTests: 15000, otherCharges: 5000 },
    hospitalizationDays: 5
  },
  {
    id: "sc-arthritis-joint",
    name: "Arthritis (joint replacement)",
    category: "Chronic & Lifestyle Diseases",
    description: "Elective joint replacement surgery for advanced arthritis.",
    estimatedCost: 400000,
    breakdown: { hospitalCharges: 180000, doctorFees: 100000, medicineCosts: 60000, diagnosticTests: 40000, otherCharges: 20000 },
    hospitalizationDays: 6
  },
  {
    id: "sc-osteoporosis",
    name: "Osteoporosis fractures",
    category: "Chronic & Lifestyle Diseases",
    description: "Management and surgical repair of fragility fractures.",
    estimatedCost: 180000,
    breakdown: { hospitalCharges: 80000, doctorFees: 40000, medicineCosts: 30000, diagnosticTests: 20000, otherCharges: 10000 },
    hospitalizationDays: 7
  },

  // --- General Medical ---
  {
    id: "sc-pneumonia",
    name: "Pneumonia",
    category: "General Medical Conditions",
    description: "In-patient care for bacterial or viral pneumonia.",
    estimatedCost: 100000,
    breakdown: { hospitalCharges: 40000, doctorFees: 20000, medicineCosts: 20000, diagnosticTests: 15000, otherCharges: 5000 },
    hospitalizationDays: 5
  },
  {
    id: "sc-dengue",
    name: "Dengue fever",
    category: "General Medical Conditions",
    description: "Management of high fever and low platelet counts.",
    estimatedCost: 75000,
    breakdown: { hospitalCharges: 30000, doctorFees: 15000, medicineCosts: 15000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 5
  },
  {
    id: "sc-malaria",
    name: "Malaria",
    category: "General Medical Conditions",
    description: "Treatment for uncomplicated or severe malaria.",
    estimatedCost: 65000,
    breakdown: { hospitalCharges: 25000, doctorFees: 15000, medicineCosts: 15000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 4
  },
  {
    id: "sc-typhoid",
    name: "Typhoid",
    category: "General Medical Conditions",
    description: "Prolonged fever treatment with IV antibiotics.",
    estimatedCost: 70000,
    breakdown: { hospitalCharges: 30000, doctorFees: 15000, medicineCosts: 15000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 6
  },
  {
    id: "sc-covid-comp",
    name: "COVID-19 complications",
    category: "General Medical Conditions",
    description: "Management of post-COVID respiratory or cardiac issues.",
    estimatedCost: 150000,
    breakdown: { hospitalCharges: 70000, doctorFees: 30000, medicineCosts: 25000, diagnosticTests: 20000, otherCharges: 5000 },
    hospitalizationDays: 7
  },
  {
    id: "sc-viral-fever",
    name: "Viral fever requiring hospitalization",
    category: "General Medical Conditions",
    description: "In-patient care for severe viral infections and dehydration.",
    estimatedCost: 50000,
    breakdown: { hospitalCharges: 20000, doctorFees: 10000, medicineCosts: 10000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 3
  },
  {
    id: "sc-severe-dehydration",
    name: "Severe dehydration",
    category: "General Medical Conditions",
    description: "IV fluid resuscitation and electrolyte correction.",
    estimatedCost: 40000,
    breakdown: { hospitalCharges: 15000, doctorFees: 10000, medicineCosts: 5000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 2
  },
  {
    id: "sc-gastroenteritis",
    name: "Gastroenteritis",
    category: "General Medical Conditions",
    description: "Management of severe vomiting and diarrhea.",
    estimatedCost: 45000,
    breakdown: { hospitalCharges: 20000, doctorFees: 10000, medicineCosts: 5000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 3
  },
  {
    id: "sc-uti",
    name: "Urinary tract infection (UTI)",
    category: "General Medical Conditions",
    description: "Treatment for complicated UTI or pyelonephritis.",
    estimatedCost: 55000,
    breakdown: { hospitalCharges: 20000, doctorFees: 15000, medicineCosts: 10000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 4
  },
  {
    id: "sc-kidney-stones",
    name: "Kidney stones",
    category: "General Medical Conditions",
    description: "Management of renal colic and stone passage.",
    estimatedCost: 60000,
    breakdown: { hospitalCharges: 25000, doctorFees: 15000, medicineCosts: 10000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 3
  },

  // --- Surgical Procedures ---
  {
    id: "sc-appendicitis",
    name: "Appendicitis (Appendectomy)",
    category: "Surgical Procedures",
    description: "Emergency surgical removal of the appendix.",
    estimatedCost: 130000,
    breakdown: { hospitalCharges: 50000, doctorFees: 40000, medicineCosts: 20000, diagnosticTests: 10000, otherCharges: 10000 },
    hospitalizationDays: 3
  },
  {
    id: "sc-gallbladder",
    name: "Gallbladder stones (Cholecystectomy)",
    category: "Surgical Procedures",
    description: "Surgical removal of the gallbladder due to stones.",
    estimatedCost: 150000,
    breakdown: { hospitalCharges: 60000, doctorFees: 45000, medicineCosts: 25000, diagnosticTests: 10000, otherCharges: 10000 },
    hospitalizationDays: 3
  },
  {
    id: "sc-hernia-repair",
    name: "Hernia repair",
    category: "Surgical Procedures",
    description: "Surgical correction of inguinal or ventral hernia.",
    estimatedCost: 110000,
    breakdown: { hospitalCharges: 40000, doctorFees: 35000, medicineCosts: 15000, diagnosticTests: 10000, otherCharges: 10000 },
    hospitalizationDays: 2
  },
  {
    id: "sc-cataract-surgery",
    name: "Cataract surgery",
    category: "Surgical Procedures",
    description: "Day-care surgical procedure for lens replacement.",
    estimatedCost: 50000,
    breakdown: { hospitalCharges: 15000, doctorFees: 20000, medicineCosts: 5000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 1
  },
  {
    id: "sc-tonsillectomy",
    name: "Tonsillectomy",
    category: "Surgical Procedures",
    description: "Surgical removal of the tonsils.",
    estimatedCost: 60000,
    breakdown: { hospitalCharges: 25000, doctorFees: 20000, medicineCosts: 5000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 2
  },
  {
    id: "sc-sinus-surgery",
    name: "Sinus surgery",
    category: "Surgical Procedures",
    description: "Functional Endoscopic Sinus Surgery (FESS).",
    estimatedCost: 90000,
    breakdown: { hospitalCharges: 35000, doctorFees: 30000, medicineCosts: 10000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 2
  },
  {
    id: "sc-varicose-vein",
    name: "Varicose vein surgery",
    category: "Surgical Procedures",
    description: "Laser or surgical treatment for varicose veins.",
    estimatedCost: 100000,
    breakdown: { hospitalCharges: 40000, doctorFees: 35000, medicineCosts: 10000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 2
  },
  {
    id: "sc-piles-surgery",
    name: "Piles / fistula surgery",
    category: "Surgical Procedures",
    description: "Surgical or laser treatment for hemorrhoids or fistula.",
    estimatedCost: 80000,
    breakdown: { hospitalCharges: 30000, doctorFees: 25000, medicineCosts: 10000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 2
  },

  // --- Maternity & Child Care ---
  {
    id: "sc-normal-delivery",
    name: "Normal delivery",
    category: "Maternity & Child Care",
    description: "Standard hospital stay and care for natural childbirth.",
    estimatedCost: 80000,
    breakdown: { hospitalCharges: 35000, doctorFees: 25000, medicineCosts: 10000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 2
  },
  {
    id: "sc-c-section",
    name: "Cesarean section",
    category: "Maternity & Child Care",
    description: "Surgical delivery and extended postnatal care.",
    estimatedCost: 150000,
    breakdown: { hospitalCharges: 60000, doctorFees: 45000, medicineCosts: 25000, diagnosticTests: 10000, otherCharges: 10000 },
    hospitalizationDays: 4
  },
  {
    id: "sc-pregnancy-comp",
    name: "Pregnancy complications",
    category: "Maternity & Child Care",
    description: "Management of pre-eclampsia, gestational diabetes, or preterm labor.",
    estimatedCost: 100000,
    breakdown: { hospitalCharges: 40000, doctorFees: 25000, medicineCosts: 15000, diagnosticTests: 10000, otherCharges: 10000 },
    hospitalizationDays: 5
  },
  {
    id: "sc-nicu-care",
    name: "Neonatal ICU care",
    category: "Maternity & Child Care",
    description: "Intensive monitoring and care for newborns in NICU.",
    estimatedCost: 400000,
    breakdown: { hospitalCharges: 200000, doctorFees: 80000, medicineCosts: 60000, diagnosticTests: 40000, otherCharges: 20000 },
    hospitalizationDays: 10
  },
  {
    id: "sc-pediatric-inf",
    name: "Pediatric infections",
    category: "Maternity & Child Care",
    description: "In-patient care for severe childhood infections.",
    estimatedCost: 60000,
    breakdown: { hospitalCharges: 25000, doctorFees: 15000, medicineCosts: 10000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 4
  },
  {
    id: "sc-congenital-disorder",
    name: "Congenital disorder treatment",
    category: "Maternity & Child Care",
    description: "Management or surgical correction of birth defects.",
    estimatedCost: 250000,
    breakdown: { hospitalCharges: 100000, doctorFees: 70000, medicineCosts: 40000, diagnosticTests: 20000, otherCharges: 20000 },
    hospitalizationDays: 8
  },
    {
      id: "sc-childhood-asthma",
      name: "Childhood asthma",
      category: "Maternity & Child Care",
      description: "Emergency nebulization and monitoring for kids.",
      estimatedCost: 40000,
      breakdown: { hospitalCharges: 15000, doctorFees: 10000, medicineCosts: 5000, diagnosticTests: 5000, otherCharges: 5000 },
      hospitalizationDays: 2
    },
    {
      id: "sc-pediatric-viral",
      name: "Viral infections in children",
      category: "Maternity & Child Care",
      description: "Treatment for common childhood viral infections requiring monitoring.",
      estimatedCost: 45000,
      breakdown: { hospitalCharges: 20000, doctorFees: 10000, medicineCosts: 10000, diagnosticTests: 5000, otherCharges: 0 },
      hospitalizationDays: 3
    },

  // --- Elderly-Specific ---
  {
    id: "sc-hip-fracture",
    name: "Hip fracture",
    category: "Elderly-Specific Conditions",
    description: "Surgical repair and rehab for hip fractures in elderly.",
    estimatedCost: 350000,
    breakdown: { hospitalCharges: 150000, doctorFees: 100000, medicineCosts: 50000, diagnosticTests: 30000, otherCharges: 20000 },
    hospitalizationDays: 10
  },
  {
    id: "sc-knee-replacement",
    name: "Knee replacement",
    category: "Elderly-Specific Conditions",
    description: "Total Knee Arthroplasty (TKA) and physiotherapy.",
    estimatedCost: 450000,
    breakdown: { hospitalCharges: 200000, doctorFees: 120000, medicineCosts: 60000, diagnosticTests: 40000, otherCharges: 30000 },
    hospitalizationDays: 7
  },
  {
    id: "sc-alzheimer-comp",
    name: "Alzheimer’s complications",
    category: "Elderly-Specific Conditions",
    description: "Management of severe behavioral issues or infections in dementia.",
    estimatedCost: 120000,
    breakdown: { hospitalCharges: 60000, doctorFees: 30000, medicineCosts: 15000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 10
  },
  {
    id: "sc-parkinson-care",
    name: "Parkinson’s disease care",
    category: "Elderly-Specific Conditions",
    description: "In-patient stabilization for advanced Parkinson's symptoms.",
    estimatedCost: 100000,
    breakdown: { hospitalCharges: 50000, doctorFees: 25000, medicineCosts: 15000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 8
  },
  {
    id: "sc-age-cardiac",
    name: "Age-related cardiac issues",
    category: "Elderly-Specific Conditions",
    description: "Management of heart failure or arrhythmias in elderly patients.",
    estimatedCost: 180000,
    breakdown: { hospitalCharges: 80000, doctorFees: 40000, medicineCosts: 30000, diagnosticTests: 20000, otherCharges: 10000 },
    hospitalizationDays: 7
  },
  {
    id: "sc-elderly-falls",
    name: "Falls and injury management",
    category: "Elderly-Specific Conditions",
    description: "Treatment for soft tissue injuries or minor fractures from falls.",
    estimatedCost: 70000,
    breakdown: { hospitalCharges: 30000, doctorFees: 15000, medicineCosts: 15000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 4
  },

  // --- Mental Health ---
  {
    id: "sc-depression-hosp",
    name: "Depression hospitalization",
    category: "Mental Health & Neurology",
    description: "In-patient psychiatric care for severe depression.",
    estimatedCost: 150000,
    breakdown: { hospitalCharges: 80000, doctorFees: 40000, medicineCosts: 15000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 14
  },
  {
    id: "sc-anxiety-crisis",
    name: "Anxiety disorder crisis",
    category: "Mental Health & Neurology",
    description: "Emergency management of severe panic or anxiety episodes.",
    estimatedCost: 80000,
    breakdown: { hospitalCharges: 40000, doctorFees: 20000, medicineCosts: 10000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 5
  },
  {
    id: "sc-epileptic-seizures",
    name: "Epileptic seizures",
    category: "Mental Health & Neurology",
    description: "Emergency treatment for prolonged or multiple seizures.",
    estimatedCost: 100000,
    breakdown: { hospitalCharges: 45000, doctorFees: 25000, medicineCosts: 15000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 4
  },
  {
    id: "sc-migraine-comp",
    name: "Migraine complications",
    category: "Mental Health & Neurology",
    description: "Management of status migrainosus or intractable headache.",
    estimatedCost: 50000,
    breakdown: { hospitalCharges: 25000, doctorFees: 10000, medicineCosts: 10000, diagnosticTests: 5000, otherCharges: 0 },
    hospitalizationDays: 3
  },
  {
    id: "sc-sleep-disorder",
    name: "Sleep disorder treatment",
    category: "Mental Health & Neurology",
    description: "In-patient sleep study and titration for severe disorders.",
    estimatedCost: 60000,
    breakdown: { hospitalCharges: 30000, doctorFees: 15000, medicineCosts: 5000, diagnosticTests: 10000, otherCharges: 0 },
    hospitalizationDays: 2
  },
  {
    id: "sc-substance-withdrawal",
    name: "Substance withdrawal care",
    category: "Mental Health & Neurology",
    description: "Medical detoxification and monitoring during withdrawal.",
    estimatedCost: 120000,
    breakdown: { hospitalCharges: 60000, doctorFees: 30000, medicineCosts: 15000, diagnosticTests: 10000, otherCharges: 5000 },
    hospitalizationDays: 10
  },

  // --- Day Care & OPD ---
  {
    id: "sc-dental-surgery",
    name: "Dental surgery (accident-related)",
    category: "Day Care & OPD Procedures",
    description: "Emergency dental reconstruction after trauma.",
    estimatedCost: 70000,
    breakdown: { hospitalCharges: 20000, doctorFees: 30000, medicineCosts: 10000, diagnosticTests: 5000, otherCharges: 5000 },
    hospitalizationDays: 1
  },
  {
    id: "sc-endoscopy",
    name: "Endoscopy",
    category: "Day Care & OPD Procedures",
    description: "Diagnostic or therapeutic upper GI endoscopy.",
    estimatedCost: 20000,
    breakdown: { hospitalCharges: 5000, doctorFees: 8000, medicineCosts: 2000, diagnosticTests: 5000, otherCharges: 0 },
    hospitalizationDays: 1
  },
  {
    id: "sc-colonoscopy",
    name: "Colonoscopy",
    category: "Day Care & OPD Procedures",
    description: "Diagnostic or therapeutic lower GI endoscopy.",
    estimatedCost: 25000,
    breakdown: { hospitalCharges: 7000, doctorFees: 10000, medicineCosts: 3000, diagnosticTests: 5000, otherCharges: 0 },
    hospitalizationDays: 1
  },
  {
    id: "sc-chemo-day-care",
    name: "Chemotherapy day care",
    category: "Day Care & OPD Procedures",
    description: "Single cycle chemotherapy administration (Day Care).",
    estimatedCost: 40000,
    breakdown: { hospitalCharges: 10000, doctorFees: 5000, medicineCosts: 20000, diagnosticTests: 5000, otherCharges: 0 },
    hospitalizationDays: 1
  },
  {
    id: "sc-dialysis-session",
    name: "Dialysis sessions",
    category: "Day Care & OPD Procedures",
    description: "Routine hemodialysis treatment (Single session).",
    estimatedCost: 15000,
    breakdown: { hospitalCharges: 5000, doctorFees: 3000, medicineCosts: 4000, diagnosticTests: 2000, otherCharges: 1000 },
    hospitalizationDays: 1
  },
  {
    id: "sc-minor-fracture",
    name: "Minor fracture treatment",
    category: "Day Care & OPD Procedures",
    description: "Casting, splinting, and initial orthopedic care.",
    estimatedCost: 30000,
    breakdown: { hospitalCharges: 10000, doctorFees: 10000, medicineCosts: 5000, diagnosticTests: 5000, otherCharges: 0 },
    hospitalizationDays: 1
  }
];

export const HOSPITAL_TYPES = [
  { value: "government", label: "Government", multiplier: 0.4 },
  { value: "private", label: "Private (Standard)", multiplier: 1.0 },
  { value: "premium", label: "Premium (Corporate)", multiplier: 1.6 }
];

export const CITY_TIERS = [
  { value: "tier1", label: "Tier 1 (Metro)", multiplier: 1.3 },
  { value: "tier2", label: "Tier 2 (Large Cities)", multiplier: 1.0 },
  { value: "tier3", label: "Tier 3 (Smaller Towns)", multiplier: 0.8 }
];

export const PLANS = [
  { 
    id: "plan-a", 
    name: "Basic Shield", 
    sumInsured: 500000,
    roomRentLimit: 5000, 
    coPay: 20, 
    deductible: 10000,
    subLimits: {
      maternity: 50000,
      cataract: 25000,
      ayush: 10000
    }
  },
  { 
    id: "plan-b", 
    name: "Gold Care", 
    sumInsured: 1000000,
    roomRentLimit: 10000, 
    coPay: 10, 
    deductible: 0,
    subLimits: {
      maternity: 100000,
      cataract: 50000,
      ayush: 50000
    }
  },
  { 
    id: "plan-c", 
    name: "Platinum Elite", 
    sumInsured: 2500000,
    roomRentLimit: 999999, // No limit
    coPay: 0, 
    deductible: 0,
    subLimits: {
      maternity: 250000,
      cataract: 100000,
      ayush: 100000
    }
  }
];

export function estimateBill(
  scenarioId: string,
  hospitalType: string,
  cityTier: string,
  icuRequired: boolean,
  stayLength: number
) {
  const scenario = SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) return null;

  const hospMult = HOSPITAL_TYPES.find(h => h.value === hospitalType)?.multiplier || 1.0;
  const cityMult = CITY_TIERS.find(c => c.value === cityTier)?.multiplier || 1.0;
  const icuMult = icuRequired ? 1.5 : 1.0;
  
  // Base stay length comparison
  const stayFactor = stayLength / scenario.hospitalizationDays;
  
  // Predict total bill
  const totalMult = hospMult * cityMult * icuMult * stayFactor;
  
  const predictedBill = scenario.estimatedCost * totalMult;
  
  const breakdown = {
    hospitalCharges: scenario.breakdown.hospitalCharges * hospMult * cityMult * stayFactor * (icuRequired ? 1.4 : 1.0),
    doctorFees: scenario.breakdown.doctorFees * hospMult * cityMult,
    medicineCosts: scenario.breakdown.medicineCosts * hospMult * stayFactor,
    diagnosticTests: scenario.breakdown.diagnosticTests * hospMult * cityMult,
    otherCharges: scenario.breakdown.otherCharges * hospMult
  };

  return {
    total: Math.round(predictedBill),
    breakdown: {
      hospitalCharges: Math.round(breakdown.hospitalCharges),
      doctorFees: Math.round(breakdown.doctorFees),
      medicineCosts: Math.round(breakdown.medicineCosts),
      diagnosticTests: Math.round(breakdown.diagnosticTests),
      otherCharges: Math.round(breakdown.otherCharges)
    },
    originalScenario: scenario
  };
}
