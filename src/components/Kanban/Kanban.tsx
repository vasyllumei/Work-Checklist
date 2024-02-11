import React from 'react';
import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { Column } from '@/components/Kanban/components/Column';
import { CreateColumnModal } from '@/components/Kanban/components/modals/CreateColumnModal/CreateColumnModal';
import { CreateTaskModal } from '@/components/Kanban/components/modals/CreateTaskModal/CreateTaskModal';
import { Button } from '@/components/Button';
import { DragDropContext } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictDroppable/StrictModeDroppable';
import { useKanbanContext } from '@/components/Context/KanbanContext';
import { ColumnType } from '@/types/Column';

export const Kanban = () => {
  const { columns, setIsAddStatusModalOpen, onDragEnd, setIsAddTaskModalOpen, setSearchText, users } =
    useKanbanContext();

  return (
    <Layout
      users={users}
      setSearchText={setSearchText}
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
