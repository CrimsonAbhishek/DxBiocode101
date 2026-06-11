import Link from 'next/link';

interface CtaBannerProps {
  title: string;
  desc: string;
  primaryText: string;
  primaryHref: string;
  secondaryText?: string;
  secondaryHref?: string;
}

export default function CtaBanner({ title, desc, primaryText, primaryHref, secondaryText, secondaryHref }: CtaBannerProps) {
  return (
    <div className="cta-banner">
      <div className="cta-inner">
        <h2>{title}</h2>
        <p>{desc}</p>
        <div className="cta-actions">
          <Link href={primaryHref} className="btn-white">{primaryText}</Link>
          {secondaryText && secondaryHref && (
            <Link href={secondaryHref} className="btn-outline-white">{secondaryText}</Link>
          )}
        </div>
      </div>
    </div>
  );
}
