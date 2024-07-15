import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useUsersContext } from '@/components/pages/users/providers/userProvider';
import styles from '@/components/pages/users/Users.module.css';
import { Button } from '@/components/Button';
import { Form } from '@/components/pages/users/components/Form';

const UserDialog: React.FC = () => {
  const { isDialogOpen, handleDialogClose, isEditMode, formik } = useUsersContext();

  return (
    <Dialog open={isDialogOpen} onClose={handleDialogClose}>
      <DialogTitle>{!isEditMode ? 'Add new user' : 'Edit existing user'}</DialogTitle>
      <DialogContent style={{ overflowX: 'hidden' }}>
        <DialogContentText>
          {!isEditMode
            ? 'To add a new user, please enter their first name, last name, email, password and select their role'
            : 'To edit the user, you can modify their first name, last name and role'}
        </DialogContentText>
        <Form />
      </DialogContent>
      <DialogActions>
        <div className={styles.buttonContainer} data-testid="submitActions">
          <Button
            dataTestId="cancelUserSubmit"
            onClick={handleDialogClose}
            text="Cancel"
            size={'medium'}
            outlined={true}
          />
          <Button
            dataTestId="addUserSubmit"
            onClick={formik.handleSubmit}
            text={formik.values.id ? 'Save Changes' : 'Add User'}
            size={'medium'}
          />
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;
