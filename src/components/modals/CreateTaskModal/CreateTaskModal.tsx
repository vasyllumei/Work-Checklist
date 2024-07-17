import React, { FC, useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import styles from '@/components/modals/CreateTaskModal/CreateTaskModal.module.css';
import { BUTTON_STATES } from '@/constants';
import useFieldError from '@/hooks/useFieldError';
import { ColumnType } from '@/types/Column';
import { FormikValues } from 'formik';
import { Option, SelectComponent } from '@/components/Select/Select';

interface CreateTaskModalProps {
  usersList: Option[];
  formik: FormikValues;
  columns: ColumnType[];
  closeAddTaskModal: () => void;
  isAddTaskModalOpen: boolean;
}
export const CreateTaskModal: FC<CreateTaskModalProps> = ({
  usersList,
  formik,
  columns,
  closeAddTaskModal,
  isAddTaskModalOpen,
}) => {
  const [showColumn, setShowColumn] = useState(false);
  const { getFieldError } = useFieldError(formik.touched, formik.errors);

  const handleCancelTask = () => {
    closeAddTaskModal();
    setShowColumn(false);
  };
  const handleSubmitForm = () => {
    formik.handleSubmit();
    if (!formik.errors) {
      setShowColumn(false);
    }
  };
  const stopEditingTask = () => {
    formik.setFieldValue('editMode', false);
    formik.resetForm();
  };
  const columnList = columns.map(column => ({
    value: column.id,
    label: `${column.title}`,
  }));

  useEffect(() => {
    if (!formik.values.statusId && isAddTaskModalOpen) {
      setShowColumn(true);
    }
  }, [formik.values.statusId, isAddTaskModalOpen]);

  return (
    <Dialog open={isAddTaskModalOpen} onClose={handleCancelTask}>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <form className={styles.taskForm}>
          <TextInput
            label="Title"
            name="title"
            type="text"
            value={formik.values.title || ''}
            onChange={value => formik.setFieldValue('title', value)}
            placeholder="New Task Title"
            error={getFieldError('title')}
          />
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
          {showColumn ? (
            <SelectComponent
              label="column"
              value={formik.values.statusId || ''}
              onChange={value => formik.setFieldValue('statusId', value)}
              options={columnList}
            />
          ) : null}
          <SelectComponent
            label="assigned  user"
            value={formik.values.assignedTo || ''}
            onChange={value => formik.setFieldValue('assignedTo', value)}
            options={usersList}
          />
          <SelectComponent
            label="task stage"
            value={formik.values.buttonState || ''}
            onChange={value => formik.setFieldValue('buttonState', value)}
            options={BUTTON_STATES}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <div className={styles.buttonsContainer}>
          <Button text="Cancel" onClick={handleCancelTask} size={'medium'} outlined={true} />
          <Button text="Add Task" onClick={handleSubmitForm} size={'medium'} />
        </div>
      </DialogActions>
    </Dialog>
  );
};
