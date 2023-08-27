import React from 'react';
import styles from './Column.module.css';
import { Card } from '@/components/Kanban/components/Card';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
interface CardData {
  title: string;
  content: string;
  buttonState: 'Pending' | 'Updates' | 'Errors' | 'Done';
  image?: string;
  avatars?: string[];
}

interface ColumnProps {
  title: string;
  cards: CardData[];
}

export const Column: React.FC<ColumnProps> = ({ title, cards }) => {
  return (
    <div className={styles.column}>
      <div className={styles.titleColumn}>
        <h2 className={styles.title}>{title}</h2>
        <button className={styles.addButton}>
          <AddIcon></AddIcon>
        </button>
      </div>
      <div className={styles.cardsContainer}>
        {cards.map(card => (
          <Card key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
};
