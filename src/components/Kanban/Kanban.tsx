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
import { TextInput } from '@/components/TextInput';

export const Kanban = () => {
  const [columns, setColumns] = useState<StatusType[]>([]);
  const [newStatus, setNewStatus] = useState({ title: '', order: '', id: '' } as StatusType);
  const [isAddStatusModalOpen, setIsAddStatusModalOpen] = useState<boolean>(false);
  const [allTasks, setAllTasks] = useState<TaskType[]>([]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;

    if (source.droppableId === destination.droppableId) {
      const sourceStatusId = source.droppableId;
      setAllTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => ({ ...task }));
        const tasksInSourceStatus = updatedTasks.filter(task => task.statusId === sourceStatusId);

        const [movedTask] = tasksInSourceStatus.splice(source.index, 1);
        tasksInSourceStatus.splice(destination.index, 0, movedTask);

        return updatedTasks.map(task =>
          task.statusId === sourceStatusId ? tasksInSourceStatus.shift() || task : task,
        );
      });
    } else {
      const sourceStatusId = source.droppableId;
      const destinationStatusId = destination.droppableId;

      setAllTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => ({ ...task }));
        const tasksInSourceStatus = updatedTasks.filter(task => task.statusId === sourceStatusId);
        const tasksInDestinationStatus = updatedTasks.filter(task => task.statusId === destinationStatusId);

        const [movedTask] = tasksInSourceStatus.splice(source.index, 1);
        tasksInDestinationStatus.splice(destination.index, 0, movedTask);

        return updatedTasks.map(task =>
          task.statusId === sourceStatusId
            ? tasksInSourceStatus.shift() || task
            : task.statusId === destinationStatusId
            ? tasksInDestinationStatus.shift() || task
            : task,
        );
      });
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
      }));

      setColumns(data);
    } catch (error) {
      console.error('Error loading columns:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const createNewStatus = async () => {
    try {
      const response = await createStatus({
        title: newStatus.title,
        order: newStatus.order,
        id: newStatus.id,
      });

      const newStatusData: StatusType = {
        title: response.data.title,
        id: response.data.id,
        order: response.data.order,
      };

      setColumns([...columns, newStatusData]);
      setNewStatus({ title: '', order: '', id: '' });
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
  const addStatusModalClose = () => {
    createNewStatus();
    setIsAddStatusModalOpen(false);
  };

  return (
    <Layout>
      <Dialog open={isAddStatusModalOpen} onClose={() => setIsAddStatusModalOpen(false)}>
        <DialogTitle>Add New Status</DialogTitle>
        <DialogContent>
          <div>
            <TextInput
              label="Title"
              error=""
              name="title"
              type="text"
              value={newStatus.title}
              onChange={value => setNewStatus({ ...newStatus, title: value })}
              placeholder="Add title"
            />
            <TextInput
              label="Order"
              error=""
              name="order"
              type="number"
              value={newStatus.order || ''}
              onChange={value => setNewStatus({ ...newStatus, order: value })}
              placeholder="Add order"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button text="Cancel" onClick={addStatusModalOpen} />
          <Button text="Add Status" onClick={addStatusModalClose} />
        </DialogActions>
      </Dialog>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer}>
            <DragDropContext onDragEnd={onDragEnd}>
              {columns.map((column, index) => (
                <StrictModeDroppable key={index} droppableId={column.id}>
                  {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Column title={column.title} order={column.order} id={column.id} allTasks={allTasks} />
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
