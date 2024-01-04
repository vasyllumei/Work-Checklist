import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ value, options, onChange, style, className }) => {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={style} className={className}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
