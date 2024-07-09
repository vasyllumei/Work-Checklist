import React, { FC } from 'react';
import { FormikValues } from 'formik';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { TextInput } from '@/components/TextInput';
import { Option, SelectComponent } from '@/components/Select/Select';
import { Button } from '@/components/Button';
import styles from './TaskForm.module.css';
import { ColumnType } from '@/types/Column';
import { BUTTON_STATES } from '@/constants';
import useFieldError from '@/hooks/useFieldError';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  formik: FormikValues;
  columns: ColumnType[];
  usersList: Option[];
  showColumn: boolean;
  handleSubmitForm: () => void;
}

export const TaskForm: FC<TaskFormProps> = ({
  isOpen,
  onClose,
  formik,
  columns,
  usersList,
  showColumn,
  handleSubmitForm,
}) => {
  const { getFieldError } = useFieldError(formik.touched, formik.errors);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <div className={styles.taskForm}>
          <TextInput
            label="Title"
            name="title"
            type="text"
            value={formik.values.title || ''}
            onChange={value => formik.setFieldValue('title', value)}
            placeholder="Task Title"
            error={getFieldError('title')}
          />
          <TextInput
            name="description"
            value={formik.values.description || ''}
            onChange={value => formik.setFieldValue('description', value)}
            placeholder="Task Description"
            error={getFieldError('description')}
            label="Description"
            isEditing={true}
          />
          {showColumn && (
            <SelectComponent
              label="Select a column"
              value={formik.values.statusId || ''}
              onChange={value => formik.setFieldValue('statusId', value)}
              options={columns.map(column => ({ value: column.id, label: column.title }))}
            />
          )}
          <SelectComponent
            label="Select assigned user"
            value={formik.values.assignedTo || ''}
            onChange={value => formik.setFieldValue('assignedTo', value)}
            options={usersList}
          />
          <SelectComponent
            label="Select a task stage"
            value={formik.values.buttonState || ''}
            onChange={value => formik.setFieldValue('buttonState', value)}
            options={BUTTON_STATES}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <div className={styles.buttonsContainer}>
          <Button text="Cancel" onClick={onClose} className={styles.modalTaskCancel} size={'small'} outlined />
          <Button text="Submit" onClick={handleSubmitForm} className={styles.modalTaskAdd} size={'small'} />
        </div>
      </DialogActions>
    </Dialog>
  );
};
