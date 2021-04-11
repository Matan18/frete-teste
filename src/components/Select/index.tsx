import React from 'react';
import SelectItem from './SelectItem';

import styles from "../../styles/components/Select/styles.module.css";

interface Category {
  id: string;
  name: string;
  code: string;
}

const Select: React.FC = () => {
  const list: Category[] = categories;

  return (
    <div className={styles.container}>
      <SelectItem categoryList={list} />
    </div>
  )
}

export default Select;

const categories: Category[] = [
  {
    name: 'BRINQUEDOS / DECORAÇÃO / ACESSÓRIOS',
    code: 'toy',
    id: '1'
  },
  {
    name: 'CUBO MÁGICO',
    code: 'magiccube',
    id: '2'
  },
  {
    name: 'DIVERSOS',
    code: 'any',
    id: '3'
  },
  {
    name: 'DOWNLOAD',
    code: 'download',
    id: '4'
  },
  {
    name: 'FANTASIAS - ROUPAS',
    code: 'fantasy',
    id: '5'
  },
  {
    name: 'FERRAMENTAS',
    code: 'tools',
    id: '6'
  },
  {
    name: 'GOZAÇÃO - PEGADINHA',
    code: 'pranks',
    id: '7'
  },
  {
    name: 'IMÃS - NEODIMMIO /FERRITE',
    code: 'magnet',
    id: '8'
  },
  {
    name: 'MÁGICA - ACESSÓRIOS',
    code: 'magic',
    id: '9'
  },
  {
    name: 'MÁGICA - CATOMAGIA',
    code: 'magictarot',
    id: '10'
  },
  {
    name: 'MÁGICA - CLOSE-UP',
    code: 'magiccloseup',
    id: '11'
  },
  {
    name: 'MÁGICA - COMBO',
    code: 'magiccombo',
    id: '12'
  },
  {
    name: 'MÁGICA - DVD/VIDEO',
    code: 'magicvideo',
    id: '13'
  },
  {
    name: 'MÁGICA - LIVROS/LIVRETES',
    code: 'magicbooks',
    id: '14'
  },
  {
    name: 'MÁGICA - GRANDE ILUSÃO',
    code: 'magicilusion',
    id: '15'
  },
  {
    name: 'MÁGICA - KITS DE MÁGICAS',
    code: 'magickits',
    id: '16'
  },
  {
    name: 'MÁGICA - MENTALISMO',
    code: 'magicmentalism',
    id: '17'
  },
  {
    name: 'MÁGICA - MOEDAS / DINHEIRO',
    code: 'magicmoney',
    id: '18'
  },
  {
    name: 'MÁGICA - PALCO/SALÃO',
    code: 'magicsalon',
    id: '19'
  },
  {
    name: 'MÁGICA - PRODUTOS REVENDA',
    code: 'magicresale',
    id: '20'
  },
  {
    name: 'MAQUIAGEM ARTÍSTICA',
    code: 'makeup',
    id: '21'
  },
  {
    name: 'MÁSCARAS',
    code: 'mask',
    id: '22'
  },
  {
    name: 'QUEBRA CABEÇA',
    code: 'puzzle',
    id: '23'
  },
];