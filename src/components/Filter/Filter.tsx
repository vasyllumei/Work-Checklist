import React, { FC, useState } from 'react';
import styles from './Filter.module.css';
import { Button } from '@/components/Button';
import { useTranslation } from 'react-i18next';
import { FilterType } from '@/types/Filter';
import { Option, SelectComponent } from '@/components/Select/Select';

export interface FilterOption {
  name: string;
  label: string;
  options: Option[];
  applyOnChange?: boolean;
}

interface FilterProps {
  filters: FilterOption[];
  handleFilterChange: (filterName: string, selectedOptions: string | string[], projectId?: string) => void;
  clearAll?: boolean;
  addItem?: boolean;
  value: FilterType[];
  projectId?: string;
  onAddNewTask?: any;
  backLogColumn?: any;
}

export const Filter: FC<FilterProps> = ({
  filters,
  value,
  handleFilterChange,
  projectId,
  clearAll = true,
  addItem = true,
  onAddNewTask,
  backLogColumn,
}) => {
  const [resetKey, setResetKey] = useState(0);
  const { t } = useTranslation();

  const handleClearAll = () => {
    filters.forEach(filter => handleFilterChange(filter.name, []));
    setResetKey(prevKey => prevKey + 1);
  };

  return (
    <div className={styles.mainFilterBox}>
      {addItem && (
        <Button
          text={t('addTask')}
          onClick={() => onAddNewTask(backLogColumn?.id)}
          className={styles.newTaskButton}
          size={'medium'}
        />
      )}
      {clearAll && <Button text={t('clear')} onClick={handleClearAll} size="medium" outlined={true} />}
      <div className={styles.filterContainer}>
        {filters.map(filter => (
          <div key={filter.name}>
            <SelectComponent
              options={filter.options}
              value={value?.find(item => item.name === filter.name)?.value || projectId}
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
    </div>
  );
};
