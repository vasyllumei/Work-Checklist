import React, { createContext, useEffect, useState } from 'react';
import { ColumnType } from '@/types/Column';
import { TaskType } from '@/types/Task';
import { UserType } from '@/types/User';
import { getAllColumns } from '@/services/column/columnService';
import { getAllTasks, createTask, deleteTask, updateTask } from '@/services/task/taskService';
import { getAllUsers } from '@/services/user/userService';
import { DropResult } from 'react-beautiful-dnd';
import { useFilters } from '@/hooks/useFilters';
import { FilterType } from '@/types/Filter';
import { getAllProjects } from '@/services/project/projectService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/projectStore/store';
import handleDragEnd from '@/components/Kanban/utils/onDragEnd';
import { setProjects } from '@/store/projectStore/projectReducer/projectReducers';
import useTaskForm from '@/hooks/useTaskForm';
import { Option } from '@/components/Select/Select';

interface FormikTaskValues {
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
  columns: ColumnType[];
  onDragEnd: (result: DropResult) => Promise<void>;
  filters: FilterType[];
  searchText: string;
  handleFilterChange: (filterName: string, selectedOptions: string | string[]) => void;
  handleSearch?: ((text: string) => void) | undefined;
  usersList: Option[];
  setIsAddTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAddTaskModalOpen: boolean;
  closeAddTaskModal: () => void;
  isEditMode: boolean;
  tasks: TaskType[];
  onAddNewTask: (columnId?: string) => void;
  handleTaskEdit: (taskId: string) => void;
  handleTaskDelete: (taskId: string) => Promise<void>;
  users: UserType[];

  formik: {
    values: FormikTaskValues;
    touched: Record<string, boolean>;
    errors: Record<string, string>;
    setValues: (values: FormikTaskValues) => void;
    resetForm: () => void;
    setFieldValue: (fieldName: string, value: string | string[]) => void;
    handleSubmit: () => void;
  };
}

export const KanbanContext = createContext<KanbanContextProps | null>(null);

export const KanbanProvider = ({ children }: { children: JSX.Element }) => {
  const projects = useSelector((state: RootState) => state.project.projects);
  const dispatch = useDispatch();
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const { filters, handleFilterChange } = useFilters();

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
          ...formik.initialValues,
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
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const closeAddTaskModal = () => {
    formik.resetForm();
    setIsAddTaskModalOpen(false);
  };

  const onAddNewTask = (columnId?: string) => {
    setIsAddTaskModalOpen(true);
    if (columnId) {
      formik.setValues({ ...formik.initialValues, statusId: columnId });
    } else {
      formik.setValues({ ...formik.initialValues, statusId: '' });
    }
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

  const formik = useTaskForm(handleSaveUpdatedTask, handleTaskCreate);
  const isEditMode = formik.values.editMode;

  const value = {
    columns,
    onDragEnd,
    filters,
    searchText,
    handleFilterChange,
    handleSearch,
    usersList,
    setIsAddTaskModalOpen,
    isAddTaskModalOpen,
    formik,
    closeAddTaskModal,
    isEditMode,
    tasks,
    onAddNewTask,
    handleTaskEdit,
    handleTaskDelete,
    users,
  };

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
};
