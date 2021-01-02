import Head from 'next/head'
import ProductList from '../components/ProductList';
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Teste de Frete</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ProductList />
    </div>
  )
}
