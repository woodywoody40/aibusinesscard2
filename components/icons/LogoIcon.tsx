import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    {...props}
  >
    <defs>
      <linearGradient id="logo-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#AAB8AB' }} />
        <stop offset="100%" style={{ stopColor: '#B7B7BD' }} />
      </linearGradient>
      <linearGradient id="logo-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#D4B8B4' }} />
        <stop offset="100%" style={{ stopColor: '#ADAAA5' }} />
      </linearGradient>
    </defs>
    
    {/* Use CSS classes to switch between gradients */}
    <style>
      {`
        .logo-fill { fill: url(#logo-gradient-light); }
        .dark .logo-fill { fill: url(#logo-gradient-dark); }
      `}
    </style>
    
    {/* Background card */}
    <path
      d="M10 35 Q10 25 20 25 H80 Q90 25 90 35 V75 Q90 85 80 85 H20 Q10 85 10 75 Z"
      className="logo-fill"
      opacity="0.6"
    />
    
    {/* Foreground card */}
    <path
      d="M15 25 Q15 15 25 15 H85 Q95 15 95 25 V65 Q95 75 85 75 H25 Q15 75 15 65 Z"
      className="logo-fill"
    />
    
    {/* "A" shape for "Ai" */}
    <path
      d="M40 55 L50 30 L60 55 M42.5 50 H57.5"
      fill="none"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-morandi-background-light dark:stroke-morandi-background-dark"
    />
    {/* "i" dot for "Ai" */}
    <circle
      cx="65"
      cy="52.5"
      r="2.5"
      className="fill-morandi-background-light dark:fill-morandi-background-dark"
    />
  </svg>
);