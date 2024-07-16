import React, { FC } from 'react';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import styles from './TaskEditModal.module.css';
import { BUTTON_STATES } from '@/constants';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import useFieldError from '@/hooks/useFieldError';
import { FormikValues } from 'formik';
import { Option, SelectComponent } from '@/components/Select/Select';

interface TaskEditModalProps {
  usersList: Option[];
  isEditMode: boolean;
  formik: FormikValues;
  stopEditingTask: () => void;
}
export const TaskEditModal: FC<TaskEditModalProps> = ({ usersList, isEditMode, formik, stopEditingTask }) => {
  const { getFieldError } = useFieldError(formik.touched, formik.errors);

  return (
    <Dialog open={isEditMode} onClose={stopEditingTask}>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <form className={styles.editingContent}>
          <TextInput
            name={`title-${formik.values.id}`}
            value={formik.values.title || ''}
            onChange={value => {
              formik.setFieldValue('title', value);
            }}
            placeholder="Edit task title"
            error={getFieldError('title')}
            label="Title"
          />
          <TextInput
            name={`description-${formik.values.id}`}
            value={formik.values.description || ''}
            onChange={value => {
              formik.setFieldValue('description', value);
            }}
            placeholder="Edit task description"
            error={getFieldError('description')}
            label="Description"
            isEditing={formik.values.editMode}
          />
          <SelectComponent
            label="Edit assigned  user"
            value={formik.values.assignedTo}
            onChange={value => formik.setFieldValue('assignedTo', value)}
            options={usersList}
          />
          <SelectComponent
            label="Edit task stage"
            value={formik.values.buttonState}
            onChange={value => formik.setFieldValue('buttonState', value)}
            options={BUTTON_STATES}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <div className={styles.taskButtonContainer}>
          <Button text="Cancel" onClick={stopEditingTask} size={'small'} outlined={true} />
          <Button text="Save" onClick={formik.handleSubmit} size={'small'} />
        </div>
      </DialogActions>
    </Dialog>
  );
};
