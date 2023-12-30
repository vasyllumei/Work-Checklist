import React, { useEffect, useState } from 'react';
import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictDroppable/StrictModeDroppable';
import { createStatus, deleteStatus, getAllColumns } from '@/services/status/statusService';
import { ColumnType } from '@/types/Column';
import { Column } from '@/components/Kanban/components/Column';
import { createTask, deleteTask, getAllTasks, updateTask } from '@/services/task/taskService';
import { ButtonStateType, TaskType } from '@/types/Task';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useFormik } from 'formik';
import { CreateStatusModal } from './components/Modal/CreateStatusModal';
import { CreateTaskModal } from '@/components/Kanban/components/Modal/CreateTaskModal';
import { BUTTON_STATE_CLASSES } from '@/constants';

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

  const handleStatusCreate = async () => {
    try {
      const response = await createStatus({
        title: newColumn.title,
        order: newColumn.order,
        id: newColumn.id,
      });

      const newStatusData: ColumnType = {
        title: response.data.title,
        id: response.data.id,
        order: response.data.order,
      };

      setColumns([...columns, newStatusData]);
      setNewColumn({ title: '', order: '', id: '' });
      await fetchData();
    } catch (error) {
      console.error('Error creating status:', error);
    }
  };

  const handleStatusDelete = async (statusId: string): Promise<void> => {
    try {
      await deleteStatus(statusId);
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
  const handleSaveUpdatedTask = async (): Promise<void> => {
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
    handleStatusCreate();
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
  const getButtonClass = (buttonState: string) => {
    const buttonClass = (BUTTON_STATE_CLASSES as Record<string, string>)[buttonState] || '';
    return `${styles.selectAction} ${buttonClass}`;
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
        <div className={styles.mainContainer}>
          {columns.map((column, index) => (
            <StrictModeDroppable key={index} droppableId={column.id}>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Column
                    column={column}
                    tasks={tasks.filter(task => task?.statusId === column.id)}
                    fetchData={fetchData}
                    isEditMode={isEditMode}
                    handleTaskEdit={handleTaskEdit}
                    handleTaskDelete={handleTaskDelete}
                    isCardExpanded={isCardExpanded}
                    isAddTaskModalOpen={isAddStatusModalOpen}
                    buttonColorClassName={getButtonClass}
                    onAddNewTask={onAddNewTask}
                    startEditingTask={startEditingTask}
                    formik={formik}
                    getFieldError={getFieldError}
                    handleSaveUpdatedTask={handleSaveUpdatedTask}
                    stopEditingTask={stopEditingTask}
                  />
                  {provided.placeholder}
                  <HighlightOffIcon onClick={() => handleStatusDelete(column.id)}> Delete Status</HighlightOffIcon>
                </div>
              )}
            </StrictModeDroppable>
          ))}
        </div>
      </DragDropContext>
      <AddCircleOutlineIcon onClick={() => setIsAddStatusModalOpen(true)}>Add Status</AddCircleOutlineIcon>
      <CreateStatusModal
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
        buttonColorClassName={getButtonClass}
        task={tasks}
        stopEditingTask={stopEditingTask}
      />
    </Layout>
  );
};
