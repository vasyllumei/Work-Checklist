import { useState, useCallback } from 'react';

interface PaginationModel {
  pageSize: number;
  page: number;
}

export const usePagination = (initialState: PaginationModel = { pageSize: 5, page: 0 }) => {
  const [paginationModel, setPaginationModel] = useState<PaginationModel>(initialState);

  const handlePaginationModelChange = useCallback((newPaginationModel: PaginationModel) => {
    setPaginationModel(newPaginationModel);
  }, []);

  return {
    paginationModel,
    handlePaginationModelChange,
  };
};
