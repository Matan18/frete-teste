import React from 'react';
import { IconType } from 'react-icons';

import styles from '../../styles/components/ContactLabel/styles.module.scss';

interface IContactProps {
  Icon: IconType;
  containerClassName?: string;
  iconClassName?: string;
}

const ContactLabel: React.FC<IContactProps> = ({
  Icon,
  containerClassName,
  iconClassName,
  children,
}) => {
  return (
    <div className={`${styles.container} ${containerClassName}`}>
      <Icon size={30} color="#048df7" className={iconClassName || ''} />
      {children}
    </div>
  );
};

export default ContactLabel;
