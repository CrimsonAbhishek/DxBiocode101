import React from 'react';

export const ProductImagePlaceholder: React.FC = () => {
  return (
    <div className="product-image-placeholder" style={{ 
      background: '#f1f5f9', 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      borderRadius: '16px',
      border: '2px dashed #cbd5e1',
      aspectRatio: '1/1',
      color: '#64748b'
    }}>
      <svg style={{ width: '64px', height: '64px', marginBottom: '16px', color: '#94a3b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Product Image</span>
      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Image Coming Soon</span>
    </div>
  );
};
