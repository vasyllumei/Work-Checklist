import React from 'react';
import styles from './Card.module.css';
import EditIcon from '@mui/icons-material/Edit';
export default interface CardsProps {
  title: string;
  content: string;
  buttonState: 'Pending' | 'Updates' | 'Errors' | 'Done';
  image?: string;
  avatars?: string[];
}

export const Card: React.FC<CardsProps> = ({ title, content, buttonState, image, avatars }) => {
  let buttonColor;

  if (buttonState === 'Pending') {
    buttonColor = 'yellow';
  } else if (buttonState === 'Updates') {
    buttonColor = 'blue';
  } else if (buttonState === 'Errors') {
    buttonColor = 'red';
  } else if (buttonState === 'Done') {
    buttonColor = 'green';
  }

  const buttonClassName = `${styles.buttonAction} ${styles[buttonColor as keyof typeof styles]}`;
  return (
    <div className={styles.card}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{title}</h2>
        <div>
          <EditIcon className={styles.editIcon} />
        </div>
      </div>
      <div className={styles.contentContainer}>
        {image && (
          <div className={styles.imageContainer}>
            <img src={image} alt={title} className={styles.cardImage} />
          </div>
        )}
        <p>{content}</p>
      </div>
      <div className={styles.actionContainer}>
        <div className={styles.iconContainer}>
          {avatars &&
            avatars.map((avatar, index) => (
              <div key={index} className={styles.avatar}>
                <img src={avatar} alt={`Avatar ${index + 1}`} />
              </div>
            ))}
        </div>
        <button className={buttonClassName}>{buttonState}</button>
      </div>
    </div>
  );
};
