import React, { useCallback, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { api } from '../../services/api';
import styles from "../../styles/components/ProductList/styles.module.css";
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

const freteStorage = "@Frete:CEP";

const ProductList: React.FC = () => {
  const [originCEP, setOriginCEP] = useState('');
  const [destinyCEP, setDestinyCEP] = useState('');
  const [formato, setFormato] = useState<'ENVELOPE' | 'CAIXA'>('CAIXA');
  const [valorDeclarado, setValorDeclarado] = useState(false);
  const [avisoRecebimento, setAvisoRecebimento] = useState(false);
  const [deliverValues, setDeliverValues] = useState<IDeliverWays>()
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false)
  const [isCepModal, setIsCepModal] = useState(false)
  const [serverError, setServerError] = useState('');
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [width, setWidth] = useState('')
  const [value, setValue] = useState('')
  const [height, setHeight] = useState('')
  const [length, setLength] = useState('')
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const value = localStorage.getItem(freteStorage)
    try {

      const { originCEP: origin, destinyCEP: destiny } = JSON.parse(value);
      setOriginCEP(origin || '')
      setDestinyCEP(destiny || '')
    } catch { }

  }, [setOriginCEP, setDestinyCEP])

  useEffect(() => {
    localStorage.setItem(freteStorage, JSON.stringify({ originCEP, destinyCEP }))
  }, [originCEP, destinyCEP])

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
    if (originCEP.length < 8 || destinyCEP.length < 8) {
      setIsCepModal(true)
    } else {
      try {
        setLoading(true)
        const response = await api.post<IDeliverWays>('/frete', { products, originCEP, destinyCEP, valorDeclarado, avisoRecebimento, formato })
        if (response.data.PAC.MsgErro !== "" || response.data.SEDEX.MsgErro !== "") {
          setServerError(`Ocorreu um erro com um dos cálculos: ${response.data.PAC.MsgErro ? `PAC: ${response.data.PAC.MsgErro}` : ('Nenhum Erro.')} ${response.data.SEDEX.MsgErro ? `SEDEX: ${response.data.SEDEX.MsgErro}` : ('Nenhum Erro.')}`)
        }
        console.log(response.data);
        setDeliverValues(response.data)
      } catch (error) {
        console.error("Um erro", error.response.data.message)
        setServerError(error.response.data.message)
      }
      finally {
        setLoading(false)
      }
    }
  }, [products, originCEP, destinyCEP, valorDeclarado, avisoRecebimento, formato, serverError])

  return (
    <div className={styles.container}>
      <div className={`${styles.modalContainer} ${modal ? (styles.modalAppear) : (null)}`}>
        <strong>Por favor, não deixe nenhum valor sendo 0 (zero) ou negativo</strong>
        <button onClick={() => { setModal(false) }}>close</button>
      </div>
      <div className={`${styles.modalContainer} ${isCepModal ? (styles.modalAppear) : (null)}`}>
        <strong>Um dos CEPs não está preenchido com 8 dígitos</strong>
        <button onClick={() => { setIsCepModal(false) }}>close</button>
      </div>
      <div className={`${styles.modalContainer} ${serverError !== '' ? (styles.modalAppear) : (null)}`}>
        <strong>{serverError}</strong>
        <button onClick={() => { setServerError('') }}>close</button>
      </div>

      <div>
        <h4>Faça o cálculo de vários itens passando as informações de cada um</h4>
        <div className={styles.header}>
          {(deliverValues?.PAC?.MsgErro == '' || deliverValues?.SEDEX?.MsgErro == "") && (
            <div className={styles.results}>
              <section className={styles.PAC}>
                {deliverValues?.PAC?.MsgErro !== '' ? (null) : (
                  <>
                    <div className={styles.deliverWayTitle}>
                      <strong>PAC</strong>
                    </div>
                    <span>Total do frete: R$ {deliverValues.PAC.Valor || "0,00"}</span>
                    <span>Com Valor Declarado: R$ {deliverValues.PAC.ValorValorDeclarado || "0,00"}</span>
                    <span>Com Aviso Recebimento: R$ {deliverValues.PAC.ValorAvisoRecebimento || "0,00"}</span>
                  </>
                )}
              </section>
              <section className={styles.SEDEX}>
                {deliverValues?.SEDEX?.MsgErro !== '' ? (null) : (
                  <>
                    <div className={styles.deliverWayTitle}>
                      <strong>SEDEX</strong>
                    </div>
                    <span>Total do frete: R$ {deliverValues.SEDEX.Valor || "0,00"}</span>
                    <span>Com Valor Declarado: R$ {deliverValues.SEDEX.ValorValorDeclarado || "0,00"}</span>
                    <span>Com Aviso Recebimento: R$ {deliverValues.SEDEX.ValorAvisoRecebimento || "0,00"}</span>
                  </>
                )}
              </section>
            </div>
          )}
          <div className={styles.config}>
            <div>
              <label>CEP de origem</label>
              <input value={originCEP}
                maxLength={8}
                onChange={(e) => setOriginCEP(e.target.value)} />
            </div>
            <div>
              <label>CEP de destino</label>
              <input value={destinyCEP}
                maxLength={8}
                onChange={(e) => setDestinyCEP(e.target.value)} />
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
              {/* <div>
                <label htmlFor="ROLO">Rolo</label>
                <input
                  type="radio"
                  name="deliver-type"
                  onChange={(e) => { setFormato('ROLO') }}
                  id="ROLO"
                  checked={formato === 'ROLO' ? true : false}
                />
              </div> */}
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
        <button
          className={styles.addItemButton}
          type="submit"
          onClick={(e) => { e.preventDefault(); addToCart() }}
        >Adicionar Item
        <FiPlus size={18} />
        </button>
      </form>
      <button
        className={styles.calcButton}
        disabled={loading}
        onClick={(e) => { e.preventDefault(); handleCalc() }}
      >Calcular</button>
      <ul className={styles.listContainer}>
        {products[0] && products.map(product => (
          <Product
            key={product.id}
            product={product}
            decrement={decrement}
            increment={increment}
            removeItem={removeFromCart}
          />
        ))}
      </ul>
    </div >
  )
}

export default ProductList;