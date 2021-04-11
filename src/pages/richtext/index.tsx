import Head from 'next/head'
import { useCallback, useState } from 'react'
import Link from "next/link";
import { convertToRaw, EditorState } from 'draft-js';
import { useProduct } from '../../hooks/product'
import EditorComponent from '../../components/EditorComponent';
import Conteudo from '../../components/Conteudo';

import styles from '../../styles/pages/RichText/styles.module.scss'

const Home: React.FC = () => {
  const [title, setTitle] = useState('Bicycle Preto')
  const [price, setPrice] = useState('R$ 30,50')
  const [height, setHeight] = useState('3')
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('12')
  const [items, setItems] = useState(['Caixa lacrada com baralho Bicycle Preto'])
  const [description, setDesciption] = useState(
    () => EditorState.createEmpty(),
  );

  const { setProduct } = useProduct();

  const handleSubmit = useCallback(
    () => {
      const parsedValue = price.replace(/\D/g, '')
      setProduct({
        title,
        price: parseInt(parsedValue),
        description: JSON.stringify(convertToRaw(description.getCurrentContent())),
        height: parseInt(height),
        length: parseInt(length),
        width: parseInt(width),
        categories: ['magic'],
        id: 'string',
        content: items,
      })
    },
    [title, price, description, height, length, width],
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.title}>
          <h1>Esse é um teste para ver como será o cadastro e exibição de um produto</h1>
          <span>Após preencher os dados como desejar, clique em salvar, depois em Ver página do produto, para ter uma previa de como será exibido no site</span>
        </div>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}>
          <div className={styles.inline}>

            <div>

              <label>Título</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text" placeholder="Título" />
            </div>
            <div>

              <label>Preço</label>
              <input
                className={styles.simpleValues}
                value={price}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/\D/g, '')
                  value = value.replace(/(^[0])/, '')
                  if (value.length < 3) {
                    value = value.replace(/(\d)/, "0,$1")
                  }
                  value = value.replace(/(\d)/, 'R$ $1')
                  if (value.length > 2) {
                    value = value.replace(/(\d)(\d{2}$)/, '$1,$2')
                  }
                  setPrice(value)
                }}
                type="text" placeholder="Preco" />
            </div>
          </div>
          <div className={styles.inline}>
            <div>

              <label>Altura</label>
              <input
                className={styles.simpleValues}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                type="text" placeholder="Altura em cm" />
            </div>
            <div>

              <label>Largura</label>
              <input
                className={styles.simpleValues}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                type="text" placeholder="Largura em cm" />
            </div>
            <div>

              <label>Comprimento</label>
              <input
                className={styles.simpleValues}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                type="text" placeholder="Comprimento em cm" />
            </div>
          </div>
          <Conteudo saveItens={setItems} />
          <label>Descrição</label>
          <div>
            <EditorComponent className={styles.descriptionEditor} state={description} setEditorState={setDesciption} />
          </div>
          <button type="submit"
            className={styles.saveButton}
          >Salvar</button>
        </form>

        <div className={styles.anchor}>
          <Link href="/richtext/preview" >
            <a>
              Ver página do produto
          </a>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        Powered by Matan
      </footer>
    </div >
  )
}

export default Home