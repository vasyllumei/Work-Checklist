import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
interface CreateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: () => void;
  formik: any;
}

export const CreateStatusModal: React.FC<CreateStatusModalProps> = ({ isOpen, onClose, onChange, formik }) => {
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
            value={formik.values.title || ''}
            onChange={value => formik.setFieldValue('title', value)}
            placeholder="Add title"
          />
          <TextInput
            label="Order"
            error=""
            name="order"
            type="number"
            value={formik.values.order || ''}
            onChange={value => formik.setFieldValue('order', value)}
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
