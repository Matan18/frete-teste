import React, { useCallback, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Input from './Input';

import styles from "../../styles/components/Conteudo/styles.module.scss";

interface ConteudoProps {
  saveItens: (value: string[]) => void;
}

const Conteudo: React.FC<ConteudoProps> = ({ saveItens }) => {
  const [items, setItems] = useState<string[]>(['']);

  const handleOnClick = useCallback(() => {
    setItems([...items, ''])
  }, [items, setItems])

  useEffect(() => {
    saveItens(items)
  }, [items])

  const updateItem = useCallback((index: number, value) => {
    const list = items
    list[index] = value;
    setItems(list);
  }, [setItems, items])

  return (
    <div className={styles.container}>
      <ul>
        {items.map((item, index) => (
          <Input saveValue={(value) => { updateItem(index, value) }} />
        ))
        }
      </ul>
      <button onClick={handleOnClick}><FiPlus size={35} /></button>
    </div>
  )
}

export default Conteudo;