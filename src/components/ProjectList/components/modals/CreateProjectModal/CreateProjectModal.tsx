import React, { FC } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { FormikValues } from 'formik';
import { CirclePicker } from 'react-color';
import styles from './CreateProjectModal.module.css';
import useFieldError from '@/hooks/useFieldError';
interface CreateProjectModalProps {
  formik: FormikValues;
  isDialogOpen: boolean;
  handleDialogClose: () => void;
  isEditMode: boolean;
}
export const CreateProjectModal: FC<CreateProjectModalProps> = ({
  formik,
  isDialogOpen,
  handleDialogClose,
  isEditMode,
}) => {
  const { getFieldError } = useFieldError(formik.touched, formik.errors);

  return (
    <Dialog open={isDialogOpen} onClose={handleDialogClose}>
      <DialogTitle>{!isEditMode ? 'Add new projectId' : 'Edit existing projectId'}</DialogTitle>
      <DialogContent style={{ overflowX: 'hidden' }}>
        <DialogContentText>
          {!isEditMode
            ? 'To add a new projectId, please enter title and description'
            : 'To edit the projectId, you can modify title and description'}
        </DialogContentText>
        <div className={styles.projectForm}>
          <TextInput
            label="Title"
            name={`title-${formik.values.id}`}
            type="text"
            value={formik.values.title || ''}
            onChange={value => formik.setFieldValue('title', value)}
            placeholder="New project title"
            error={getFieldError('title')}
            dataTestId="title-input"
          />
          <TextInput
            name={`description-${formik.values.id}`}
            value={formik.values.description || ''}
            onChange={value => {
              formik.setFieldValue('description', value);
            }}
            placeholder="New project description"
            label="Description"
            isEditing={formik.values.editMode}
            error={getFieldError('description')}
            dataTestId="description-input"
          />
          <div className={styles.colorPickerContainer} data-testid="color-picker">
            <span className={styles.colorPickerTitle}>Color</span>
            <CirclePicker
              color={formik.values.color}
              onChange={color => formik.setFieldValue('color', color.hex)}
              width="100%"
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <div className={styles.buttonsProjectContainer}>
          <Button
            dataTestId="cancelProjectSubmit"
            text="Cancel"
            onClick={handleDialogClose}
            className={styles.modalProjectCancel}
            size={'small'}
            outlined={true}
          />
          <Button
            dataTestId="addProjectSubmit"
            onClick={formik.handleSubmit}
            text={formik.values.id ? 'Save Changes' : 'Add Project'}
            className={styles.modalProjectAdd}
            size={'small'}
          />
        </div>
      </DialogActions>
    </Dialog>
  );
};
