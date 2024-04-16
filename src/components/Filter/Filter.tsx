import React, { FC, useState } from 'react';
import { Option, SelectComponent } from '@/components/Select/Select';
import styles from './Filter.module.css';
import { Button } from '@/components/Button';
import { useTranslation } from 'react-i18next';
import { FilterType } from '@/types/Filter';

export interface FilterOption {
  name: string;
  label: string;
  options: Option[];
  applyOnChange?: boolean;
}

interface FilterProps {
  filters: FilterOption[];
  handleFilterChange: (filterName: string, selectedOptions: string | string[]) => void;
  clearAll?: boolean;
  value: FilterType[];
}

export const Filter: FC<FilterProps> = ({ filters, value, handleFilterChange, clearAll = true }) => {
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();

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
              value={value?.find(item => item.name === filter.name)?.value || []}
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
      {clearAll && <Button text={t('clear')} onClick={handleClearAll} size="small" outlined={true} />}
    </div>
  );
};
