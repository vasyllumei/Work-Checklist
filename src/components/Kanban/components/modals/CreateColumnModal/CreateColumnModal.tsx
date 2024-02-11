import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import styles from './CreateColumnModal.module.css';
import { useKanbanContext } from '@/components/Context/KanbanContext';

export const CreateColumnModal = () => {
  const { createStatusModal, closeAddStatusModal, setNewColumn, isAddStatusModalOpen, newColumn } = useKanbanContext();
  const handleCreateStatus = async () => {
    await createStatusModal();
    closeAddStatusModal();
  };

  const handleCancelStatus = () => {
    closeAddStatusModal();
    setNewColumn(prevColumn => ({
      ...prevColumn,
      title: '',
    }));
  };

  return (
    <Dialog open={isAddStatusModalOpen} onClose={handleCancelStatus}>
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
