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

export const Column: React.FC<ColumnType> = ({ title }) => {
  const [cards, setCards] = useState<TaskType[]>([]);
  const [editCard, setEditCard] = useState<string | null>(null);
  const [errorExist, setErrorExist] = useState<string>('');

  const formik = useFormik({
    initialValues: initialCardForm,
    onSubmit: async () => {
      try {
        if (formik.values.id) {
        } else {
          await handleCardsCreate();
        }

        if (errorExist) {
          // Handle errors
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
    fetchCards();
  }, []);

  const handleCardsCreate = async () => {
    try {
      if (formik.isValid) {
        await createTask(formik.values);
        await fetchCards();
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        // Handle specific error
      } else {
        console.error('Error creating the user:', error);
      }
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

  const handleOpenDeleteModal = (userId: string) => {
    // Implement the delete modal logic here
  };

  const handleCloseDeleteModal = () => {
    // Implement the close delete modal logic here
  };

  const handleDialogOpen = () => {
    setErrorExist('');
    formik.setValues(initialCardForm);
    // Implement the open dialog logic here
  };

  const handleDialogClose = () => {
    setErrorExist('');
    formik.resetForm();
    // Implement the close dialog logic here
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
          error={getError('text')}
        />
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
      </div>
      <div className={styles.titleColumn}>
        <h2 className={styles.title}>{title}</h2>
        <button onClick={handleCardsCreate} className={styles.addButton}>
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
                    className={`${styles.buttonAction} ${styles[buttonColor(item.statusId) as keyof typeof styles]}`}
                  >
                    {item.statusId}
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
