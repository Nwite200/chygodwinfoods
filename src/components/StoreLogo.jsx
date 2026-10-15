import React from 'react';

export default function StoreLogo({ size = 44, rounded = true, alt = 'Chygodwin Foodstuffs Global Concept logo' }) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      style={{
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: rounded ? '50%' : 10,
        border: '2px solid rgba(34,197,94,0.35)',
        background: '#062E1D',
        flexShrink: 0,
        display: 'block'
      }}
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
  );
}
