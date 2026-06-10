export type ProductType = 'analyzer' | 'test-kit' | 'accessory';

export interface Product {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  category: string;
  shortDescription: string;
  image: string;
  
  // Specific to Test Kits
  intendedUse?: string;
  specifications?: Record<string, string>;
  applicableDevice?: string[]; // Array of compatible parent product IDs
  
  // Specific to Analyzers
  features?: string[];
  
  // Universal SEO & State
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  status: 'available' | 'coming-soon';
}

export const products: Product[] = [
  {
    id: 'dx-101',
    slug: 'dx-101',
    name: 'DX 101 Immunofluorescence Quantitative Analyzer',
    type: 'analyzer',
    category: 'Analyzers',
    shortDescription: 'India\'s first portable and handheld multi-parameter POCT device. Compact, user-friendly, and built for rapid quantitative results.',
    image: '/hero.webp',
    features: [
      '🏥 Point-of-Care Ready',
      '⚡ Results in 3–15 min',
      '📱 Android OS',
      '☁️ Lims Connectivity HL7 interface',
      '🔋 Long Battery Life',
      '💾 50,000 Results Storage'
    ],
    seoTitle: 'DX 101 Immunofluorescence Analyzer | DX BIOCODE',
    seoDescription: 'Portable point-of-care quantitative diagnostic analyzer for rapid results.',
    featured: true,
    status: 'available'
  },
  // Cardiac Markers
  {
    id: 'hs-ctni',
    slug: 'hs-ctni',
    name: 'hs-cTnI (High-Sensitivity Troponin I)',
    type: 'test-kit',
    category: 'Cardiac Markers',
    shortDescription: 'Quantitative determination of High-Sensitivity Troponin I in human serum, plasma, or whole blood.',
    image: '/test_kit_placeholder.png',
    intendedUse: 'This kit is used for the in vitro quantitative determination of High-Sensitivity Troponin I (hs-cTnI) in human serum, plasma or whole blood. It is mainly used for the clinical auxiliary diagnosis of myocardial injury.',
    specifications: {
      'Sample Type': 'Serum/Plasma/Whole Blood',
      'Sample Volume': '100 μL',
      'Reaction Time': '15 min',
      'Measuring Range': '0.01 - 50.00 ng/mL',
      'Storage Temperature': '4-30°C',
      'Shelf Life': '24 Months'
    },
    applicableDevice: ['dx-101'],
    seoTitle: 'hs-cTnI Test Kit | DX BIOCODE',
    seoDescription: 'High-Sensitivity Troponin I rapid test kit for the DX 101 Analyzer.',
    featured: true,
    status: 'available'
  },
  {
    id: 'ck-mb',
    slug: 'ck-mb',
    name: 'CK-MB',
    type: 'test-kit',
    category: 'Cardiac Markers',
    shortDescription: 'Quantitative determination of Creatine Kinase Isoenzyme MB.',
    image: '/test_kit_placeholder.png',
    intendedUse: 'For in vitro quantitative determination of CK-MB in human serum, plasma or whole blood.',
    specifications: {
      'Sample Type': 'Serum/Plasma/Whole Blood',
      'Reaction Time': '15 min',
      'Storage Temperature': '4-30°C'
    },
    applicableDevice: ['dx-101'],
    seoTitle: 'CK-MB Test Kit | DX BIOCODE',
    seoDescription: 'CK-MB rapid test kit for the DX 101 Analyzer.',
    featured: false,
    status: 'available'
  },
  // Thyroid Function
  {
    id: 'tsh',
    slug: 'tsh',
    name: 'TSH (Thyroid Stimulating Hormone)',
    type: 'test-kit',
    category: 'Thyroid Function',
    shortDescription: 'Quantitative determination of TSH for thyroid function assessment.',
    image: '/test_kit_placeholder.png',
    intendedUse: 'For in vitro quantitative determination of TSH in human serum or plasma.',
    specifications: {
      'Sample Type': 'Serum/Plasma',
      'Reaction Time': '15 min',
      'Storage Temperature': '4-30°C'
    },
    applicableDevice: ['dx-101'],
    seoTitle: 'TSH Test Kit | DX BIOCODE',
    seoDescription: 'TSH rapid test kit for the DX 101 Analyzer.',
    featured: true,
    status: 'available'
  },
  {
    id: 't3-t4',
    slug: 't3-t4',
    name: 'T3 / T4',
    type: 'test-kit',
    category: 'Thyroid Function',
    shortDescription: 'Quantitative determination of Triiodothyronine (T3) and Thyroxine (T4).',
    image: '/test_kit_placeholder.png',
    intendedUse: 'For in vitro quantitative determination of T3 and T4 in human serum or plasma.',
    specifications: {
      'Sample Type': 'Serum/Plasma',
      'Reaction Time': '15 min',
      'Storage Temperature': '4-30°C'
    },
    applicableDevice: ['dx-101'],
    seoTitle: 'T3/T4 Test Kit | DX BIOCODE',
    seoDescription: 'T3/T4 rapid test kit for the DX 101 Analyzer.',
    featured: false,
    status: 'available'
  },
  // Diabetes
  {
    id: 'hba1c',
    slug: 'hba1c',
    name: 'HbA1c',
    type: 'test-kit',
    category: 'Diabetes',
    shortDescription: 'Quantitative determination of Glycated Hemoglobin for diabetes monitoring.',
    image: '/test_kit_placeholder.png',
    intendedUse: 'For in vitro quantitative determination of HbA1c in human whole blood.',
    specifications: {
      'Sample Type': 'Whole Blood',
      'Reaction Time': '5 min',
      'Measuring Range': '3.0% - 15.0%',
      'Storage Temperature': '4-30°C'
    },
    applicableDevice: ['dx-101'],
    seoTitle: 'HbA1c Test Kit | DX BIOCODE',
    seoDescription: 'HbA1c rapid test kit for the DX 101 Analyzer.',
    featured: true,
    status: 'available'
  },
  // Infectious Diseases
  {
    id: 'dengue-ns1',
    slug: 'dengue-ns1',
    name: 'Dengue NS1/IgG/IgM',
    type: 'test-kit',
    category: 'Infectious Diseases',
    shortDescription: 'Rapid detection of Dengue virus antigens and antibodies.',
    image: '/test_kit_placeholder.png',
    intendedUse: 'For in vitro quantitative/qualitative detection of Dengue NS1 antigen and IgG/IgM antibodies.',
    specifications: {
      'Sample Type': 'Serum/Plasma/Whole Blood',
      'Reaction Time': '15 min',
      'Storage Temperature': '4-30°C'
    },
    applicableDevice: ['dx-101'],
    seoTitle: 'Dengue Test Kit | DX BIOCODE',
    seoDescription: 'Dengue rapid test kit for the DX 101 Analyzer.',
    featured: true,
    status: 'available'
  },
  // Inflammation
  {
    id: 'crp',
    slug: 'crp',
    name: 'CRP / hs-CRP',
    type: 'test-kit',
    category: 'Inflammation',
    shortDescription: 'Quantitative determination of C-Reactive Protein.',
    image: '/test_kit_placeholder.png',
    intendedUse: 'For in vitro quantitative determination of CRP and hs-CRP in human serum, plasma or whole blood.',
    specifications: {
      'Sample Type': 'Serum/Plasma/Whole Blood',
      'Reaction Time': '5 min',
      'Storage Temperature': '4-30°C'
    },
    applicableDevice: ['dx-101'],
    seoTitle: 'CRP Test Kit | DX BIOCODE',
    seoDescription: 'CRP rapid test kit for the DX 101 Analyzer.',
    featured: false,
    status: 'available'
  },
  // Fertility
  {
    id: 'hcg',
    slug: 'hcg',
    name: 'HCG+β / LH / FSH',
    type: 'test-kit',
    category: 'Fertility',
    shortDescription: 'Quantitative determination of fertility hormones.',
    image: '/test_kit_placeholder.png',
    intendedUse: 'For in vitro quantitative determination of fertility hormones in human serum or plasma.',
    specifications: {
      'Sample Type': 'Serum/Plasma',
      'Reaction Time': '15 min',
      'Storage Temperature': '4-30°C'
    },
    applicableDevice: ['dx-101'],
    seoTitle: 'HCG Test Kit | DX BIOCODE',
    seoDescription: 'HCG rapid test kit for the DX 101 Analyzer.',
    featured: false,
    status: 'available'
  }
];
