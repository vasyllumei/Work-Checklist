import React from 'react';

interface UniversalSelectProps {
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const Select: React.FC<UniversalSelectProps> = ({ value, onChange, style, className }) => {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={style} className={className}>
      <option value="Pending">Pending</option>
      <option value="Updates">Updates</option>
      <option value="Errors">Errors</option>
      <option value="Done">Done</option>
    </select>
  );
};
