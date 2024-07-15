import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import parse from 'html-react-parser';
import { DeleteModal } from '@/components/modals/DeleteModal/DeleteModal';
import { useDialogControl } from '@/hooks/useDialogControl';
import useButtonStyle from '@/hooks/useButtonStyle';
import { FormikValues } from 'formik';
import { TaskType } from '@/types/Task';
import styles from './Task.module.css';
import { TaskEditModal } from '@/components/modals/TaskEditModal';
import { useUserDisplayDataMap } from '@/hooks/useUserDisplayDataMap';
import { UserType } from '@/types/User';
import { Option, SelectComponent } from '@/components/Select/Select';

interface TaskProps {
  task: TaskType;
  index: number;
  handleTaskEdit: (taskId: string) => void;
  handleTaskDelete: (taskId: string) => Promise<void>;
  sendingList?: Option[];
  usersList: Option[];
  formik: FormikValues;
  handleTaskStatusChange?: (taskId: string, newStatusId: string) => void;
  isEditMode: boolean;
  showSelect?: boolean;
  users: UserType[];
}

export const Task: React.FC<TaskProps> = ({
  task,
  index,
  handleTaskEdit,
  handleTaskDelete,
  sendingList,
  handleTaskStatusChange,
  formik,
  isEditMode,
  usersList,
  showSelect,
  users,
}) => {
  const { isOpen: isDialogOpen, openDialog: openProjectDialog, closeDialog: closeProjectDialog } = useDialogControl();
  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string } | null>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<string>(formik.values.statusId);
  const getButtonStyle = useButtonStyle();
  const userDisplayDataMap = useUserDisplayDataMap(users);

  const onStatusChange = (statusId: string | string[]) => {
    if (typeof statusId === 'string') {
      setSelectedStatusId(statusId);
    }
  };

  const handleOpenDeleteTaskModal = (taskId: string, taskTitle: string) => {
    setSelectedTask({ id: taskId, title: taskTitle });
    openProjectDialog();
  };

  const handleCloseDeleteTaskModal = () => {
    closeProjectDialog();
  };

  const handleEditClick = (taskId: string) => {
    handleTaskEdit(taskId);
  };

  const handleDeleteClick = (taskId: string, taskTitle: string) => {
    handleOpenDeleteTaskModal(taskId, taskTitle);
  };
  const stopEditingTask = () => {
    formik.setFieldValue('editMode', false);
    formik.resetForm();
  };
  const handleSendClick = (taskId: string) => {
    if (handleTaskStatusChange) {
      handleTaskStatusChange(taskId, selectedStatusId);
    }
    setSelectedTask(null);
  };

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div className={styles.card} {...provided.dragHandleProps}>
            <div className={styles.contentContainer}>
              <div className={styles.titleContainer}>
                <h2 className={styles.taskTitle}>{task.title}</h2>
                <span>
                  <EditIcon onClick={() => handleEditClick(task.id)} className={styles.editIcon} />
                  <DeleteIcon onClick={() => handleDeleteClick(task.id, task.title)} className={styles.editIcon} />
                  <DeleteModal
                    title="Delete Task"
                    item={`task "${selectedTask?.title}"`}
                    isOpen={isDialogOpen}
                    onClose={handleCloseDeleteTaskModal}
                    onDelete={async () => {
                      if (selectedTask) {
                        await handleTaskDelete(selectedTask.id);
                        handleCloseDeleteTaskModal();
                      }
                    }}
                  />
                </span>
              </div>
              <div className={styles.taskDescription}>{parse(task.description)}</div>
            </div>
            <div className={styles.actionContainer}>
              <div
                className={styles.avatar}
                style={{
                  backgroundColor: userDisplayDataMap.get(task.assignedTo)?.backgroundColor || 'blue',
                }}
              >
                {userDisplayDataMap.get(task.assignedTo)?.initials}
              </div>
              <button style={getButtonStyle(task.buttonState)} className={styles.buttonAction}>
                {task.buttonState}
              </button>
            </div>
          </div>
          {showSelect && (
            <span className={styles.sendingContainer}>
              <span className={styles.select}>
                <SelectComponent
                  onChange={onStatusChange}
                  label="Choise status"
                  value={selectedStatusId}
                  options={sendingList || []}
                />
              </span>
              <SendIcon onClick={() => handleSendClick(task.id)} className={styles.editIcon} />
            </span>
          )}
          {isEditMode && formik.values.id === task.id && (
            <TaskEditModal
              usersList={usersList}
              isEditMode={isEditMode}
              formik={formik}
              stopEditingTask={stopEditingTask}
            />
          )}
        </div>
      )}
    </Draggable>
  );
};
