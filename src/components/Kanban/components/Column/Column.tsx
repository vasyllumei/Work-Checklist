import React from 'react';
import styles from './Column.module.css';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import Card, { CardItem } from '../Card/Card';

export interface ColumnProps {
  id: number;
  title: string;
  items: CardItem[];
}

const Column: React.FC<ColumnProps> = ({ title, items }) => {
  return (
    <div className={styles.column}>
      <div className={styles.titleColumn}>
        <h2 className={styles.title}>{title}</h2>
        <button className={styles.addButton}>
          <AddIcon />
        </button>
      </div>
      <div className={styles.cardsContainer}>
        {items.map(item => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Column;
