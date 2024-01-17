// Ваш компонент Select

import React from 'react';
import styles from './Select.module.css';

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
  label: string;
}

export const Select: React.FC<SelectProps> = ({ value, options, onChange, style, className, label }) => {
  return (
    <div className={styles.selectContainer}>
      <label className={styles.selectLabel}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={style} className={className}>
        {options.map(option => (
          <option key={option.value} value={option.value} className={styles.option}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
