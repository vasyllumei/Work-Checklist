import React, { useEffect } from 'react';
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
    fetchData,
    fetchUsers,
    applyFilters,
    onDragEnd,
    usersList,
    formik,
    setIsAddTaskModalOpen,
  } = useKanbanContext();

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, [searchText]);

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
          applyFilters={applyFilters}
          label="Choise assigneds users"
          value={formik.values.assignedTo || ''}
          onChange={value => formik.setFieldValue('assignedTo', value)}
          options={usersList}
          multiple
        />
        <SelectComponent
          applyFilters={applyFilters}
          label="Choise buttons states"
          value={formik.values.buttonState}
          onChange={value => formik.setFieldValue('buttonState', value)}
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
