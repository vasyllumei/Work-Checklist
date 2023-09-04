import React from 'react';
import styles from './Column.module.css';
import CardsProps, { Card } from './../Card/Card';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';

interface ColumnProps {
  title: string;
  cards: CardsProps[];
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
