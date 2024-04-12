import { useState } from 'react';
import { FilterType } from '@/types/Filter';

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterType[]>([]);

  const handleFilterChange = (filterName: string, selectedOptions: string | string[]) => {
    // Проверяем, существует ли уже фильтр с таким именем
    const existingFilterIndex = filters.findIndex(filter => filter.name === filterName);

    // Если фильтр существует, обновляем его значение, иначе добавляем новый фильтр
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
