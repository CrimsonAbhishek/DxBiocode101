import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import FadeUp from '@/components/FadeUp';
import TiltCard from '@/components/TiltCard';
import CtaBanner from '@/components/CtaBanner';
import CertificationsSection from '@/components/CertificationsSection';
import ProductsPageClient from './ProductsPageClient';

export const metadata: Metadata = {
  title: 'Products — DX 101 Immunofluorescence Analyzer',
  description: 'Explore the DX 101 Immunofluorescence Quantitative Analyzer — India\'s first handheld POCT device. View specifications, test menu, and CE/IVD certifications.',
};

const TEST_CATEGORIES = [
  {
    icon: '❤️',
    title: 'Cardiac Markers',
    tests: ['cTnI (Troponin I)', 'CK-MB', 'Myoglobin', 'BNP / NT-proBNP', 'D-Dimer', 'hs-CRP'],
  },
  {
    icon: '🦋',
    title: 'Thyroid Function',
    tests: ['TSH', 'Free T3 (fT3)', 'Free T4 (fT4)', 'Total T3', 'Total T4', 'Anti-TPO'],
  },
  {
    icon: '🦠',
    title: 'Infectious Disease',
    tests: ['PCT (Procalcitonin)', 'CRP', 'SAA', 'IL-6', 'COVID-19 Ag', 'Influenza A/B'],
  },
  {
    icon: '🧬',
    title: 'Fertility & Hormones',
    tests: ['FSH', 'LH', 'Prolactin', 'Progesterone', 'Estradiol (E2)', 'Beta-HCG'],
  },
  {
    icon: '🎯',
    title: 'Tumor Markers',
    tests: ['PSA', 'AFP', 'CEA', 'CA 125', 'CA 19-9', 'CA 15-3'],
  },
  {
    icon: '⚕️',
    title: 'Critical Care',
    tests: ['Lactate', 'Cortisol', 'NGAL', 'Cystatin C', 'Ferritin', 'Transferrin'],
  },
  {
    icon: '🌿',
    title: 'Metabolic',
    tests: ['HbA1c', 'Insulin', 'C-Peptide', 'Adiponectin', 'Leptin'],
  },
  {
    icon: '🩸',
    title: 'Coagulation',
    tests: ['D-Dimer', 'Fibrinogen', 'PT/INR', 'APTT'],
  },
  {
    icon: '💊',
    title: 'Drug Monitoring',
    tests: ['Tacrolimus', 'Cyclosporin', 'Vancomycin', 'Digoxin'],
  },
  {
    icon: '🧠',
    title: 'Neurology',
    tests: ['NSE', 'S100B', 'GFAP', 'NfL (Neurofilament Light)'],
  },
];

const SPEC_HIGHLIGHTS = [
  { val: '8', unit: 'min', label: 'Result Time' },
  { val: '5', unit: 'µL', label: 'Sample Volume' },
  { val: '200', unit: 'g', label: 'Device Weight' },
  { val: '99', unit: '%', label: 'Accuracy' },
];

export default function ProductsPage() {
  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link><span>/</span>Products</div>
          <h1>Our Products</h1>
          <p>India&apos;s first handheld multi-parameter POCT analyzer — precision diagnostics, everywhere.</p>
        </div>
      </div>

      {/* Tab-based content */}
      <ProductsPageClient
        testCategories={TEST_CATEGORIES}
        specHighlights={SPEC_HIGHLIGHTS}
      />

      {/* CTA */}
      <CtaBanner
        title="Ready to Add DX 101 to Your Facility?"
        desc="Request a demo or customized quote for the DX 101 Analyzer. Our team responds within 1 business day."
        primaryText="📋 Request a Quote"
        primaryHref="/quote"
        secondaryText="📞 Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
