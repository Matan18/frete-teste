import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

export interface IProduct {
  id: string;
  title: string;//
  price: number;//
  description: string;//
  categories: string[];
  content: string[];
  width: number;//
  length: number;//
  height: number;//
}

type IDeliverWay = {
  [value in 'PAC' | 'SEDEX' | null]: { value: number; days: number };
};

interface IProductContext {
  product: IProduct;
  setProduct: (value: IProduct) => void;
}

const ProductContext = createContext<IProductContext | null>(null);

const ProductProvider: React.FC = ({ children }) => {
  const [product, setProduct] = useState<IProduct>();
  const value = useMemo(() => {
    return { product, setProduct }
  }, [product, setProduct])

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

const useProduct = (): IProductContext => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

export { ProductProvider, useProduct };