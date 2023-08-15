import React from 'react';
import { Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DeleteModal } from '@/components/Modal/DeleteModal';
import { GridRowParams } from '@mui/x-data-grid';

interface UserActionsCellProps {
  row: GridRowParams;
  handleUserEdit: (userId: string) => void;
  handleOpenDeleteModal: (userId: string) => void;
  handleCloseDeleteModal: () => void;
  handleUserDelete: (userId: string) => Promise<void>;
  isDeleteModalOpen: boolean;
  userIdToDelete: string;
}

export const UserActionsCell: React.FC<UserActionsCellProps> = ({
  row,
  handleUserEdit,
  handleOpenDeleteModal,
  handleCloseDeleteModal,
  handleUserDelete,
  userIdToDelete,
  isDeleteModalOpen,
}) => (
  <Grid container justifyContent="center" spacing={2}>
    <>
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
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={async () => await handleUserDelete(userIdToDelete)}
        />
      </Grid>
    </>
  </Grid>
);
