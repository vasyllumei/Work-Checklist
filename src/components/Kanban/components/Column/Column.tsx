import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { AnimatePresence, motion } from 'framer-motion';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import EditIcon from '@mui/icons-material/Edit';
import { TaskType } from '@/types/Task';
import { ColumnType } from '@/types/Column';
import styles from './Column.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskEditor } from '@/components/Kanban/components/TaskEditor/TaskEditor';
import { ColumnTitleEdit } from '@/components/Kanban/components/ColumnTitleEdit/ColumnTitleEdit';

type ColumnPropsType = {
  tasks: TaskType[];
  column: ColumnType;
  fetchData: () => void;
  isEditMode: boolean;
  handleTaskEdit: (taskId: string) => void;
  handleTaskDelete: (taskId: string) => void;
  isCardExpanded: (taskId: string) => boolean;
  isAddTaskModalOpen: boolean;
  getButtonStyle: (buttonState: string) => { backgroundColor: string };
  onAddNewTask: (columnId: string) => void;
  startEditingTask: (taskId: string) => void;
  formik: any;
  getFieldError: (fieldName: string) => string | undefined;
  handleSaveUpdatedTask: () => void;
  stopEditingTask: () => void;
  handleSaveUpdatedColumn: () => void;
  handleColumnEdit: (columnId: string, newTitle: string) => void;
};
export const Column: React.FC<ColumnPropsType> = ({
  column,
  tasks,
  handleTaskEdit,
  handleTaskDelete,
  onAddNewTask,
  getButtonStyle,
  formik,
  getFieldError,
  handleSaveUpdatedTask,
  stopEditingTask,
  isEditMode,
  handleColumnEdit,
  handleSaveUpdatedColumn,
}) => {
  return (
    <div className={styles.column}>
      <div className={styles.titleColumn}>
        <h2 className={styles.title}>
          <ColumnTitleEdit
            column={column}
            onEditTitle={newTitle => handleColumnEdit(column.id, newTitle)}
            onSave={handleSaveUpdatedColumn}
          />
        </h2>
        <button onClick={() => onAddNewTask(column.id)} className={styles.addButton}>
          <AddIcon />
        </button>
      </div>
      {tasks.map((task: TaskType, index: number) => (
        <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={isEditMode}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={styles.cardsContainer}
              style={{
                ...provided.draggableProps.style,
                boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
              }}
            >
              <motion.div className={styles.card} initial={false} layout>
                <AnimatePresence>
                  {isEditMode && formik.values.id === task.id ? (
                    <motion.div key="expandedContent">
                      <TaskEditor
                        formik={formik}
                        getFieldError={getFieldError}
                        getButtonStyle={getButtonStyle}
                        handleSaveUpdatedTask={handleSaveUpdatedTask}
                        stopEditingTask={stopEditingTask}
                      />
                    </motion.div>
                  ) : (
                    <motion.div key="content" className={styles.contentContainer}>
                      <div className={styles.titleContainer} {...provided.dragHandleProps}>
                        <h2 className={styles.title}>{task.title}</h2>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.1 }}>
                          <EditIcon onClick={() => handleTaskEdit(task.id)} className={styles.editIcon} />
                          <DeleteIcon onClick={() => handleTaskDelete(task.id)} className={styles.editIcon} />
                        </motion.div>
                      </div>
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
                  {!isEditMode || (isEditMode && formik.values.id !== task.id) ? (
                    <button style={getButtonStyle(task.buttonState)} className={styles.buttonAction}>
                      {task.buttonState}
                    </button>
                  ) : null}
                </div>
              </motion.div>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};
