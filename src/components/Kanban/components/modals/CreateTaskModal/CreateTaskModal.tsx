import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import styles from '@/components/Kanban/components/modals/CreateTaskModal/CreateTaskModal.module.css';
import { Select } from '@/components/Select/Select';
import { BUTTON_STATES } from '@/constants';
import { UserType } from '@/types/User';
interface CreateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  formik: any;
  getFieldError: (fieldName: string) => string | undefined;
  getButtonStyle: (buttonState: string) => { backgroundColor: string };
  stopEditingTask: () => void;
  users: UserType[];
}

export const CreateTaskModal: React.FC<CreateStatusModalProps> = ({
  isOpen,
  onClose,
  formik,
  getFieldError,
  getButtonStyle,
  stopEditingTask,
  users,
}) => {
  const handleCancelTask = () => {
    onClose();
  };
  const usersList = users.map(user => ({
    value: user.id ? user.id.toString() : '',
    label: `${user.firstName} ${user.lastName}`,
  }));
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
          <Select
            label="Select assigned  user"
            value={formik.values.assignedTo}
            onChange={value => formik.setFieldValue('assignedTo', value)}
            options={usersList}
            className={styles.userList}
          />
          <Select
            label="Select a task stage"
            value={formik.values.buttonState}
            onChange={value => formik.setFieldValue('buttonState', value)}
            options={BUTTON_STATES}
            style={getButtonStyle(formik.values.buttonState)}
            className={styles.createTaskButton}
          />
        </div>
      </DialogContent>
      <DialogActions className={styles.buttonsContainer}>
        <Button
          text="Cancel"
          onClick={handleCancelTask}
          className={styles.modalTaskCancel}
          size={'small'}
          outlined={true}
        />
        <Button text="Add Task" onClick={formik.handleSubmit} className={styles.modalTaskAdd} size={'small'} />
      </DialogActions>
    </Dialog>
  );
};
