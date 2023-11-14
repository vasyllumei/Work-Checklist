import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { AnimatePresence, motion } from 'framer-motion';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import EditIcon from '@mui/icons-material/Edit';
import { ButtonStateType, TaskType } from '@/types/Task';
import { StatusType } from '@/types/Column';
import { createTask, deleteTask, getAllTasks } from '@/services/task/taskService';
import styles from './Column.module.css';
import { useFormik } from 'formik';
import DeleteIcon from '@mui/icons-material/Delete';

const initialCardForm = {
  id: '',
  userId: '',
  assignedTo: '',
  title: '',
  description: '',
  statusId: '',
  avatar: '',
  image: '',
  buttonState: ButtonStateType.Pending,
};

export const Column: React.FC<StatusType> = ({ title }) => {
  const [cards, setCards] = useState<TaskType[]>([]);
  const [editCard, setEditCard] = useState<string | null>(null);
  const [errorExist, setErrorExist] = useState<string>('');
  const [currentColumnTitle, setCurrentColumnTitle] = useState<string>('');

  const userId = localStorage.getItem('userId');
  const assignedTo = localStorage.getItem('assignedTo');

  const formik = useFormik({
    initialValues: initialCardForm,
    onSubmit: async () => {
      try {
        if (formik.values.description && formik.values.buttonState) {
          await handleCardCreate();
        }

        if (errorExist) {
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });
  const fetchTask = async () => {
    try {
      const fetchedTaskData = await getAllTasks();
      const fetchedTask: TaskType[] = fetchedTaskData.data;
      setCards(fetchedTask);
    } catch (error) {
      console.error('Error retrieving the list of tasks:', error);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const handleCardCreate = async () => {
    try {
      if (formik.isValid) {
        const taskData = {
          ...formik.values,
          statusId: currentColumnTitle,
          userId: userId || '',
          assignedTo: assignedTo || '',
        };
        await createTask(taskData);
        await fetchTask();
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
      await fetchTask();
    } catch (error) {
      console.error('Error deleting the user:', error);
    }
  };
  const buttonColor = (buttonState: string) => {
    if (buttonState === 'Pending') {
      return 'yellow';
    } else if (buttonState === 'Updates') {
      return 'blue';
    } else if (buttonState === 'Errors') {
      return 'red';
    } else if (buttonState === 'Done') {
      return 'green';
    } else {
      return '';
    }
  };

  const isCardExpanded = (taskId: string) => editCard === taskId;

  const handleEditing = (taskId: string) => {
    setEditCard(taskId === editCard ? null : taskId);
  };

  const getError = (fieldName: string): string | undefined => {
    const touchedField = formik.touched[fieldName as keyof typeof formik.touched];
    const errorField = formik.errors[fieldName as keyof typeof formik.errors];

    if (touchedField && errorField) {
      return errorField;
    }
    return undefined;
  };

  return (
    <div className={styles.column}>
      <div>
        <input
          type="text"
          value={formik.values.title}
          onChange={formik.handleChange('title')}
          placeholder="New Task Title"
        />
        {getError('title') && <div className={styles.error}>{getError('title')}</div>}
        <input
          type="text"
          value={formik.values.description}
          onChange={formik.handleChange('description')}
          placeholder="New Task Description"
        />
        <input
          type="text"
          value={formik.values.avatar}
          onChange={formik.handleChange('avatar')}
          placeholder="Avatar URL"
        />
        <input
          type="text"
          value={formik.values.image}
          onChange={formik.handleChange('image')}
          placeholder="Image URL"
        />
        <select value={formik.values.statusId} onChange={formik.handleChange('statusId')}>
          <option value="Pending">Pending</option>
          <option value="Updates">Updates</option>
          <option value="Errors">Errors</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div className={styles.titleColumn}>
        <h2 className={styles.title}>{title}</h2>
        <button
          onClick={() => {
            handleCardCreate();
            setCurrentColumnTitle(title);
          }}
          className={styles.addButton}
        >
          <AddIcon />
        </button>
      </div>
      {cards.map((task: TaskType, index: number) => (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {provided => (
            <div ref={provided.innerRef} {...provided.draggableProps} className={styles.cardsContainer}>
              <motion.div className={styles.card} initial={false} layout>
                <div className={styles.titleContainer}>
                  <h2 className={styles.title} {...provided.dragHandleProps}>
                    {task.title}
                  </h2>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.1 }}>
                    <EditIcon onClick={() => handleEditing(task.userId)} className={styles.editIcon} />
                    <DeleteIcon onClick={() => handleTaskDelete(task.id)} className={styles.editIcon} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isCardExpanded(task.userId) ? (
                    <motion.fieldset key="expandedContent" className={styles.editingContent}>
                      {task.image && (
                        <div className={styles.imageContainer}>
                          <img src={task.image} alt={task.title} className={styles.cardImage} />
                        </div>
                      )}
                      <p>{task.description}</p>
                    </motion.fieldset>
                  ) : (
                    <motion.div key="content" className={styles.contentContainer}>
                      {task.image && (
                        <div className={styles.imageContainer}>
                          <img src={task.image} alt={task.title} className={styles.cardImage} />
                        </div>
                      )}
                      <p>{task.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className={styles.actionContainer}>
                  <div className={styles.iconContainer}>
                    {task.avatar &&
                      task.avatar.map((avatar: string, index: number) => (
                        <div key={index} className={styles.avatar}>
                          <img src={avatar} alt={`Avatar ${task.userId}`} />
                        </div>
                      ))}
                  </div>
                  <button
                    className={`${styles.buttonAction} ${
                      task.buttonState ? styles[buttonColor(task.buttonState) as keyof typeof styles] : ''
                    }`}
                  >
                    {task.buttonState}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};
