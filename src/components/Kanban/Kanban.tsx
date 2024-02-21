import React from 'react';
import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { Column } from '@/components/Kanban/components/Column';
import { CreateColumnModal } from '@/components/Kanban/components/modals/CreateColumnModal/CreateColumnModal';
import { CreateTaskModal } from '@/components/Kanban/components/modals/CreateTaskModal/CreateTaskModal';
import { Button } from '@/components/Button';
import { DragDropContext } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictDroppable/StrictModeDroppable';
import { useKanbanContext } from '@/components/Kanban/providers/kanbanProvider/';
import { ColumnType } from '@/types/Column';
import { SelectComponent } from '@/components/Select/Select';
import { BUTTON_STATES } from '@/constants';

export const Kanban = () => {
  const {
    columns,
    searchText,
    handleSearch,
    setIsAddStatusModalOpen,
    onDragEnd,
    setSelectedAssignedTo,
    selectedAssignedTo,
    setSelectedButtonState,
    selectedButtonState,
    usersList,
    setIsAddTaskModalOpen,
  } = useKanbanContext();

  return (
    <Layout
      searchText={searchText}
      handleSearch={handleSearch}
      headTitle="Kanban"
      breadcrumbs={[
        { title: 'Dashboard', link: '/' },
        { title: 'Kanban', link: '/kanban' },
      ]}
    >
      <div className={styles.addStatusButton}>
        <Button
          text="Add status"
          onClick={() => setIsAddStatusModalOpen(true)}
          className={styles.newStatusButton}
          size={'small'}
        />
        <Button
          text="Add task"
          onClick={() => setIsAddTaskModalOpen(true)}
          className={styles.newTaskButton}
          size={'small'}
        />
      </div>
      <div className={styles.selectContainer}>
        <SelectComponent
          label="Choise assigneds users"
          value={selectedAssignedTo}
          onChange={(selectedValues: string | string[]) =>
            setSelectedAssignedTo(Array.isArray(selectedValues) ? selectedValues : [selectedValues])
          }
          options={usersList}
          multiple
        />
        <SelectComponent
          label="Choise buttons states"
          value={selectedButtonState}
          onChange={(selectedValues: string | string[]) =>
            setSelectedButtonState(Array.isArray(selectedValues) ? selectedValues : [selectedValues])
          }
          options={BUTTON_STATES}
          multiple
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="mainContainer" type="COLUMN" direction="horizontal">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} className={styles.mainContainer}>
              {columns.map((column: ColumnType, index: number) => (
                <Column column={column} key={column.id} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      <CreateColumnModal />
      <CreateTaskModal />
    </Layout>
  );
};
