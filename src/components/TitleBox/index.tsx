import React from 'react';

import styles from '../../styles/components/TitleBox/styles.module.scss';

interface IPageTitle {
  titleText: string;
  className?: string;
  titleClassName?: string;
}

const TitleBox: React.FC<IPageTitle> = ({
  titleText,
  className,
  titleClassName,
  children,
}) => {
  return (
    <div className={`${styles.headerBox} ${className}`}>
      <h3 className={titleClassName}>{titleText.toUpperCase()}</h3>
      {children}
    </div>
  );
};

export default TitleBox;
