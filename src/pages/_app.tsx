import '../styles/globals.css'
import { ProductProvider } from "../hooks/product";

function MyApp({ Component, pageProps }) {
  return (
    <ProductProvider>
      <Component {...pageProps} />
    </ProductProvider>
  )
}

export default MyApp
