import React, { useEffect, useState } from 'react';
import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { createColumn, deleteColumn, getAllColumns, updateColumns } from '@/services/columns/columnService';
import { ColumnType } from '@/types/Column';
import { Column } from '@/components/Kanban/components/Column';
import { createTask, deleteTask, getAllTasks, updateTask, updateTasks } from '@/services/task/taskService';
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
      setTasks(sortedTasks);
      setColumns(sortColumnsByOrder(columnsData));
    } catch (error) {
      console.error('Error loading columns:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);

  const handleColumnCreate = async () => {
    try {
      const columnData = await createColumn(newColumn);
      setColumns(prevColumns => {
        const updatedColumns = [...prevColumns, columnData];
        return sortColumnsByOrder(updatedColumns);
      });
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
  const hasTasksInColumn = (columnId: string) =>
    tasks.some(task => task.statusId !== undefined && task.statusId === columnId);
  const sortColumnsByOrder = (columns: ColumnType[]) => {
    return columns.sort((a: ColumnType, b: ColumnType) => {
      if (a.order < b.order) {
        return -1;
      }
      if (a.order > b.order) {
        return 1;
      }
      return 0;
    });
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
        const movedColumn = updatedColumns[source.index];
        const replacedColumn = updatedColumns[destination.index];
        const tempOrder = movedColumn.order;
        movedColumn.order = replacedColumn.order;
        replacedColumn.order = tempOrder;
        updatedColumns.splice(source.index, 1, replacedColumn);
        updatedColumns.splice(destination.index, 1, movedColumn);
        setColumns(updatedColumns);
        await updateColumns(updatedColumns);
      } else if (type === 'TASK') {
        const updatedTasks = [...tasks];
        const movedTaskIndex = updatedTasks.findIndex(task => task.id === draggableId);

        if (movedTaskIndex !== -1) {
          const movedTask = updatedTasks[movedTaskIndex];
          if (source.droppableId === destination.droppableId) {
            console.log('Reordering tasks in the same column.');

            // Создаем копию массива задач в колонне
            const tasksInColumn = [...updatedTasks.filter(task => task.statusId === source.droppableId)];

            // Убеждаемся, что задачи в колонне отсортированы по order
            const sortedTasksInColumn = tasksInColumn.sort((a, b) => a.order - b.order);

            // Перемещаем задачу внутри колонны
            const movedTask = sortedTasksInColumn.splice(source.index, 1)[0];
            sortedTasksInColumn.splice(destination.index, 0, movedTask);

            // Обновляем порядок order внутри колонны
            sortedTasksInColumn.forEach((task, index) => {
              task.order = index + 1;
            });

            // Обновляем общий массив задач
            const updatedTasksCopy = [...updatedTasks];
            let columnIndex = 0;

            updatedTasksCopy.forEach((task, index) => {
              if (task.statusId === source.droppableId) {
                // Убеждаемся, что мы не выходим за границы массива
                if (columnIndex < sortedTasksInColumn.length) {
                  updatedTasksCopy[index] = sortedTasksInColumn[columnIndex++];
                }
              }
            });

            // Устанавливаем новое состояние задач
            setTasks(updatedTasksCopy);

            // Обновляем задачи в базе данных
            await updateTasks(updatedTasksCopy);
          } else {
            console.log('Moving task to a different column.');
            movedTask.statusId = destination.droppableId;
            updatedTasks.splice(movedTaskIndex, 1);

            const tasksInDestinationColumn = updatedTasks.filter(task => task.statusId === destination.droppableId);
            const movedTaskClone = { ...movedTask };

            // Используйте destination.index для обновления order в новой колонке
            movedTaskClone.order = destination.index + 1;

            tasksInDestinationColumn.splice(destination.index, 0, movedTaskClone);

            const updatedTasksWithoutMoved = updatedTasks.filter(task => task.statusId !== destination.droppableId);
            updatedTasksWithoutMoved.push(...tasksInDestinationColumn);
            updatedTasks.splice(0, updatedTasks.length, ...updatedTasksWithoutMoved);

            console.log('Updated tasks:', updatedTasks);

            const sortedTasks = updatedTasks.sort((a, b) => a.order - b.order);
            console.log('Sorted tasks:', sortedTasks);

            setTasks(sortedTasks);
            await updateTasks(sortedTasks);
          }
        }
      }
    } catch (error) {
      console.error('Error in onDragEnd:', error);
    }
  };

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
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((column, index) => (
            <StrictModeDroppable key={column.id} droppableId={column.id} type="COLUMN">
              {provided => (
                <div key={column.id}>
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {!hasTasksInColumn(column.id) && (
                      <button onClick={() => handleColumnDelete(column.id)} className={styles.deleteStatusButton}>
                        <DeleteIcon color="primary" />
                      </button>
                    )}

                    <Column
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
                    />
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          ))}
        </DragDropContext>
      </div>

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
