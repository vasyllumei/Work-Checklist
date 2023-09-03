import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import styles from './BreadcrumbsPath.module.css';

export default interface Breadcrumb {
  title: string;
  link: string;
}

interface BreadcrumbsComponentProps {
  breadcrumbData: Breadcrumb[];
}

export const BreadcrumbsPath: React.FC<BreadcrumbsComponentProps> = ({ breadcrumbData }) => (
  <div className={styles.breadcrumbs}>
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbData.map(({ title, link }, index) => (
        <React.Fragment key={index}>
          {index === breadcrumbData.length - 1 ? (
            <span className={styles.breadcrumbText}>{title}</span>
          ) : (
            <Link underline="none" color="inherit" href={link}>
              <span className={styles.breadcrumbText}>{title}</span>
            </Link>
          )}
          {index < breadcrumbData.length - 1}
        </React.Fragment>
      ))}
    </Breadcrumbs>
  </div>
);
