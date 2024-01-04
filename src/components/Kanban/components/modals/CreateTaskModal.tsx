import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import styles from '@/components/Kanban/components/modals/CreateTaskModal.module.css';
import { Select } from './../Select/Select';
import { BUTTON_STATES } from '@/constants';
interface CreateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: () => void;
  formik: any;
  getFieldError: (fieldName: string) => string | undefined;
  getButtonStyle: (buttonState: string) => { backgroundColor: string };
  stopEditingTask: () => void;
}

export const CreateTaskModal: React.FC<CreateStatusModalProps> = ({
  isOpen,
  onClose,
  onChange,
  formik,
  getFieldError,
  getButtonStyle,
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
              name={`Description`}
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
          <Select
            value={formik.values.buttonState}
            onChange={value => formik.setFieldValue('buttonState', value)}
            options={BUTTON_STATES}
            style={getButtonStyle(formik.values.buttonState)}
            className={styles.createTaskButton}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button text="Cancel" onClick={handleCancelTask} />
        <Button text="Add Task" onClick={() => handleCreateTask()} />
      </DialogActions>
    </Dialog>
  );
};
