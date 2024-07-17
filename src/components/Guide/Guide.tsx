import React from 'react';
import Image from 'next/image';
import styles from './Guide.module.css';
import GuideImage1 from '../../assets/image/guide/guide1.png';
import GuideImage2 from '../../assets/image/guide/guide2.png';
import GuideImage3 from '../../assets/image/guide/guide3.png';
import GuideImage4 from '../../assets/image/guide/guide4.png';
import { useRouter } from 'next/router';
import { guideDescriptions } from '@/components/Guide/utils';

export const Guide = () => {
  const router = useRouter();
  return (
    <main className={styles.boxesContainer}>
      <div className={styles.box} onClick={() => router.push('/configs')}>
        <Image src={GuideImage1} alt="Image 1" layout="responsive" />
        <div className={styles.overlay}>
          <p>{guideDescriptions.guide1}</p>
        </div>
      </div>
      <div className={styles.box} onClick={() => router.push('/kanban')}>
        <Image src={GuideImage2} alt="Image 2" layout="responsive" />
        <div className={styles.overlay}>
          <p>{guideDescriptions.guide2}</p>
        </div>
      </div>
      <div className={styles.box} onClick={() => router.push('/users')}>
        <Image src={GuideImage3} alt="Image 1" layout="responsive" />
        <div className={styles.overlay}>
          <p>{guideDescriptions.guide3}</p>
        </div>
      </div>
      <div className={styles.box} onClick={() => router.push('/backlog')}>
        <Image src={GuideImage4} alt="Image 1" layout="responsive" />
        <div className={styles.overlay}>
          <p>{guideDescriptions.guide4}</p>
        </div>
      </div>
    </main>
  );
};
