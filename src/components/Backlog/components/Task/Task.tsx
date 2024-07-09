import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import parse from 'html-react-parser';
import { DeleteModal } from '@/components/DeleteModal/DeleteModal';
import { Option, SelectComponent } from '@/components/Select/Select';
import { useDialogControl } from '@/hooks/useDialogControl';
import useButtonStyle from '@/hooks/useButtonStyle';
import { FormikValues } from 'formik';
import { TaskType } from '@/types/Task';
import styles from './Task.module.css';

interface TaskProps {
  task: TaskType;
  index: number;
  userDisplayDataMap: Map<string, { backgroundColor: string; initials: string }>;
  handleTaskEdit: (taskId: string) => void;
  handleTaskDelete: (taskId: string) => Promise<void>;
  sendingList: Option[];
  formik: FormikValues;
  handleTaskStatusChange: (taskId: string, newStatusId: string) => void;
}

export const Task: React.FC<TaskProps> = ({
  task,
  index,
  userDisplayDataMap,
  handleTaskEdit,
  handleTaskDelete,
  sendingList,
  handleTaskStatusChange,
  formik,
}) => {
  const { isOpen: isDialogOpen, openDialog: openProjectDialog, closeDialog: closeProjectDialog } = useDialogControl();
  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string } | null>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<string>(formik.values.statusId);
  const getButtonStyle = useButtonStyle();

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

  const handleSendClick = (taskId: string) => {
    handleTaskStatusChange(taskId, selectedStatusId);
    setSelectedTask(null);
  };
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} className={styles.mainContainer}>
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
            {task.avatar || task.buttonState ? (
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
            ) : null}
          </div>
          <span className={styles.sendingContainer}>
            <span className={styles.select}>
              <SelectComponent
                onChange={onStatusChange}
                label="Choise status"
                value={selectedStatusId}
                options={sendingList}
              />{' '}
            </span>
            <SendIcon onClick={() => handleSendClick(task.id)} className={styles.editIcon} />
          </span>
        </div>
      )}
    </Draggable>
  );
};
