import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBanner from '@/components/CtaBanner';
import ServicePageClient from './ServicePageClient';

export const metadata: Metadata = {
  title: 'Service & Support',
  description: 'DX BIOCODE Service — Comprehensive support, training, and technical assistance for our diagnostic equipment. Rapid response, professional troubleshooting, personalized service.',
};

export default function ServicePage() {
  return (
    <>
      <div className="page-hero" id="service-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link><span>/</span>Service</div>
          <h1>Our Service</h1>
          <p>Comprehensive support, training, and technical assistance — because your success is our commitment.</p>
        </div>
      </div>

      <ServicePageClient />

      <CtaBanner
        title="Need Immediate Assistance?"
        desc="Our support team is ready to help. Reach out to us via phone, email, or our contact form."
        primaryText="📞 Contact Support"
        primaryHref="/contact"
        secondaryText="🛒 Browse Products"
        secondaryHref="/products"
      />
    </>
  );
}
