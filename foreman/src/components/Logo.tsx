import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'icon';
  height?: number;
}

export function Logo({ className = '', variant = 'light', height = 36 }: LogoProps) {
  // Ratio of SVG is approximately 4.5:1 for full logo, 1.2:1 for icon
  const width = variant === 'icon' ? Math.round(height * 1.2) : Math.round(height * 4.3);

  if (variant === 'icon') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        id="foreman-logo-icon"
      >
        <defs>
          <linearGradient id="hardhatGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" /> {/* brand purple */}
            <stop offset="50%" stopColor="#6366f1" /> {/* indigo */}
            <stop offset="100%" stopColor="#3b82f6" /> {/* brand blue */}
          </linearGradient>
        </defs>

        {/* 1. Base brim plate with central step/gap */}
        <path
          d="M 10 82 L 108 82 L 108 94 L 71 94 L 71 87 L 47 87 L 47 94 L 10 94 Z"
          fill="url(#hardhatGrad)"
        />

        {/* 2. Left building block (curved outer side) */}
        <path
          d="M 22 76 L 51 76 L 51 36 L 44 36 C 30 46 22 59 22 76 Z"
          fill="url(#hardhatGrad)"
        />

        {/* 3. Center building block (tall, slanted roof) */}
        <path
          d="M 55 76 L 68 76 L 68 12 L 55 24 Z"
          fill="url(#hardhatGrad)"
        />

        {/* 4. Right building block (curved outer side) */}
        <path
          d="M 72 76 L 101 76 C 101 59 93 46 79 36 L 72 36 Z"
          fill="url(#hardhatGrad)"
        />

        {/* 5. Small block floating on the right representing digital data bits */}
        <rect
          x="105"
          y="54"
          width="9"
          height="9"
          fill="url(#hardhatGrad)"
        />
      </svg>
    );
  }

  // Full Logo (with text)
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 450 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      id={`foreman-logo-${variant}`}
    >
      <defs>
        <linearGradient id="fullGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* --- LOGO ICON SLAT (Left side shifted) --- */}
      <g transform="translate(10, 0)">
        {/* Base brim plate */}
        <path
          d="M 10 82 L 108 82 L 108 94 L 71 94 L 71 87 L 47 87 L 47 94 L 10 94 Z"
          fill="url(#fullGrad)"
        />

        {/* Left building block */}
        <path
          d="M 22 76 L 51 76 L 51 36 L 44 36 C 30 46 22 59 22 76 Z"
          fill="url(#fullGrad)"
        />

        {/* Center building block */}
        <path
          d="M 55 76 L 68 76 L 68 12 L 55 24 Z"
          fill="url(#fullGrad)"
        />

        {/* Right building block */}
        <path
          d="M 72 76 L 101 76 C 101 59 93 46 79 36 L 72 36 Z"
          fill="url(#fullGrad)"
        />

        {/* Floating digital block */}
        <rect
          x="105"
          y="54"
          width="9"
          height="9"
          fill="url(#fullGrad)"
        />
      </g>

      {/* --- TEXT CONTENT "Foreman-AI" --- */}
      {/* 
        We use clean, bold, stylized geometric lettering of 'Foreman'.
        The 'AI' gets the brilliant blue-purple gradient treatment 
      */}
      <text
        x="135"
        y="83"
        fontFamily='"Inter", system-ui, -apple-system, sans-serif'
        fontWeight="800"
        fontSize="71"
        letterSpacing="-0.03em"
        fill={variant === 'light' ? '#FFFFFF' : '#1e293b'}
      >
        Foreman
        <tspan fill="url(#fullGrad)" fontWeight="900" letterSpacing="-0.01em">
          -AI
        </tspan>
      </text>
    </svg>
  );
}
