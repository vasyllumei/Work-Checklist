import React from 'react';
import styles from './Column.module.css';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import EditIcon from '@mui/icons-material/Edit';
import { Draggable } from 'react-beautiful-dnd';

export interface ColumnProps {
  title: string;
  items: CardItem[];
}

interface CardItem {
  id: number;
  title: string;
  content: string;
  buttonState: string;
  image?: string;
  avatars?: string[];
}

const Column: React.FC<ColumnProps> = ({ title, items }) => {
  const buttonColor = (buttonState: string) => {
    if (buttonState === 'Pending') {
      return 'yellow';
    } else if (buttonState === 'Updates') {
      return 'blue';
    } else if (buttonState === 'Errors') {
      return 'red';
    } else if (buttonState === 'Done') {
      return 'green';
    }
  };

  return (
    <div className={styles.column}>
      <div className={styles.titleColumn}>
        <h2 className={styles.title}>{title}</h2>
        <button className={styles.addButton}>
          <AddIcon />
        </button>
      </div>
      {items.map((item, index) => (
        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={styles.cardsContainer}
            >
              <div className={styles.card}>
                <div className={styles.titleContainer}>
                  <h2 className={styles.title}>{item.title}</h2>
                  <div>
                    <EditIcon className={styles.editIcon} />
                  </div>
                </div>
                <div className={styles.contentContainer}>
                  {item.image && (
                    <div className={styles.imageContainer}>
                      <img src={item.image} alt={item.title} className={styles.cardImage} />
                    </div>
                  )}
                  <p>{item.content}</p>
                </div>
                <div className={styles.actionContainer}>
                  <div className={styles.iconContainer}>
                    {item.avatars &&
                      item.avatars.map((avatar, index) => (
                        <div key={index} className={styles.avatar}>
                          <img src={avatar} alt={`Avatar ${item.id}`} />
                        </div>
                      ))}
                  </div>
                  <button
                    className={`${styles.buttonAction} ${styles[buttonColor(item.buttonState) as keyof typeof styles]}`}
                  >
                    {item.buttonState}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};
