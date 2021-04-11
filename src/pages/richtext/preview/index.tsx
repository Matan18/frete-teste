import React from 'react';
import { HiMail } from "react-icons/hi";
import { ImWhatsapp } from "react-icons/im";
import { FaPlusSquare, FaTruck } from "react-icons/fa";
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import Link from 'next/link';

import { useProduct } from '../../../hooks/product';
import convertToBrazil from '../../../util/currencyConversor';
import TitleBox from '../../../components/TitleBox';
import ContactLabel from '../../../components/ContactLabel';
import Details from '../../../components/Details';
import BuyButtom from '../../../components/BuyButton';

import styles from "../../../styles/pages/RichText/Preview/styles.module.scss";

const Product: React.FC = () => {
  const { product } = useProduct();

  return (
    <>
      {product ? (
        <div className={styles.container}>
          <TitleBox
            titleText={product.title}
            className={styles.titleBox}
            titleClassName={styles.title}
          />
          <div className={styles.productContent}>
            <div>
              <section>
                <div className="Carrosel">
                  {/* <div className={styles.contentText}>

                    <p>
                      <span>
                        Conteúdo:
                    </span>
                      {product.content}
                    </p>
                  </div> */}
                </div>
              </section>
              <section>
                <span>{convertToBrazil(product.price)}</span>
                <BuyButtom />
                <div className={styles.infoContainer}>
                  <div>
                    <ContactLabel
                      Icon={FaTruck}
                      iconClassName={styles.icon}
                      containerClassName={styles.deliverContainer}
                    >
                      Prazo de Entrega:
                  </ContactLabel>
                  Envio imediato após o pagamento concluído. Dia da Postagem +
                  dias úteis informado pelo site dos correios referente ao seu
                  CEP, empresa que faz a entrega.
                </div>
                  <ContactLabel Icon={FaPlusSquare} iconClassName={styles.icon}>
                    Mais Informações
                </ContactLabel>
                  <ContactLabel Icon={HiMail} iconClassName={styles.icon}>
                    Indicar para um amigo
                </ContactLabel>
                  <ContactLabel Icon={ImWhatsapp} iconClassName={styles.icon}>
                    (41) 98415-5572
                </ContactLabel>
                </div>
              </section>
            </div>

            <div className={styles.descriptionContainer}>
              <Editor editorState={
                EditorState.createWithContent(
                  convertFromRaw(JSON.parse(product.description))
                )
              }
                onChange={() => { }} />
            </div>

            <Details
              description={''}
              content={product.content.join(', ')}
            />
          </div>
        </div>
      ) : null}
      <div className={styles.anchor}>
        <Link href="/" >
          <a>
            Voltar para inicial
          </a>
        </Link>
      </div>
    </>
  )
}

export default Product;