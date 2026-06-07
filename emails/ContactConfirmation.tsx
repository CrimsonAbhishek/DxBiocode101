import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Hr, Link } from '@react-email/components';
import type { ContactEmailData } from '../api/_lib/types';

export default function ContactConfirmationEmail({ name, enquiryType, submissionId }: ContactEmailData) {
  return (
    <Html lang="en">
      <Head />
      <Body style={body}>
        <Container style={header}>
          <Text style={brand}>DX BIOCODE</Text>
          <Text style={headerSub}>Message Confirmation</Text>
        </Container>

        <Container style={container}>
          <Section style={{ textAlign: 'center', paddingBottom: '8px' }}>
            <Text style={{ fontSize: '48px', margin: '0 0 8px' }}>✅</Text>
            <Heading style={h1}>Message Received!</Heading>
            <Text style={intro}>
              Thank you, <strong>{name}</strong>. We've received your{enquiryType ? ` "${enquiryType}"` : ''} enquiry
              and our team will respond shortly.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={infoBox}>
            <Text style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
              ⏱ Expected Response Time
            </Text>
            <Text style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.6 }}>
              Our team typically responds within <strong>1 business day</strong>. For urgent matters,
              call us directly at{' '}
              <Link href="tel:+918080885059" style={link}>+91 8080885059</Link>.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px' }}>You can also reach us at</Text>
            <Link href="mailto:info@dxbiocode.com" style={ctaLink}>✉️ info@dxbiocode.com</Link>
          </Section>

          <Hr style={hr} />
          <Text style={refText}>Reference ID: {submissionId}</Text>
        </Container>

        <Container style={footer}>
          <Text style={footerText}>DX BIOCODE Pvt. Ltd. · 27(38), Madley Road, T. Nagar, Chennai 600017</Text>
          <Text style={footerText}>CE Certified · EU-IVD Compliant</Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = { backgroundColor: '#f1f5f9', fontFamily: "'Inter', Arial, sans-serif", margin: 0, padding: '32px 0' };
const header: React.CSSProperties = { backgroundColor: '#0f172a', borderRadius: '12px 12px 0 0', padding: '28px 40px', maxWidth: '600px', margin: '0 auto' };
const brand: React.CSSProperties = { color: '#ffffff', fontSize: '22px', fontWeight: 800, margin: 0 };
const headerSub: React.CSSProperties = { color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '4px 0 0' };
const container: React.CSSProperties = { backgroundColor: '#ffffff', maxWidth: '600px', margin: '0 auto', padding: '32px 40px', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' };
const h1: React.CSSProperties = { fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' };
const intro: React.CSSProperties = { fontSize: '15px', color: '#374151', lineHeight: 1.7, margin: 0 };
const hr: React.CSSProperties = { borderColor: '#e5e7eb', margin: '24px 0' };
const infoBox: React.CSSProperties = { backgroundColor: '#eff6ff', padding: '20px 24px', borderRadius: '8px', borderLeft: '3px solid #3a7bd5' };
const link: React.CSSProperties = { color: '#3a7bd5', textDecoration: 'none', fontWeight: 600 };
const ctaLink: React.CSSProperties = { fontSize: '15px', color: '#3a7bd5', textDecoration: 'none', fontWeight: 700 };
const refText: React.CSSProperties = { fontSize: '11px', color: '#9ca3af', textAlign: 'center' as const };
const footer: React.CSSProperties = { maxWidth: '600px', margin: '0 auto', backgroundColor: '#0f172a', borderRadius: '0 0 12px 12px', padding: '20px 40px', textAlign: 'center' as const };
const footerText: React.CSSProperties = { fontSize: '12px', color: 'rgba(255,255,255,0.55)', margin: '4px 0' };
