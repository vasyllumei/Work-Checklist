import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { ColumnType } from '@/types/Column';
import styles from './CreateColumnModal.module.css';
interface CreateColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  newColumn: ColumnType;
  setNewColumn: React.Dispatch<React.SetStateAction<ColumnType>>;
}

export const CreateColumnModal: React.FC<CreateColumnModalProps> = ({
  isOpen,
  onClose,
  onSave,
  newColumn,
  setNewColumn,
}) => {
  const handleCreateStatus = async () => {
    await onSave();
    onClose();
  };

  const handleCancelStatus = () => {
    onClose();
    setNewColumn(prevColumn => ({
      ...prevColumn,
      title: '',
    }));
  };

  return (
    <Dialog open={isOpen} onClose={handleCancelStatus}>
      <DialogTitle>Add New Status</DialogTitle>
      <DialogContent>
        <TextInput
          label="Title"
          error=""
          name="title"
          type="text"
          value={newColumn.title || ''}
          onChange={value => setNewColumn({ ...newColumn, title: value })}
          placeholder="Add title"
        />
      </DialogContent>
      <DialogActions className={styles.buttonContainer}>
        <Button text="Cancel" onClick={handleCancelStatus} size={'small'} outlined={true} />
        <Button
          text="Add Status"
          onClick={handleCreateStatus}
          size={'small'}
          disabled={newColumn.title.trim() === ''}
        />
      </DialogActions>
    </Dialog>
  );
};
