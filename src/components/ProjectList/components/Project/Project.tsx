import React, { FC } from 'react';
import styles from './Project.module.css';
import { ProjectType } from '@/types/Project';
import MenuButton from '@/components/ProjectList/components/Project/MenuButton/MenuButton';

type ProjectProps = {
  project: ProjectType;
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => Promise<void>;
  onToggleActive: (projectId: string) => void;
  dataTestId?: string;
};

export const Project: FC<ProjectProps> = ({ project, onEdit, onDelete, onToggleActive, dataTestId }) => {
  const handleMenuButtonClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <li
      data-testid={`${dataTestId}-${project.id}`}
      key={project.id}
      className={`${styles.projectTitleRow} ${project.active ? styles.activeProject : ''}`}
      onClick={() => onToggleActive(project.id)}
    >
      <div className={styles.marker} style={{ backgroundColor: project.color }} />
      <div className={`${styles.projectTitle} ${project.active ? styles.activeTitle : ''}`}>{project.title}</div>
      {project.active && (
        <div className={styles.actionIconContainer}>
          <MenuButton
            projectId={project.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onClick={handleMenuButtonClick}
            dataTestId={`${dataTestId}-menuButton-${project.id}`}
          />
        </div>
      )}
    </li>
  );
};

export default Project;
