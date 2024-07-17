import React from 'react';
import Image from 'next/image';
import styles from './Guide.module.css';
import GuideImage1 from './../../../assets/image/guide/guide1.png';
import GuideImage2 from './../../../assets/image/guide/guide2.png';
import GuideImage3 from './../../../assets/image/guide/guide3.png';
import GuideImage4 from './../../../assets/image/guide/guide4.png';

export const Guide = () => {
  return (
    <main className={styles.boxesContainer}>
      <div className={styles.box}>
        <Image src={GuideImage1} alt="Image 1" layout="responsive" />
        <div className={styles.overlay}>
          <p>Text description for Box 1</p>
        </div>
      </div>
      <div className={styles.box}>
        <Image src={GuideImage2} alt="Image 2" layout="responsive" />
        <div className={styles.overlay}>
          <p>Text description for Box 2</p>
        </div>
      </div>
      <div className={styles.box}>
        <Image src={GuideImage3} alt="Image 1" layout="responsive" />
        <div className={styles.overlay}>
          <p>Text description for Box 1</p>
        </div>
      </div>
      <div className={styles.box}>
        <Image src={GuideImage4} alt="Image 1" layout="responsive" />
        <div className={styles.overlay}>
          <p>Text description for Box 1</p>
        </div>
      </div>
    </main>
  );
};
