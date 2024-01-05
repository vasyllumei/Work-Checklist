import React, { useState, useRef } from 'react';
import styles from '@/components/Kanban/components/ColumnTitleEdit/ColumnTitleEdit.module.css';
import EditIcon from '@mui/icons-material/Edit';
import { TextInput } from '@/components/TextInput';
import { updateColumn } from '@/services/columns/columnService';
import { ColumnType } from '@/types/Column';
import useOutsideClick from '@/hooks/useOutsideClick';

type ColumnTitleEditType = {
  column: ColumnType;
};

export const ColumnTitleEdit: React.FC<ColumnTitleEditType> = ({ column }) => {
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title || '');
  const containerRef = useRef<HTMLDivElement>(null);
  const excludeRefs = [containerRef];

  useOutsideClick(
    () => {
      if (isEditing) {
        updateColumn(column.id, { ...column, title: editedTitle })
          .then(() => {
            setIsEditing(false);
            setEditedTitle(editedTitle);
          })
          .catch(error => {
            console.error('Error updating column:', error);
          });
      }
    },
    containerRef,
    excludeRefs,
  );

  const handleMouseEnter = () => {
    setIsEditVisible(true);
  };

  const handleMouseLeave = () => {
    setIsEditVisible(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (value: string) => {
    setEditedTitle(value);
  };

  return (
    <div
      className={styles.columnTitle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {isEditing ? (
        <div className={styles.editInput}>
          <TextInput type="text" value={editedTitle} onChange={handleInputChange} />
        </div>
      ) : (
        <>
          {editedTitle}
          {isEditVisible && (
            <div>
              <button onClick={handleEditClick} className={styles.editButton}>
                <EditIcon fontSize="small" color="primary" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
