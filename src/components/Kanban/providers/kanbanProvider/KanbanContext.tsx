import React, { createContext, useEffect, useState } from 'react';
import { ColumnType } from '@/types/Column';
import { TaskType } from '@/types/Task';
import { UserType } from '@/types/User';
import { getAllColumns, createColumn, deleteColumn, updateColumns } from '@/services/column/columnService';
import { getAllTasks, createTask, deleteTask, updateTask, updateTasks } from '@/services/task/taskService';
import { getAllUsers } from '@/services/user/userService';
import { DropResult } from 'react-beautiful-dnd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BLUE_COLOR, GREEN_COLOR, RED_COLOR, YELLOW_COLOR } from '@/constants';
import { Option } from '@/components/Select/Select';

const BUTTON_STATE_COLORS = {
  Updates: BLUE_COLOR,
  Errors: RED_COLOR,
  Done: GREEN_COLOR,
  Pending: YELLOW_COLOR,
};
const initialTaskForm = {
  id: '',
  userId: '',
  assignedTo: '',
  title: '',
  description: '',
  statusId: '',
  avatar: '',
  image: '',
  buttonState: '',
  order: 0,
  editMode: false,
};
interface FormikValues {
  id: string;
  userId: string;
  assignedTo: string;
  title: string;
  description: string;
  statusId: string;
  avatar: string;
  image: string;
  buttonState: string;
  order: number;
  editMode: boolean;
}
export default interface KanbanContextProps {
  usersList: Option[];
  setSelectedAssignedTo: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedButtonState: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAssignedTo: string[];
  selectedButtonState: string[];
  columns: ColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  newColumn: ColumnType;
  setNewColumn: React.Dispatch<React.SetStateAction<ColumnType>>;
  isAddStatusModalOpen: boolean;
  setIsAddStatusModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  users: UserType[];
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  searchText: string;
  handleSearch?: ((text: string) => void) | undefined;
  fetchData: () => void;
  fetchUsers: () => void;
  createStatusModal: () => void;
  closeAddStatusModal: () => void;
  stopEditingTask: () => void;
  getFieldError: (fieldName: string) => string | undefined;
  formik: {
    values: FormikValues;
    touched: Record<string, boolean>;
    errors: Record<string, string>;
    setValues: (values: FormikValues) => void;
    resetForm: () => void;
    setFieldValue: (fieldName: string, value: string | string[]) => void;
    handleSubmit: () => void;
  };
  closeAddTaskModal: () => void;
  onDragEnd: (result: DropResult) => Promise<void>;
  handleColumnDelete: (statusId: string) => Promise<void>;
  onAddNewTask: (columnId?: string) => void;
  isEditMode: boolean;
  handleTaskEdit: (taskId: string) => void;
  getButtonStyle: (buttonState: string) => React.CSSProperties;
  handleTaskDelete: (taskId: string) => Promise<void>;
}
export const KanbanContext = createContext<KanbanContextProps | null>(null);

export const KanbanProvider = ({ children }: { children: JSX.Element }) => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [newColumn, setNewColumn] = useState<ColumnType>({ title: '', order: 0, id: '' });
  const [isAddStatusModalOpen, setIsAddStatusModalOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedAssignedTo, setSelectedAssignedTo] = useState<string[]>([]);
  const [selectedButtonState, setSelectedButtonState] = useState<string[]>([]);

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

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);
  const fetchData = async () => {
    try {
      const { data: columnsData } = await getAllColumns();
      const { data: tasksData } = await getAllTasks();

      const sortedColumns = columnsData.sort((a, b) => a.order - b.order);
      const sortedTasks = tasksData.sort((a, b) => a.order - b.order);

      setColumns(sortedColumns);
      setTasks(sortedTasks);
    } catch (error) {}
  };

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
          userId: localStorage.getItem('currentUser') || '',
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

  const onAddNewTask = (columnId?: string) => {
    formik.resetForm();
    setIsAddTaskModalOpen(true);

    if (columnId) {
      formik.setValues({ ...initialTaskForm, statusId: columnId });
    } else {
      formik.setValues({ ...initialTaskForm, statusId: '' });
    }
  };

  const getButtonStyle = (buttonState: string) => {
    const backgroundColor = (BUTTON_STATE_COLORS as Record<string, string>)[buttonState] || '';
    return {
      backgroundColor,
    };
  };

  const isEditMode = formik.values.editMode;

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

  const onDragEnd = async (result: DropResult) => {
    try {
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

  const handleSearch = (text: string) => {
    setSearchText && setSearchText(text);
  };

  const usersList: { value: string; label: string }[] = users.map((user: UserType) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
  }));

  const value = {
    columns,
    setColumns,
    newColumn,
    setNewColumn,
    isAddStatusModalOpen,
    setIsAddStatusModalOpen,
    tasks,
    setTasks,
    isAddTaskModalOpen,
    setIsAddTaskModalOpen,
    users,
    setUsers,
    searchText,
    handleSearch,
    fetchData,
    handleColumnDelete,
    handleTaskEdit,
    handleTaskDelete,
    getFieldError,
    createStatusModal,
    closeAddStatusModal,
    closeAddTaskModal,
    onAddNewTask,
    getButtonStyle,
    isEditMode,
    stopEditingTask,
    onDragEnd,
    selectedAssignedTo,
    setSelectedAssignedTo,
    selectedButtonState,
    setSelectedButtonState,
    formik,
    fetchUsers,
    usersList,
  };

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
};
