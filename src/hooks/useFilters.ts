import { useState } from 'react';
import { FilterType } from '@/types/Filter';

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterType[]>([]);

  const handleFilterChange = (filterName: string, selectedOptions: string | string[], projectId?: string) => {
    const existingFilterIndex = filters.findIndex(filter => filter.name === filterName);

    if (existingFilterIndex !== -1) {
      const updatedFilters = [...filters];
      updatedFilters[existingFilterIndex] = { name: filterName, value: selectedOptions, projectId };
      setFilters(updatedFilters);
    } else {
      setFilters(prevFilters => [...prevFilters, { name: filterName, value: selectedOptions, projectId }]);
    }
  };

  return {
    filters,
    handleFilterChange,
  };
};
