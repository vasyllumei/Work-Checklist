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
import { createTask, deleteTask, getAllTasks, updateTask } from '@/services/task/taskService';
import { TaskType } from '@/types/Task';
import { getAllUsers } from '@/services/user/userService';
import { UserType } from '@/types/User';
import { Filter, FilterOption } from '@/components/Filter/Filter';
import { useFilters } from '@/hooks/useFilters';
import { BUTTON_STATES } from '@/constants';
import { Task } from '@/components/Task/Task';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal/CreateTaskModal';
import useTaskForm from '@/hooks/useTaskForm';
import { breadcrumbsBacklog } from '@/components/Backlog/utils';
import { handleTaskDragEnd } from '@/components/Backlog/utils/onDragEndTask';
export enum Filters {
  ASSIGNED_TO = 'assignedTo',
  BUTTON_STATE = 'buttonState',
}
export const Backlog = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);

  const { filters, handleFilterChange } = useFilters();
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.project.projects);
  const activeProject = projects.find(project => project.active);
  const backLogColumn = columns.find(column => column.title === 'Backlog');
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

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      if (activeProject) await fetchProjectData(activeProject.id);
    } catch (error) {
      console.error('Error deleting the task:', error);
    }
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

  useEffect(() => {
    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    if (activeProject) {
      fetchProjectData(activeProject.id);
    }
  }, [activeProject]);

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

  const onAddNewTask = (columnId?: string) => {
    setIsAddTaskModalOpen(true);
    formik.setValues({ ...formik.initialValues, statusId: columnId || '' });
  };

  const handleTaskDragEndLocal = (result: DropResult) => {
    handleTaskDragEnd(result, tasks, setTasks);
  };

  const formik = useTaskForm(handleSaveUpdatedTask, handleTaskCreate);
  const isEditMode = formik.values.editMode;

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
  return (
    <Layout headTitle="backlog" breadcrumbs={breadcrumbsBacklog}>
      <main>
        {activeProject ? (
          <section>
            <Filter
              filters={backLogFiltersOptions}
              value={filters}
              handleFilterChange={handleFilterChange}
              clearAll
              projectId={activeProject.id}
              addItem
              backLogColumn={backLogColumn}
              onAddNewTask={onAddNewTask}
            />
            <header className={styles.projectTitleName} style={{ color: activeProject.color }}>
              {activeProject.title}
            </header>
            <div className={styles.titleDivider} style={{ backgroundColor: activeProject.color }} />
            <DragDropContext onDragEnd={handleTaskDragEndLocal}>
              <StrictModeDroppable droppableId="columnContainer">
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={styles.droppable}>
                    {tasks.map((task, index) => (
                      <Task
                        key={task.id}
                        task={task}
                        index={index}
                        handleTaskEdit={handleTaskEdit}
                        handleTaskDelete={handleTaskDelete}
                        sendingList={sendingList}
                        formik={formik}
                        handleTaskStatusChange={handleTaskStatusChange}
                        isEditMode={isEditMode}
                        usersList={usersList}
                        users={users}
                        showSelect
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
            <CreateTaskModal
              usersList={usersList}
              formik={formik}
              columns={columns}
              closeAddTaskModal={closeAddTaskModal}
              isAddTaskModalOpen={isAddTaskModalOpen}
            />
          </section>
        ) : null}
      </main>
    </Layout>
  );
};
