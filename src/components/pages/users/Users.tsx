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
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { TextInput } from '../../TextInput';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout/Layout';
import { UserType, UserRoleType } from '@/types/User';
import { getUsers, createUser, deleteUser, updateUser } from '@/services/user/userService';

const initialUserForm = { firstName: '', lastName: '', email: '', password: '', role: UserRoleType.USER };
export const Users: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [userForm, setUserForm] = useState<UserType>(initialUserForm);

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
        <Grid container justifyContent="center" spacing={2}>
          <>
            <Grid item>
              <IconButton onClick={() => handleUserEdit(row.id as string)}>
                <EditIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={() => handleUserDelete(row.id as string)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </>
        </Grid>
      ),
    },
  ];

  const handleUserCreate = async () => {
    try {
      if (userForm?.email && userForm.password && userForm.firstName && userForm.lastName) {
        await createUser(userForm);
        await fetchUsers();
        handleDialogClose();
      }
    } catch (error) {
      console.error('Error creating the user:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const fetchedUsers: UserType[] = (await getUsers()).data;
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error retrieving the list of users:', error);
    }
  };

  const handleUserDelete = async (userId: string) => {
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
        setUserForm(userData);
        setIsDialogOpen(true);
      } else {
        console.error('Error: User data not found');
      }
    } catch (error) {
      console.error('Error updating the user', error);
    }
  };

  const handleDialogOpen = () => {
    setUserForm(initialUserForm);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSaveUpdatedUser = async () => {
    try {
      if (userForm && userForm.email && userForm.firstName && userForm.lastName) {
        if (userForm.id) {
          await updateUser(userForm.id, userForm);
          await fetchUsers();
        } else {
          console.error('Error: User ID is not defined.');
        }
      }
    } catch (error) {
      console.error('Error updating userForm:', error);
    }
    handleDialogClose();
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
          <DialogTitle>Add new user</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add a new user, please enter their first name, last name, email, password and select their role
            </DialogContentText>

            <TextInput
              name="firstName"
              type="text"
              value={userForm?.firstName || ''}
              onChange={value => {
                setUserForm({ ...userForm, firstName: value });
              }}
              placeHolder="Имя"
            />
            <TextInput
              name="lastName"
              type="text"
              value={userForm?.lastName || ''}
              onChange={value => {
                setUserForm({ ...userForm, lastName: value });
              }}
              placeHolder="Last Name"
            />
            <TextInput
              name="email"
              type="email"
              value={userForm?.email || ''}
              onChange={value => {
                setUserForm({ ...userForm, email: value });
              }}
              placeHolder="Email"
            />
            <TextInput
              name="password"
              type="password"
              value={userForm?.password || ''}
              onChange={value => {
                setUserForm({ ...userForm, password: value });
              }}
              placeHolder="Password"
            />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={userForm?.role || UserRoleType.USER}
                onChange={event => {
                  setUserForm({ ...userForm, role: event.target.value as UserRoleType });
                }}
              >
                <MenuItem value={UserRoleType.USER}>User</MenuItem>
                <MenuItem value={UserRoleType.ADMIN}>Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} text="Cancel" />
            {userForm.id ? (
              <Button onClick={handleSaveUpdatedUser} text="Save Changes" />
            ) : (
              <Button onClick={handleUserCreate} text="Add User" />
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};
