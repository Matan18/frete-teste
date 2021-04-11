import Head from 'next/head'
import Link from "next/link";
import styles from "../styles/pages/Home/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Matan React Tests</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Esse é um projeto para fazer testes em React</h1>
      <div>
        <Link href="/frete">
          <a>
            <div>
              <h2>Frete-Teste</h2>
            </div>
          </a>
        </Link>
        <Link href="/select">
          <a>
            <div>
              <h2>Multi-Select</h2>
            </div>
          </a>
        </Link>
        <Link href="/richtext">
          <a>
            <div>
              <h2>Rich Text Register A Product</h2>
            </div>
          </a>
        </Link>
      </div>

    </div>
  )
}
