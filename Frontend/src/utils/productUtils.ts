import { products, type Product } from '../data/products';

export interface CategoryInfo {
  name: string;
  count: number;
}

// Get all unique categories for test kits with their counts
export const getTestKitCategories = (): CategoryInfo[] => {
  const testKits = products.filter(p => p.type === 'test-kit');
  
  const categoryMap = new Map<string, number>();
  
  testKits.forEach(kit => {
    const count = categoryMap.get(kit.category) || 0;
    categoryMap.set(kit.category, count + 1);
  });
  
  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => a.name.localeCompare(b.name));
};

// Get all products matching a specific category
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
};

// Get a product by its ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

// Get a product by its slug
export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

// Get related kits (same category, excluding current)
export const getRelatedKits = (category: string, currentId: string, limit: number = 4): Product[] => {
  return products
    .filter(p => p.type === 'test-kit' && p.category === category && p.id !== currentId)
    .slice(0, limit);
};

// Global search across all products
export const searchProducts = (query: string): Product[] => {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  
  return products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.shortDescription.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
};
