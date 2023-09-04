import * as React from 'react';
import { Breadcrumbs as BreadcrumbsComponent } from '@mui/material';
import Link from '@mui/material/Link';
import styles from './Breadcrumbs.module.css';

export default interface BreadcrumbsItem {
  title: string;
  link: string;
}

interface BreadcrumbsProps {
  data: BreadcrumbsItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ data }) => (
  <div className={styles.breadcrumbs}>
    <BreadcrumbsComponent aria-label="breadcrumb">
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
    </BreadcrumbsComponent>
  </div>
);
