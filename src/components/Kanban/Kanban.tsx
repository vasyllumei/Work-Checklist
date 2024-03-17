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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  enum Filters {
    ASSIGNED_TO = 'assignedTo',
    BUTTON_STATE = 'buttonState',
  }
  const kanbanFilters = [
    {
      name: Filters.ASSIGNED_TO,
      label: t('assignedUsers'),
      options: usersList,
      value: selectedAssignedTo,
      applyOnChange: true,
    },
    {
      name: Filters.BUTTON_STATE,
      label: t('buttonsStates'),
      options: BUTTON_STATES,
      value: selectedButtonState,
      applyOnChange: true,
    },
  ];
  const handleFilterChange = (filterName: string, selectedOptions: string | string[]) => {
    if (filterName === Filters.ASSIGNED_TO) {
      setSelectedAssignedTo(Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]);
    } else if (filterName === Filters.BUTTON_STATE) {
      setSelectedButtonState(Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]);
    }
  };

  return (
    <Layout
      searchText={searchText}
      handleSearch={handleSearch}
      headTitle={t('kanban')}
      breadcrumbs={[
        { title: t('dashboard'), link: '/' },
        { title: t('kanban'), link: '/kanban' },
      ]}
    >
      <div className={styles.addStatusButton}>
        <Button
          text={t('addStatus')}
          onClick={() => setIsAddStatusModalOpen(true)}
          className={styles.newStatusButton}
          size={'small'}
        />
        <Button
          text={t('addTask')}
          onClick={() => setIsAddTaskModalOpen(true)}
          className={styles.newTaskButton}
          size={'small'}
        />
      </div>
      <Filter filters={kanbanFilters} handleFilterChange={handleFilterChange} clearAll />
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
