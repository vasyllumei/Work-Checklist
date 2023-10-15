import React from 'react';
import styles from './Card.module.css';
import EditIcon from '@mui/icons-material/Edit';

export interface CardItem {
  id: number;
  title: string;
  content: string;
  buttonState: string;
  image?: string;
  avatars?: string[];
}

interface CardProps {
  item: CardItem;
}

const Card: React.FC<CardProps> = ({ item }) => {
  let buttonColor;

  if (item.buttonState === 'Pending') {
    buttonColor = 'yellow';
  } else if (item.buttonState === 'Updates') {
    buttonColor = 'blue';
  } else if (item.buttonState === 'Errors') {
    buttonColor = 'red';
  } else if (item.buttonState === 'Done') {
    buttonColor = 'green';
  }

  const buttonClassName = `${styles.buttonAction} ${styles[buttonColor as keyof typeof styles]}`;

  return (
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
        <button className={buttonClassName}>{item.buttonState}</button>
      </div>
    </div>
  );
};

export default Card;
