import React, { useState, useRef } from 'react';
import styles from '@/components/Configs/components/ProjectConfig/ColumnTitleEdit/ColumnTitleEdit.module.css';
import EditIcon from '@mui/icons-material/Edit';
import { TextInput } from '@/components/TextInput';
import { updateColumn } from '@/services/column/columnService';
import { ColumnType } from '@/types/Column';
import useOutsideClick from '@/hooks/useOutsideClick';

type ColumnTitleEditType = {
  column: ColumnType;
};

export const ColumnTitleEdit: React.FC<ColumnTitleEditType> = ({ column }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column?.title || '');
  const containerRef = useRef<HTMLDivElement>(null);
  const excludeRefs = [containerRef];

  const handleOutsideClick = async () => {
    if (isEditing) {
      try {
        await updateColumn(column.id, { ...column, title: editedTitle });
        setIsEditing(false);
        setEditedTitle(editedTitle);
      } catch (error) {
        console.error('Error updating column:', error);
      }
    }
  };

  useOutsideClick(handleOutsideClick, containerRef, excludeRefs);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (value: string) => {
    setEditedTitle(value);
  };

  return (
    <div
      className={styles.columnTitle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={containerRef}
    >
      {isEditing ? (
        <div className={styles.editInput}>
          <TextInput type="text" value={editedTitle} onChange={handleInputChange} />
        </div>
      ) : (
        <>
          {editedTitle}
          {isHovered && (
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
