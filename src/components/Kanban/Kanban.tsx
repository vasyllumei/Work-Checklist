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

    const source = result.source;
    const destination = result.destination;

    if (source.droppableId === destination.droppableId) {
      const columnId = source.droppableId;
      const updatedColumns = [...columns];
      const column = updatedColumns.find(c => c.title === columnId);
      if (column) {
        const [movedItem] = column.order.splice(source.index, 1);
        column.order.splice(destination.index, 0, movedItem);
        setColumns(updatedColumns);
      }
    } else {
      const sourceColumnTitle = source.droppableId;
      const destinationColumnTitle = destination.droppableId;
      const updatedColumns = [...columns];
      const sourceColumn = updatedColumns.find(c => c.title === sourceColumnTitle);
      const destinationColumn = updatedColumns.find(c => c.title === destinationColumnTitle);
      if (sourceColumn && destinationColumn) {
        const [movedItem] = sourceColumn.order.splice(source.index, 1);
        destinationColumn.order.splice(destination.index, 0, movedItem);
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
        order: newStatus.order.toString(),
      });
      setColumns([...columns, response.data]);
      setNewStatus({ title: '', order: 0 });
    } catch (error) {
      console.error('Error creating statuses:', error);
    }
  };

  return (
    <Layout>
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
    </Layout>
  );
};
