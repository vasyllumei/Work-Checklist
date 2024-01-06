import React from 'react';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import styles from './TaskEditor.module.css';
import { Select } from '@/components/Kanban/components/Select/Select';
import { BUTTON_STATES } from '@/constants';

type TaskEditorPropsType = {
  formik: any;
  getFieldError: (fieldName: string) => string | undefined;
  handleSaveUpdatedTask: () => void;
  stopEditingTask: () => void;
  getButtonStyle: (buttonState: string) => { backgroundColor: string };
};
export const TaskEditor: React.FC<TaskEditorPropsType> = ({
  formik,
  getFieldError,
  getButtonStyle,
  stopEditingTask,
}) => {
  return (
    <div className={styles.editingContent}>
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
      <Select
        value={formik.values.buttonState}
        onChange={value => formik.setFieldValue('buttonState', value)}
        options={BUTTON_STATES}
        style={getButtonStyle(formik.values.buttonState)}
        className={styles.editingButtonAction}
      />
      <div className={styles.taskButtonContainer}>
        <Button text="Cancel" onClick={stopEditingTask} />
        <Button text="Save" onClick={formik.handleSubmit} />
      </div>
    </div>
  );
};
