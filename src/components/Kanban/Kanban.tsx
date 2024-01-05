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
import DeleteIcon from './../../assets/image/menuicon/deleteIcon.svg';
import { Button } from '@/components/Button';
import { BLUE_COLOR, GREEN_COLOR, RED_COLOR, YELLOW_COLOR } from '@/constants';

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
const BUTTON_STATE_COLORS = {
  Updates: BLUE_COLOR,
  Errors: RED_COLOR,
  Done: GREEN_COLOR,
  Pending: YELLOW_COLOR,
};
export const Kanban = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [newColumn, setNewColumn] = useState({ title: '', order: 0, id: '' } as ColumnType);
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
      setColumns(sortColumnsByOrder(columnsData));
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

      setColumns(prevColumns => {
        const updatedColumns = [...prevColumns, columnData];
        const sortedColumns = sortColumnsByOrder(updatedColumns);
        return sortedColumns;
      });
      setNewColumn({ title: '', order: 0, id: '' });
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
  const handleSaveUpdatedColumn = async () => {
    try {
      await updateColumn(formik.values.id, formik.values);
      await fetchData();
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

    if (result.type === 'TASK') {
      if (source.droppableId === destination.droppableId) {
        const updatedTasksOrder = [...tasks];
        const [movedTask] = updatedTasksOrder.splice(source.index, 1);
        updatedTasksOrder.splice(destination.index, 0, movedTask);
        await updateTasksOrder(updatedTasksOrder);
        setTasks(updatedTasksOrder);
      } else {
        const updatedTask = tasks.find(task => task.id === result.draggableId);
        if (updatedTask) {
          await updateTask(updatedTask.id, { ...updatedTask, statusId: destination.droppableId });
        }
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === result.draggableId ? { ...task, statusId: destination.droppableId } : task,
          ),
        );
      }
    } else if (result.type === 'COLUMN') {
      const updatedColumns = [...columns];
      const movedColumn = updatedColumns.splice(source.index, 1)[0];
      updatedColumns.splice(destination.index, 0, movedColumn);

      const updatedColumnsWithOrder = updatedColumns.map((col, index) => ({ ...col, order: index }));
      await updateColumnsOrder(updatedColumnsWithOrder);
      setColumns(updatedColumnsWithOrder);

      const updatedColumn = updatedColumnsWithOrder.find(col => col.id === result.draggableId);
      if (updatedColumn) {
        await handleSaveUpdatedColumn();
      }
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
  const hasTasksInColumn = (columnId: string) => tasks.some(task => task.statusId === columnId);
  const sortColumnsByOrder = (columns: ColumnType[]) => {
    return columns.sort((a: ColumnType, b: ColumnType) => a.order - b.order);
  };
  return (
    <Layout>
      <DragDropContext onDragEnd={onDragEndHandler}>
        <div className={styles.addStatusButton}>
          <Button text="Add new status" onClick={() => setIsAddStatusModalOpen(true)} />
        </div>

        <div className={styles.mainContainer}>
          {columns.map((column, index) =>
            column ? (
              <StrictModeDroppable key={index} droppableId={column.id}>
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {!hasTasksInColumn(column.id) && (
                      <button onClick={() => handleColumnDelete(column.id)} className={styles.deleteStatusButton}>
                        <DeleteIcon />
                      </button>
                    )}

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
