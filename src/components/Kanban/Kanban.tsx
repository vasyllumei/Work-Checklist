import React, { useEffect, useState } from 'react';
import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { Column } from './components/Column/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictModeDroppable';
import { createStatus, deleteStatus, getAllStatuses } from '@/services/status/statusService';
import { StatusType } from '@/types/Column';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export const Kanban = () => {
  const [columns, setColumns] = useState<StatusType[]>([]);
  const [newStatus, setNewStatus] = useState({ title: '', order: 0 } as StatusType);
  const [isAddStatusModalOpen, setIsAddStatusModalOpen] = useState<boolean>(false);

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

  const fetchColumns = async () => {
    try {
      const response = await getAllStatuses();
      const fetchedStatusData: StatusType[] = response.data;
      const formattedColumns = fetchedStatusData.map(column => ({
        title: column.title,
        order: column.order,
        id: column.id,
      }));
      setColumns(formattedColumns);
    } catch (error) {
      console.error('Error loading columns:', error);
    }
  };

  useEffect(() => {
    fetchColumns();
  }, []);

  const createNewStatus = async () => {
    try {
      const response = await createStatus({
        title: newStatus.title,
        order: newStatus.order,
        id: newStatus.id,
      });
      setColumns([...columns, response.data]);
      setNewStatus({ title: '', order: 0, id: '' });
      setIsAddStatusModalOpen(false); // Close the modal after creating a status
    } catch (error) {
      console.error('Error creating status:', error);
    }
  };

  const handleStatusDelete = async (statusId: string): Promise<void> => {
    try {
      await deleteStatus(statusId);
      await fetchColumns();
    } catch (error) {
      console.error('Error deleting status:', error);
    }
  };

  return (
    <Layout>
      <Dialog open={isAddStatusModalOpen} onClose={() => setIsAddStatusModalOpen(false)}>
        <DialogTitle>Add New Status</DialogTitle>
        <DialogContent>
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddStatusModalOpen(false)}>Cancel</Button>
          <Button onClick={createNewStatus}>Add Status</Button>
        </DialogActions>
      </Dialog>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer}>
            <DragDropContext onDragEnd={onDragEnd}>
              {columns.map((column, index) => (
                <StrictModeDroppable key={index} droppableId={index.toString()}>
                  {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Column title={column.title} order={column.order} id={column.id} />
                      {provided.placeholder}
                      <button onClick={() => handleStatusDelete(column.id)}>Delete Status</button>
                    </div>
                  )}
                </StrictModeDroppable>
              ))}
            </DragDropContext>
          </div>
        </div>
      </DragDropContext>

      <div>
        <button onClick={() => setIsAddStatusModalOpen(true)}>Add Status</button>
      </div>
    </Layout>
  );
};
