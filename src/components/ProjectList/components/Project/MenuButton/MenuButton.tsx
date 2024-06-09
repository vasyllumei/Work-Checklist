import React, { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DeleteModal } from '@/components/DeleteModal/DeleteModal';

type MenuButtonProps = {
  projectId: string;
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => Promise<void>;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  dataTestId?: string;
};

const MenuButton: React.FC<MenuButtonProps> = ({ projectId, onEdit, onDelete, onClick, dataTestId }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick && onClick(event);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    await onDelete(projectId);
    setIsDeleteModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    handleClose();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div onClick={handleContainerClick} data-testid={dataTestId}>
      <Button
        id="basic-button"
        aria-controls={Boolean(anchorEl) ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
        onClick={handleClick}
        data-testid={`${dataTestId}-button`}
      >
        <MoreHorizIcon fontSize="small" color="primary" />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => onEdit(projectId)} data-testid={`${dataTestId}-edit`}>
          Edit
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteModal} data-testid={`${dataTestId}-delete`}>
          Delete
        </MenuItem>
      </Menu>
      <DeleteModal
        title="Delete Project"
        item={`project`}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDelete}
        testIdContext={dataTestId}
      />
    </div>
  );
};

export default MenuButton;
