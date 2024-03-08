import React, { FC, useState } from 'react';
import { Option, SelectComponent } from '@/components/Select/Select';
import styles from './Filter.module.css';
import { Button } from '@/components/Button';

export interface Filter {
  name: string;
  label: string;
  options: Option[];
  value: string | string[];
  applyOnChange?: boolean;
}

interface FilterProps {
  filters: Filter[];
  handleFilterChange: (filterName: string, selectedOptions: string | string[]) => void;
  clearAll?: boolean;
}

export const Filter: FC<FilterProps> = ({ filters, handleFilterChange, clearAll = true }) => {
  const [resetKey, setResetKey] = useState(0);

  const handleClearAll = () => {
    filters.forEach(filter => handleFilterChange(filter.name, []));
    setResetKey(prevKey => prevKey + 1);
  };

  return (
    <div className={styles.mainFilterBox}>
      <div className={styles.filterContainer}>
        {filters.map(filter => (
          <div key={filter.name}>
            <SelectComponent
              options={filter.options}
              value={filter.value}
              label={filter.label}
              applyOnChange={filter.applyOnChange}
              onChange={selectedOptions => {
                handleFilterChange(filter.name, selectedOptions);
              }}
              multiple
              key={resetKey}
            />
          </div>
        ))}
      </div>
      {clearAll && <Button text="Clear" onClick={handleClearAll} size="small" outlined={true} />}
    </div>
  );
};
