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
import { BUTTON_STATES } from '@/constants';
import { Filter } from '@/components/Filter/Filter';

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
  const kanbanFilters = [
    {
      name: 'assignedTo',
      label: 'assigned users',
      options: usersList,
      value: selectedAssignedTo,
    },
    {
      name: 'buttonState',
      label: 'buttons states',
      options: BUTTON_STATES,
      value: selectedButtonState,
    },
  ];
  const handleFilterChange = (filterName: string, selectedOptions: any) => {
    if (filterName === 'assignedTo') {
      setSelectedAssignedTo(selectedOptions);
    } else if (filterName === 'buttonState') {
      setSelectedButtonState(selectedOptions);
    }
  };
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
      <Filter filters={kanbanFilters} handleFilterChange={handleFilterChange} outsideClick={false} />

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
