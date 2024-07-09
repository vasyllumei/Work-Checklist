import React, { createContext, useEffect, useState } from 'react';
import { ColumnType } from '@/types/Column';
import { TaskType } from '@/types/Task';
import { UserType } from '@/types/User';
import { getAllColumns } from '@/services/column/columnService';
import { getAllTasks, createTask, deleteTask, updateTask } from '@/services/task/taskService';
import { getAllUsers } from '@/services/user/userService';
import { DropResult } from 'react-beautiful-dnd';
import { useFormik } from 'formik';
import { Option } from '@/components/Select/Select';
import { useFilters } from '@/hooks/useFilters';
import { FilterType } from '@/types/Filter';
import { getAllProjects } from '@/services/project/projectService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/projectStore/store';
import handleDragEnd from '@/components/Kanban/utils/onDragEnd';
import { setProjects } from '@/store/projectStore/projectReducer/projectReducers';
import useFieldError from '@/hooks/useFieldError';
import { taskValidationSchema } from '@/utils';

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
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  users: UserType[];
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  searchText: string;
  handleSearch?: ((text: string) => void) | undefined;
  stopEditingTask: () => void;
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
  onAddNewTask: (columnId?: string) => void;
  isEditMode: boolean;
  handleTaskEdit: (taskId: string) => void;
  handleTaskDelete: (taskId: string) => Promise<void>;
}
export const KanbanContext = createContext<KanbanContextProps | null>(null);

export const KanbanProvider = ({ children }: { children: JSX.Element }) => {
  const projects = useSelector((state: RootState) => state.project.projects);
  const dispatch = useDispatch();
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [column, setColumn] = useState<ColumnType>({ title: '', order: 0, id: '', projectId: '' });
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
    fetchProjects();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeProject) {
      fetchColumns(activeProject.id);
      fetchTasks(activeProject.id);
    }
  }, [activeProject]);

  const fetchProjects = async () => {
    try {
      const { data: projectsData } = await getAllProjects();
      dispatch(setProjects(projectsData));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchColumns = async (projectId: string) => {
    try {
      const { data: columnsData } = await getAllColumns(projectId);
      const columnToRender = columnsData.filter(column => column.title !== 'Backlog');
      setColumns(columnToRender.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
        await fetchProjects();
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
      await fetchProjects();
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
        await fetchProjects();
        formik.resetForm();
        await stopEditingTask();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const { getFieldError } = useFieldError(formik.touched, formik.errors);

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
    newColumn: column,
    setNewColumn: setColumn,
    tasks,
    setTasks,
    isAddTaskModalOpen,
    setIsAddTaskModalOpen,
    users,
    setUsers,
    searchText,
    handleSearch,
    handleTaskEdit,
    handleTaskDelete,
    getFieldError,
    closeAddTaskModal,
    onAddNewTask,
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
