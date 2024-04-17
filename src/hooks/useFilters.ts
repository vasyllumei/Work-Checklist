import { useState } from 'react';
import { FilterType } from '@/types/Filter';

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterType[]>([]);

  const handleFilterChange = (filterName: string, selectedOptions: string | string[]) => {
    const existingFilterIndex = filters.findIndex(filter => filter.name === filterName);

    if (existingFilterIndex !== -1) {
      const updatedFilters = [...filters];
      updatedFilters[existingFilterIndex] = { name: filterName, value: selectedOptions };
      setFilters(updatedFilters);
    } else {
      setFilters(prevFilters => [...prevFilters, { name: filterName, value: selectedOptions }]);
    }
  };

  return {
    filters,
    handleFilterChange,
  };
};
