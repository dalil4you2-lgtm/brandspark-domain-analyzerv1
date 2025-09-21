import React from 'react';

interface SortIconProps {
  direction: 'ascending' | 'descending' | 'none';
}

export const SortIcon: React.FC<SortIconProps> = ({ direction }) => {
  const commonProps = {
    className: "h-4 w-4",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2,
    // Fix: Changed "true" to boolean true to match React's SVGProps type for aria-hidden.
    "aria-hidden": true,
  };

  if (direction === 'ascending') {
    return (
      <svg {...commonProps} className={`${commonProps.className} text-indigo-600`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    );
  }

  if (direction === 'descending') {
    return (
      <svg {...commonProps} className={`${commonProps.className} text-indigo-600`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    );
  }

  // Neutral state for non-active sortable columns
  return (
    <svg {...commonProps} className={`${commonProps.className} text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
  );
};