import React, { FC } from 'react';
import { Option, SelectComponent } from '@/components/Select/Select';
import styles from './Filter.module.css';

export default interface Filter {
  name: string;
  label: string;
  options: Option[];
  value: string | string[];
}

interface FilterProps {
  filters: Filter[];
  handleFilterChange: (filterName: string, selectedOptions: string | string[]) => void;
}

export const Filter: FC<FilterProps> = ({ filters, handleFilterChange }) => {
  return (
    <div className={styles.filterContainer}>
      {filters.map(filter => (
        <div key={filter.name}>
          <SelectComponent
            options={filter.options}
            value={filter.value}
            label={filter.label}
            onChange={selectedOptions => {
              handleFilterChange(filter.name, selectedOptions);
            }}
            multiple
          />
        </div>
      ))}
    </div>
  );
};
