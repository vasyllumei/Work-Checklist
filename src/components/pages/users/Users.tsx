import React, { FC, useEffect, useState } from 'react';
import {
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
import StyledBox from './components/StyledBox/StyledBox';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { TextInput } from '../../TextInput';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout/Layout';
import { UserType, UserRoleType } from '@/types/User';
import { createUser, deleteUser, updateUser, getAllUsers, deleteAllUsers } from '@/services/user/userService';
import { useFormik } from 'formik';
import { UserActionsCell } from '@/components/pages/users/components/ActionCell/UserActionsCell';
import styles from './Users.module.css';
import { ValidationSchema } from '@/utils';
import { DeleteModal } from '@/components/DeleteModal/DeleteModal';
import { Filter } from '@/components/Filter/Filter';
const initialUserForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: UserRoleType.USER,
  id: '',
  iconColor: '',
  editMode: false,
};

export const Users: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteAllUsersModalOpen, setIsDeleteAllUsersModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [filters, setFilters] = useState<string[]>([]);
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
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  const isEditMode = formik.values.editMode;
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      headerClassName: 'theme--header',
      headerAlign: 'center',
      align: 'center',
      width: 70,
    },
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
  const usersFilter = [
    {
      name: 'role',
      label: 'Role',
      options: [
        { label: 'User', value: UserRoleType.USER },
        { label: 'Admin', value: UserRoleType.ADMIN },
      ],
      value: filters,
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
  const handleDeleteAllUsers = async (userIds: string[]) => {
    try {
      await deleteAllUsers(userIds);
      await fetchUsers();
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting selected users:', error);
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
    formik.setValues(initialUserForm);
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    formik.resetForm();
    setIsDialogOpen(false);
  };
  const handleDeleteButtonClick = () => {
    if (selectedRows.length > 0) {
      const userIds = selectedRows.map(rowId => rowId.toString());
      handleDeleteAllUsers(userIds);
    }
  };
  const handleOpenDeleteAllUsersModal = (userIds: string[]) => {
    setSelectedRows(userIds);
    setIsDeleteAllUsersModalOpen(true);
  };
  const handleCloseDeleteAllUsersModal = () => {
    setIsDeleteAllUsersModalOpen(false);
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
      const fetchedUsersData = await getAllUsers();
      const fetchedUsers: UserType[] = fetchedUsersData.data;
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error retrieving the list of users:', error);
    }
  };

  const filteredUsers = users
    .filter(
      user =>
        (user.firstName && user.firstName.toLowerCase().includes(searchText.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchText.toLowerCase())) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()),
    )
    .filter(user => (filters.length > 0 ? filters.includes(user.role) : true));

  const handleSearch = (text: string) => {
    setSearchText && setSearchText(text);
  };
  const handleFilterChange = (filterName: string, selectedOptions: string | string[]) => {
    setFilters(selectedOptions as string[]);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout
      searchText={searchText}
      handleSearch={handleSearch}
      headTitle="Users"
      breadcrumbs={[
        { title: 'Dashboard', link: '/' },
        { title: 'Users', link: '/users' },
      ]}
    >
      <StyledBox>
        {selectedRows && selectedRows.length > 0 ? (
          <div className={styles.deleteAllUserContainer}>
            <Button
              onClick={() => handleOpenDeleteAllUsersModal(selectedRows.map(String))}
              text="Delete selected users"
              size={'small'}
            />
          </div>
        ) : null}

        <DeleteModal
          title="Delete Selected Users"
          item={`selected users`}
          isOpen={isDeleteAllUsersModalOpen}
          onClose={handleCloseDeleteAllUsersModal}
          onDelete={async () => await handleDeleteButtonClick()}
        />
        <Filter filters={usersFilter} handleFilterChange={handleFilterChange} clearAll={false} />
        <DataGrid
          className={styles.dataGridContainer}
          rows={filteredUsers}
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
          getRowId={(row: UserType) => row.id}
          checkboxSelection
          onRowSelectionModelChange={ids => {
            setSelectedRows(ids as string[]);
          }}
        ></DataGrid>
        <Grid className={styles.gridContainer}>
          <Button onClick={handleDialogOpen} text="Add User" size={'small'} />
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
            <div className={styles.buttonContainer}>
              <Button onClick={handleDialogClose} text="Cancel" size={'small'} outlined={true} />
              <Button
                onClick={formik.handleSubmit}
                text={formik.values.id ? 'Save Changes' : 'Add User'}
                size={'small'}
              />
            </div>
          </DialogActions>
        </Dialog>
      </StyledBox>
    </Layout>
  );
};
