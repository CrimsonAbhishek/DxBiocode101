import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Hr, Link } from '@react-email/components';
import type { ContactEmailData } from '../api/_lib/types';

export default function ContactInternalEmail(props: ContactEmailData) {
  const { name, phone, email, organization, enquiryType, message, submissionId } = props;

  return (
    <Html lang="en">
      <Head />
      <Body style={body}>
        <Container style={header}>
          <Text style={brand}>DX BIOCODE</Text>
          <Text style={headerSub}>Internal Notification — New Contact Enquiry</Text>
        </Container>

        <Container style={container}>
          <Section style={{ textAlign: 'center', paddingBottom: '8px' }}>
            <Text style={{ fontSize: '36px', margin: '0 0 8px' }}>📨</Text>
            <Heading style={h1}>New Contact Enquiry</Heading>
            {enquiryType && (
              <Text style={enquiryBadge}>{enquiryType}</Text>
            )}
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Sender Details</Heading>
            <table style={table}>
              <tbody>
                {row('Name', name)}
                {row('Phone', phone)}
                {row('Email', email)}
                {organization && row('Organization', organization)}
                {enquiryType && row('Enquiry Type', enquiryType)}
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Message</Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />
          <Text style={refText}>Submission ID: {submissionId}</Text>
        </Container>

        <Container style={footer}>
          <Text style={footerText}>DX BIOCODE Pvt. Ltd. · T. Nagar, Chennai, Tamil Nadu</Text>
          <Text style={footerText}>
            <Link href="mailto:info@dxbiocode.com" style={footerLink}>info@dxbiocode.com</Link>
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

const body: React.CSSProperties = { backgroundColor: '#f1f5f9', fontFamily: "'Inter', Arial, sans-serif", margin: 0, padding: '32px 0' };
const header: React.CSSProperties = { backgroundColor: '#0f172a', borderRadius: '12px 12px 0 0', padding: '28px 40px', maxWidth: '600px', margin: '0 auto' };
const brand: React.CSSProperties = { color: '#ffffff', fontSize: '22px', fontWeight: 800, margin: 0 };
const headerSub: React.CSSProperties = { color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '4px 0 0' };
const container: React.CSSProperties = { backgroundColor: '#ffffff', maxWidth: '600px', margin: '0 auto', padding: '32px 40px', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' };
const h1: React.CSSProperties = { fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' };
const enquiryBadge: React.CSSProperties = { display: 'inline-block', backgroundColor: '#eff6ff', color: '#3a7bd5', fontSize: '13px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px', margin: 0 };
const h2: React.CSSProperties = { fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' as const, letterSpacing: '0.8px', margin: '0 0 12px' };
const hr: React.CSSProperties = { borderColor: '#e5e7eb', margin: '24px 0' };
const table: React.CSSProperties = { borderCollapse: 'collapse', width: '100%' };
const td: React.CSSProperties = { padding: '10px 14px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f1f5f9' };
const tdLabel: React.CSSProperties = { ...td, fontWeight: 600, color: '#0f172a', width: '140px' };
const messageText: React.CSSProperties = { fontSize: '14px', color: '#374151', lineHeight: 1.7, backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', margin: 0, whiteSpace: 'pre-wrap' as const };
const refText: React.CSSProperties = { fontSize: '11px', color: '#9ca3af', textAlign: 'center' as const };
const footer: React.CSSProperties = { maxWidth: '600px', margin: '0 auto', backgroundColor: '#0f172a', borderRadius: '0 0 12px 12px', padding: '20px 40px', textAlign: 'center' as const };
const footerText: React.CSSProperties = { fontSize: '12px', color: 'rgba(255,255,255,0.55)', margin: '4px 0' };
const footerLink: React.CSSProperties = { color: 'rgba(255,255,255,0.7)', textDecoration: 'none' };
