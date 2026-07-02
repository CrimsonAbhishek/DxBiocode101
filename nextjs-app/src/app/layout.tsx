import type { Metadata } from 'next';
import './globals.css';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: { default: 'DX BIOCODE — India\'s First Handheld Multi-Parameter POCT Analyzer', template: '%s | DX BIOCODE' },
  description: 'DX BIOCODE Pvt. Ltd. — Pioneers of the DX 101 Immunofluorescence Quantitative Analyzer, India\'s first handheld multi-parameter Point-of-Care diagnostic device. CE & EU-IVD certified.',
  keywords: ['DX BIOCODE', 'DX 101', 'POCT', 'immunofluorescence', 'diagnostic analyzer', 'point of care', 'India', 'CE certified', 'medical diagnostics'],
  authors: [{ name: 'DX BIOCODE Pvt. Ltd.' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://dxbiocode.com',
    siteName: 'DX BIOCODE',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ScrollProgressBar />
        <TopBar />
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
