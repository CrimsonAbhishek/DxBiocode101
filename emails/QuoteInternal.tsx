import * as React from 'react';
import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Row, Column, Link,
} from '@react-email/components';
import type { QuoteEmailData } from '../api/_lib/types';

export default function QuoteInternalEmail(props: QuoteEmailData) {
  const { name, phone, email, organization, designation, facilityType, timeline, message, items, quoteId } = props;

  return (
    <Html lang="en">
      <Head />
      <Body style={body}>
        {/* Header */}
        <Container style={header}>
          <Text style={brand}>DX BIOCODE</Text>
          <Text style={headerSub}>Internal Notification — New Quote Request</Text>
        </Container>

        <Container style={container}>
          {/* Title row */}
          <Section style={titleSection}>
            <Text style={icon}>🔬</Text>
            <Heading style={h1}>New Quote Request</Heading>
            <Text style={subtitle}>{organization}{facilityType ? ` · ${facilityType}` : ''}</Text>
          </Section>

          <Hr style={hr} />

          {/* Lead details */}
          <Section>
            <Heading style={h2}>Lead Details</Heading>
            <table style={table}>
              <tbody>
                {row('Name', name)}
                {row('Phone', phone)}
                {row('Email', email)}
                {row('Organization', organization)}
                {designation && row('Designation', designation)}
                {facilityType && row('Facility Type', facilityType)}
                {timeline && row('Timeline', timeline)}
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Products */}
          <Section>
            <Heading style={h2}>Products Requested ({items.length})</Heading>
            <table style={{ ...table, width: '100%' }}>
              <thead>
                <tr>
                  <th style={th}>Product</th>
                  <th style={{ ...th, width: '80px', textAlign: 'center' }}>Qty</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} style={i % 2 === 0 ? {} : { backgroundColor: '#f8fafc' }}>
                    <td style={td}>{item.product_name}</td>
                    <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {message && (
            <>
              <Hr style={hr} />
              <Section>
                <Heading style={h2}>Message</Heading>
                <Text style={messageText}>{message}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />
          <Text style={refText}>Reference ID: {quoteId}</Text>
        </Container>

        {/* Footer */}
        <Container style={footer}>
          <Text style={footerText}>DX BIOCODE Pvt. Ltd. · T. Nagar, Chennai, Tamil Nadu</Text>
          <Text style={footerText}>
            <Link href="mailto:info@dxbiocode.com" style={footerLink}>info@dxbiocode.com</Link>
            {' · '}
            <Link href="tel:+918080885059" style={footerLink}>+91 8080885059</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function row(label: string, value: string) {
  return (
    <tr>
      <td style={tdLabel}>{label}</td>
      <td style={td}>{value}</td>
    </tr>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const body: React.CSSProperties = { backgroundColor: '#f1f5f9', fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", margin: 0, padding: '32px 0' };
const header: React.CSSProperties = { backgroundColor: '#0f172a', borderRadius: '12px 12px 0 0', padding: '28px 40px', maxWidth: '600px', margin: '0 auto' };
const brand: React.CSSProperties = { color: '#ffffff', fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' };
const headerSub: React.CSSProperties = { color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '4px 0 0' };
const container: React.CSSProperties = { backgroundColor: '#ffffff', maxWidth: '600px', margin: '0 auto', padding: '32px 40px', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' };
const titleSection: React.CSSProperties = { textAlign: 'center', paddingBottom: '8px' };
const icon: React.CSSProperties = { fontSize: '36px', margin: '0 0 8px' };
const h1: React.CSSProperties = { fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.5px' };
const subtitle: React.CSSProperties = { fontSize: '15px', color: '#6b7280', margin: 0 };
const h2: React.CSSProperties = { fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' as const, letterSpacing: '0.8px', margin: '0 0 12px' };
const hr: React.CSSProperties = { borderColor: '#e5e7eb', margin: '24px 0' };
const table: React.CSSProperties = { borderCollapse: 'collapse', width: '100%' };
const th: React.CSSProperties = { backgroundColor: '#f8fafc', padding: '10px 14px', textAlign: 'left' as const, fontSize: '12px', fontWeight: 700, color: '#374151', borderBottom: '1px solid #e5e7eb' };
const td: React.CSSProperties = { padding: '10px 14px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f1f5f9' };
const tdLabel: React.CSSProperties = { ...td, fontWeight: 600, color: '#0f172a', width: '140px', whiteSpace: 'nowrap' as const };
const messageText: React.CSSProperties = { fontSize: '14px', color: '#374151', lineHeight: 1.7, backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', margin: 0 };
const refText: React.CSSProperties = { fontSize: '11px', color: '#9ca3af', textAlign: 'center' as const };
const footer: React.CSSProperties = { maxWidth: '600px', margin: '0 auto', backgroundColor: '#0f172a', borderRadius: '0 0 12px 12px', padding: '20px 40px', textAlign: 'center' as const };
const footerText: React.CSSProperties = { fontSize: '12px', color: 'rgba(255,255,255,0.55)', margin: '4px 0' };
const footerLink: React.CSSProperties = { color: 'rgba(255,255,255,0.7)', textDecoration: 'none' };
