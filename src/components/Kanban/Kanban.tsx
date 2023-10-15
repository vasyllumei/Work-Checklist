import React, { useState } from 'react';
import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { Column, ColumnProps } from './components/Column/Column';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { data } from './KanbanData';

export const Kanban = () => {
  const [columns, setColumns] = useState<ColumnProps[]>(data);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;

    if (source.droppableId === destination.droppableId) {
      const columnId = source.droppableId;
      const updatedColumns = [...columns];
      const column = updatedColumns.find(c => c.title === columnId);
      if (column) {
        const [movedItem] = column.items.splice(source.index, 1);
        column.items.splice(destination.index, 0, movedItem);
        setColumns(updatedColumns);
      }
    } else {
      const sourceColumnTitle = source.droppableId;
      const destinationColumnTitle = destination.droppableId;
      const updatedColumns = [...columns];
      const sourceColumn = updatedColumns.find(c => c.title === sourceColumnTitle);
      const destinationColumn = updatedColumns.find(c => c.title === destinationColumnTitle);
      if (sourceColumn && destinationColumn) {
        const [movedItem] = sourceColumn.items.splice(source.index, 1);
        destinationColumn.items.splice(destination.index, 0, movedItem);
        setColumns(updatedColumns);
      }
    }
  };

  return (
    <Layout
      setSearchText={() => ''}
      searchText={''}
      headTitle="Kanban"
      breadcrumbs={[
        { title: 'Dashboard', link: '/' },
        { title: 'Kanban', link: '/kanban' },
      ]}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.mainContainer}>
          {columns.map(column => (
            <Droppable key={column.title} droppableId={column.title}>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Column title={column.title} items={column.items} />
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </Layout>
  );
};
