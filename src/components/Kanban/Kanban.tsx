import React, { useEffect, useState } from 'react';
import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { createColumn, deleteColumn, getAllColumns, updateColumns } from '@/services/columns/columnService';
import { ColumnType } from '@/types/Column';
import { Column } from '@/components/Kanban/components/Column';
import { createTask, deleteTask, getAllTasks, updateTask, updateTasks } from '@/services/task/taskService';
import { ButtonStateType, TaskType } from '@/types/Task';
import { useFormik } from 'formik';
import { CreateColumnModal } from '@/components/Kanban/components/modals/CreateColumnModal/CreateColumnModal';
import { CreateTaskModal } from '@/components/Kanban/components/modals/CreateTaskModal/CreateTaskModal';
import { Button } from '@/components/Button';
import { BLUE_COLOR, GREEN_COLOR, RED_COLOR, YELLOW_COLOR } from '@/constants';
import * as Yup from 'yup';
import { getAllUsers } from '@/services/user/userService';
import { UserType } from '@/types/User';
import { DragDropContext } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictDroppable/StrictModeDroppable';

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
  order: 0,
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
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchText, setSearchText] = useState('');

  const ValidationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    editMode: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: initialTaskForm,
    validationSchema: ValidationSchema,
    onSubmit: async () => {
      try {
        if (formik.values.description && formik.values.title) {
          if (formik.values.id) {
            await handleSaveUpdatedTask();
          } else {
            await handleTaskCreate();
          }
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

      const sortedTasks = tasksData.sort((a, b) => a.order - b.order);
      const sortedColumns = columnsData.sort((a, b) => a.order - b.order);
      setTasks(sortedTasks);
      setColumns(sortedColumns);
    } catch (error) {
      console.error('Error loading columns:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, [searchText]);

  const handleColumnCreate = async () => {
    try {
      const columnData = await createColumn(newColumn);
      setColumns(prevColumns => [...prevColumns, columnData]);
      setNewColumn({ title: '', order: 0, id: '' });
    } catch (error) {
      console.error('Error creating column:', error);
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
          assignedTo: formik.values.assignedTo || '',
        };
        await createTask(taskData);
        await fetchData();
        formik.resetForm();
        setIsAddTaskModalOpen(false);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
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
      if (formik.isValid) {
        await updateTask(formik.values.id, formik.values);
        await fetchData();
        formik.resetForm();
        await stopEditingTask();
      }
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

  const createStatusModal = () => {
    handleColumnCreate();
    setIsAddStatusModalOpen(false);
  };

  const closeAddStatusModal = () => {
    setIsAddStatusModalOpen(false);
  };
  const closeAddTaskModal = () => {
    formik.resetForm();
    setIsAddTaskModalOpen(false);
  };
  const onAddNewTask = (columnId: string) => {
    formik.resetForm();
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

  const fetchUsers = async () => {
    try {
      const fetchedUsersData = await getAllUsers();
      const fetchedUsers: UserType[] = fetchedUsersData.data;
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error retrieving the list of users:', error);
    }
  };
  const onDragEnd = async (result: any) => {
    try {
      console.log('Drag result:', result);
      const { destination, source, type, draggableId } = result;

      if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
        return;
      }

      if (type === 'COLUMN') {
        const updatedColumns = [...columns];
        const movedColumn = updatedColumns.splice(source.index, 1)[0];
        updatedColumns.splice(destination.index, 0, movedColumn);
        if (source.index !== destination.index) {
          updatedColumns.forEach((column, index) => {
            column.order = index + 1;
          });
        }

        setColumns(updatedColumns);
        await updateColumns(updatedColumns);
      } else if (type === 'TASK') {
        const updatedTasks = [...tasks];
        const movedTaskIndex = updatedTasks.findIndex(task => task.id === draggableId);

        if (movedTaskIndex !== -1) {
          const movedTask = updatedTasks[movedTaskIndex];
          if (source.droppableId === destination.droppableId) {
            const tasksInColumn = [...updatedTasks.filter(task => task.statusId === source.droppableId)];

            const sortedTasksInColumn = tasksInColumn.sort((a, b) => a.order - b.order);

            const movedTask = sortedTasksInColumn.splice(source.index, 1)[0];
            sortedTasksInColumn.splice(destination.index, 0, movedTask);

            sortedTasksInColumn.forEach((task, index) => {
              task.order = index + 1;
            });

            const updatedTasksCopy = [...updatedTasks];
            let columnIndex = 0;

            updatedTasksCopy.forEach((task, index) => {
              if (task.statusId === source.droppableId) {
                if (columnIndex < sortedTasksInColumn.length) {
                  updatedTasksCopy[index] = sortedTasksInColumn[columnIndex++];
                }
              }
            });

            setTasks(updatedTasksCopy);

            await updateTasks(updatedTasksCopy);
          } else {
            movedTask.statusId = destination.droppableId;
            updatedTasks.splice(movedTaskIndex, 1);

            const tasksInDestinationColumn = updatedTasks.filter(task => task.statusId === destination.droppableId);
            const movedTaskClone = { ...movedTask };
            movedTaskClone.order = destination.index + 1;

            tasksInDestinationColumn.splice(destination.index, 0, movedTaskClone);

            tasksInDestinationColumn.forEach((task, index) => {
              task.order = index + 1;
            });

            const updatedTasksWithoutMoved = updatedTasks.filter(task => task.statusId !== destination.droppableId);
            updatedTasksWithoutMoved.push(...tasksInDestinationColumn);
            updatedTasks.splice(0, updatedTasks.length, ...updatedTasksWithoutMoved);

            const sortedTasks = updatedTasks.sort((a, b) => a.order - b.order);

            setTasks(sortedTasks);
            await updateTasks(sortedTasks);
          }
        }
      }
    } catch (error) {
      console.error('Error in onDragEnd:', error);
    }
  };
  const filteredTasks = tasks.filter(
    task =>
      task.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchText.toLowerCase()),
  );
  return (
    <Layout
      setSearchText={setSearchText}
      headTitle="Kanban"
      breadcrumbs={[
        { title: 'Dashboard', link: '/' },
        { title: 'Kanban', link: '/kanban' },
      ]}
    >
      <div className={styles.addStatusButton}>
        <Button
          text="Add new status"
          onClick={() => setIsAddStatusModalOpen(true)}
          className={styles.newStatusButton}
          size={'small'}
        />
        <Button
          text="Create task"
          onClick={() => setIsAddTaskModalOpen(true)}
          className={styles.newTaskButton}
          size={'small'}
        />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="mainContainer" type="COLUMN" direction="horizontal">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} className={styles.mainContainer}>
              {columns.map((column, index) => (
                <Column
                  key={column.id}
                  index={index}
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
                  users={users}
                  onDelete={handleColumnDelete}
                  filteredTasks={filteredTasks}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      <CreateColumnModal
        newColumn={newColumn}
        setNewColumn={setNewColumn}
        isOpen={isAddStatusModalOpen}
        onClose={closeAddStatusModal}
        onSave={createStatusModal}
      />
      <CreateTaskModal
        onClose={closeAddTaskModal}
        formik={formik}
        isOpen={isAddTaskModalOpen}
        getFieldError={getFieldError}
        getButtonStyle={getButtonStyle}
        stopEditingTask={stopEditingTask}
        users={users}
      />
    </Layout>
  );
};
