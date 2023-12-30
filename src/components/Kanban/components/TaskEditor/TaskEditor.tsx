import React from 'react';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import styles from './TaskEditor.module.css';

type TaskEditorPropsType = {
  formik: any;
  getFieldError: (fieldName: string) => string | undefined;
  handleSaveUpdatedTask: () => void;
  stopEditingTask: () => void;
  buttonColorClassName: (buttonState: string) => string;
};
export const TaskEditor: React.FC<TaskEditorPropsType> = ({
  formik,
  getFieldError,
  buttonColorClassName,
  stopEditingTask,
  handleSaveUpdatedTask,
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
      <div className={styles.buttonColorContainer}>
        <select
          value={formik.values.buttonState}
          onChange={formik.handleChange}
          className={buttonColorClassName(formik.values.buttonState)}
          name="buttonState"
        >
          <option value="Pending">Pending</option>
          <option value="Updates">Updates</option>
          <option value="Errors">Errors</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div className={styles.taskButtonContainer}>
        <Button text="Cancel" onClick={stopEditingTask} />
        <Button text="Save" onClick={handleSaveUpdatedTask} />
      </div>
    </div>
  );
};
