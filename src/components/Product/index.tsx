import React from 'react';
import { FiPlus, FiMinus, FiTrash } from "react-icons/fi";
import { IProduct } from './IProduct';

import styles from "../../styles/Product/styles.module.css";

interface IProductProps {
  product: IProduct;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeItem: (id: string) => void;
}

const Product: React.FC<IProductProps> = ({ product, increment, decrement, removeItem }) => {

  return (
    <li key={product.id} className={styles.container}>
      <div className={styles.nameContainer}>
        <strong>{product.name}</strong>
      </div>
      <div className={styles.dimensions}>
        <label>Altura: {product.height}cm. </label>
        <label>Largura: {product.width}cm. </label>
        <label>Comprimento: {product.length}cm. </label>
        <label>Peso: {product.weight}Kg. </label>

      </div>
      <div className={styles.quantityManipulatorContainer}>
        <button onClick={(e) => { e.preventDefault(); increment(product.id) }}><FiPlus size={25} color="#333" /></button>
        <label>{product.quantity}</label>
        <button onClick={(e) => { e.preventDefault(); decrement(product.id) }}><FiMinus size={25} color="#333" /></button>
      </div>
      <button onClick={(e) => { e.preventDefault(); removeItem(product.id) }}><FiTrash size={25} color="#333" /></button>
    </li>
  )
}

export default Product;