import React, { FC, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import styles from './Task.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskEditor } from '@/components/Kanban/components/TaskEditor/TaskEditor';
import { Draggable } from 'react-beautiful-dnd';
import { DeleteModal } from '@/components/DeleteModal/DeleteModal';
import parse from 'html-react-parser';
import { useDialogControl } from '@/hooks/useDialogControl';
import { TaskType } from '@/types/Task';
import { useKanbanContext } from '@/components/Kanban/providers/kanbanProvider';
import { useUserDisplayDataMap } from '@/hooks/useUserDisplayDataMap';
import useButtonStyle from '@/hooks/useButtonStyle';
interface TaskProps {
  task: TaskType;
  index: number;
}
export const Task: FC<TaskProps> = ({ task, index }) => {
  const { formik, isEditMode, handleTaskEdit, handleTaskDelete, users } = useKanbanContext();
  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string } | null>(null);
  const { isOpen: isDialogOpen, openDialog: openProjectDialog, closeDialog: closeProjectDialog } = useDialogControl();
  const userDisplayDataMap = useUserDisplayDataMap(users);
  const getButtonStyle = useButtonStyle();

  const handleOpenDeleteTaskModal = (taskId: string, taskTitle: string) => {
    setSelectedTask({ id: taskId, title: taskTitle });
    openProjectDialog();
  };

  const handleCloseDeleteTaskModal = () => {
    closeProjectDialog();
  };

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} className={styles.cardsContainer}>
          <div className={styles.card} {...provided.dragHandleProps}>
            {isEditMode && formik.values.id === task.id && <TaskEditor />}
            <div className={styles.contentContainer}>
              <div className={styles.titleContainer}>
                <h2 className={styles.taskTitle}>{task.title}</h2>
                <div>
                  <EditIcon onClick={() => handleTaskEdit(task.id)} className={styles.editIcon} />
                  <DeleteIcon
                    onClick={() => handleOpenDeleteTaskModal(task.id, task.title)}
                    className={styles.editIcon}
                  />
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
                </div>
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
        </div>
      )}
    </Draggable>
  );
};
