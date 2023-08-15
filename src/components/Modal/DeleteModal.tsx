import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Button } from '@/components/Button';
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onDelete }) => {
  const handleDelete = async () => {
    await onDelete();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this user? This action cannot be undone.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} text="Cancel" />
        <Button onClick={handleDelete} text="Delete" />
      </DialogActions>
    </Dialog>
  );
};
