import React, { useEffect, useState } from 'react';
import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { DragDropContext } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictModeDroppable';
import { createStatus, deleteStatus, getAllStatuses } from '@/services/status/statusService';
import { StatusType } from '@/types/Column';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Column } from '@/components/Kanban/components/Column';
import { Button } from '@/components/Button';
import { getAllTasks } from '@/services/task/taskService';
import { TaskType } from '@/types/Task';

export const Kanban = () => {
  const [columns, setColumns] = useState<StatusType[]>([]);
  const [newStatus, setNewStatus] = useState({ title: '', order: 0, id: '', task: [] } as StatusType);
  const [isAddStatusModalOpen, setIsAddStatusModalOpen] = useState<boolean>(false);
  const [allTasks, setAllTasks] = useState<TaskType[]>([]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceColumnId = result.source.droppableId;
    const destinationColumnId = result.destination.droppableId;

    if (sourceColumnId === destinationColumnId) {
      const columnId = sourceColumnId;
      const updatedColumns = [...columns];
      const column = updatedColumns.find(c => c.title === columnId);

      if (column) {
        const [movedItem] = column.id.splice(result.source.index, 1);
        column.id.splice(result.destination.index, 0, movedItem);
        setColumns(updatedColumns);
      }
    } else {
      const sourceColumnTitle = sourceColumnId;
      const destinationColumnTitle = destinationColumnId;
      const updatedColumns = [...columns];
      const sourceColumn = updatedColumns.find(c => c.title === sourceColumnTitle);
      const destinationColumn = updatedColumns.find(c => c.title === destinationColumnTitle);

      if (sourceColumn && destinationColumn) {
        const [movedItem] = sourceColumn.id.splice(result.source.index, 1);
        destinationColumn.id.splice(result.destination.index, 0, movedItem);
        setColumns(updatedColumns);
      }
    }
  };

  const getData = async () => {
    try {
      const statusesResponse = await getAllStatuses();
      const tasksResponse = await getAllTasks();

      const statuses: StatusType[] = statusesResponse.data;
      const tasksData: TaskType[] = tasksResponse.data;

      setAllTasks(tasksData);

      const data: StatusType[] = statuses.map(status => ({
        order: status.order,
        title: status.title,
        id: status.id,
        task: tasksData.filter(task => task.statusId === status.id),
      }));

      setColumns(data);
    } catch (error) {
      console.error('Error loading columns:', error);
    }
  };

  useEffect(() => {
    getData();
  }, [allTasks]);

  const createNewStatus = async () => {
    try {
      const response = await createStatus({
        title: newStatus.title,
        order: newStatus.order,
        id: newStatus.id,
        task: newStatus.task,
      });

      const newStatusData: StatusType = {
        title: response.data.title,
        id: response.data.id,
        order: response.data.order,
        task: [],
      };

      setColumns([...columns, newStatusData]);
      setNewStatus({ title: '', order: 0, id: '', task: [] });
      setIsAddStatusModalOpen(false);
    } catch (error) {
      console.error('Error creating status:', error);
    }
  };
  const handleStatusDelete = async (statusId: string): Promise<void> => {
    try {
      await deleteStatus(statusId);
      await getData();
    } catch (error) {
      console.error('Error deleting status:', error);
    }
  };
  const addStatusModalOpen = () => {
    setIsAddStatusModalOpen(false);
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
          <Button text="Cancel" onClick={addStatusModalOpen} />
          <Button text="Add Status" onClick={createNewStatus} />
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
                      <Column
                        title={column.title}
                        order={column.order}
                        id={column.id}
                        task={column.task}
                        allTasks={allTasks}
                      />
                      {provided.placeholder}
                      <Button text="Delete Status" onClick={() => handleStatusDelete(column.id)} />
                    </div>
                  )}
                </StrictModeDroppable>
              ))}
            </DragDropContext>
          </div>
        </div>
      </DragDropContext>

      <Button text="Add Status" onClick={() => setIsAddStatusModalOpen(true)} />
    </Layout>
  );
};
