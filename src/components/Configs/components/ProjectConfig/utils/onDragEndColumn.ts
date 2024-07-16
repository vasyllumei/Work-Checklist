import { DropResult } from 'react-beautiful-dnd';
import { ColumnType } from '@/types/Column';
import { updateColumns } from '@/services/column/columnService';
import { Dispatch, SetStateAction } from 'react';

export const handleColumnDragEnd = async (
  columns: ColumnType[],
  setColumns: Dispatch<SetStateAction<ColumnType[]>>,
  result: DropResult,
) => {
  const { source, destination } = result;

  if (!destination || source.index === destination.index) {
    return;
  }

  const updatedColumns = [...columns];
  const movedColumn = updatedColumns.splice(source.index, 1)[0];
  updatedColumns.splice(destination.index, 0, movedColumn);

  updatedColumns.forEach((column, index) => {
    column.order = index + 1;
  });

  setColumns(updatedColumns);
  await updateColumns(updatedColumns);
};
