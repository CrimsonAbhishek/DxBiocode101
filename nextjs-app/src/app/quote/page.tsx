import type { Metadata } from 'next';
import Link from 'next/link';
import FadeUp from '@/components/FadeUp';
import CtaBanner from '@/components/CtaBanner';
import QuotePageClient from './QuotePageClient';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description: 'Request a customized quote for DX 101 Immunofluorescence Quantitative Analyzer and test consumables. Get fast response within 1 business day.',
};

export default function QuotePage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link><span>/</span>Request Quote</div>
          <h1>Request a Quote</h1>
          <p>Fill out the form below with your requirements, and our team will get back to you with a customized quotation within 1 business day.</p>
        </div>
      </div>

      <section className="quote-section" id="quote">
        <div className="quote-mesh" />
        <div className="quote-inner">
          <QuotePageClient />
        </div>
      </section>

      <CtaBanner
        title="Questions Before Quoting?"
        desc="Our team is happy to walk you through the DX 101 features and help you choose the right panels for your facility."
        primaryText="📞 Talk to Us"
        primaryHref="/contact"
        secondaryText="🛒 Browse Products"
        secondaryHref="/products"
      />
    </>
  );
}
