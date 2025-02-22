import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import styles from './DeleteModal.module.css';
import { Button } from '@/components/Button';
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  item: string;
  title: string;
  testIdContext?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, testIdContext, onClose, onDelete, item, title }) => {
  const handleDelete = async () => {
    await onDelete();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel} sx={{ '& .MuiBackdrop-root': { backgroundColor: 'transparent' } }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{`Are you sure you want to delete ${item}? This action cannot be undone.`}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <div className={styles.buttonContainer}>
          <Button
            onClick={handleCancel}
            text="Cancel"
            dataTestId={`cancelModal${testIdContext}`}
            size={'medium'}
            outlined={true}
          />
          <Button onClick={handleDelete} text="Delete" dataTestId={`deleteModal${testIdContext}`} size={'medium'} />
        </div>
      </DialogActions>
    </Dialog>
  );
};
