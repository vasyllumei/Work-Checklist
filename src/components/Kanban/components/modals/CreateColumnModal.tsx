import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { ColumnType } from '@/types/Column';

interface CreateColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: () => void;
  newColumn: ColumnType;
  setNewColumn: React.Dispatch<React.SetStateAction<ColumnType>>;
}

export const CreateColumnModal: React.FC<CreateColumnModalProps> = ({
  isOpen,
  onClose,
  onChange,
  newColumn,
  setNewColumn,
}) => {
  const handleCreateStatus = async () => {
    await onChange();
    onClose();
  };

  const handleCancelStatus = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleCancelStatus}>
      <DialogTitle>Add New Status</DialogTitle>
      <DialogContent>
        <div>
          <TextInput
            label="Title"
            error=""
            name="title"
            type="text"
            value={newColumn.title || ''}
            onChange={value => setNewColumn({ ...newColumn, title: value })}
            placeholder="Add title"
          />
          <TextInput
            label="Order"
            error=""
            name="order"
            type="number"
            value={newColumn.order !== undefined ? String(newColumn.order) : ''}
            onChange={value => setNewColumn({ ...newColumn, order: Number(value) })}
            placeholder="Add order"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button text="Cancel" onClick={handleCancelStatus} />
        <Button text="Add Status" onClick={handleCreateStatus} />
      </DialogActions>
    </Dialog>
  );
};
