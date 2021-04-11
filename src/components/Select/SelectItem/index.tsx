import React, { useCallback, useMemo, useState } from 'react';
import SelectedItem from "./SelectedItem";

import styles from "../../../styles/components/Select/SelectItem/Index/styles.module.css";


interface Category {
  id: string;
  name: string;
  code: string;
}
interface ISelectItemProps {
  categoryList: {
    id: string;
    name: string;
    code: string;
  }[]
}

const SelectItem: React.FC<ISelectItemProps> = ({ categoryList }) => {
  const [selected, setSelected] = useState<Category[]>([])

  const addSelected = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const id = event.target.value
      const category = categoryList.find(item => item.id === id)
      if (category) {
        const inSelected = selected.find(item => item.id === id)
        if (!inSelected) {
          setSelected([...selected, category])
        }
      }
    },
    [setSelected, selected, categoryList],
  )

  const removeSelected = useCallback((id: string) => {
    const list = selected.filter(item => item.id !== id);
    setSelected(list)
  }, [setSelected, selected])

  const optionList = useMemo(() => {
    const filtered = categoryList.filter(item => !selected.includes(item))
    return filtered
  }, [selected, categoryList])

  return (
    <div className={styles.formContainer}>
      <div>{selected.map(item => (
        <SelectedItem key={item.id} category={item} removeSelected={removeSelected} />
      ))}
      </div>
      <select onChange={addSelected} value="" name="" id="essenão">
        <option value="" defaultChecked></option>
        {optionList.map(item => (
          <option key={item.id} value={item.id} id={item.id} about={item.code}>
            {item.name}
          </option>
        ))}
      </select>
      <button onClick={(e) => { console.log(selected) }}>Confirm</button>
    </div>
  );
}

export default SelectItem;
