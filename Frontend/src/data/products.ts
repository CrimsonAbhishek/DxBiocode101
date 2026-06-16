import productsData from './products.json';

export type ProductType = 'analyzer' | 'test-kit' | 'accessory';

export interface Product {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  category: string;
  shortDescription: string;
  image: string;
  
  // Specific to Test Kits
  intendedUse?: string;
  specifications?: Record<string, string>;
  applicableDevice?: string[]; // Array of compatible parent product IDs
  tags?: string[];
  
  // Specific to Analyzers
  features?: string[];
  
  // Universal SEO & State
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  status: 'available' | 'coming-soon';
}

export const products: Product[] = productsData.products as Product[];
