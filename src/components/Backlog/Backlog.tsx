import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictDroppable/StrictModeDroppable';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/projectStore/store';
import styles from './Backlog.module.css';
import { getAllColumns } from '@/services/column/columnService';
import { ColumnType } from '@/types/Column';
import { getAllProjects } from '@/services/project/projectService';
import { setProjects } from '@/store/projectStore/projectReducer/projectReducers';
import { createTask, deleteTask, getAllTasks, updateTask, updateTasks } from '@/services/task/taskService';
import { TaskType } from '@/types/Task';
import { getAllUsers } from '@/services/user/userService';
import { UserType } from '@/types/User';
import { useUserDisplayDataMap } from '@/hooks/useUserDisplayDataMap';
import { useFormik } from 'formik';
import { Button } from '@/components/Button';
import { Filter, FilterOption } from '@/components/Filter/Filter';
import { Filters } from '@/components/Kanban';
import { useFilters } from '@/hooks/useFilters';
import { BUTTON_STATES } from '@/constants';
import { TaskForm } from '@/components/Backlog/components/TaskForm';
import { Task } from '@/components/Backlog/components/Task/Task';
import { taskValidationSchema } from '@/utils';
export const initialTaskForm = {
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
export const Backlog = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [showColumn, setShowColumn] = useState(false);

  const userDisplayDataMap = useUserDisplayDataMap(users);
  const { filters, handleFilterChange } = useFilters();
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.project.projects);
  const activeProject = projects.find(project => project.active);
  const backLogColumn = columns.find(column => column.title === 'Backlog');

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
  const fetchInitialData = async () => {
    try {
      const [{ data: projectsData }, { data: usersData }] = await Promise.all([getAllProjects(), getAllUsers()]);
      dispatch(setProjects(projectsData));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };
  useEffect(() => {
    fetchInitialData();
  }, [dispatch]);
  const closeAddTaskModal = () => {
    formik.resetForm();
    setIsAddTaskModalOpen(false);
  };
  const usersList: { value: string; label: string }[] = users.map((user: UserType) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
  }));

  const sendingList = columns
    .filter(column => column.title !== 'Backlog')
    .map(column => ({
      value: column.id,
      label: `${column.title}`,
    }));

  const handleCancelTask = () => {
    closeAddTaskModal();
    setShowColumn(false);
  };
  const handleSubmitForm = () => {
    formik.handleSubmit();
    if (!formik.errors) {
      setShowColumn(false);
    }
  };
  const fetchProjectData = async (projectId: string) => {
    try {
      const [{ data: columnsData }, { data: tasksData }] = await Promise.all([
        getAllColumns(projectId),
        getAllTasks(projectId),
      ]);
      setColumns(columnsData.sort((a, b) => a.order - b.order));
      const backLogColumnId = columnsData.find(column => column.title === 'Backlog')?.id;
      setTasks(
        tasksData
          .filter(task => backLogColumnId && task.statusId === backLogColumnId)
          .sort((a, b) => a.order - b.order),
      );
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  useEffect(() => {
    if (activeProject) {
      fetchProjectData(activeProject.id);
    }
  }, [activeProject]);

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
        if (activeProject) await fetchProjectData(activeProject.id);
        formik.resetForm();
      }
    } catch (error) {
      console.error('Error updating task:', error);
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
          statusId: backLogColumn?.id || '',
        };
        await createTask(taskData);
        await fetchInitialData();
        formik.resetForm();
        setIsAddTaskModalOpen(false);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        console.error('Error creating the card:', error);
      }
    }
  };
  const onAddNewTask = (columnId?: string) => {
    setIsAddTaskModalOpen(true);
    formik.setValues({ ...initialTaskForm, statusId: columnId || '' });
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      if (activeProject) await fetchProjectData(activeProject.id);
    } catch (error) {
      console.error('Error deleting the task:', error);
    }
  };

  const backLogFiltersOptions: FilterOption[] = [
    {
      name: Filters.ASSIGNED_TO,
      label: 'assignedUsers',
      options: usersList,
      applyOnChange: true,
    },
    {
      name: Filters.BUTTON_STATE,
      label: 'buttonsStates',
      options: BUTTON_STATES,
      applyOnChange: true,
    },
  ];
  const handleTaskDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination || source.index === destination.index) {
      return;
    }

    const updatedTasks = [...tasks];
    const movedTask = updatedTasks.splice(source.index, 1)[0];
    updatedTasks.splice(destination.index, 0, movedTask);

    updatedTasks.forEach((column, index) => {
      column.order = index + 1;
    });
    const sortedTasks = updatedTasks.sort((a, b) => a.order - b.order);

    setTasks(sortedTasks);
    await updateTasks(sortedTasks);
  };

  const handleTaskStatusChange = async (taskId: string, newStatusId: string) => {
    try {
      await updateTask(taskId, { statusId: newStatusId } as TaskType);
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => (task.id === taskId ? { ...task, statusId: newStatusId } : task));
        return updatedTasks.sort((a, b) => a.order - b.order);
      });
      fetchInitialData();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  return (
    <Layout
      headTitle="backlog"
      breadcrumbs={[
        { title: 'dashboard', link: '/' },
        { title: 'backlog', link: '/backlog' },
      ]}
    >
      <div>
        {activeProject ? (
          <>
            <div className={styles.addStatusButton}>
              <Button
                text={'Add task'}
                onClick={() => onAddNewTask(backLogColumn?.id)}
                className={styles.newTaskButton}
                size={'small'}
              />
              <Filter
                filters={backLogFiltersOptions}
                value={filters}
                handleFilterChange={handleFilterChange}
                clearAll
                projectId={activeProject.id}
              />
            </div>
            <div className={styles.projectTitleName} style={{ color: activeProject.color }}>
              {activeProject.title}
            </div>
            <div className={styles.titleDivider} style={{ backgroundColor: activeProject.color }} />
            <DragDropContext onDragEnd={handleTaskDragEnd}>
              <StrictModeDroppable droppableId="columnContainer">
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={styles.droppable}>
                    {tasks.map((task, index) => (
                      <Task
                        key={task.id}
                        task={task}
                        index={index}
                        userDisplayDataMap={userDisplayDataMap}
                        handleTaskEdit={handleTaskEdit}
                        handleTaskDelete={handleTaskDelete}
                        sendingList={sendingList}
                        formik={formik}
                        handleTaskStatusChange={handleTaskStatusChange}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
            <TaskForm
              formik={formik}
              isOpen={isAddTaskModalOpen}
              onClose={handleCancelTask}
              columns={columns}
              showColumn={showColumn}
              usersList={usersList}
              handleSubmitForm={handleSubmitForm}
            />
          </>
        ) : null}
      </div>
    </Layout>
  );
};
