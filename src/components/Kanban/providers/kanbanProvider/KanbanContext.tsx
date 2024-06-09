import React, { createContext, useEffect, useState } from 'react';
import { ColumnType } from '@/types/Column';
import { TaskType } from '@/types/Task';
import { UserType } from '@/types/User';
import { getAllColumns, createColumn, deleteColumn } from '@/services/column/columnService';
import { getAllTasks, createTask, deleteTask, updateTask } from '@/services/task/taskService';
import { getAllUsers } from '@/services/user/userService';
import { DropResult } from 'react-beautiful-dnd';
import { useFormik } from 'formik';
import { BLUE_COLOR, GREEN_COLOR, RED_COLOR, YELLOW_COLOR } from '@/constants';
import { Option } from '@/components/Select/Select';
import { useFilters } from '@/hooks/useFilters';
import { FilterType } from '@/types/Filter';
import { getAllProjects } from '@/services/project/projectService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/projectStore/store';
import handleDragEnd from '@/components/Kanban/utils/onDragEnd';
import { taskValidationSchema } from '@/components/Kanban/components/Column/components/Task/utils';
import { setProjects } from '@/store/projectStore/projectReducer/projectReducers';

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
  projectId: '',
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
  projectId: string;
}
export default interface KanbanContextProps {
  filters: FilterType[];
  handleFilterChange: (filterName: string, selectedOptions: string | string[]) => void;
  usersList: Option[];
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
  const projects = useSelector((state: RootState) => state.project.projects);
  const dispatch = useDispatch();
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [newColumn, setNewColumn] = useState<ColumnType>({ title: '', order: 0, id: '' });
  const [isAddStatusModalOpen, setIsAddStatusModalOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const { filters, handleFilterChange } = useFilters();

  const formik = useFormik({
    initialValues: initialTaskForm,
    validationSchema: taskValidationSchema,
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
  const currentUserString = localStorage.getItem('currentUser') || '';
  const currentUserId = currentUserString ? JSON.parse(currentUserString).user._id : '';

  const activeProject = projects.find(project => project.active);

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeProject) {
      fetchTasks(activeProject.id);
    }
  }, [activeProject]);

  const fetchData = async () => {
    try {
      const { data: projectsData } = await getAllProjects();
      const { data: columnsData } = await getAllColumns();
      dispatch(setProjects(projectsData));
      setColumns(columnsData.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTasks = async (projectId: string) => {
    try {
      const { data: tasksData } = await getAllTasks(projectId);
      setTasks(tasksData.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  const handleColumnCreate = async () => {
    try {
      const columnData = await createColumn(newColumn);
      setColumns(prevColumns => [...prevColumns, columnData]);
      setNewColumn({ title: '', order: 0, id: '' });
      fetchData();
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
      if (formik.isValid && activeProject) {
        const taskData = {
          ...formik.values,
          userId: currentUserId,
          assignedTo: formik.values.assignedTo || '',
          projectId: activeProject.id,
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
    formik.resetForm();
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
    await handleDragEnd(result, columns, tasks, setColumns, setTasks);
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
    formik,
    usersList,
    filters,
    handleFilterChange,
  };

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
};
