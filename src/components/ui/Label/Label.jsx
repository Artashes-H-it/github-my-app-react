// components/Label/Label.js
import React from 'react';
import styles from './Label.module.scss';

const Label = ({
  htmlFor,
  children,
  className = '',
  required = false,
  description = '',
  icon = null,
}) => {
  return (
    <label htmlFor={htmlFor} className={`${styles.label} ${className}`}>
      <div className={styles.labelContent}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span>{children}</span>
        {required && <span className={styles.required}>*</span>}
      </div>
      {description && <small className={styles.description}>{description}</small>}
    </label>
  );
};

export default Label;
