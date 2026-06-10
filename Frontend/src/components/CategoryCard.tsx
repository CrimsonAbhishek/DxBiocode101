import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { TiltCard } from './TiltCard';

interface CategoryCardProps {
  name: string;
  count: number;
  icon?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, count, icon }) => {
  const slug = name.toLowerCase().replace(/ /g, '-');
  
  // Assign icons based on category name
  let defaultIcon = '🔬';
  if (name.includes('Cardiac')) defaultIcon = '❤️';
  if (name.includes('Thyroid')) defaultIcon = '🩺';
  if (name.includes('Diabetes')) defaultIcon = '🩸';
  if (name.includes('Infectious')) defaultIcon = '🦠';
  if (name.includes('Inflammation')) defaultIcon = '🔥';
  if (name.includes('Fertility')) defaultIcon = '🌸';
  
  return (
    <Link to={`/products/test-kits/${slug}`} className="category-card-link">
      <TiltCard className="category-card">
        <div className="cat-card-header">
          <span className="cat-card-icon">{icon || defaultIcon}</span>
          <span className="cat-card-badge">{count} {count === 1 ? 'Parameter' : 'Parameters'}</span>
        </div>
        <h3 className="cat-card-title">{name}</h3>
        <div className="cat-card-footer">
          <span className="view-kits-text">View Kits</span>
          <ChevronRight size={16} />
        </div>
      </TiltCard>
    </Link>
  );
};
