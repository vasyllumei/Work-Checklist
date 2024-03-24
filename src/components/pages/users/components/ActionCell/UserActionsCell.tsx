import React, { FC } from 'react';
import { Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DeleteModal } from '@/components/DeleteModal/DeleteModal';
import { GridRowParams } from '@mui/x-data-grid';
import { UserType } from '@/types/User';

interface UserActionsCellProps {
  row: GridRowParams<UserType>;
  handleUserEdit: (userId: string) => void;
  handleOpenDeleteModal: (userId: string) => void;
  handleCloseDeleteModal: () => void;
  handleUserDelete: (userId: string) => Promise<void>;
  isDeleteModalOpen: boolean;
  userIdToDelete: string;
  isSuperAdmin: boolean;
  currentUserId: string;
}

export const UserActionsCell: FC<UserActionsCellProps> = ({
  row,
  handleUserEdit,
  handleOpenDeleteModal,
  handleCloseDeleteModal,
  handleUserDelete,
  isDeleteModalOpen,
  userIdToDelete,
  isSuperAdmin,
  currentUserId,
}) => {
  if (!isSuperAdmin || currentUserId === row.id) {
    return <div>-</div>;
  }

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Grid item>
        <IconButton onClick={() => handleUserEdit(String(row.id))}>
          <EditIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={() => handleOpenDeleteModal(String(row.id))}>
          <DeleteIcon />
        </IconButton>
        <DeleteModal
          title="Delete User"
          item={`user with id ${userIdToDelete}`}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={async () => await handleUserDelete(userIdToDelete)}
        />
      </Grid>
    </Grid>
  );
};
