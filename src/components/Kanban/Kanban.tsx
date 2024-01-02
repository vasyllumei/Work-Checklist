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
import { CreateStatusModal } from '@/components/Kanban/components/modals/CreateStatusModal';
import { CreateTaskModal } from '@/components/Kanban/components/modals/CreateTaskModal';
import { BUTTON_STATE_COLORS } from '@/constants';
import AddIcon from '@/assets/image/menuicon/addIcon.svg';
import DeleteIcon from './../../assets/image/menuicon/deleteIcon.svg';

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
const initialColumnForm = {
  id: '',
  title: '',
  order: '',
  editMode: false,
};

export const Kanban = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [isAddStatusModalOpen, setIsAddStatusModalOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [errorExist, setErrorExist] = useState<string>('');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);

  const formikTask = useFormik({
    initialValues: initialTaskForm,
    onSubmit: async () => {
      try {
        if (formikTask.values.description && formikTask.values.buttonState) {
          await handleTaskCreate();
        }

        if (errorExist) {
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });
  const formikColumn = useFormik({
    initialValues: initialColumnForm,
    onSubmit: async () => {
      try {
        if (formikColumn.values.title && formikColumn.values.order) {
          await handleColumnCreate();
        }
        if (errorExist) {
        }
      } catch (error) {
        console.error('Error submitting column form:', error);
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
      if (formikColumn.isValid) {
        const columnData = {
          ...formikColumn.values,
        };
        await createColumn(columnData);
        await fetchData();
        formikColumn.resetForm();
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

  const handleColumnDelete = async (statusId: string) => {
    try {
      await deleteColumn(statusId);
      await fetchData();
    } catch (error) {
      console.error('Error deleting columns:', error);
    }
  };

  const handleColumnEdit = (columnId: string) => {
    try {
      const columnData = columns.find(column => column.id === columnId);
      if (columnData) {
        formikColumn.setValues({
          ...initialColumnForm,
          ...columnData,
          editMode: true,
        });
      }
    } catch (error) {
      console.error('Error updating the task', error);
    }
  };

  const handleSaveUpdatedColumn = async () => {
    try {
      await updateColumn(formikColumn.values.id, formikColumn.values);
      await fetchData();
      await stopEditingColumn();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskCreate = async () => {
    try {
      if (formikTask.isValid) {
        const taskData = {
          ...formikTask.values,
          userId: localStorage.getItem('userId') || '',
          assignedTo: '64db26458eb8527007b38e10',
        };
        await createTask(taskData);
        await fetchData();
        formikTask.resetForm();
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

  const handleTaskDelete = async (taskId: string): Promise<void> => {
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
        formikTask.setValues({
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
      await updateTask(formikTask.values.id, formikTask.values);
      await fetchData();
      await stopEditingTask();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    const touchedField = formikTask.touched[fieldName as keyof typeof formikTask.touched];
    const errorField = formikTask.errors[fieldName as keyof typeof formikTask.errors];

    if (touchedField && errorField) {
      return errorField;
    }
    return undefined;
  };

  const onDragEndHandler = (result: DropResult) => {
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;

    if (source.droppableId === destination.droppableId) {
      setTasks(prevTasks => {
        const tasksInSourceStatus = prevTasks.filter(task => task.statusId === source.droppableId);
        const [movedTask] = tasksInSourceStatus.splice(source.index, 1);
        tasksInSourceStatus.splice(destination.index, 0, movedTask);

        return prevTasks.map(task =>
          task.statusId === source.droppableId ? tasksInSourceStatus.shift() || task : task,
        );
      });
    } else {
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
    formikTask.setValues({ ...initialTaskForm, statusId: columnId });
  };

  const getButtonStyle = (buttonState: string) => {
    const backgroundColor = (BUTTON_STATE_COLORS as Record<string, string>)[buttonState] || '';
    return {
      backgroundColor,
    };
  };

  const isEditMode = formikTask.values.editMode;

  const isCardExpanded = (taskId: string) => editingTaskId === taskId;

  const startEditingTask = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const stopEditingTask = () => {
    formikTask.setFieldValue('editMode', false);
  };

  const stopEditingColumn = () => {
    formikColumn.setFieldValue('editMode', false);
  };

  return (
    <Layout>
      <DragDropContext onDragEnd={onDragEndHandler}>
        <button onClick={() => setIsAddStatusModalOpen(true)} className={styles.addButton}>
          <AddIcon />
        </button>
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
                      formik={formikTask}
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
      <CreateStatusModal
        formik={formikColumn}
        isOpen={isAddStatusModalOpen}
        onClose={closeAddStatusModal}
        onChange={createStatusModal}
      />
      <CreateTaskModal
        onClose={closeAddTaskModal}
        formik={formikTask}
        onChange={handleTaskCreate}
        isOpen={isAddTaskModalOpen}
        getFieldError={getFieldError}
        getButtonStyle={getButtonStyle}
        stopEditingTask={stopEditingTask}
      />
    </Layout>
  );
};
