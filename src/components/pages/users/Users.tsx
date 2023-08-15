import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Select,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as Yup from 'yup';
import { TextInput } from '../../TextInput';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout/Layout';
import { UserType, UserRoleType } from '@/types/User';
import { getUsers, createUser, deleteUser, updateUser } from '@/services/user/userService';
import { useFormik } from 'formik';
import { UserActionsCell } from '@/components/pages/users/UserActionsCell';
import styles from './Users.module.css';

const initialUserForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: UserRoleType.USER,
  id: '',
  editMode: false,
};
export const Users: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errorExist, setErrorExist] = useState('');
  const [userIdToDelete, setUserIdToDelete] = useState<string>('');

  const ValidationSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name is required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name is required'),
    email: Yup.string()
      .email('Invalid email')
      .when('editMode', (editMode, schema) => {
        if (!editMode[0]) return schema.required('Email is required');
        return schema;
      }),
    editMode: Yup.boolean(),
    password: Yup.string()
      .min(4, 'Password is too short - should be 4 chars min')
      .when('editMode', (editMode, schema) => {
        if (!editMode[0]) return schema.required('Password is required');
        console.log('editMode', editMode);
        return schema;
      }),
  });

  const formik = useFormik({
    initialValues: initialUserForm,
    validationSchema: ValidationSchema,
    onSubmit: async () => {
      try {
        if (formik.values.id) {
          await handleSaveUpdatedUser();
        } else {
          await handleUserCreate();
        }

        if (errorExist) {
          handleDialogClose();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });
  const isEditMode = formik.values.editMode;
  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      headerClassName: 'theme--header',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      flex: 1,
      editable: false,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      headerClassName: 'theme--header',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      flex: 1,
      editable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      headerClassName: 'theme--header',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      width: 200,
      flex: 1,
      editable: false,
    },
    {
      field: 'role',
      headerName: 'Role',
      headerClassName: 'theme--header',
      headerAlign: 'center',
      align: 'center',
      editable: false,
      sortable: true,
      flex: 1,
      width: 160,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerClassName: 'theme--header',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      width: 150,
      editable: false,

      renderCell: ({ row }) => (
        <UserActionsCell
          row={row}
          handleUserEdit={handleUserEdit}
          handleOpenDeleteModal={handleOpenDeleteModal}
          handleCloseDeleteModal={handleCloseDeleteModal}
          handleUserDelete={handleUserDelete}
          isDeleteModalOpen={isDeleteModalOpen}
          userIdToDelete={userIdToDelete}
        />
      ),
    },
  ];
  const handleUserCreate = async () => {
    try {
      if (formik.isValid) {
        await createUser(formik.values);
        await fetchUsers();
        handleDialogClose();
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorExist(error.response.data.message);
      } else {
        console.error('Error creating the user:', error);
      }
    }
  };
  const handleUserDelete = async (userId: string): Promise<void> => {
    try {
      await deleteUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting the user:', error);
    }
  };
  const handleUserEdit = (userId: string) => {
    try {
      const userData = users.find(user => user.id === userId);
      if (userData) {
        formik.setValues({
          ...initialUserForm,
          ...userData,
          editMode: true,
        });
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error('Error updating the user', error);
    }
  };
  const handleSaveUpdatedUser = async (): Promise<void> => {
    try {
      await updateUser(formik.values.id, formik.values);
      await fetchUsers();
      handleDialogClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  const handleOpenDeleteModal = (userId: string) => {
    setUserIdToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setUserIdToDelete('');
    setIsDeleteModalOpen(false);
  };

  const handleDialogOpen = () => {
    setErrorExist('');
    formik.setValues(initialUserForm);
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setErrorExist('');
    formik.resetForm();
    setIsDialogOpen(false);
  };
  const getError = (fieldName: string): string | undefined => {
    const touchedField = formik.touched[fieldName as keyof typeof formik.touched];
    const errorField = formik.errors[fieldName as keyof typeof formik.errors];

    if (touchedField && errorField) {
      return errorField;
    }
    return undefined;
  };
  const fetchUsers = async () => {
    try {
      const fetchedUsers: UserType[] = (await getUsers()).data;
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error retrieving the list of users:', error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout>
      <Box
        sx={{
          height: 400,
          width: '100%',
          '& .theme--header': {
            backgroundColor: 'rgba(67, 24, 254, 100)',
            color: 'rgba(255,255,255,100)',
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
        <Grid container justifyContent="left">
          <Button onClick={handleDialogOpen} text="Add User" />
        </Grid>
        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>{!isEditMode ? 'Add new user' : 'Edit existing user'}</DialogTitle>
          <DialogContent style={{ overflowX: 'hidden' }}>
            <DialogContentText>
              {!isEditMode
                ? 'To add a new user, please enter their first name, last name, email, password and select their role'
                : 'To edit the user, you can modify their first name, last name and role'}
            </DialogContentText>
            <div>
              <TextInput
                label="First Name"
                name="firstName"
                value={formik.values.firstName || ''}
                onChange={value => {
                  formik.setFieldValue('firstName', value);
                }}
                placeholder="Enter first name"
                error={getError('firstName')}
              />
            </div>
            <div>
              <TextInput
                label="Last Name"
                name="lastName"
                value={formik.values.lastName || ''}
                onChange={value => {
                  formik.setFieldValue('lastName', value);
                }}
                placeholder="Enter last name"
                error={getError('lastName')}
              />
            </div>
            <div>
              <TextInput
                label="Email"
                name="email"
                type="email"
                value={formik.values.email || ''}
                onChange={value => formik.setFieldValue('email', value)}
                placeholder="Enter email address"
                error={getError('email')}
                disabled={isEditMode}
              />
            </div>
            {!isEditMode && (
              <TextInput
                label="Password"
                name="password"
                type="password"
                value={formik.values.password || ''}
                onChange={value => formik.setFieldValue('password', value)}
                placeholder="Enter password"
                error={getError('password')}
              />
            )}
            {errorExist && <div className={styles.errorExist}>{errorExist}</div>}
            <FormControl variant="standard" sx={{ m: 2, minWidth: 300 }}>
              <Select
                value={formik.values?.role || UserRoleType.USER}
                onChange={event => {
                  formik.setFieldValue('role', event.target.value as UserRoleType);
                }}
              >
                <MenuItem value={UserRoleType.USER}>User</MenuItem>
                <MenuItem value={UserRoleType.ADMIN}>Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} text="Cancel" />
            <Button onClick={formik.handleSubmit} text={formik.values.id ? 'Save Changes' : 'Add User'} />
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};
