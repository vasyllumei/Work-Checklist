import React, { useState, useEffect, useRef } from 'react';
import styles from '@/components/Kanban/components/ColumnTitleEdit/ColumnTitleEdit.module.css';
import EditIcon from '@mui/icons-material/Edit';
import { ColumnType } from '@/types/Column';
import { TextInput } from '@/components/TextInput';

type ColumnTitleEditType = {
  column: ColumnType;
  onEdit: (columnId: string) => void;
  onSave: () => void;
};

export const ColumnTitleEdit: React.FC<ColumnTitleEditType> = ({ column, onEdit, onSave }) => {
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsEditVisible(true);
  };

  const handleMouseLeave = () => {
    setIsEditVisible(false);
  };

  const handleEditClick = () => {
    onEdit(column.id);
    setIsEditing(true);
  };

  const handleInputChange = (value: string) => {
    setEditedTitle(value);
  };

  const handleClickOutside = async (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsEditing(false);
      await onSave();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
