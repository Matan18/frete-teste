import React, { useCallback, useState } from 'react';
import { api } from '../../services/api';
import styles from "../../styles/ProductList/styles.module.css";
import Product from '../Product';
import { IProduct } from '../Product/IProduct';

interface FreteResult {
  Valor: string;
  ValorAvisoRecebimento: string;
  ValorValorDeclarado: string;
  ValorSemAdicionais: string;
  MsgErro: string | undefined;
}

type IDeliverWays = {
  [value in 'PAC' | 'SEDEX']: FreteResult;
}

const ProductList: React.FC = () => {
  const [originCEP, setOriginCEP] = useState('');
  const [destinyCEP, setDestinyCEP] = useState('');
  const [formato, setFormato] = useState<'ENVELOPE' | 'ROLO' | 'CAIXA'>('CAIXA');
  const [valorDeclarado, setValorDeclarado] = useState(false);
  const [avisoRecebimento, setAvisoRecebimento] = useState(false);
  const [deliverValues, setDeliverValues] = useState<IDeliverWays>()
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false)
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [width, setWidth] = useState('')
  const [value, setValue] = useState('')
  const [height, setHeight] = useState('')
  const [length, setLength] = useState('')
  const [products, setProducts] = useState<IProduct[]>([
    {
      id: "1",
      name: 'Primeiro Item',
      quantity: 1,
      height: '10',
      width: '10',
      length: '10',
      weight: '0.2',
      value: '10'
    }
  ]);


  const compare = useCallback((a: IProduct, b: IProduct) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  }, []);

  const addToCart = useCallback(() => {
    if (!!weight && !!width && !!height && !!length) {
      const product: IProduct = {
        id: `${products.length + 1}`,
        name,
        weight: weight,
        width,
        height,
        length,
        value,
        quantity: 1
      }
      console.log(product)
      const list = [...products, product];
      setProducts(list.sort(compare));
    } else {
      setModal(true)
    }
  }, [products, setProducts, compare, weight, width, height, length, name, value])

  const increment = useCallback((id: string) => {
    const index = products.findIndex(item => item.id === id);
    if (index >= 0) {
      const list = products;
      const [prod] = list.splice(index, 1);
      // eslint-disable-next-line no-plusplus
      prod.quantity++;
      setProducts([...list, prod].sort(compare));
    }
  },
    [products, compare, setProducts],
  );

  const decrement = useCallback((id: string) => {
    const index = products.findIndex(item => item.id === id);
    if (index >= 0) {
      const list = products;
      const [prod] = list.splice(index, 1);
      // eslint-disable-next-line no-plusplus
      prod.quantity--;
      if (prod.quantity === 0) {
        setProducts([...list].sort(compare));
      } else {
        setProducts([...list, prod].sort(compare));
      }
    }
  }, [products, setProducts, compare]);

  const removeFromCart = useCallback((id: string) => {
    const index = products.findIndex(item => item.id === id);
    if (index >= 0) {
      const list = products;
      list.splice(index, 1);
      setProducts([...list].sort(compare));
    }
  }, [products, setProducts, compare])

  const handleCalc = useCallback(async () => {
    setLoading(true)
    const response = await api.post<IDeliverWays>('/frete', { products, originCEP, destinyCEP, valorDeclarado, avisoRecebimento, formato })
    setDeliverValues(response.data)
    setLoading(false)
  }, [products, originCEP, destinyCEP, valorDeclarado, avisoRecebimento, formato])

  return (
    <div className={styles.container}>
      <div className={`${styles.modalContainer} ${modal ? (styles.modalAppear) : (null)}`}>
        <strong>Por favor, não deixe nenhum valor sendo 0 (zero) ou negativo</strong>
        <button onClick={() => { setModal(false) }}>close</button>
      </div>

      <div>
        <h1>Faça o cálculo de vários itens passando as informações de cada um</h1>
        <div className={styles.header}>
          <div className={styles.config}>
            <div>
              <label>CEP de origem</label>
              <input value={originCEP} onChange={(e) => setOriginCEP(e.target.value)} />
            </div>
            <div>
              <label>CEP de destino</label>
              <input value={destinyCEP} onChange={(e) => setDestinyCEP(e.target.value)} />
            </div>

            <div
              className={styles.simpleCheckbox}
              onClick={() => { valorDeclarado ? (setValorDeclarado(false)) : (setValorDeclarado(true)) }}>
              <label>Valor Declarado?</label>
              <input
                type='checkbox'
                checked={valorDeclarado}
                onChange={() => { }}
              />
            </div>

            <div
              className={styles.simpleCheckbox}

              onClick={() => { avisoRecebimento ? setAvisoRecebimento(false) : setAvisoRecebimento(true) }}
            >
              <label>Aviso Recebimento?</label>
              <input type='checkbox'
                onChange={() => { }}
                checked={avisoRecebimento}
              />
            </div>
            <div>
              <div>
                <label htmlFor="ENVELOPE">Envelope</label>
                <input
                  type="radio"
                  name="deliver-type"
                  onChange={(e) => {
                    setFormato('ENVELOPE')
                  }}
                  id="ENVELOPE"
                  checked={formato === 'ENVELOPE' ? true : false}
                />
              </div>
              <div>
                <label htmlFor="ROLO">Rolo</label>
                <input
                  type="radio"
                  name="deliver-type"
                  onChange={(e) => { setFormato('ROLO') }}
                  id="ROLO"
                  checked={formato === 'ROLO' ? true : false}
                />
              </div>
              <div>
                <label htmlFor="CAIXA">Caixa</label>
                <input
                  type="radio"
                  name="deliver-type"
                  onChange={(e) => { setFormato('CAIXA') }}
                  id="CAIXA"
                  checked={formato === 'CAIXA' ? true : false}
                />
              </div>
            </div>
          </div>
          <div className={styles.results}>
            {deliverValues && (
              <>
                <section className={styles.PAC}>
                  <h4>PAC</h4>
                  {deliverValues.PAC.MsgErro !== '' ? (
                    <>
                      <span>Parece que o valor informado é muito baixo, o padrão é R$ 21,00</span>
                    </>
                  ) : (
                      <>
                        <span>Total do frete: R$ {deliverValues.PAC.Valor || "0,00"}</span>
                        <span>Com Valor Declarado: R$ {deliverValues.PAC.ValorValorDeclarado || "0,00"}</span>
                        <span>Com Aviso Recebimento: R$ {deliverValues.PAC.ValorAvisoRecebimento || "0,00"}</span>
                      </>
                    )}
                </section>
                <section className={styles.SEDEX}>
                  <h4>SEDEX</h4>
                  {deliverValues.SEDEX.MsgErro !== '' ? (
                    <>
                      <span>Parece que o valor informado é muito baixo, o padrão é R$ 21,00</span>
                    </>
                  ) : (
                      <>
                        <span>Total do frete: R$ {deliverValues.SEDEX.Valor || "0,00"}</span>
                        <span>Com Valor Declarado: R$ {deliverValues.SEDEX.ValorValorDeclarado || "0,00"}</span>
                        <span>Com Aviso Recebimento: R$ {deliverValues.SEDEX.ValorAvisoRecebimento || "0,00"}</span>
                      </>
                    )}
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      <form className={styles.newItemContainer}>
        <label>Nome</label>
        <input
          type="text"
          className={styles.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          placeholder="Nome do Produto"
        />
        <div className={styles.centimetersContainer}>
          <div className={styles.unityContainer}>
            <label>Altura</label>
            <div>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                name="name"
              />
              <label >cm</label>
            </div>
          </div>
          <div className={styles.unityContainer}>
            <label>Largura</label>
            <div>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                name="name"
              />
              <label >cm</label>
            </div>
          </div>
          <div className={styles.unityContainer}>
            <label>Comprimento</label>
            <div>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                name="name"
              />
              <label >cm</label>
            </div>
          </div>
        </div>
        <div className={styles.unityContainer}>
          <label>Peso</label>
          <div>
            <input
              type="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              name="peso"
              placeholder="Peso"
            />
            <label>Kg</label>
          </div>
        </div>
        <div className={styles.unityContainer}>
          <label>Valor</label>
          <div>
            <label >R$</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              name="name"
            />
          </div>
        </div>
        <button type="submit" onClick={(e) => { e.preventDefault(); addToCart() }}>Adicionar na Lista</button>
      </form>
      <ul className={styles.listContainer}>
        {products && products.map(product => (
          <Product
            key={product.id}
            product={product}
            decrement={decrement}
            increment={increment}
            removeItem={removeFromCart}
          />
        ))}
        <button
          disabled={loading}
          onClick={(e) => { e.preventDefault(); handleCalc() }}>Calcular frete</button>
      </ul>
    </div >
  )
}

export default ProductList;