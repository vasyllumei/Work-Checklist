import React, { useEffect, useState } from 'react';
import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictDroppable/StrictModeDroppable';
import { createColumn, deleteColumn, getAllColumns, updateColumn } from '@/services/columns/columnService';
import { ColumnType } from '@/types/Column';
import { Column } from '@/components/Kanban/components/Column';
import { createTask, deleteTask, getAllTasks, updateTask } from '@/services/task/taskService';
import { ButtonStateType, TaskType } from '@/types/Task';
import { useFormik } from 'formik';
import { CreateColumnModal } from '@/components/Kanban/components/modals/CreateColumnModal';
import { CreateTaskModal } from '@/components/Kanban/components/modals/CreateTaskModal';
import { BUTTON_STATE_COLORS } from '@/constants';
import DeleteIcon from './../../assets/image/menuicon/deleteIcon.svg';
import { Button } from '@/components/Button';

const initialTaskForm = {
  id: '',
  userId: '',
  assignedTo: '',
  title: '',
  description: '',
  statusId: '',
  avatar: '',
  image: '',
  buttonState: ButtonStateType.Pending,
  editMode: false,
};
export const Kanban = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [newColumn, setNewColumn] = useState({ title: '', order: '', id: '' } as ColumnType);
  const [isAddStatusModalOpen, setIsAddStatusModalOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [errorExist, setErrorExist] = useState<string>('');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: initialTaskForm,
    onSubmit: async () => {
      try {
        if (formik.values.description && formik.values.buttonState) {
          await handleTaskCreate();
        }

        if (errorExist) {
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  const fetchData = async () => {
    try {
      const { data: columnsData } = await getAllColumns();
      const { data: tasksData } = await getAllTasks();

      setTasks(tasksData);
      setColumns(columnsData);
    } catch (error) {
      console.error('Error loading columns:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleColumnCreate = async () => {
    try {
      const response = await createColumn(newColumn);
      const columnData = response.data;
      setColumns([...columns, columnData]);
      setNewColumn({ title: '', order: '', id: '' });
      await fetchData();
    } catch (error) {
      console.error('Error creating status:', error);
    }
  };

  const handleColumnDelete = async (statusId: string) => {
    try {
      await deleteColumn(statusId);
      await fetchData();
    } catch (error) {
      console.error('Error deleting status:', error);
    }
  };
  const handleColumnEdit = (columnId: string, newTitle: string) => {
    console.log('Handling column edit for columnId:', columnId);

    try {
      const columnData = columns.find(column => column.id === columnId);
      if (columnData) {
        setNewColumn(prevColumn => ({
          ...prevColumn,
          id: columnData.id || '',
          title: newTitle,
          order: columnData.order || '',
        }));
      }
    } catch (error) {
      console.error('Error editing column:', error);
    }
  };

  const handleSaveUpdatedColumn = async () => {
    try {
      if (newColumn.id) {
        await updateColumn(newColumn.id, {
          id: newColumn.id,
          title: newColumn.title,
          order: newColumn.order,
        });

        await fetchData();
        setNewColumn({ id: '', title: '', order: '' });
      }
    } catch (error) {
      console.error('Error updating column:', error);
    }
  };

  const handleTaskCreate = async () => {
    try {
      if (formik.isValid) {
        const taskData = {
          ...formik.values,
          userId: localStorage.getItem('userId') || '',
          assignedTo: '64db26458eb8527007b38e10',
        };
        await createTask(taskData);
        await fetchData();
        formik.resetForm();
        setIsAddTaskModalOpen(false);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorExist(error.response.data.message);
      } else {
        console.error('Error creating the card:', error);
      }
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await fetchData();
    } catch (error) {
      console.error('Error deleting the user:', error);
    }
  };

  const handleTaskEdit = (taskId: string) => {
    try {
      const cardData = tasks.find(card => card.id === taskId);
      if (cardData) {
        formik.setValues({
          ...initialTaskForm,
          ...cardData,
          editMode: true,
        });
      }
      setEditingTaskId(taskId);
    } catch (error) {
      console.error('Error updating the task', error);
    }
  };
  const handleSaveUpdatedTask = async () => {
    try {
      await updateTask(formik.values.id, formik.values);
      await fetchData();
      await stopEditingTask();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  const getFieldError = (fieldName: string): string | undefined => {
    const touchedField = formik.touched[fieldName as keyof typeof formik.touched];
    const errorField = formik.errors[fieldName as keyof typeof formik.errors];

    if (touchedField && errorField) {
      return errorField;
    }
    return undefined;
  };
  const onDragEndHandler = async (result: DropResult) => {
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;

    if (source.droppableId === destination.droppableId) {
      const tasksInSourceStatus = tasks.filter(task => task.statusId === source.droppableId);
      const [movedTask] = tasksInSourceStatus.splice(source.index, 1);
      tasksInSourceStatus.splice(destination.index, 0, movedTask);

      const updatedTasksOrder = tasks.map(task =>
        task.statusId === source.droppableId ? tasksInSourceStatus.shift() || task : task,
      );

      await updateTasksOrder(updatedTasksOrder);
      setTasks(updatedTasksOrder);
    } else {
      const updatedTask = tasks.find(task => task.id === result.draggableId);
      if (updatedTask) {
        await updateTask(updatedTask.id, { ...updatedTask, statusId: destination.droppableId });
      }
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === result.draggableId ? { ...task, statusId: destination.droppableId } : task)),
      );
    }
  };

  const createStatusModal = () => {
    handleColumnCreate();
    setIsAddStatusModalOpen(false);
  };

  const closeAddStatusModal = () => {
    setIsAddStatusModalOpen(false);
  };
  const closeAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };
  const onAddNewTask = (columnId: string) => {
    setIsAddTaskModalOpen(true);
    formik.setValues({ ...initialTaskForm, statusId: columnId });
  };

  const getButtonStyle = (buttonState: string) => {
    const backgroundColor = (BUTTON_STATE_COLORS as Record<string, string>)[buttonState] || '';
    return {
      backgroundColor,
    };
  };
  const isEditMode = formik.values.editMode;
  const isCardExpanded = (taskId: string) => editingTaskId === taskId;
  const startEditingTask = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const stopEditingTask = () => {
    formik.setFieldValue('editMode', false);
  };

  return (
    <Layout>
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Button text="Add new status" onClick={() => setIsAddStatusModalOpen(true)} className={styles.addButton} />
        <div className={styles.mainContainer}>
          {columns.map((column, index) =>
            column ? (
              <StrictModeDroppable key={index} droppableId={column.id}>
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <button onClick={() => handleColumnDelete(column.id)} className={styles.addButton}>
                      <DeleteIcon />
                    </button>

                    <Column
                      column={column}
                      tasks={tasks.filter(task => task?.statusId === column.id)}
                      fetchData={fetchData}
                      isEditMode={isEditMode}
                      handleTaskEdit={handleTaskEdit}
                      handleTaskDelete={handleTaskDelete}
                      isCardExpanded={isCardExpanded}
                      isAddTaskModalOpen={isAddStatusModalOpen}
                      getButtonStyle={getButtonStyle}
                      onAddNewTask={onAddNewTask}
                      startEditingTask={startEditingTask}
                      formik={formik}
                      getFieldError={getFieldError}
                      handleSaveUpdatedTask={handleSaveUpdatedTask}
                      stopEditingTask={stopEditingTask}
                      handleSaveUpdatedColumn={handleSaveUpdatedColumn}
                      handleColumnEdit={handleColumnEdit}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            ) : null,
          )}
        </div>
      </DragDropContext>
      <CreateColumnModal
        newColumn={newColumn}
        setNewColumn={setNewColumn}
        isOpen={isAddStatusModalOpen}
        onClose={closeAddStatusModal}
        onChange={createStatusModal}
      />
      <CreateTaskModal
        onClose={closeAddTaskModal}
        formik={formik}
        onChange={handleTaskCreate}
        isOpen={isAddTaskModalOpen}
        getFieldError={getFieldError}
        getButtonStyle={getButtonStyle}
        stopEditingTask={stopEditingTask}
      />
    </Layout>
  );
};
