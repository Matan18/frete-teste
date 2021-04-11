import React from 'react';

import styles from "../../../styles/components/Select/SelectItem/Item/styles.module.css";

interface Category {
  id: string;
  name: string;
  code: string;
}
interface ISelectedItemProps {
  category: Category;
  removeSelected: (id: string) => void;
}

const SelectedItem: React.FC<ISelectedItemProps> = ({ category, removeSelected }) => {
  return (
    <div className={styles.itemContainer}>
      <span>{category.code}</span>

      <div className={styles.categoryInfo}>
        <span>
          Nome: {category.name}
        </span>
        <span>
          Id: {category.id}
        </span>
      </div>
      <button className={styles.closeButton} onClick={() => { removeSelected(category.id) }}>
        <span>x</span>
      </button>
    </div>
  )
}

export default SelectedItem;