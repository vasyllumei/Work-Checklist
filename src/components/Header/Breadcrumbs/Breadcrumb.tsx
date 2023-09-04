import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import styles from './Breadcrumb.module.css';

export default interface Breadcrumbs {
  title: string;
  link: string;
}

interface BreadcrumbsProps {
  data: Breadcrumbs[];
}

export const Breadcrumb: React.FC<BreadcrumbsProps> = ({ data }) => (
  <div className={styles.breadcrumbs}>
    <Breadcrumbs aria-label="breadcrumb">
      {data.map(({ title, link }, index) => [
        index === data.length - 1 ? (
          <span className={styles.breadcrumbText} key={index}>
            {title}
          </span>
        ) : (
          <Link underline="none" color="inherit" href={link} key={index}>
            <span className={styles.breadcrumbText}>{title}</span>
          </Link>
        ),
      ])}
    </Breadcrumbs>
  </div>
);
