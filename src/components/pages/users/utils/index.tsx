import { UserRoleType } from '@/types/User';
import { GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { UserActionsCell } from '@/components/pages/users/components/ActionCell/UserActionsCell';

export const columnsConfig: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    headerClassName: 'theme--header',
    headerAlign: 'center',
    align: 'center',
    width: 250,
    sortable: false,
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
    sortable: false,
    editable: false,

    renderCell: ({ row }) => <UserActionsCell row={row} />,
  },
];
export const breadcrumbsUsers = [
  { title: 'Dashboard', link: '/' },
  { title: 'Users', link: '/users' },
];
export const usersFilterOptions = [
  {
    name: 'role',
    label: 'Role',
    options: [
      { label: 'User', value: UserRoleType.USER },
      { label: 'Admin', value: UserRoleType.ADMIN },
    ],
  },
];
