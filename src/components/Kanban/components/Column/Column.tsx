import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { AnimatePresence, motion } from 'framer-motion';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import EditIcon from '@mui/icons-material/Edit';
import { TaskType } from '@/types/Task';
import { ColumnType } from '@/types/Column';
import { createTask, getAllTasks } from '@/services/task/taskService';
import styles from './Column.module.css';
import { useFormik } from 'formik';

const initialCardForm = {
  userId: '',
  assignedTo: '',
  title: '',
  description: '',
  statusId: '',
  avatar: '',
  image: '',
};

export const Column: React.FC<ColumnType> = ({ title, currentUser }) => {
  const [cards, setCards] = useState<TaskType[]>([]);
  const [editCard, setEditCard] = useState<string | null>(null);
  const [errorExist, setErrorExist] = useState<string>('');

  const userId = currentUser?.id;

  const formik = useFormik({
    initialValues: initialCardForm,
    onSubmit: async () => {
      try {
        if (formik.values.title) {
          await handleCardCreate();
        }

        if (errorExist) {
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  const fetchCards = async () => {
    try {
      const fetchedCardsData = await getAllTasks();
      const fetchedCards: TaskType[] = fetchedCardsData.data;
      setCards(fetchedCards);
    } catch (error) {
      console.error('Error retrieving the list of tasks:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCards();
      } catch (error) {
        console.error('Error retrieving the list of tasks:', error);
      }
    };

    fetchData();
  }, []);

  const handleCardCreate = async () => {
    try {
      if (formik.isValid && currentUser && currentUser.id) {
        const newTask = {
          userId: userId || '',
          assignedTo: currentUser.id,
          title: formik.values.title || '',
          description: formik.values.description || '',
          statusId: formik.values.statusId || '', // Теперь берем значение из формы
          buttonState: buttonColor(formik.values.statusId || ''), // Теперь берем значение из формы
        };

        const response = await createTask(newTask);

        console.log(response);
        await fetchCards();
        formik.resetForm();
      }
    } catch (error: any) {
      console.error('Error creating the task:', error);
      setErrorExist(error.message);
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

  const isCardExpanded = (itemId: string) => editCard === itemId;

  const handleEditing = (itemId: string) => {
    setEditCard(itemId === editCard ? null : itemId);
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
        <button onClick={handleCardCreate} className={styles.addButton}>
          <AddIcon />
        </button>
      </div>
      {cards.map((item: TaskType, index: number) => (
        <Draggable key={item.userId} draggableId={item.userId} index={index}>
          {provided => (
            <div ref={provided.innerRef} {...provided.draggableProps} className={styles.cardsContainer}>
              <motion.div className={styles.card} initial={false} layout>
                <div className={styles.titleContainer}>
                  <h2 className={styles.title} {...provided.dragHandleProps}>
                    {item.title}
                  </h2>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.1 }}>
                    <EditIcon onClick={() => handleEditing(item.userId)} className={styles.editIcon} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isCardExpanded(item.userId) ? (
                    <motion.fieldset key="expandedContent" className={styles.editingContent}>
                      {item.image && (
                        <div className={styles.imageContainer}>
                          <img src={item.image} alt={item.title} className={styles.cardImage} />
                        </div>
                      )}
                      <p>{item.description}</p>
                    </motion.fieldset>
                  ) : (
                    <motion.div key="content" className={styles.contentContainer}>
                      {item.image && (
                        <div className={styles.imageContainer}>
                          <img src={item.image} alt={item.title} className={styles.cardImage} />
                        </div>
                      )}
                      <p>{item.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className={styles.actionContainer}>
                  <div className={styles.iconContainer}>
                    {item.avatar &&
                      item.avatar.map((avatar: string, index: number) => (
                        <div key={index} className={styles.avatar}>
                          <img src={avatar} alt={`Avatar ${item.userId}`} />
                        </div>
                      ))}
                  </div>
                  <button
                    className={`${styles.buttonAction} ${
                      item.buttonState ? styles[buttonColor(item.buttonState) as keyof typeof styles] : ''
                    }`}
                  >
                    {item.buttonState}
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
