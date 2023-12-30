import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import styles from '@/components/Kanban/Kanban.module.css';

interface CreateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: () => void;
  formik: any;
  getFieldError: any;
  buttonColorClassName: (buttonState: string) => string;
  task: any;
  stopEditingTask: any;
}

export const CreateTaskModal: React.FC<CreateStatusModalProps> = ({
  isOpen,
  onClose,
  onChange,
  formik,
  getFieldError,
  buttonColorClassName,
  task,
  stopEditingTask,
}) => {
  const handleCreateTask = async () => {
    await onChange();
    onClose();
  };

  const handleCancelTask = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleCancelTask}>
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
            error={getFieldError('title')}
          />
          {getFieldError('title') && <div className={styles.error}>{getFieldError('title')}</div>}
          <div className={styles.textAreaContainer}>
            <TextInput
              name={`description-${task.id}`}
              value={formik.values.description || ''}
              onChange={value => {
                formik.setFieldValue('description', value);
              }}
              placeholder="New task description"
              error={getFieldError('description')}
              label="Description"
              isEditing={true}
              onBlur={stopEditingTask}
            />
          </div>
          <TextInput
            label="Avatar"
            name="avatar"
            type="text"
            value={formik.values.avatar || ''}
            onChange={value => formik.setFieldValue('avatar', value)}
            placeholder="New avatar"
            error={getFieldError('avatar')}
          />
          <TextInput
            label="Image"
            name="image"
            type="text"
            value={formik.values.image || ''}
            onChange={value => formik.setFieldValue('image', value)}
            placeholder="Image URL"
            error={getFieldError('image')}
          />
          <div className={styles.selectContainer}>
            <select
              value={formik.values.buttonState}
              onChange={formik.handleChange('buttonState')}
              className={buttonColorClassName(formik.values.buttonState)}
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
        <Button text="Cancel" onClick={handleCancelTask} />
        <Button text="Add Task" onClick={() => handleCreateTask()} />
      </DialogActions>
    </Dialog>
  );
};
