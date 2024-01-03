import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from '@/components/Kanban/components/ColumnTitleEdit/ColumnTitleEdit.module.css';
import EditIcon from '@mui/icons-material/Edit';
import { ColumnType } from '@/types/Column';
import { TextInput } from '@/components/TextInput';

type ColumnTitleEditType = {
  column: ColumnType;
  onEditTitle: (columnId: string) => void;
  onSave: () => void;
};

export const ColumnTitleEdit: React.FC<ColumnTitleEditType> = ({ column, onEditTitle, onSave }) => {
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    async (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsEditing(false);
        await onSave();
      }
    },
    [onSave],
  );

  const handleMouseEnter = () => {
    setIsEditVisible(true);
  };

  const handleMouseLeave = () => {
    setIsEditVisible(false);
  };

  const handleEditClick = () => {
    onEditTitle(editedTitle);
    setIsEditing(true);
  };

  const handleInputChange = (value: string) => {
    setEditedTitle(value);
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, handleClickOutside]);

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
          {column.title}
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
