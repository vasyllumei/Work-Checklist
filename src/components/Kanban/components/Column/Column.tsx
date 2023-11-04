import styles from './Column.module.css';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import EditIcon from '@mui/icons-material/Edit';
import { Draggable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CardDocumentType } from '@/models/Card';
import { getAllCards } from '@/services/card/cardService';

export interface ColumnProps {
  title: string;
  order: any;
}

export interface CardItem {
  id: number;
  title: string;
  content: string;
  buttonState: string;
  image?: string;
  avatars?: string[];
}

export const Column: React.FC<ColumnProps> = ({ title, order }) => {
  const [cards, setCards] = useState<CardDocumentType[]>([]);
  const [editCard, setEditCard] = useState<number | null>(null);
  const fetchCards = async () => {
    try {
      const fetchedCardsData = await getAllCards();
      const fetchedCards: CardDocumentType[] = fetchedCardsData.data;
      setCards(fetchedCards);
    } catch (error) {
      console.error('Error retrieving the list of cards:', error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [cards]);

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

  const isCardExpanded = (itemId: number) => editCard === itemId;

  const handleEditing = (itemId: number) => {
    setEditCard(itemId === editCard ? null : itemId);
  };

  return (
    <div className={styles.column}>
      <div className={styles.titleColumn}>
        <h2 className={styles.title}>{title}</h2>
        <button className={styles.addButton}>
          <AddIcon />
        </button>
      </div>
      {order.map((item: any, index: any) => (
        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
          {provided => (
            <div ref={provided.innerRef} {...provided.draggableProps} className={styles.cardsContainer}>
              <motion.div className={styles.card} initial={false} layout>
                <div className={styles.titleContainer}>
                  <h2 className={styles.title} {...provided.dragHandleProps}>
                    {item.title}
                  </h2>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.1 }}>
                    <EditIcon onClick={() => handleEditing(item.id)} className={styles.editIcon} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isCardExpanded(item.id) ? (
                    <motion.fieldset key="expandedContent" className={styles.editingContent}>
                      {item.image && (
                        <div className={styles.imageContainer}>
                          <img src={item.image} alt={item.title} className={styles.cardImage} />
                        </div>
                      )}
                      <p>{item.content}</p>
                    </motion.fieldset>
                  ) : (
                    <motion.div key="content" className={styles.contentContainer}>
                      {item.image && (
                        <div className={styles.imageContainer}>
                          <img src={item.image} alt={item.title} className={styles.cardImage} />
                        </div>
                      )}
                      <p>{item.content}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className={styles.actionContainer}>
                  <div className={styles.iconContainer}>
                    {item.avatars &&
                      item.avatars.map((avatar: any, index: any) => (
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
              </motion.div>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};
