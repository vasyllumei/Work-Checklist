import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { AnimatePresence, motion } from 'framer-motion';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import EditIcon from '@mui/icons-material/Edit';
import { ButtonStateType, TaskType } from '@/types/Task';
import { StatusType } from '@/types/Column';
import { createTask, deleteTask } from '@/services/task/taskService';
import styles from './Column.module.css';
import { useFormik } from 'formik';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextInput } from '@/components/TextInput';

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
  editMode: false,
};

export const Column: React.FC<StatusType & { allTasks: TaskType[] }> = ({ title, id, allTasks }) => {
  const [cards, setCards] = useState<TaskType[]>([]);
  const [editCard, setEditCard] = useState<string | null>(null);
  const [errorExist, setErrorExist] = useState<string>('');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);

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
  const isEditMode = formik.values.editMode;

  const fetchTask = () => {
    const filteredTasks = allTasks.filter(task => task.statusId === id);
    setCards(filteredTasks);
  };

  useEffect(() => {
    fetchTask();
  }, [allTasks, id]);

  const handleCardCreate = async () => {
    try {
      if (formik.isValid) {
        const taskData = {
          ...formik.values,
          statusId: id,
          userId: localStorage.getItem('userId') || '',
          assignedTo: '64db26458eb8527007b38e10',
        };
        await createTask(taskData);
        await fetchTask();
        formik.resetForm();
        setIsAddTaskModalOpen(false);
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
    switch (buttonState) {
      case 'Pending':
        return styles.selectAction;
      case 'Updates':
        return `${styles.selectAction} ${styles.blue}`;
      case 'Errors':
        return `${styles.selectAction} ${styles.red}`;
      case 'Done':
        return `${styles.selectAction} ${styles.green}`;
      default:
        return styles.selectAction;
    }
  };

  const isCardExpanded = (taskId: string) => editCard === taskId;

  const handleTaskEdit = (taskId: string) => {
    try {
      const cardData = cards.find(card => card.id === taskId);
      if (cardData) {
        formik.setValues({
          ...initialCardForm,
          ...cardData,
          editMode: true,
        });
      }
    } catch (error) {
      console.error('Error updating the user', error);
    }
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
      <Dialog open={isAddTaskModalOpen} onClose={() => setIsAddTaskModalOpen(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <div className={styles.taskForm}>
            <TextInput
              label="Title"
              name="title"
              type="text"
              value={formik.values.title || ''}
              onChange={value => formik.setFieldValue('title', value)}
              placeholder="New Task Title"
              error={getError('title')}
            />
            {getError('title') && <div className={styles.error}>{getError('title')}</div>}
            <div className={styles.textAreaContainer}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                maxLength={150}
                minLength={5}
                required
                className={styles.textArea}
                value={formik.values.description}
                onChange={formik.handleChange('description')}
                placeholder="Write description here"
              />
            </div>
            <TextInput
              label="Avatar"
              name="avatar"
              type="text"
              value={formik.values.avatar || ''}
              onChange={value => formik.setFieldValue('avatar', value)}
              placeholder="New avatar"
              error={getError('avatar')}
            />
            <TextInput
              label="Image"
              name="image"
              type="text"
              value={formik.values.image || ''}
              onChange={value => formik.setFieldValue('image', value)}
              placeholder="Image URL"
              error={getError('image')}
            />
            <div className={styles.selectContainer}>
              <select
                value={formik.values.statusId}
                onChange={formik.handleChange('statusId')}
                className={buttonColor(formik.values.statusId)}
              >
                <option value="Pending">Pending</option>
                <option value="Updates">Updates</option>
                <option value="Errors">Errors</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddTaskModalOpen(false)}>Cancel</Button>
          <Button onClick={() => handleCardCreate()}>Add Task</Button>
        </DialogActions>
      </Dialog>
      <div className={styles.titleColumn}>
        <h2 className={styles.title}>{title}</h2>
        <button
          onClick={() => {
            setIsAddTaskModalOpen(true);
            formik.setValues({ ...initialCardForm, statusId: id });
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
                    <EditIcon onClick={() => handleTaskEdit(task.id)} className={styles.editIcon} />
                    <DeleteIcon onClick={() => handleTaskDelete(task.id)} className={styles.editIcon} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isCardExpanded(task.id) && isEditMode ? (
                    <motion.fieldset key="expandedContent" className={styles.editingContent}>
                      {task.image && (
                        <div className={styles.imageContainer}>
                          <img src={task.image} alt={task.title} className={styles.cardImage} />
                        </div>
                      )}
                      <p className={styles.p}>{task.description}</p>
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
