import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      <div className="breadcrumbs-container">
        <Link to="/" className="breadcrumb-link" title="Home">
          <Home size={16} />
        </Link>
        
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          // Format name
          let formattedName = name.replace(/-/g, ' ');
          formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
          
          // Special cases
          if (name === 'dx-101') formattedName = 'DX 101 Analyzer';
          if (name === 'test-kits') formattedName = 'Test Kits';
          
          return (
            <React.Fragment key={name}>
              <ChevronRight size={14} className="breadcrumb-separator" />
              {isLast ? (
                <span className="breadcrumb-current" aria-current="page">
                  {formattedName}
                </span>
              ) : (
                <Link to={routeTo} className="breadcrumb-link">
                  {formattedName}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
