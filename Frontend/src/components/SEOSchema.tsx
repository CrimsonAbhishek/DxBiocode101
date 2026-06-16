import React from 'react';

interface SchemaProps {
  type: 'WebSite' | 'Organization' | 'Product' | 'BreadcrumbList';
  data: any;
}

export const SEOSchema: React.FC<SchemaProps> = ({ type, data }) => {
  let schema = {};

  if (type === 'WebSite') {
    schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "DX BIOCODE",
      "url": "https://dxbiocode.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://dxbiocode.com/products?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
  } else if (type === 'Organization') {
    schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "DX BIOCODE",
      "url": "https://dxbiocode.com",
      "logo": "https://dxbiocode.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-XXXXXXXXXX",
        "contactType": "customer service"
      }
    };
  } else if (type === 'Product') {
    schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": data.name,
      "image": data.image || "https://dxbiocode.com/logo.png",
      "description": data.shortDescription,
      "brand": {
        "@type": "Brand",
        "name": "DX BIOCODE"
      },
      "category": data.category
    };
  } else if (type === 'BreadcrumbList') {
    schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": data.items.map((item: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
};
