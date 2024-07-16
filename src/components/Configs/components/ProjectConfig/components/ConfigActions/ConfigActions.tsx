import React from 'react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import styles from './ConfigActions.module.css';
import { FormikValues } from 'formik';

interface ProjectActionsProps {
  projectId?: string | string[];
  isAddStatusModalOpen: boolean;
  openAddStatusModal: () => void;
  closeAddStatusModal: () => void;
  handleAddStatus: () => void;
  formik: FormikValues;
}

export const ProjectActions: React.FC<ProjectActionsProps> = ({
  projectId,
  isAddStatusModalOpen,
  openAddStatusModal,
  closeAddStatusModal,
  handleAddStatus,
  formik,
}) => {
  return (
    <div data-testid={`addStatusConfig-${projectId}`}>
      <IconButton onClick={openAddStatusModal}>
        <AddIcon />
      </IconButton>
      <Dialog
        open={isAddStatusModalOpen}
        onClose={closeAddStatusModal}
        sx={{ '& .MuiBackdrop-root': { backgroundColor: 'transparent' } }}
      >
        <DialogTitle>Add New Status</DialogTitle>
        <DialogContent>
          <div className={styles.formContainer}>
            <TextInput
              dataTestId="statusModalInput"
              label="Title"
              error={formik.errors.title}
              name="title"
              type="text"
              value={formik.values.title}
              onChange={value => {
                formik.setFieldValue('title', value);
              }}
              onBlur={formik.handleBlur}
              placeholder="Add title"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <div className={styles.buttonContainer}>
            <Button text="Cancel" onClick={closeAddStatusModal} size="medium" outlined={true} />
            <Button
              dataTestId="addStatusSubmit"
              text="Add Status"
              onClick={handleAddStatus}
              size="medium"
              disabled={formik.values.title.trim() === ''}
            />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectActions;
