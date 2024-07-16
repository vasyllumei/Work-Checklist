import React from 'react';
import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { Column } from '@/components/Kanban/components/Column';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal/CreateTaskModal';
import { DragDropContext } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictDroppable/StrictModeDroppable';
import { useKanbanContext } from '@/components/Kanban/providers/kanbanProvider/';
import { ColumnType } from '@/types/Column';
import { BUTTON_STATES } from '@/constants';
import { Filter, FilterOption } from '@/components/Filter/Filter';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/projectStore/store';
import { breadcrumbsKanban } from '@/components/Kanban/utils';
export enum Filters {
  ASSIGNED_TO = 'assignedTo',
  BUTTON_STATE = 'buttonState',
}

export const Kanban = () => {
  const {
    columns,
    onDragEnd,
    filters,
    searchText,
    handleFilterChange,
    handleSearch,
    usersList,
    onAddNewTask,
    isAddTaskModalOpen,
    formik,
    closeAddTaskModal,
  } = useKanbanContext();

  const { t } = useTranslation();
  const activeProject = useSelector((state: RootState) => state.project.projects.find(project => project.active));

  const kanbanFiltersOptions: FilterOption[] = [
    {
      name: Filters.ASSIGNED_TO,
      label: t('assignedUsers'),
      options: usersList,
      applyOnChange: true,
    },
    {
      name: Filters.BUTTON_STATE,
      label: t('buttonsStates'),
      options: BUTTON_STATES,
      applyOnChange: true,
    },
  ];

  return (
    <Layout handleSearch={handleSearch} searchText={searchText} headTitle={t('kanban')} breadcrumbs={breadcrumbsKanban}>
      <main>
        {activeProject ? (
          <section>
            <Filter
              filters={kanbanFiltersOptions}
              value={filters}
              handleFilterChange={handleFilterChange}
              clearAll
              projectId={activeProject.id}
              addItem
              onAddNewTask={onAddNewTask}
            />
            <header className={styles.projectTitleName} style={{ color: activeProject.color }}>
              {activeProject.title}
            </header>
            <div className={styles.titleDivider} style={{ backgroundColor: activeProject.color }} />
            <DragDropContext onDragEnd={onDragEnd}>
              <StrictModeDroppable droppableId="mainContainer">
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={styles.mainContainer}>
                    {columns.map((column: ColumnType) => (
                      <Column column={column} key={column.id} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
            <CreateTaskModal
              usersList={usersList}
              formik={formik}
              columns={columns}
              closeAddTaskModal={closeAddTaskModal}
              isAddTaskModalOpen={isAddTaskModalOpen}
            />
          </section>
        ) : null}
      </main>
    </Layout>
  );
};
