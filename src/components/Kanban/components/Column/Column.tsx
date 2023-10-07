import React, { useState } from 'react';
import styles from './Column.module.css';
import CardsProps, { Card } from './../Card/Card';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface ColumnProps {
  title: string;
  cards: CardsProps[];
}

export const Column: React.FC<ColumnProps> = ({ title, cards }) => {
  const [cardsMove, setCardsMove] = useState(cards);
  const handleDragAndDrop = (results: any) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'group') {
      const reorderedStores = [...cardsMove];

      const storeSourceIndex = source.index;
      const storeDestinatonIndex = destination.index;

      const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
      reorderedStores.splice(storeDestinatonIndex, 0, removedStore);

      return setCardsMove(reorderedStores);
    }
    const itemSourceIndex = source.index;
    const itemDestinationIndex = destination.index;

    const storeSourceIndex = cards.findIndex(cards => cards.title === source.droppableId);
    const storeDestinationIndex = cards.findIndex(cards => cards.title === destination.droppableId);
    console.log(itemSourceIndex);
    console.log(itemDestinationIndex);
    console.log(storeSourceIndex);
    console.log(storeDestinationIndex);
  };

  return (
    <DragDropContext onDragEnd={handleDragAndDrop}>
      <Droppable droppableId="ROOT" type="d">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef} className={styles.column}>
            <div className={styles.titleColumn}>
              <h2 className={styles.title}>{title}</h2>
              <button className={styles.addButton}>
                <AddIcon></AddIcon>
              </button>
            </div>
            {cards.map((card, index) => (
              <Draggable draggableId={card.title} key={card.title} index={index}>
                {provided => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className={styles.cardsContainer}
                  >
                    <Card key={card.title} {...card} />
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
