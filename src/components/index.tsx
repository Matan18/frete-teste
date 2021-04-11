import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import styles from '../../styles/components/BuyButtom/styles.module.scss';

const BuyButtom: React.FC = () => {
  return (
    <div className={styles.container} >
      <FaShoppingCart size={16} />
      COMPRAR
    </div>
  );
};

export default BuyButtom;
