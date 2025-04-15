import { MedicalTerm } from "./schema";

// Define a comprehensive dictionary of medical terms
export const medicalDictionary: Record<string, MedicalTerm> = {
  "cholesterol": {
    term: "cholesterol",
    simplified: "fat-like substance in blood",
    definition: "A waxy, fat-like substance found in all cells of the body. Your body needs some cholesterol to make hormones, vitamin D, and substances that help you digest foods. High cholesterol can lead to heart disease."
  },
  "elevated cholesterol levels": {
    term: "elevated cholesterol levels",
    simplified: "high cholesterol",
    definition: "When the amount of cholesterol in your blood is higher than recommended, increasing the risk of heart disease and stroke."
  },
  "LDL": {
    term: "LDL (Low-Density Lipoprotein)",
    simplified: "\"Bad\" cholesterol (LDL)",
    definition: "Often called \"bad\" cholesterol, LDL can build up in your arteries and form plaque that makes them narrower. Higher levels mean higher risk of heart disease.",
    normalRange: "< 100 mg/dL (optimal)"
  },
  "HDL": {
    term: "HDL (High-Density Lipoprotein)",
    simplified: "\"Good\" cholesterol (HDL)",
    definition: "Known as \"good\" cholesterol, HDL helps remove other forms of cholesterol from your bloodstream. Higher levels are better and may lower your risk of heart disease.",
    normalRange: "> 40 mg/dL for men, > 50 mg/dL for women"
  },
  "triglycerides": {
    term: "Triglycerides",
    simplified: "Blood fats (Triglycerides)",
    definition: "A type of fat found in your blood. When you eat, your body converts calories it doesn't need into triglycerides, which are stored in fat cells. High levels may contribute to hardening of the arteries and increased risk of heart disease.",
    normalRange: "< 150 mg/dL"
  },
  "atherosclerotic cardiovascular disease": {
    term: "atherosclerotic cardiovascular disease",
    simplified: "heart disease caused by plaque buildup in arteries",
    definition: "A condition where plaque builds up inside the arteries. Plaque is made up of fat, cholesterol, calcium, and other substances. Over time, plaque hardens and narrows the arteries, limiting blood flow to organs and other parts of the body."
  },
  "statin therapy": {
    term: "statin therapy",
    simplified: "cholesterol-lowering medication",
    definition: "Medications that help lower cholesterol levels in the blood by reducing the amount of cholesterol produced by the liver."
  },
  "lifestyle modifications": {
    term: "lifestyle modifications",
    simplified: "changes to daily habits",
    definition: "Changes to diet, exercise, and other daily habits to improve health outcomes."
  },
  "hypertension": {
    term: "hypertension",
    simplified: "high blood pressure",
    definition: "A condition in which the force of the blood against the artery walls is too high. Normal blood pressure is below 120/80 mm Hg."
  },
  "glucose": {
    term: "glucose",
    simplified: "blood sugar",
    definition: "A simple sugar that is an important energy source in living organisms and is a component of many carbohydrates."
  },
  "HbA1c": {
    term: "HbA1c",
    simplified: "average blood sugar level",
    definition: "A test that measures your average blood sugar levels over the past 2-3 months. It's used to diagnose diabetes and monitor how well diabetes is being controlled.",
    normalRange: "< 5.7% (normal), 5.7-6.4% (prediabetes), ≥ 6.5% (diabetes)"
  },
  "creatinine": {
    term: "creatinine",
    simplified: "kidney function indicator",
    definition: "A waste product produced by muscles from the breakdown of a compound called creatine. Creatinine levels in the blood are used to calculate how well your kidneys are working.",
    normalRange: "0.7-1.3 mg/dL (men), 0.6-1.1 mg/dL (women)"
  },
  "thyroid-stimulating hormone": {
    term: "thyroid-stimulating hormone",
    simplified: "hormone that controls thyroid function",
    definition: "A hormone produced by the pituitary gland that regulates the production of hormones by the thyroid gland.",
    normalRange: "0.4-4.0 mIU/L"
  },
  "anemia": {
    term: "anemia",
    simplified: "low red blood cell count",
    definition: "A condition in which you lack enough healthy red blood cells to carry adequate oxygen to your body's tissues."
  },
  "hemoglobin": {
    term: "hemoglobin",
    simplified: "oxygen-carrying protein in blood",
    definition: "A protein in your red blood cells that carries oxygen from your lungs to the rest of your body.",
    normalRange: "13.5-17.5 g/dL (men), 12.0-15.5 g/dL (women)"
  },
  "platelet count": {
    term: "platelet count",
    simplified: "blood clotting cells count",
    definition: "A measure of how many platelets are in your blood. Platelets are parts of the blood that help with clotting.",
    normalRange: "150,000-450,000 per microliter of blood"
  }
};

// Function to identify medical terms in text
export function identifyMedicalTerms(text: string): MedicalTerm[] {
  if (!text) return [];
  
  const terms: MedicalTerm[] = [];
  const lowercaseText = text.toLowerCase();
  
  // Check for each term in the dictionary
  Object.keys(medicalDictionary).forEach(key => {
    if (lowercaseText.includes(key.toLowerCase())) {
      terms.push({...medicalDictionary[key]});
    }
  });
  
  return terms;
}

// Function to simplify medical report text
export function simplifyText(text: string, terms: MedicalTerm[]): string {
  if (!text || terms.length === 0) return text;
  
  let simplifiedText = text;
  
  // Sort terms by length (longest first) to avoid partial replacements
  const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
  
  // Replace each identified term with its simplified version
  sortedTerms.forEach(term => {
    const regex = new RegExp(`\\b${term.term}\\b`, 'gi');
    simplifiedText = simplifiedText.replace(regex, term.simplified);
  });
  
  return simplifiedText;
}

// Function to extract value and status for a medical term
export function extractValueAndStatus(text: string, term: MedicalTerm): MedicalTerm {
  const updatedTerm = {...term};
  
  // Look for patterns like "LDL: 142 mg/dL (high)"
  const regex = new RegExp(`${term.term}[:\\s]+(\\d+(?:\\.\\d+)?)\\s*(?:mg\\/dL|mmol\\/L|g\\/dL)?\\s*(?:\\(([^)]+)\\))?`, 'i');
  const match = text.match(regex);
  
  if (match) {
    updatedTerm.value = match[1];
    
    if (match[2]) {
      const statusText = match[2].toLowerCase();
      if (statusText.includes('high')) {
        updatedTerm.status = statusText.includes('borderline') ? 'borderline-high' : 'high';
      } else if (statusText.includes('low')) {
        updatedTerm.status = statusText.includes('borderline') ? 'borderline-low' : 'low';
      } else if (statusText.includes('normal')) {
        updatedTerm.status = 'normal';
      } else {
        updatedTerm.status = 'abnormal';
      }
    }
  }
  
  return updatedTerm;
}

// Process a medical report to identify terms and generate simplifications
export function processMedicalReport(text: string): {
  identifiedTerms: MedicalTerm[],
  simplifiedText: string
} {
  // Identify medical terms in the text
  let terms = identifyMedicalTerms(text);
  
  // Extract values and status for each term
  terms = terms.map(term => extractValueAndStatus(text, term));
  
  // Simplify the text
  const simplifiedText = simplifyText(text, terms);
  
  return {
    identifiedTerms: terms,
    simplifiedText
  };
}
