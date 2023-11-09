import React, { useEffect, useState } from 'react';
import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { Column } from './components/Column/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictModeDroppable';
import { createStatus, getAllStatus } from '@/services/status/statusService';
import { ColumnType } from '@/types/Column';

export const Kanban = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [newStatus, setNewStatus] = useState({ title: '', order: 0 } as ColumnType);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceColumnId = result.source.droppableId;
    const destinationColumnId = result.destination.droppableId;

    if (sourceColumnId === destinationColumnId) {
      const columnId = sourceColumnId;
      const updatedColumns = [...columns];
      const column = updatedColumns.find(c => c.title === columnId);

      if (column) {
        const [movedItem] = column.task.splice(result.source.index, 1);
        column.task.splice(result.destination.index, 0, movedItem);
        setColumns(updatedColumns);
      }
    } else {
      const sourceColumnTitle = sourceColumnId;
      const destinationColumnTitle = destinationColumnId;
      const updatedColumns = [...columns];
      const sourceColumn = updatedColumns.find(c => c.title === sourceColumnTitle);
      const destinationColumn = updatedColumns.find(c => c.title === destinationColumnTitle);

      if (sourceColumn && destinationColumn) {
        const [movedItem] = sourceColumn.task.splice(result.source.index, 1);
        destinationColumn.task.splice(result.destination.index, 0, movedItem);
        setColumns(updatedColumns);
      }
    }
  };
  const loadColumns = async () => {
    try {
      const response = await getAllStatus();
      const fetchedStatusData: ColumnType[] = response.data;
      const formattedColumns = fetchedStatusData.map(column => ({
        title: column.title,
        order: column.order,
      }));
      setColumns(formattedColumns);
    } catch (error) {
      console.error('Error loading columns:', error);
    }
  };

  useEffect(() => {
    loadColumns();
  }, []);

  const createNewStatus = async () => {
    try {
      const response = await createStatus({
        title: newStatus.title,
        order: newStatus.order,
      });
      setColumns([...columns, response.data]);
      setNewStatus({ title: '', order: 0 });
    } catch (error) {
      console.error('Error creating statuses:', error);
    }
  };

  return (
    <Layout>
      <div>
        <input
          type="text"
          value={newStatus.title}
          onChange={e => setNewStatus({ ...newStatus, title: e.target.value })}
          placeholder="New Status"
        />
        <input
          type="number"
          value={newStatus.order}
          onChange={e => setNewStatus({ ...newStatus, order: parseInt(e.target.value) })}
          placeholder="Order"
        />
        <button onClick={createNewStatus}>Add Status</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer}>
            <DragDropContext onDragEnd={onDragEnd}>
              {columns.map((column, index) => (
                <StrictModeDroppable key={index} droppableId={index.toString()}>
                  {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Column title={column.title} order={column.order} />
                      {provided.placeholder}
                    </div>
                  )}
                </StrictModeDroppable>
              ))}
            </DragDropContext>
          </div>
        </div>
      </DragDropContext>
    </Layout>
  );
};
