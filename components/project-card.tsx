import React from 'react';
import { useMediaQuery } from '../hooks/use-media-query';
import styles from './project-card.module.css';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, imageUrl }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className={styles.projectCard}>
      <img src={imageUrl || "/placeholder.svg"} alt={title} className={styles.projectImage} />
      <div className={styles.projectDetails}>
        <h2 className={styles.projectTitle}>{title}</h2>
        <p className={styles.projectDescription}>{description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
