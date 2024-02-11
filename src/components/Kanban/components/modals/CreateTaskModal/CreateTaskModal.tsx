import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import styles from '@/components/Kanban/components/modals/CreateTaskModal/CreateTaskModal.module.css';
import { SelectComponent } from '@/components/Select/Select';
import { BUTTON_STATES } from '@/constants';
import { useKanbanContext } from '@/components/Kanban/providers/kanbanProvider';

export const CreateTaskModal = () => {
  const { users, formik, getFieldError, stopEditingTask, columns, closeAddTaskModal, isAddTaskModalOpen } =
    useKanbanContext();
  const [showColumn, setShowColumn] = useState(false);
  const handleCancelTask = () => {
    closeAddTaskModal();
    setShowColumn(false);
  };
  const usersList = users.map(user => ({
    value: user.id ? user.id.toString() : '',
    label: `${user.firstName} ${user.lastName}`,
  }));
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
              label="Select a column"
              value={formik.values.statusId || ''}
              onChange={value => formik.setFieldValue('statusId', value)}
              options={columnList}
            />
          ) : null}
          <SelectComponent
            label="Select assigned  user"
            value={formik.values.assignedTo}
            onChange={value => formik.setFieldValue('assignedTo', value)}
            options={usersList}
          />
          <SelectComponent
            label="Select a task stage"
            value={formik.values.buttonState}
            onChange={value => formik.setFieldValue('buttonState', value)}
            options={BUTTON_STATES}
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
        <Button
          text="Add Task"
          onClick={() => {
            formik.handleSubmit();
            setShowColumn(false);
          }}
          className={styles.modalTaskAdd}
          size={'small'}
        />
      </DialogActions>
    </Dialog>
  );
};
