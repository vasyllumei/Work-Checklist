import React from 'react';
import { Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DeleteModal } from '@/components/modals/DeleteModal/DeleteModal';
import { useUsersContext } from '@/components/pages/users/providers/userProvider';
import { UserType } from '@/types/User';

export const UserActionsCell = ({ row }: { row: UserType }) => {
  const {
    isSuperAdmin,
    isDeleteModalOpen,
    handleCloseDeleteModal,
    currentUserId,
    handleUserEdit,
    handleOpenDeleteModal,
    userIdToDelete,
    handleUserDelete,
  } = useUsersContext();

  if (!isSuperAdmin || currentUserId === row.id) {
    return <div>-</div>;
  }

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Grid item>
        <div data-testid={`updateUser-${row.id}`}>
          <IconButton onClick={() => handleUserEdit(String(row.id))}>
            <EditIcon />
          </IconButton>
        </div>
      </Grid>
      <Grid item>
        <div data-testid={`deleteUser-${row.id}`}>
          <IconButton onClick={() => handleOpenDeleteModal(String(row.id))}>
            <DeleteIcon />
          </IconButton>
        </div>
        <DeleteModal
          title="Delete User"
          item={`user with id ${userIdToDelete}`}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={async () => await handleUserDelete(userIdToDelete)}
          testIdContext={`User${row.id}`}
        />
      </Grid>
    </Grid>
  );
};
