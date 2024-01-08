import React, { useEffect, useState } from 'react';
import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { createColumn, deleteColumn, getAllColumns } from '@/services/columns/columnService';
import { ColumnType } from '@/types/Column';
import { Column } from '@/components/Kanban/components/Column';
import { createTask, deleteTask, getAllTasks, updateTask } from '@/services/task/taskService';
import { ButtonStateType, TaskType } from '@/types/Task';
import { useFormik } from 'formik';
import { CreateColumnModal } from '@/components/Kanban/components/modals/CreateColumnModal';
import { CreateTaskModal } from '@/components/Kanban/components/modals/CreateTaskModal';
import { Button } from '@/components/Button';
import { BLUE_COLOR, GREEN_COLOR, RED_COLOR, YELLOW_COLOR } from '@/constants';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllUsers } from '@/services/user/userService';
import { UserType } from '@/types/User';

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
        return sortColumnsByOrder(updatedColumns);
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
  const hasTasksInColumn = (columnId: string) => tasks.some(task => task.statusId === columnId);
  const sortColumnsByOrder = (columns: ColumnType[]) => {
    return columns.sort((a: ColumnType, b: ColumnType) => a.order - b.order);
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
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <Layout>
      <div className={styles.addStatusButton}>
        <Button
          text="Add new status"
          onClick={() => setIsAddStatusModalOpen(true)}
          className={styles.newStatusButton}
        />
      </div>

      <div className={styles.mainContainer}>
        {columns.map((column, index) =>
          column ? (
            <div key={index}>
              {!hasTasksInColumn(column.id) && (
                <button onClick={() => handleColumnDelete(column.id)} className={styles.deleteStatusButton}>
                  <DeleteIcon color="primary" />
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
                users={users}
              />
            </div>
          ) : null,
        )}
      </div>

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
        isOpen={isAddTaskModalOpen}
        getFieldError={getFieldError}
        getButtonStyle={getButtonStyle}
        stopEditingTask={stopEditingTask}
        users={users}
      />
    </Layout>
  );
};
