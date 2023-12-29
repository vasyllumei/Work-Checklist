import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { AnimatePresence, motion } from 'framer-motion';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import EditIcon from '@mui/icons-material/Edit';
import { TaskType } from '@/types/Task';
import { ColumnType } from '@/types/Column';
import styles from './Column.module.css';
import DeleteIcon from '@mui/icons-material/Delete';

type ColumnPropsType = {
  tasks: TaskType[];
  column: ColumnType;
  fetchData: () => void;
  children: React.ReactNode;
  isEditMode: boolean;
  handleTaskEdit: (taskId: string) => void;
  handleTaskDelete: (taskId: string) => void;
  isCardExpanded: (taskId: string) => boolean;
  setIsAddTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialTaskForm: any;
  formik: any;
  isAddTaskModalOpen: boolean;
  buttonColorClassName: any;
};
export const Column: React.FC<ColumnPropsType> = ({
  column,
  tasks,
  children,
  isEditMode,
  handleTaskEdit,
  handleTaskDelete,
  isCardExpanded,
  setIsAddTaskModalOpen,
  initialTaskForm,
  formik,
  buttonColorClassName,
}) => {
  return (
    <div className={styles.column}>
      {children}
      <div className={styles.titleColumn}>
        <h2 className={styles.title}>{column.title}</h2>
        <button
          onClick={() => {
            setIsAddTaskModalOpen(true);
            formik.setValues({ ...initialTaskForm, statusId: column.id });
          }}
          className={styles.addButton}
        >
          <AddIcon />
        </button>
      </div>
      {tasks.map((task: TaskType, index: number) => (
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
                  <button className={`${styles.buttonAction} ${buttonColorClassName(task.buttonState)}`}>
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
