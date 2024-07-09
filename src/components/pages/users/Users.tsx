import React from 'react';
import StyledBox from './components/StyledBox/StyledBox';
import { Layout } from '@/components/Layout/Layout';
import { DeleteModal } from '@/components/DeleteModal/DeleteModal';
import { breadcrumbsUsers, columnsConfig, usersFilterOptions } from '@/components/pages/users/utils';
import { useUsersContext } from '@/components/pages/users/providers/userProvider/useUsersContext';
import UserDialog from '@/components/pages/users/components/UserDialog/UserDialog';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { Filter } from '@/components/Filter/Filter';
import { Button } from '@/components/Button';
import { Grid } from '@mui/material';
import { UserType } from '@/types/User';
import styles from '@/components/pages/users/Users.module.css';
import { UserActionsCell } from '@/components/pages/users/components/ActionsCell/UserActionsCell';
export const Users = () => {
  const {
    handleDeleteButtonClick,
    handleFilterChange,
    filters,
    isDeleteAllUsersModalOpen,
    handleCloseDeleteAllUsersModal,
    selectedRows,
    handleOpenDeleteAllUsersModal,
    rowsWithIds,
    handleSearch,
    handleDialogOpen,
    totalUsers,
    searchText,
    setSelectedRows,
    currentUserId,
    isSuperAdmin,
    paginationModel,
    handlePaginationModelChange,
    handleSortModelChange,
  } = useUsersContext();

  const columns = columnsConfig.map(column => ({
    ...column,
    renderCell: (params: GridRenderCellParams) =>
      column.field === 'actions' ? <UserActionsCell row={params.row} /> : <span>{params.value}</span>,
  }));

  const pageSizeOption = [5, 7, 9];

  return (
    <Layout headTitle="Users" searchText={searchText} handleSearch={handleSearch} breadcrumbs={breadcrumbsUsers}>
      <StyledBox>
        <DeleteModal
          isOpen={isDeleteAllUsersModalOpen}
          onClose={handleCloseDeleteAllUsersModal}
          title="Delete Selected Users"
          item={`selected users`}
          onDelete={async () => await handleDeleteButtonClick()}
          testIdContext="AllUsers"
        />
        <div className={styles.deleteAllUsersContainer} data-testid="filterUsers">
          <Filter
            filters={usersFilterOptions}
            value={filters}
            handleFilterChange={handleFilterChange}
            clearAll={false}
          />
          {isSuperAdmin && selectedRows && selectedRows.length > 0 ? (
            <Button
              onClick={() => handleOpenDeleteAllUsersModal(selectedRows.map(String))}
              dataTestId="deleteUsers"
              text="Delete selected users"
              size={'small'}
              className={styles.allUsersContainer}
            />
          ) : null}
        </div>
        <DataGrid
          disableColumnMenu
          pagination
          rowCount={totalUsers}
          className={styles.dataGridContainer}
          rows={rowsWithIds}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={pageSizeOption}
          paginationMode="server"
          initialState={{
            sorting: {
              sortModel: [{ field: 'rating', sort: 'desc' }],
            },
          }}
          onSortModelChange={handleSortModelChange}
          disableRowSelectionOnClick
          getRowId={(row: UserType) => row.id}
          checkboxSelection={isSuperAdmin}
          isRowSelectable={params => params.row.id !== currentUserId}
          onRowSelectionModelChange={ids => {
            setSelectedRows(ids as string[]);
          }}
        />
        <Grid className={styles.gridContainer}>
          {isSuperAdmin && <Button onClick={handleDialogOpen} dataTestId="addUser" text="Add User" size={'small'} />}
        </Grid>
        <UserDialog />
      </StyledBox>
    </Layout>
  );
};
