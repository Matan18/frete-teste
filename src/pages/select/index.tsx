import React from 'react';

import Select from "../../components/Select";
import styles from "../../styles/pages/SelectPage/Select.module.css";

const SelectPage: React.FC = () => {
  return (
    <div className={styles.App}>
      <Select />
    </div>
  );
}

export default SelectPage;