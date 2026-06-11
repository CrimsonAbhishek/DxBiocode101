import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Hr, Link } from '@react-email/components';
import type { TrainingEmailData } from '../api/_lib/types';

export default function TrainingConfirmationEmail({ name, organization, trainingCategory, bookingId }: TrainingEmailData) {
  return (
    <Html lang="en">
      <Head />
      <Body style={body}>
        <Container style={header}>
          <Text style={brand}>DX BIOCODE</Text>
          <Text style={headerSub}>Training Request Confirmation</Text>
        </Container>

        <Container style={container}>
          <Section style={{ textAlign: 'center', paddingBottom: '8px' }}>
            <Text style={{ fontSize: '48px', margin: '0 0 8px' }}>🎓</Text>
            <Heading style={h1}>Training Request Received!</Heading>
            <Text style={intro}>
              Thank you, <strong>{name}</strong> from <strong>{organization}</strong>. We've received your request
              {trainingCategory ? ` for <strong>${trainingCategory}</strong> training` : ' for a training session'} and
              our team will reach out to schedule it.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={infoBox}>
            <Text style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
              ⏱ What Happens Next
            </Text>
            <Text style={timelineItem}>1. Our training coordinator will review your request</Text>
            <Text style={timelineItem}>2. We'll contact you within <strong>24–48 hours</strong> to confirm availability</Text>
            <Text style={timelineItem}>3. A customized training session will be scheduled at your convenience</Text>
          </Section>

          <Hr style={hr} />

          <Section style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px' }}>
              For urgent scheduling, contact us directly:
            </Text>
            <Link href="mailto:info@dxbiocode.com" style={ctaLink}>✉️ info@dxbiocode.com</Link>
            {'   '}
            <Link href="tel:+918080885059" style={ctaLink}>📞 +91 8080885059</Link>
          </Section>

          <Hr style={hr} />
          <Text style={refText}>Booking ID: {bookingId}</Text>
        </Container>

        <Container style={footer}>
          <Text style={footerText}>DX BIOCODE Pvt. Ltd. · 27(38), Madley Road, T. Nagar, Chennai 600017</Text>
          <Text style={footerText}>CE Certified · EU-IVD Compliant · India's First Handheld Multi-Parameter POCT</Text>
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
const infoBox: React.CSSProperties = { backgroundColor: '#fffbeb', padding: '20px 24px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' };
const timelineItem: React.CSSProperties = { fontSize: '13px', color: '#374151', margin: '6px 0', lineHeight: 1.6 };
const ctaLink: React.CSSProperties = { fontSize: '14px', color: '#3a7bd5', textDecoration: 'none', fontWeight: 700 };
const refText: React.CSSProperties = { fontSize: '11px', color: '#9ca3af', textAlign: 'center' as const };
const footer: React.CSSProperties = { maxWidth: '600px', margin: '0 auto', backgroundColor: '#0f172a', borderRadius: '0 0 12px 12px', padding: '20px 40px', textAlign: 'center' as const };
const footerText: React.CSSProperties = { fontSize: '12px', color: 'rgba(255,255,255,0.55)', margin: '4px 0' };
